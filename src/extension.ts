import { privateEncrypt } from 'crypto';
import * as vscode from 'vscode';
import { getVSCodeDownloadUrl } from 'vscode-test/out/util';
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

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'sundry.transCamel.transBigCamel',
            async () => {
                let str = await vscode.env.clipboard.readText();
                var ary = vscode.workspace
                    .getConfiguration()
                    .get<Array<string>>('sundry.transCamel');
                ary?.map((s) => {
                    str = str.replace(s, ' ');
                });
                const aryStr = str.split(' ');
                let buildStr = '';
                if (aryStr.length > 0) {
                    for (let index = 0; index < aryStr.length; index++) {
                        const element = aryStr[index];
                        const charletter =
                            element.substr(0, 1).toUpperCase() +
                            element.substr(1);
                        buildStr += charletter;
                    }
                }
                vscode.env.clipboard.writeText(`${buildStr}`);
                vscode.window.showInformationMessage(
                    await vscode.env.clipboard.readText()
                );
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'sundry.transCamel.transSmallCamel',
            async () => {
                let str = await vscode.env.clipboard.readText();
                var ary = vscode.workspace
                    .getConfiguration()
                    .get<Array<string>>('sundry.transCamel');
                ary?.map((s) => {
                    str = str.replace(s, ' ');
                });
                const aryStr = str.split(' ');
                let buildStr = '';
                if (aryStr.length > 0) {
                    for (let index = 0; index < aryStr.length; index++) {
                        const element = aryStr[index];
                        let charletter = '';
                        if (index == 0)
                            charletter =
                                element.substr(0, 1).toLowerCase() +
                                element.substr(1);
                        else
                            charletter =
                                element.substr(0, 1).toUpperCase() +
                                element.substr(1);
                        buildStr += charletter;
                    }
                }
                vscode.env.clipboard.writeText(`${buildStr}`);
                vscode.window.showInformationMessage(
                    await vscode.env.clipboard.readText()
                );
            }
        )
    );
}
