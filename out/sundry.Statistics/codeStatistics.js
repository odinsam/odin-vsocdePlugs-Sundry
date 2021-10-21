"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeStatistics = void 0;
const vscode = require("vscode");
const localize_1 = require("../localize");
const formatDate_1 = require("../utils/formatDate");
const statisticsCommand_1 = require("../config/statisticsCommand");
const statistics_Config = {
    commitAuthor: '',
    beginTime: '',
    endTime: '',
    error: ''
};
class CodeStatistics {
    constructor() {
        this.InputEndTime = function () {
            return vscode.window.showInputBox({
                // 这个对象中所有参数都是可选参数
                password: false,
                ignoreFocusOut: true,
                // 在输入框内的提示信息
                placeHolder: (0, localize_1.default)('Sundry.Codelinestatistics.GitAuthor.endTime'),
                // 在输入框下方的提示信息
                // prompt: '赶紧输入，不输入就赶紧滚',
                validateInput: function (text) {
                    if (text == '')
                        return text;
                } // 对输入内容进行验证并返回
            });
        };
        this.InputBeginTime = function () {
            return vscode.window.showInputBox({
                // 这个对象中所有参数都是可选参数
                password: false,
                ignoreFocusOut: true,
                // 在输入框内的提示信息
                placeHolder: (0, localize_1.default)('Sundry.Codelinestatistics.GitAuthor.beginTime'),
                // 在输入框下方的提示信息
                // prompt: '赶紧输入，不输入就赶紧滚',
                validateInput: function (text) {
                    if (text == '')
                        return text;
                } // 对输入内容进行验证并返回
            });
        };
        this.InputCommitUser = function () {
            return vscode.window.showInputBox({
                // 这个对象中所有参数都是可选参数
                password: false,
                ignoreFocusOut: true,
                // 在输入框内的提示信息
                placeHolder: (0, localize_1.default)('Sundry.Codelinestatistics.GitAuthor.placeHolder'),
                // 在输入框下方的提示信息
                // prompt: '赶紧输入，不输入就赶紧滚',
                validateInput: function (text) {
                    if (text == '')
                        return text;
                } // 对输入内容进行验证并返回
            });
        };
    }
    codeLineStatistics() {
        this.InputCommitUser().then((author) => {
            const _author = author || '';
            statistics_Config.commitAuthor = _author;
            this.InputBeginTime().then((beginTime) => {
                const _beginTime = beginTime || '';
                statistics_Config.beginTime = _beginTime;
                this.InputEndTime().then((endTime) => {
                    const date = new formatDate_1.FormatDate(new Date());
                    const _endTime = endTime || date.GetDateString();
                    statistics_Config.endTime = _endTime;
                    const statisticsType = vscode.workspace
                        .getConfiguration()
                        .get('sundry.codelinestatistics.statisticsType');
                    const sst = statisticsType === null || statisticsType === void 0 ? void 0 : statisticsType.join('|');
                    const statisticsAll = statisticsCommand_1.StatisticsCommand.StatisticsAll;
                    let statisticsByTime = statisticsCommand_1.StatisticsCommand.StatisticsByTime;
                    statisticsByTime = statisticsByTime
                        .replace('$author$', statistics_Config.commitAuthor)
                        .replace('$beginTime$', statistics_Config.beginTime)
                        .replace('$endTime$', statistics_Config.endTime)
                        .replace('$statisticsType$', sst);
                    let termIndex = null;
                    for (var i = 0; i < vscode.window.terminals.length; i++) {
                        if (vscode.window.terminals[i].name == 'codeStatistics') {
                            termIndex = i;
                            break;
                        }
                    }
                    const term = termIndex != null
                        ? vscode.window.terminals[termIndex]
                        : vscode.window.createTerminal('codeStatistics');
                    term.sendText(statisticsAll);
                    term.sendText(statisticsByTime);
                });
            });
        });
    }
}
exports.CodeStatistics = CodeStatistics;
//# sourceMappingURL=codeStatistics.js.map