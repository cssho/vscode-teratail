import * as vscode from 'vscode';
import Controller from './controller';

export default class View implements vscode.Disposable {
	private statusBarItemMain: vscode.StatusBarItem;
	
	activate() {
		this.statusBarItemMain = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 6);
		this.statusBarItemMain.text = '$(home)teratail'
		this.statusBarItemMain.tooltip = 'Display Questions';
		this.statusBarItemMain.command = Controller.CmdDisplay;
		this.statusBarItemMain.show();

	}

	dispose() {
		this.statusBarItemMain.dispose();
	}
}