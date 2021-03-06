"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    context.subscriptions.push(vscode.commands.registerCommand('sundry.transCamel.transBigCamel', () => __awaiter(this, void 0, void 0, function* () {
        let str = yield vscode.env.clipboard.readText();
        var ary = vscode.workspace
            .getConfiguration()
            .get('sundry.transCamel');
        ary === null || ary === void 0 ? void 0 : ary.map((s) => {
            str = str.replace(s, ' ');
        });
        const aryStr = str.split(' ');
        let buildStr = '';
        if (aryStr.length > 0) {
            for (let index = 0; index < aryStr.length; index++) {
                const element = aryStr[index];
                const charletter = element.substr(0, 1).toUpperCase() +
                    element.substr(1);
                buildStr += charletter;
            }
        }
        vscode.env.clipboard.writeText(`${buildStr}`);
        vscode.window.showInformationMessage(yield vscode.env.clipboard.readText());
    })));
    context.subscriptions.push(vscode.commands.registerCommand('sundry.transCamel.transSmallCamel', () => __awaiter(this, void 0, void 0, function* () {
        let str = yield vscode.env.clipboard.readText();
        var ary = vscode.workspace
            .getConfiguration()
            .get('sundry.transCamel');
        ary === null || ary === void 0 ? void 0 : ary.map((s) => {
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
        vscode.window.showInformationMessage(yield vscode.env.clipboard.readText());
    })));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map