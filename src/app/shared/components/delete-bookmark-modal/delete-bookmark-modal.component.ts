import {Inject, OnDestroy} from "@angular/core";
import {Component, OnInit} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FlickerApi} from "@entities/flickerNameSpace.namespace";
import {Bookmarks, BookmarksService} from "@shared/services/bookmarks.service";
import {Subscription} from "rxjs";

@Component({
	selector: "app-delete-bookmark-modal",
	templateUrl: "./delete-bookmark-modal.component.html",
	styleUrls: ["./delete-bookmark-modal.component.scss"],
})
export class DeleteBookmarkModalComponent implements OnInit, OnDestroy {
	constructor(
		public dialogRef: MatDialogRef<DeleteBookmarkModalComponent>,
		@Inject(MAT_DIALOG_DATA) public cardsForDelete: FlickerApi.Card[],
		private bookmarksService: BookmarksService
	) {}
	bookmarks: Bookmarks = {};
	bookmarksSubscription!: Subscription;
	ngOnInit(): void {
		this.bookmarksSubscription = this.bookmarksService.getBookmarks().subscribe((res) => {
			this.bookmarks = res;
		});
	}

	ngOnDestroy() {
		this.bookmarksSubscription.unsubscribe();
	}
	onClose() {
		this.dialogRef.close();
	}
	onSubmit() {
		this.cardsForDelete.forEach((card) => {
			delete this.bookmarks[card.id];
		});

		this.bookmarksService.updateBookmarks(this.bookmarks);
		this.dialogRef.close();
	}
}