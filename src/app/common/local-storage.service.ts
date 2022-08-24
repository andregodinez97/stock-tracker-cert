import {Injectable} from '@angular/core';
import {StockDataService} from "./stock-data.service";
import {StockQuote} from "./stock.model";
import {take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  saveItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  loadItem(key: string): any {
    const jsonString = localStorage.getItem(key);

    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  }

}
