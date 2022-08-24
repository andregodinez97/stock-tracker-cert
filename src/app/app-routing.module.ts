import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StockDetailListComponent} from "./stock-detail-list/stock-detail-list.component";
import {SentimentDetailComponent} from "./sentiment-detail/sentiment-detail.component";

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: StockDetailListComponent },
  { path: 'sentiment/:symbol', component: SentimentDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
