import {Component, OnDestroy, OnInit} from "@angular/core";
import {Bookmarks, BookmarksService} from "@shared/services/bookmarks.service";
import {FlickerApi} from "@entities/flickerNameSpace.namespace";
import {Subscription} from "rxjs";
import {Lightbox} from "ngx-lightbox";
import {MatDialog} from "@angular/material/dialog";
import {DeleteBookmarkModalComponent} from "@shared/components/delete-bookmark-modal/delete-bookmark-modal.component";

@Component({
	selector: "app-bookmarks-page",
	templateUrl: "./bookmarks-page.component.html",
	styleUrls: ["./bookmarks-page.component.scss"],
})
export class BookmarksPageComponent implements OnInit, OnDestroy {
	constructor(private bookmarksService: BookmarksService, private _lightbox: Lightbox, public dialog: MatDialog) {}
	bookmarks: Bookmarks = {};
	bookmarksForDelete: FlickerApi.Card[] = [];
	bookmarksSubscription!: Subscription;
	modalCLoseSubscription!: Subscription;
	private _albums: any[] = [];

	ngOnInit(): void {
		this.bookmarksSubscription = this.bookmarksService.getBookmarks().subscribe((res) => {
			this.bookmarks = res;
			this.updateLightbox();
		});
	}
	deleteBookmark(id: string): void {
		delete this.bookmarks[id];
		this.bookmarksService.updateBookmarks(this.bookmarks);
		this.updateLightbox();
	}
	updateLightbox() {
		this._albums = [];
		Object.values(this.bookmarks).forEach((el) => {
			this._albums.push({
				src: el.originalImageUrl,
				caption: el.title,
			});
		});
		this._albums.reverse();
	}
	open(index: number): void {
		this._lightbox.open(this._albums, index);
	}
	getArr(bookmarks: Bookmarks): FlickerApi.Card[] {
		return Object.values(bookmarks).reverse();
	}

	ngOnDestroy() {
		this.bookmarksService.updateBookmarks(this.bookmarks);
		this.bookmarksSubscription.unsubscribe();
	}
	openModalForAloneCard(card: FlickerApi.Card): void {
		this.bookmarksForDelete.push(card);
		this.openModalForMany(this.bookmarksForDelete);
	}
	openModalForMany(cards: FlickerApi.Card[]): void {
		const dialogRef = this.dialog.open(DeleteBookmarkModalComponent, {
			width: "250px",
			data: cards,
		});
		this.modalCLoseSubscription = dialogRef.afterClosed().subscribe((result) => {
			console.log(result);
			this.modalCLoseSubscription.unsubscribe();
		});
	}
}