import {Component, Input, OnInit} from '@angular/core';
import {StockQuote} from "../../common/stock.model";
import {StockDataService} from "../../common/stock-data.service";
import { faArrowUpLong, faArrowDownLong, faX} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  faArrowUpLong = faArrowUpLong;
  faArrowDownLong = faArrowDownLong;
  faX = faX;

  @Input()
  stockQuote: StockQuote | undefined;

  constructor(public stockDataService: StockDataService) { }

  ngOnInit(): void {
  }

}
