import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Bookmarks, BookmarksService} from "@shared/services/bookmarks.service";
import {FlickerApi} from "@entities/flickerNameSpace.namespace";
import {fromEvent, Subscription} from "rxjs";
import {Lightbox} from "ngx-lightbox";
import {MatDialog} from "@angular/material/dialog";
import {DeleteBookmarkModalComponent} from "@shared/components/delete-bookmark-modal/delete-bookmark-modal.component";
import {delay, mergeMap, takeUntil} from "rxjs/operators";
import {of} from "rxjs";

@Component({
	selector: "app-bookmarks-page",
	templateUrl: "./bookmarks-page.component.html",
	styleUrls: ["./bookmarks-page.component.scss"],
})
export class BookmarksPageComponent implements OnInit, OnDestroy, AfterViewInit {
	constructor(private bookmarksService: BookmarksService, private _lightbox: Lightbox, public dialog: MatDialog) {}
	bookmarks: Bookmarks = {};
	bookmarksForDelete: Bookmarks = {};
	bookmarksSubscription!: Subscription;
	modalCLoseSubscription!: Subscription;
	longMouseDownSubscription!: Subscription;
	private _albums: any[] = [];
	allComplete: boolean = false;
	@ViewChild("bookmarksGallery", {static: false})
	gallery: ElementRef | undefined;
	multipleDeleting: boolean = false;

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

	ngAfterViewInit() {
		if (this.gallery?.nativeElement) {
			const mouseDown$ = fromEvent(this.gallery.nativeElement, "mousedown");
			const mouseUp$ = fromEvent(this.gallery.nativeElement, "mouseup");
			this.longMouseDownSubscription = mouseDown$
				.pipe(
					mergeMap((e: any) => {
						return of(e).pipe(delay(1200), takeUntil(mouseUp$));
					})
				)
				.subscribe((e: any) => {
					if (e.target.closest(".gallery-item")) {
						e.preventDefault();
						this.multipleDeleting = true;
					}
				});
		}
	}
	multipleDeletingSelect(card: FlickerApi.Card): void {
		// const empty = () => {};
		// this.multipleDeleting
		// 	? this.bookmarksForDelete[card.id]
		// 		? delete this.bookmarksForDelete[card.id]
		// 		: (this.bookmarksForDelete[card.id] = card)
		// 	: empty();
		if (this.multipleDeleting) {
			if (this.bookmarksForDelete[card.id]) {
				console.log(2);
				delete this.bookmarksForDelete[card.id];
			} else {
				console.log(1);
				this.bookmarksForDelete[card.id] = card;
			}
		}

		console.log(this.bookmarksForDelete);
	}

	openModalForAloneCard(card: FlickerApi.Card): void {
		const id = card.id;
		const data: Bookmarks = {};
		data[id] = card;
		const dialogRef = this.dialog.open(DeleteBookmarkModalComponent, {
			width: "250px",
			data: data,
		});
	}
	openModalForMany(cards: Bookmarks): void {
		const dialogRef = this.dialog.open(DeleteBookmarkModalComponent, {
			width: "250px",
			data: cards,
		});
		this.modalCLoseSubscription = dialogRef.afterClosed().subscribe(() => {
			this.bookmarksForDelete = {};
			this.allComplete = false;
			this.multipleDeleting = false;
			this.modalCLoseSubscription.unsubscribe();
		});
	}
	setAll(complete: boolean): void {
		this.allComplete = complete;
		this.multipleDeleting = complete;
		complete ? (this.bookmarksForDelete = this.bookmarks) : (this.bookmarksForDelete = {});
	}
	ngOnDestroy() {
		this.bookmarksService.updateBookmarks(this.bookmarks);
		this.bookmarksSubscription.unsubscribe();
		this.longMouseDownSubscription.unsubscribe();
	}
}