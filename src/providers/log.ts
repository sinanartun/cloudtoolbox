import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel | undefined;

function getOutputChannel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('CloudToolbox');
    }
    return outputChannel;
}

export function out(message: string) {
    getOutputChannel().appendLine(message);
}