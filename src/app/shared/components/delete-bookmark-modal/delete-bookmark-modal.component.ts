import {Inject, OnDestroy} from "@angular/core";
import {Component, OnInit} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FlickerApi} from "@entities/flickerNameSpace.namespace";
import {Bookmarks, BookmarksService} from "@shared/services/bookmarks.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
	selector: "app-delete-bookmark-modal",
	templateUrl: "./delete-bookmark-modal.component.html",
	styleUrls: ["./delete-bookmark-modal.component.scss"],
})
export class DeleteBookmarkModalComponent implements OnInit, OnDestroy {
	constructor(
		public dialogRef: MatDialogRef<DeleteBookmarkModalComponent>,
		@Inject(MAT_DIALOG_DATA) public cardsForDelete: Bookmarks,
		private bookmarksService: BookmarksService
	) {}
	public bookmarks: Bookmarks = {};
	private unsubscribe$ = new Subject<void>();
	ngOnInit(): void {
		this.bookmarksService
			.getBookmarks()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe((res) => {
				this.bookmarks = res;
			});
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
	public onClose() {
		this.dialogRef.close(false);
	}
	public getArr(bookmarks: Bookmarks): FlickerApi.Card[] {
		return Object.values(bookmarks);
	}
	public onSubmit() {
		if (this.getArr(this.bookmarks).length === this.getArr(this.cardsForDelete).length) {
			this.bookmarksService.updateBookmarks({});
		} else {
			Object.values(this.cardsForDelete).forEach((card) => {
				if (this.bookmarks[card.id]) delete this.bookmarks[card.id];
			});

			this.bookmarksService.updateBookmarks(this.bookmarks);
		}
		this.dialogRef.close(true);
	}
}
