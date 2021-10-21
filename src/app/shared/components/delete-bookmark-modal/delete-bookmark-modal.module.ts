import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DeleteBookmarkModalComponent} from "@shared/components/delete-bookmark-modal/delete-bookmark-modal.component";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
	declarations: [DeleteBookmarkModalComponent],
	imports: [CommonModule, MatDialogModule],
	exports: [DeleteBookmarkModalComponent],
})
export class DeleteBookmarkModalModule {}