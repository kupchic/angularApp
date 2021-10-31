import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {CardsService} from "@shared/services/cards-service.service";
import {FlickerApi} from "@entities/flickerNameSpace.namespace";
import {Lightbox} from "ngx-lightbox";
import {BehaviorSubject, fromEvent, Subject} from "rxjs";
import {bufferCount, debounceTime, pairwise, takeUntil} from "rxjs/operators";
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

	public perPage: number = 100;
	public page: number = 1;
	public pages: number = 0;
	public total: number = 0;
	public searchKeyword: string = "popular";
	public cards: FlickerApi.Card[] = [];
	public bookmarks: Bookmarks = {};
	private pageSubject$ = new BehaviorSubject<number>(this.page);
	private _albums: any[] = [];
	@ViewChild("searchInput", {static: false})
	private searchInput: ElementRef | undefined;
	private unsubscribe$ = new Subject<void>();
	private test: any;

	ngOnInit(): void {
		this.bookmarksService
			.getBookmarks()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe((res) => {
				this.bookmarks = res;
			});
		this.pageSubject$.pipe(debounceTime(1000), takeUntil(this.unsubscribe$)).subscribe((res) => {
			this.page = res;
			this.updateInfo({keyWord: this.searchKeyword, page: this.page});
		});
	}

	ngAfterViewInit() {
		if (this.searchInput) {
			const searching = fromEvent(this.searchInput.nativeElement, "input");
			searching.pipe(debounceTime(1200), takeUntil(this.unsubscribe$)).subscribe((res: any) => {
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
			.pipe(pairwise(), takeUntil(this.unsubscribe$))
			.subscribe(
				(res) => {
					this.test = res;
				},
				() => {},
				() => {
					console.log(this.test);
				}
			);

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
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}