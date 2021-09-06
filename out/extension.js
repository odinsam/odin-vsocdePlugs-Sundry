"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const codeStatisticsViewProvider_1 = require("./viewProviders/codeStatisticsViewProvider");
function activate(context) {
    const commitUser = vscode.workspace
        .getConfiguration()
        .get('Sundry.Codelinestatistics.GitAuthor');
    const provider = new codeStatisticsViewProvider_1.CodeStatisticsViewProvider(commitUser, context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(codeStatisticsViewProvider_1.CodeStatisticsViewProvider.viewType, provider));
    context.subscriptions.push(vscode.commands.registerCommand('sundry.codelinestatistics.statistics', () => {
        provider.codeLineStatistics();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('sundry.codelinestatistics.clear', () => {
        provider.clearCodeLineStatistics();
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map