import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BookmarksPageComponent} from "@pages/bookmarks-page/bookmarks-page.component";
import {StorePageComponent} from "@pages/store-page/store-page.component";

const routes: Routes = [
	{
		path: "store",
		component: StorePageComponent,
	},
	{
		path: "bookmarks",
		component: BookmarksPageComponent,
	},
	{
		path: "",
		redirectTo: "store",
		pathMatch: "full",
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}