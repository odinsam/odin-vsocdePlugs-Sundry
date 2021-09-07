"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const codeStatistics_1 = require("./sundry.Statistics/codeStatistics");
function activate(context) {
    const codeStatistics = new codeStatistics_1.CodeStatistics();
    //const provider = new CodeStatisticsViewProvider(context.extensionUri);
    // context.subscriptions.push(
    //     vscode.window.registerWebviewViewProvider(
    //         CodeStatisticsViewProvider.viewType,
    //         provider
    //     )
    // );
    context.subscriptions.push(vscode.commands.registerCommand('sundry.codelinestatistics.statistics', () => {
        codeStatistics.codeLineStatistics();
        // provider.codeLineStatistics();
    }));
    // context.subscriptions.push(
    //     vscode.commands.registerCommand(
    //         'sundry.codelinestatistics.clear',
    //         () => {
    //             provider.clearCodeLineStatistics();
    //         }
    //     )
    // );
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map