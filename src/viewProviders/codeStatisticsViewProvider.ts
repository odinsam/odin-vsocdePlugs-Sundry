const execSh = require('../../');
import { rejects } from 'assert';
import * as vscode from 'vscode';
import { Statistics_Config } from '../config/Statistics_Config';
import localize from '../localize';
import { FormatDate } from '../utils/formatDate';
const process = require('child_process');

const statistics_Config: Statistics_Config = {
    commitAuthor: '',
    beginTime: '',
    endTime: '',
    error: ''
};
export class CodeStatisticsViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'sundry.codelinestatisticsView';

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case 'colorSelected': {
                    vscode.window.activeTextEditor?.insertSnippet(
                        new vscode.SnippetString(`#${data.value}`)
                    );
                    break;
                }
            }
        });
    }

    InputEndTime = function () {
        return vscode.window.showInputBox({
            // 这个对象中所有参数都是可选参数
            password: false, // 输入内容是否是密码
            ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
            // 在输入框内的提示信息
            placeHolder: localize(
                'Sundry.Codelinestatistics.GitAuthor.endTime'
            ),
            // 在输入框下方的提示信息
            // prompt: '赶紧输入，不输入就赶紧滚',
            validateInput: function (text) {
                if (text == '') return text;
            } // 对输入内容进行验证并返回
        });
    };

    InputBeginTime = function () {
        return vscode.window.showInputBox({
            // 这个对象中所有参数都是可选参数
            password: false, // 输入内容是否是密码
            ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
            // 在输入框内的提示信息
            placeHolder: localize(
                'Sundry.Codelinestatistics.GitAuthor.beginTime'
            ),
            // 在输入框下方的提示信息
            // prompt: '赶紧输入，不输入就赶紧滚',
            validateInput: function (text) {
                if (text == '') return text;
            } // 对输入内容进行验证并返回
        });
    };
    InputCommitUser = function () {
        return vscode.window.showInputBox({
            // 这个对象中所有参数都是可选参数
            password: false, // 输入内容是否是密码
            ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
            // 在输入框内的提示信息
            placeHolder: localize(
                'Sundry.Codelinestatistics.GitAuthor.placeHolder'
            ),
            // 在输入框下方的提示信息
            // prompt: '赶紧输入，不输入就赶紧滚',
            validateInput: function (text) {
                if (text == '') return text;
            } // 对输入内容进行验证并返回
        });
    };

    public codeLineStatistics() {
        this.InputCommitUser().then((author) => {
            const _author = author || '';
            statistics_Config.commitAuthor = _author;
            this.InputBeginTime().then((beginTime) => {
                const _beginTime = beginTime || '';
                statistics_Config.beginTime = _beginTime;
                this.InputEndTime().then((endTime) => {
                    const date = new FormatDate(new Date());
                    const _endTime = endTime || date.GetDateString();
                    statistics_Config.endTime = _endTime;
                    const statisticsType = vscode.workspace
                        .getConfiguration()
                        .get<Array<string>>(
                            'sundry.codelinestatistics.statisticsType'
                        );
                    const sst = statisticsType?.join('|');
                    const statisticsAll = vscode.workspace
                        .getConfiguration()
                        .get<string>('sundry.codelinestatistics.statisticsAll');

                    let statisticsByTime = vscode.workspace
                        .getConfiguration()
                        .get<string>(
                            'sundry.codelinestatistics.statisticsByTime'
                        );
                    statisticsByTime = statisticsByTime!
                        .replace('$author$', statistics_Config.commitAuthor)
                        .replace('$beginTime$', statistics_Config.beginTime)
                        .replace('$endTime$', statistics_Config.endTime)
                        .replace('$statisticsType$', sst!);
                    vscode.window
                        .createTerminal('codeStatistics')
                        .sendText(statisticsAll!);
                    vscode.window.terminals[0].sendText(statisticsByTime!);
                });
            });
        });
    }

    public clearCodeLineStatistics() {
        if (this._view) {
            this._view.webview.postMessage({ type: 'clearCodeLineStatistics' });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js')
        );

        // Do the same for the stylesheet.
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css')
        );
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css')
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css')
        );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				<title>Cat Colors</title>
			</head>
			<body>
				<div class="statistics-list">
					代码行数统计
				</div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
