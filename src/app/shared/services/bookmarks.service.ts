import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {FlickerApi} from "@entities/flickerNameSpace.namespace";

export interface Bookmarks {
	[key: string]: FlickerApi.Card;
}

@Injectable({
	providedIn: "root",
})
export class BookmarksService {
	private bookmarks$ = new BehaviorSubject<Bookmarks>({});

	constructor() {
		const bookmarks = localStorage.getItem("bookmarks")
			? JSON.parse(<string>localStorage.getItem("bookmarks"))
			: {};
		this.updateBookmarks(bookmarks);
	}

	getBookmarks(): Observable<Bookmarks> {
		return this.bookmarks$.asObservable();
	}

	addToBookmarks(card: FlickerApi.Card): void {
		const bookmarks = localStorage.getItem("bookmarks")
			? JSON.parse(<string>localStorage.getItem("bookmarks"))
			: {};
		bookmarks[card.id] = card;
		this.updateBookmarks(bookmarks);
	}
	removeBookmark(card: FlickerApi.Card) {
		const bookmarks = localStorage.getItem("bookmarks")
			? JSON.parse(<string>localStorage.getItem("bookmarks"))
			: {};
		delete bookmarks[card.id];
		this.updateBookmarks(bookmarks);
	}

	updateBookmarks(bookmarks: Bookmarks): void {
		const bookmarksJSON = JSON.stringify(bookmarks);
		localStorage.setItem("bookmarks", bookmarksJSON);
		this.bookmarks$.next(bookmarks);
	}
}