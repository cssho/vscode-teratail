import * as vscode from 'vscode'
import * as os from 'os'
import * as fs from 'fs'
import {join} from 'path';
import Question from './question'

var Teratail = require('teratail');

export class QuestionsFactory {

	static fileName: string = 'teratail_question';

	static getQuestions(): IQuestions {
		return Questions.getSharedInstance();
	}

	static targetQuestions: string = 'vscTeratailTargetQuestions';
	static refreshTargetQuestions: IQuestions;

	static isTeratailBuffer(document: vscode.TextDocument): boolean {
		const firstLine = document.lineAt(0).text;
		return (firstLine.startsWith('# ' + this.fileName));
	}

	static getQuestionsByDocument(document: vscode.TextDocument): IQuestions {
		const firstLine = document.lineAt(0).text;
		if (firstLine.startsWith('# ' + this.fileName)) {
			var parts = firstLine.split('_');
			var type = Number(parts[1]);
			return this.getQuestions();
		}
		return null;
	}
}

export interface IQuestions {
	getNew(): Thenable<string>;
	filename: string;
	refreshInProgress: boolean;
}

export class Questions implements IQuestions {
	client: any;
	refreshInProgress: boolean = false;

	protected _filename: string;
	get filename(): string {
		const file = join(os.tmpdir(), this._filename);
		if (!fs.existsSync(file)) {
			fs.writeFileSync(file, '');
		}
		return file;
	}
	question: Question[];

	endpoint: string = 'questions';

	title: string = 'Teratail Questions';

	getNew(): Thenable<string> {
		const self = this;
		var params: any = { limit: vscode.workspace.getConfiguration('teratail').get('getQuestionsCount'), page: 1 };
		return new Promise((resolve, reject) => {
			self.client.get(self.endpoint, params, function(error: any[], json: any, resposne) {
				if (!error) {
					// older question go first
					json.questions.reverse().forEach((value, index, array) => {
						// don't cache more than 1000 question
						if (self.question.unshift(Question.fromJson(value)) >= 1000) {
							self.question.pop();
						}
					});
					var result = Question.head1(self.title) + self.question.map<string>((t) => { return t.toMarkdown(); }).join('');

					resolve(result);
				} else {
					console.error(error);
					var msg = error.map((value, index, array) => { return value.message; }).join(';');
					reject(msg);
				}
			});
		});
	}

	protected static _instance: IQuestions;
	protected static createInstance(): IQuestions {
		return new Questions();
	}

	static getSharedInstance(): IQuestions {
		if (!this._instance) {
			this._instance = this.createInstance();
		}
		return this._instance;
	}

	constructor() {
		var configuration = vscode.workspace.getConfiguration('teratail');
		var bearer_token = configuration.get('accesstoken');
		this.client = new Teratail({
			bearer_token
		});
		this._filename = QuestionsFactory.fileName + '.md';
		this.question = new Array<Question>();
	}
}