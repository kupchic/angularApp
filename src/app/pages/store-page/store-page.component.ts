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
	private fetchResults$: any = new Subject<FlickerApi.FetchResult>().pipe(pairwise());
	private lastTwoResults: FlickerApi.FetchResult[] = [];

	ngOnInit(): void {
		this.bookmarksService
			.getBookmarks()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe((res) => {
				this.bookmarks = res;
			});
		this.pageSubject$.pipe(debounceTime(1000), takeUntil(this.unsubscribe$)).subscribe((res) => {
			this.page = res;
			if (
				this.lastTwoResults.length === 2 &&
				this.lastTwoResults[0].page === this.page &&
				this.lastTwoResults[0].searchKeyword === this.searchKeyword
			) {
				this.cards = this.lastTwoResults[0].cards;
				this.updateLightbox();
				this.fetchResults$.next(this.lastTwoResults[0]);
			} else {
				this.updateInfo({keyWord: this.searchKeyword, page: this.page});
			}
		});
		this.fetchResults$.pipe(takeUntil(this.unsubscribe$)).subscribe((res: FlickerApi.FetchResult[]) => {
			this.lastTwoResults = res;
			console.log(this.lastTwoResults);
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

	public cardLike(card: FlickerApi.Card): void {
		if (!this.bookmarks[card.id]) {
			this.bookmarksService.addToBookmarks(card);
		} else {
			this.bookmarksService.removeBookmark(card);
		}
	}

	private updateInfo(searchParams?: FlickerApi.SearchParams): void {
		this.cards = [];
		this.cardService
			.fetchCards(searchParams)
			.toPromise()
			.then((res) => {
				this.fetchResults$.next(res);
				this.cards = res.cards;
				this.searchKeyword = res.searchKeyword;
				this.total = res.total;
				this.pages = res.pages;
				this.page = res.page;
				this.perPage = res.perpage;
			})
			.then(() => {
				this.updateLightbox();
			});
	}

	public open(index: number): void {
		this._lightbox.open(this._albums, index);
	}

	private updateLightbox(): void {
		this._albums = [];
		this.cards.forEach((el) => {
			this._albums.push({
				src: el.originalImageUrl,
				caption: el.title,
			});
		});
	}

	public onTableChange(page: number): void {
		this.pageSubject$.next(page);
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
