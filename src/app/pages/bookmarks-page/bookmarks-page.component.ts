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
	bookmarksForDelete: Bookmarks = {};
	bookmarksSubscription!: Subscription;
	modalCLoseSubscription!: Subscription;
	private _albums: any[] = [];
	allComplete: boolean = false;

	ngOnInit(): void {
		this.bookmarksSubscription = this.bookmarksService.getBookmarks().subscribe((res) => {
			this.bookmarks = res;
			this.updateLightbox();
		});
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
		this.bookmarksForDelete[card.id] = card;
		this.openModalForMany(this.bookmarksForDelete);
	}
	openModalForMany(cards: Bookmarks): void {
		const dialogRef = this.dialog.open(DeleteBookmarkModalComponent, {
			width: "250px",
			data: cards,
		});
		this.modalCLoseSubscription = dialogRef.afterClosed().subscribe(() => {
			this.bookmarksForDelete = {};
			this.allComplete = false;
			this.modalCLoseSubscription.unsubscribe();
		});
	}
	setAll(complete: boolean): void {
		this.allComplete = complete;
		complete ? (this.bookmarksForDelete = this.bookmarks) : (this.bookmarksForDelete = {});
	}
}