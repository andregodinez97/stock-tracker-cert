import {Component, OnInit} from '@angular/core';
import {StockDataService} from "../common/stock-data.service";

@Component({
  selector: 'app-stock-detail-list',
  templateUrl: './stock-detail-list.component.html',
  styleUrls: ['./stock-detail-list.component.scss']
})
export class StockDetailListComponent implements OnInit {

  constructor(public stockDataService: StockDataService) { }

  ngOnInit(): void {
  }

}
