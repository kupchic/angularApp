import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {FlickerApi} from "@entities/flickerNameSpace.namespace";

@Injectable({
	providedIn: "root",
})
export class CardsService {
	private apiKey = "9e38b7736e9ae50c7bef767293c03b8c";
	private searchUrl =
		"https://www.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1";
	constructor(private http: HttpClient) {}

	fetchCards(searchParams?: FlickerApi.SearchParams): Observable<FlickerApi.FetchResult> {
		let searchKeyword = searchParams?.keyWord ? searchParams.keyWord : "popular";
		let endpoint = `${this.searchUrl}&api_key=${this.apiKey}&text=${searchKeyword}&=per_page=100&page=${
			searchParams?.page ? searchParams.page : 1
		}`;
		return this.http.get<FlickerApi.ApiResponse>(endpoint).pipe(
			map((res: FlickerApi.ApiResponse) => {
				const cardsArr: FlickerApi.Card[] = [];
				res.photos.photo.forEach((el: FlickerApi.FlickrCard) => {
					let newCard: FlickerApi.Card = {
						id: el.id,
						title: el.title,
						originalImageUrl: `https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_b.jpg`,
						thumbnailUrl: `https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_n.jpg`,
					};

					cardsArr.push(newCard);
				});
				const fetchResult: FlickerApi.FetchResult = {
					cards: cardsArr,
					page: +res.photos.page,
					pages: +res.photos.pages,
					total: +res.photos.total,
					perpage: +res.photos.perpage,
					searchKeyword: searchKeyword,
				};

				return fetchResult;
			})
		);
	}
}