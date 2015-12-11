import * as punycode from 'punycode';
import User from './user'

export default class Question {
	id: number;
	title: string;
	created: string;
	modified: string;
	countReply: number;
	countClip: number;
	countPv: number;
	isBeginner: boolean;
	isAccepted: boolean;
	tags: string[];
	user: User;


	static userLinkPrefix: string = 'https://teratail.com/users/';
	static questionLinkPrefix: string = 'https://teratail.com/questions/';
	static tagLinkPrefix: string = 'https://teratail.com/tags/';

	static lineFeed: string = '\r\n\r\n';
	static endLine: string = '_____' + Question.lineFeed;
	static dotSeparator: string = ' \u2022 ';
	static underscoreAlter: string = '&lowbar;';

	questionLink(): string {
		return Question.questionLinkPrefix + this.id;
	}

	userLink(): string {
		return Question.userLinkPrefix + this.user.displayName;
	}

	toMarkdown(): string {

		var result = '';
		result += '## ' + this.title + Question.lineFeed;
		result += this.formatTags() + Question.lineFeed;
		result += this.formatUser() + Question.lineFeed;
		result += Question.endLine;
		return result;
	}

	formatUser(): string {
		var result = ''
		if (this.user) {
			result += ' [' + Question.normalizeUnderscore(this.user.displayName) + '](' + this.userLink() + ')';
		}
		result += Question.dotSeparator + this.created;
		result += '  ([Go teratail](' + this.questionLink() + ')) ' + Question.lineFeed;
		if (this.user) {
			result += '![](' + this.user.photo + ') ';
		}
		return result;
	}

	formatTags(): string {
		var result = '';
		this.tags.forEach((value, index, array) => {
			result += '[' + value + '](' + Question.tagLinkPrefix + value + ') ';
		});
		return result;
	}

	constructor(id: number, title: string, created: string, modified: string, countReply: number,
		countClip: number, countPv: number, isBeginner: boolean, isAccepted: boolean) {
		this.id = id;
		this.title = title;
		this.created = created;
		this.modified = modified;
		this.countReply = countReply;
		this.countClip = countClip;
		this.countPv = countPv;
		this.isBeginner = isBeginner;
		this.isAccepted = isAccepted;
	}

	static normalizeUnderscore(text: string): string {
		return text.replace(/_/g, Question.underscoreAlter);
	}

	static head1(text: string): string {
		return '#' + text + '\r\n\r\n';
	}

	static fromJson(json: any): Question {
		var question = new Question(json.id, json.title, json.created, json.modified, json.count_reply, json.count_clip, json.count_pv, json.is_beginner, json.is_accepted);
		if (json.tags) {
			question.tags = json.tags;
		}
		if (json.user) {
			var user = json.user;
			question.user = new User(user.display_name, user.photo, user.score);
		}
		return question;
	}
}