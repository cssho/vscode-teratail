export default class User {
	displayName: string;
	photo: string;
	score: number;

	constructor(displayName: string, photo: string, score: number) {
		this.displayName = displayName;
		this.photo = photo;
		this.score = score;
	}
}