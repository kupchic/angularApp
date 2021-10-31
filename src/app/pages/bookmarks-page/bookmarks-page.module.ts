import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BookmarksPageComponent} from "@pages/bookmarks-page/bookmarks-page.component";
import {LightboxModule} from "ngx-lightbox";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DeleteBookmarkModalModule} from "@shared/components/delete-bookmark-modal/delete-bookmark-modal.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
	declarations: [BookmarksPageComponent],
	imports: [
		CommonModule,
		LightboxModule,
		MatProgressBarModule,
		DeleteBookmarkModalModule,
		MatTooltipModule,
		MatCheckboxModule,
	],
	exports: [BookmarksPageComponent],
})
export class BookmarksPageModule {}