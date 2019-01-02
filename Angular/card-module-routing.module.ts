import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardModuleComponent } from './card-module.component';
import { SearchCardHolderComponent } from './search-card-holder/search-card-holder.component'

const routes: Routes = [
  { path: '', component: CardModuleComponent, pathMatch: 'full' },
  { path: 'searchCard', component: SearchCardHolderComponent },
  { path: 'view/:id', component: CardModuleComponent },
  { path: 'edit/:id', component: CardModuleComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class CardModuleRoutingModule { }


