import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {
  StockQuote,
  StockQuoteResponse,
  StockSentiment,
  StockSentimentResponse,
  Symbol,
  SymbolLookupResponse
} from './stock.model'
import {LocalStorageService} from "./local-storage.service";
import * as moment from 'moment';
import {A} from "@angular/cdk/keycodes";

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private TRACKED_STOCK_QUOTE_KEY = 'trackeStockQuotes';

  private symbolLookupSubject = new BehaviorSubject<Symbol[]>([]);
  public symbolLookup$: Observable<Symbol[]> = this.symbolLookupSubject.asObservable();

  private trackedStockQuotesSubject = new BehaviorSubject<StockQuote[]>([]);
  public trackedStockQuotes$: Observable<StockQuote[]> = this.trackedStockQuotesSubject.asObservable();

  private configUrl = "https://finnhub.io/api/v1/";
  private token = "&token=cc2lsgiad3ibhhek1ieg";

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {
    this.loadTrackedStocksFromLocalStorage();
  }

  symbolLookup(stockSymbol: string): void {
    this.http.get<SymbolLookupResponse>(encodeURI(this.configUrl + "search?q=" +
      encodeURI(stockSymbol) + this.token)).subscribe(response => {
      if (response.result && response.result.length > 0) {
        // filter to top 30 / single letter can return 10,000 symbols
        if (response.count > 30) {
          this.symbolLookupSubject.next(response.result.slice(0, 30));
        } else {
          this.symbolLookupSubject.next(response.result);
        }
      }
    });
  }

  trackStockQuote(stockSymbol: Symbol): void {
    // Don't track again if its already tracked
    if (this.trackedStockQuotesSubject.getValue().map(trackedStockQuote => trackedStockQuote.symbol).indexOf(stockSymbol.symbol) == -1) {
      this.http.get<StockQuoteResponse>(
        encodeURI(`${this.configUrl}quote?symbol=${stockSymbol.symbol}${this.token}`)).subscribe(response => {
        const newStockQuote: StockQuote = {
          symbol: stockSymbol.symbol,
          description: stockSymbol.description,
          currentPrice: response.c,
          change: response.d,
          percentChange: response.dp,
          highPriceOfTheDay: response.h,
          openPriceOfTheDay: response.o,
          previousClosePrice: response.pc
        };

        const newTrackedStockQuotes = [...this.trackedStockQuotesSubject.getValue(), newStockQuote];

        this.trackedStockQuotesSubject.next(newTrackedStockQuotes);
        // TODO: store time item was saved and when retrieving check if it is more than a certaim time old to retrieve quotes
        this.localStorageService.saveItem(this.TRACKED_STOCK_QUOTE_KEY, newTrackedStockQuotes);

        // reset symbol lookup search
        this.symbolLookupSubject.next([]);
      });
    }
  };

  getStockSentiment(stockSymbol: string): Observable<StockSentimentResponse> {
    const currentDate = moment().format('YYYY-MM-DD');
    const last3monthsDate = moment().subtract(2, 'months').format('YYYY-MM-DD');

    return this.http.get<StockSentimentResponse>(
      encodeURI(`${this.configUrl}stock/insider-sentiment?symbol=${stockSymbol}&from=${last3monthsDate}&to=${currentDate}${this.token}`));
  }

  removeTrackedStockQuote(stockSymbolToRemove: string): void {
    const newTrackedStockQuotes = this.trackedStockQuotesSubject.getValue().filter(trackedStockQuote => trackedStockQuote.symbol !== stockSymbolToRemove);
    this.trackedStockQuotesSubject.next(newTrackedStockQuotes);
    this.localStorageService.saveItem(this.TRACKED_STOCK_QUOTE_KEY, newTrackedStockQuotes);
  }

  loadTrackedStocksFromLocalStorage(): void {
    const trackedStockQuotesFromLocal = this.localStorageService.loadItem(this.TRACKED_STOCK_QUOTE_KEY) as StockQuote[];
    if (trackedStockQuotesFromLocal) {
      this.trackedStockQuotesSubject.next(trackedStockQuotesFromLocal);
    }
  }

}
