import { Statistics_Config } from '../config/Statistics_Config';
import * as vscode from 'vscode';
import localize from '../localize';
import { FormatDate } from '../utils/formatDate';
import { StatisticsCommand } from '../config/statisticsCommand';

const statistics_Config: Statistics_Config = {
    commitAuthor: '',
    beginTime: '',
    endTime: '',
    error: ''
};
export class CodeStatistics {
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
                    const statisticsAll = StatisticsCommand.StatisticsAll;
                    let statisticsByTime = StatisticsCommand.StatisticsByTime;
                    statisticsByTime = statisticsByTime!
                        .replace('$author$', statistics_Config.commitAuthor)
                        .replace('$beginTime$', statistics_Config.beginTime)
                        .replace('$endTime$', statistics_Config.endTime)
                        .replace('$statisticsType$', sst!);
                    let termIndex: number | null = null;
                    for (var i = 0; i < vscode.window.terminals.length; i++) {
                        if (
                            vscode.window.terminals[i].name == 'codeStatistics'
                        ) {
                            termIndex = i;
                            break;
                        }
                    }
                    const term =
                        termIndex != null
                            ? vscode.window.terminals[termIndex]
                            : vscode.window.createTerminal('codeStatistics');
                    term.sendText(statisticsAll!);
                    term.sendText(statisticsByTime!);
                });
            });
        });
    }
}
