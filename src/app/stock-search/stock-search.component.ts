import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {StockDataService} from "../common/stock-data.service";
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged, filter, Subject, takeUntil} from "rxjs";
import {Symbol} from "../common/stock.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-stock-search',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.scss']
})
export class StockSearchComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  trackButtonDisabled = true;
  stockSearchInput = new FormControl(undefined);

  constructor(private router: Router, public stockDataService: StockDataService) {
  }

  ngOnInit(): void {
    this.stockSearchInput.valueChanges.pipe(
      takeUntil(this.unsubscribe),
      filter(value => !!value),
      debounceTime(200),
      distinctUntilChanged(),
    ).subscribe(newSymbol => {
      if (newSymbol) {
        this.stockDataService.symbolLookup(newSymbol);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
  }

  onTrackButtonClicked(): void {
    const symbolSelected = this.stockSearchInput.value as any;

    // make user select from dropdown
    if (symbolSelected.symbol && symbolSelected.description) {
      this.stockDataService.trackStockQuote(symbolSelected);
      this.stockSearchInput.setValue(undefined);
      this.trackButtonDisabled = true;
    }
  }

  onOptionSelected(symbolSelected: any) {
    // only allow user to track once they have selected from mat auto complete
    if (symbolSelected.symbol && symbolSelected.description) {
      this.trackButtonDisabled = false;
    }
  }

  displayFn(stockSymbol: Symbol): string {
    return stockSymbol && stockSymbol.symbol ? stockSymbol.symbol : '';
  }

}
