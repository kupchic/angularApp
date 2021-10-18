export namespace FlickerApi {
	export interface ApiResponse {
		photos: {
			photo: FlickrCard[];
			page: number;
			pages: number;
			perpage: number;
			total: number;
		};
	}
	export interface FlickrCard {
		id: string;
		secret: string;
		server: string;
		farm: string;
		title: string;
	}
	export interface Card {
		id: string;
		title: string;
		originalImageUrl: string;
		thumbnailUrl: string;
	}
	export interface SearchParams {
		keyWord?: string;
		page?: number;
	}
	export interface FetchResult {
		cards: Card[];
		page: number;
		pages: number;
		perpage: number;
		total: number;
		searchKeyword: string;
	}
}