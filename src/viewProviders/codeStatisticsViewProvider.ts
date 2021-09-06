const execSh = require('../../');
import { rejects } from 'assert';
import * as vscode from 'vscode';
import { Statistics_Config } from '../config/Statistics_Config';
import localize from '../localize';
import { FormatDate } from '../utils/formatDate';
const process = require('child_process');

function InputStatisticsConfig() {}
const statistics_Config: Statistics_Config = {
    commitAuthor: '',
    beginTime: '',
    endTime: '',
    error: ''
};
export class CodeStatisticsViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'sundry.codelinestatisticsView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly commitUser: string | undefined,
        private readonly _extensionUri: vscode.Uri
    ) {}

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
        // .then(function (endTime) {
        //     const _endTime = endTime || '';
        //     statistics_Config.endTime = _endTime;
        // });
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
        // .then(function (beginTime) {
        //     const _beginTime = beginTime || '';
        //     statistics_Config.beginTime = _beginTime;
        //     InputEndTime();
        // });
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
        // .then(function (author) {
        //     const _author = author || '';
        //     statistics_Config.commitAuthor = _author;
        //     InputBeginTime();
        // });
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
                    console.log(JSON.stringify(statistics_Config));
                    const statisticsType = vscode.workspace
                        .getConfiguration()
                        .get<Array<string>>(
                            'sundry.codelinestatistics.statisticsType'
                        );
                    const sst = statisticsType?.join('|');
                    console.warn(sst);
                    const gitCommit1 =
                        'git log --pretty=tformat: --numstat | awk \'{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\\n", add, subs, loc }\'';

                    let gitCommit2 =
                        'git log --author=$author$ --since=$beginTime$ --until=$endTime$ --format=\'%aN\' | sort -u | while read name; do echo -en "$name\\t"; git log --author="$name" --pretty=tformat: --numstat | grep "\\($statisticsType$)$" | awk \'{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\\n", add, subs, loc }\' -; done';
                    gitCommit2 = gitCommit2
                        .replace('$author$', statistics_Config.commitAuthor)
                        .replace('$beginTime$', statistics_Config.beginTime)
                        .replace('$endTime$', statistics_Config.endTime)
                        .replace('$statisticsType$', sst!);

                    console.log(gitCommit2);
                    process.exec(
                        gitCommit2,
                        this._extensionUri.path,
                        function (error: any, stdout: string, stderr: string) {
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            } else {
                                console.log(stdout);
                            }
                        }
                    );
                });
            });
        });
    }
    // InputStatisticsConfig;

    // console.log(JSON.stringify(statistics_Config.endTime));
    // const gitCommit1 =
    //     'git log --pretty=tformat: --numstat | awk \'{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\\n", add, subs, loc }\'';

    // let gitCommit2 =
    //     'git log --author=$author$ --since=$beginTime$ --until=$endTime$ --format=\'%aN\' | sort -u | while read name; do echo -en "$name\\t"; git log --author="$name" --pretty=tformat: --numstat | grep "\\(.cs\\)$" | awk \'{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\\n", add, subs, loc }\' -; done';
    // gitCommit2 = gitCommit2
    //     .replace('$author$', statistics_Config.commitAuthor)
    //     .replace('$beginTime$', statistics_Config.beginTime)
    //     .replace('$endTime$', statistics_Config.endTime);

    // console.log(gitCommit2);
    // process.exec(
    //     gitCommit2,
    //     this._extensionUri.path,
    //     function (error: any, stdout: string, stderr: string) {
    //         if (error !== null) {
    //             console.log('exec error: ' + error);
    //         } else {
    //             console.log(stdout);
    //         }
    //     }
    // );
    ///Users/odin/workSpace/Odin_Github/vsplugs/Sundry
    ///Users/odin/workSpace/Odin_Github/vsplugs/Sundry
    // const child = execSh(
    //     'echo hello exec-sh',
    //     true,
    //     (err: any, stdout: string, stderr: string) => {
    //         vscode.window.showInformationMessage(JSON.stringify(err));
    //         vscode.window.showInformationMessage(stdout);
    //         vscode.window.showInformationMessage(stderr);
    //     }
    // );
    // if (this._view) {
    //     this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
    //     this._view.webview.postMessage({
    //         type: 'codeLineStatistics',
    //         config: statistics_Config
    //     });
    // }
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
