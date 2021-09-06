import * as vscode from 'vscode';
import { CodeStatisticsViewProvider } from './viewProviders/codeStatisticsViewProvider';

export function activate(context: vscode.ExtensionContext) {
    const commitUser = vscode.workspace
        .getConfiguration()
        .get<string>('Sundry.Codelinestatistics.GitAuthor');
    const provider = new CodeStatisticsViewProvider(
        commitUser,
        context.extensionUri
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            CodeStatisticsViewProvider.viewType,
            provider
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'sundry.codelinestatistics.statistics',
            () => {
                provider.codeLineStatistics();
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'sundry.codelinestatistics.clear',
            () => {
                provider.clearCodeLineStatistics();
            }
        )
    );
}
