import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
	name: "storeTitle",
})
export class StoreTitlePipe implements PipeTransform {
	transform(value: string): string {
		return value === "popular" ? value : `Result for "${value}"`;
	}
}