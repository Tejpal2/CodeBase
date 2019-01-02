import { NgModule } from '@angular/core';
import { CommonModuleModule} from './../common-module/common-module.module'
import { CardModuleRoutingModule } from './card-module-routing.module';
import { CardModuleComponent } from './card-module.component';
import { GeneralInformationComponent }from './general-information/general-information.component'
import { CardEligibilityComponent} from './card-eligibility/card-eligibility.component'
import { CardAddressComponent} from './card-address/card-address.component';
import { CardHolderComponent} from './card-holder/card-holder.component';
import { SearchCardHolderComponent } from './search-card-holder/search-card-holder.component'
import { SharedModule }     from '../shared/shared.module'; 

import { CardHolderGeneralInformationComponent} from '../card-module/card-holder/card-holder-general-information/card-holder-general-information.component'
import { CardHolderRoleAssignedComponent} from '../card-module/card-holder/card-holder-role-assigned/card-holder-role-assigned.component';
import { CardBankAccComponent} from './card-bank-acc/card-bank-acc.component';
import { CardHolderCobComponent } from './card-holder/card-holder-cob/card-holder-cob.component';
import { CardHolderEligibilityComponent } from './card-holder/card-holder-eligibility/card-holder-eligibility.component';
import { AddRowTableComponent} from '../demo-component/add-row-table/add-row-table.component';
import { CardServiceService} from './card-service.service'
import { CardHolderPopupComponent } from './card-holder-popup/card-holder-popup.component';
import { CardHolderPopupGeneralInformationComponent } from './card-holder-popup/card-holder-popup-general-information/card-holder-popup-general-information.component';
import { CardTrusteeComponent } from './card-trustee/card-trustee.component';
import { CardHolderHistoryPopupComponent } from './card-holder-history-popup/card-holder-history-popup.component';
import { CardHolderCobhistoryPopupComponent } from './card-holder-cobhistory-popup/card-holder-cobhistory-popup.component';
import { CardHolderExpenseHistoryPopupComponent } from './card-holder-expense-history-popup/card-holder-expense-history-popup.component';
import { CardHolderVoucherHistoryPopupComponent } from './card-holder-voucher-history-popup/card-holder-voucher-history-popup.component';


@NgModule({
  imports: [  
    CommonModuleModule,  
    CardModuleRoutingModule,
    SharedModule,
  ],
  exports: [
    CardBankAccComponent
  ],
  declarations: [CardModuleComponent,GeneralInformationComponent,CardEligibilityComponent,
                 CardAddressComponent,CardHolderComponent, SearchCardHolderComponent,
                 CardHolderGeneralInformationComponent,CardHolderRoleAssignedComponent,SearchCardHolderComponent,
                 CardBankAccComponent, AddRowTableComponent,CardTrusteeComponent,CardHolderCobComponent,CardHolderEligibilityComponent,CardHolderPopupComponent, CardHolderPopupGeneralInformationComponent, CardHolderHistoryPopupComponent, CardHolderCobhistoryPopupComponent, CardHolderExpenseHistoryPopupComponent, CardHolderVoucherHistoryPopupComponent],
  providers: [CardServiceService]

})
export class CardModuleModule { }
