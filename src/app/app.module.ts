import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {AppComponent} from "./app.component";
import {BookmarksPageComponent} from "@pages/bookmarks-page/bookmarks-page.component";
import {HeaderComponent} from "@shared/components/header/header.component";
import {SidebarComponent} from "@shared/components/sidebar/sidebar.component";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {StorePageModule} from "@pages/store-page/store-page.module";

@NgModule({
	declarations: [AppComponent, BookmarksPageComponent, HeaderComponent, SidebarComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		MatIconModule,
		BrowserAnimationsModule,
		StorePageModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}