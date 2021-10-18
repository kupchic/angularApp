import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {StorePageComponent} from "@pages/store-page/store-page.component";
import {StoreTitlePipe} from "@shared/pipes/store-title.pipe";
import {LightboxModule} from "ngx-lightbox";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
	declarations: [StorePageComponent, StoreTitlePipe],
	imports: [CommonModule, LightboxModule, MatProgressSpinnerModule, NgxPaginationModule],
	exports: [StorePageComponent],
})
export class StorePageModule {}