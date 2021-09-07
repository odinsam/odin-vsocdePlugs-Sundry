import * as vscode from 'vscode';
import { CodeStatistics } from './sundry.Statistics/codeStatistics';
import { CodeStatisticsViewProvider } from './viewProviders/codeStatisticsViewProvider';

export function activate(context: vscode.ExtensionContext) {
    const codeStatistics = new CodeStatistics();
    //const provider = new CodeStatisticsViewProvider(context.extensionUri);

    // context.subscriptions.push(
    //     vscode.window.registerWebviewViewProvider(
    //         CodeStatisticsViewProvider.viewType,
    //         provider
    //     )
    // );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'sundry.codelinestatistics.statistics',
            () => {
                codeStatistics.codeLineStatistics();
                // provider.codeLineStatistics();
            }
        )
    );

    // context.subscriptions.push(
    //     vscode.commands.registerCommand(
    //         'sundry.codelinestatistics.clear',
    //         () => {
    //             provider.clearCodeLineStatistics();
    //         }
    //     )
    // );
}
