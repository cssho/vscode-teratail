import * as events from 'events';
import * as vscode from 'vscode'
import {QuestionsFactory, IQuestions} from './teratail';
import View from './view';
import Document from './document';

export default class Controller implements vscode.Disposable {
	private extensionContext: vscode.ExtensionContext;
	private event: events.EventEmitter = new events.EventEmitter();
	private view: View;
	private refreshTimelineInProgress: boolean = false;

	static CmdDisplay: string = 'teratail.display';
	static CmdRefresh: string = 'teratail.refresh';

	constructor(context: vscode.ExtensionContext, view: View) {
		this.extensionContext = context;
		this.view = view;
	}

	private registerCommand(command: string) {
		const self = this;
		this.extensionContext.subscriptions.push(vscode.commands.registerCommand(command, () => {
			self.event.emit(command);
		}));
	}

	private onEditorChange(editor: vscode.TextEditor) {
		if (editor) {
			console.log('editor changed: ' + editor.document.fileName);
			if (QuestionsFactory.isTeratailBuffer(editor.document)) {
				console.log('it is a teratail buffer file');
					vscode.commands.executeCommand('workbench.action.markdown.togglePreview');
			} 
		}
	}

	private refreshQuestions(message: string, questions: IQuestions) {
		const self = this;
		vscode.window.setStatusBarMessage(message,
			questions.getNew().then((content) => {
				questions.refreshInProgress = true;
				Document.openDocument(questions.filename, content).then(() => {
					vscode.commands.executeCommand("workbench.action.markdown.togglePreview");
					questions.refreshInProgress = false;
				}, (error) => {
					questions.refreshInProgress = false;
				});
			}, (error: string) => {
				vscode.window.showErrorMessage('Failed to retrieve timeline: ' + error);
			})
		);
	}

	private refreshTeratail() {
		const questions = QuestionsFactory.getQuestions();
		this.refreshQuestions('Refreshing questions...', questions);
	}

	private onTeratailRefresh() {
		const self = this;
		self.refreshTeratail();
	}

	private teratailQuestionsInternal() {
		const self = this;
		self.refreshTeratail();
	}

	private onTeratailQuestions() {
		const self = this;
		self.teratailQuestionsInternal();
	}

	activate() {
		const self = this;

		this.registerCommand(Controller.CmdDisplay);
		this.registerCommand(Controller.CmdRefresh);

		this.event.on(Controller.CmdDisplay, () => { self.onTeratailQuestions(); });
		this.event.on(Controller.CmdRefresh, () => { self.onTeratailRefresh(); });

		this.extensionContext.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => { self.onEditorChange(editor); }));
		this.view.activate();
	}

	deactivate() {
		console.log('Teratail deactivated!');
	}

	dispose() {
		this.deactivate();
		this.view.dispose();
	}
}