import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {CardsService} from "@shared/services/cards-service.service";
import {FlickerApi} from "@entities/flickerNameSpace.namespace";
import {Lightbox} from "ngx-lightbox";
import {BehaviorSubject, fromEvent, Subject, Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {Bookmarks, BookmarksService} from "@shared/services/bookmarks.service";

@Component({
	selector: "app-store-page",
	templateUrl: "./store-page.component.html",
	styleUrls: ["./store-page.component.scss"],
})
export class StorePageComponent implements OnInit, AfterViewInit, OnDestroy {
	constructor(
		private cardService: CardsService,
		private bookmarksService: BookmarksService,
		private _lightbox: Lightbox
	) {}
	perPage: number = 100;
	page: number = 1;
	pageSubject$ = new BehaviorSubject<number>(this.page);
	pages: number = 0;
	total: number = 0;
	searchKeyword: string = "popular";
	cards: FlickerApi.Card[] = [];
	bookmarks: Bookmarks = {};
	private _albums: any[] = [];
	@ViewChild("searchInput", {static: false})
	searchInput: ElementRef | undefined;
	searchingSubscription!: Subscription;
	bookmarksSubscription!: Subscription;
	pageSubscription!: Subscription;

	ngOnInit(): void {
		this.bookmarksSubscription = this.bookmarksService.getBookmarks().subscribe((res) => {
			this.bookmarks = res;
		});
		this.pageSubscription = this.pageSubject$.pipe(debounceTime(1000)).subscribe((res) => {
			this.page = res;
			this.updateInfo({keyWord: this.searchKeyword, page: this.page});
		});

		this.updateInfo();
	}
	ngAfterViewInit() {
		if (this.searchInput) {
			const searching = fromEvent(this.searchInput.nativeElement, "input");
			this.searchingSubscription = searching.pipe(debounceTime(1200)).subscribe((res: any) => {
				this.updateInfo({keyWord: res.target.value});
			});
		}
	}

	cardLike(card: FlickerApi.Card): void {
		if (!this.bookmarks[card.id]) {
			this.bookmarksService.addToBookmarks(card);
		} else {
			this.bookmarksService.removeBookmark(card);
		}
	}

	updateInfo(searchParams?: FlickerApi.SearchParams): void {
		this.cards = [];
		this.cardService
			.fetchCards(searchParams)
			.toPromise()
			.then((res) => {
				this.cards = res.cards;
				this.searchKeyword = res.searchKeyword;
				this.total = res.total;
				this.pages = res.pages;
				this.page = res.page;
				this.perPage = res.perpage;
			})
			.then(() => {
				this._albums = [];
				this.cards.forEach((el) => {
					this._albums.push({
						src: el.originalImageUrl,
						caption: el.title,
					});
				});
			});
	}
	open(index: number): void {
		this._lightbox.open(this._albums, index);
	}
	onTableChange(page: number): void {
		this.pageSubject$.next(page);
	}

	ngOnDestroy() {
		this.bookmarksSubscription.unsubscribe();
		this.searchingSubscription.unsubscribe();
	}
}