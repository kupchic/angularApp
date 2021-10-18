import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {CardsService} from "@shared/services/cards-service.service";
import {FlickerApi} from "@entities/flickerNameSpace.namespace";
import {IAlbum, Lightbox} from "ngx-lightbox";
import {fromEvent, Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Component({
	selector: "app-store-page",
	templateUrl: "./store-page.component.html",
	styleUrls: ["./store-page.component.scss"],
})
export class StorePageComponent implements OnInit, AfterViewInit, OnDestroy {
	constructor(private cardService: CardsService, private _lightbox: Lightbox) {}
	perPage: number = 100;
	page: number = 1;
	pages: number = 0;
	total: number = 0;
	searchKeyword: string = "popular";
	cards: FlickerApi.Card[] = [];
	private _albums: any[] = [];
	@ViewChild("searchInput", {static: false})
	searchInput: ElementRef | undefined;
	searchingSubscription!: Subscription;

	ngOnInit(): void {
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
		this.updateInfo({keyWord: this.searchKeyword, page: page});
	}

	ngOnDestroy() {
		this.searchingSubscription.unsubscribe();
	}
}