import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Bookmarks, BookmarksService} from "@shared/services/bookmarks.service";
import {FlickerApi} from "@entities/flickerNameSpace.namespace";
import {fromEvent, Subject, Subscription} from "rxjs";
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

	public bookmarks: Bookmarks = {};
	public bookmarksArr: FlickerApi.Card[] = [];
	public bookmarksForDelete: Bookmarks = {};
	public bookmarksForDeleteArr: FlickerApi.Card[] = [];
	public allComplete: boolean = false;
	public multipleDeleting: boolean = false;
	private _albums: any[] = [];
	private unsubscribe$ = new Subject<void>();
	private modalCLoseSubscription!: Subscription;
	@ViewChild("bookmarksGallery", {static: false})
	private gallery: ElementRef | undefined;

	ngOnInit(): void {
		this.bookmarksService
			.getBookmarks()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe((res) => {
				this.bookmarks = res;
				this.bookmarksArr = this.getArr(res);
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
			mouseDown$
				.pipe(
					mergeMap((e: any) => {
						return of(e).pipe(delay(1200), takeUntil(mouseUp$));
					}),
					takeUntil(this.unsubscribe$)
				)
				.subscribe((e: any) => {
					if (e.target.closest(".gallery-item")) {
						this.multipleDeleting = true;
					}
				});
		}
	}

	multipleDeletingSelect(card: FlickerApi.Card): void {
		if (this.multipleDeleting) {
			if (this.bookmarksForDelete[card.id]) {
				delete this.bookmarksForDelete[card.id];
				this.bookmarksForDeleteArr.splice(
					this.bookmarksForDeleteArr.findIndex((c) => c === card),
					1
				);
			} else {
				this.bookmarksForDelete[card.id] = card;
				this.bookmarksForDeleteArr.push(card);
			}
			if (!this.bookmarksForDeleteArr.length) {
				this.multipleDeleting = false;
				this.allComplete = false;
			}
		}
	}

	openModalForAloneCard(card: FlickerApi.Card): void {
		const id = card.id;
		const data: Bookmarks = {};
		data[id] = card;
		const dialogRef = this.dialog.open(DeleteBookmarkModalComponent, {
			width: "18rem",
			maxWidth: "90vw",
			data: data,
		});
	}

	openModalForMany(cards: Bookmarks): void {
		const dialogRef = this.dialog.open(DeleteBookmarkModalComponent, {
			width: "18rem",
			maxWidth: "90vw",
			data: cards,
		});
		this.modalCLoseSubscription = dialogRef.afterClosed().subscribe((res) => {
			if (res) {
				this.bookmarksForDelete = {};
				this.bookmarksForDeleteArr = [];
				this.allComplete = false;
				this.multipleDeleting = false;
			}
			this.modalCLoseSubscription.unsubscribe();
		});
	}

	setAll(complete: boolean): void {
		this.allComplete = complete;
		this.multipleDeleting = complete;
		if (complete) {
			this.bookmarksForDelete = {...this.bookmarks};
			this.bookmarksForDeleteArr = [...this.bookmarksArr];
		} else {
			this.bookmarksForDelete = {};
			this.bookmarksForDeleteArr = [];
		}
	}

	ngOnDestroy() {
		this.bookmarksService.updateBookmarks(this.bookmarks);
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}