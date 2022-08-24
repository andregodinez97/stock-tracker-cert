import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, Observable} from "rxjs";
import {StockDataService} from "../common/stock-data.service";
import {StockQuote, StockSentimentResponse} from "../common/stock.model";
import {faArrowUpLong, faArrowDownLong} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sentiment-detail',
  templateUrl: './sentiment-detail.component.html',
  styleUrls: ['./sentiment-detail.component.scss']
})
export class SentimentDetailComponent implements OnInit {
  faArrowUpLong = faArrowUpLong;
  faArrowDownLong = faArrowDownLong;

  stockSentimentResponse$: Observable<StockSentimentResponse> | undefined;
  stockQuote$: Observable<StockQuote | undefined> | undefined;

  constructor(private route: ActivatedRoute,
              private stockDataService: StockDataService) {
  }

  ngOnInit(): void {
    this.route.params.pipe(map(p => p['symbol'])).subscribe(stockSymbol => {
      this.stockSentimentResponse$ = this.stockDataService.getStockSentiment(stockSymbol);

      this.stockQuote$ = this.stockDataService.trackedStockQuotes$.pipe(
        map(stockQuotes => stockQuotes.find(stockQuote => stockQuote.symbol === stockSymbol))
      );
    });
  }

  newDateFromMonth(month: number): Date {
    const date = new Date();
    date.setMonth(month - 1);
    return date;
  }

}
