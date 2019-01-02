import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class CardServiceService {

  public getCardId = new EventEmitter();
  public updateTableData = new EventEmitter();
  public setCompanyChangeEvent = new EventEmitter();  //emit change event when company name inpiut empty
  public getCompanyCoKey = new EventEmitter(); //emit company cokey after getiing key by selecting company in general information
  public getCardHolderData = new Subject<any>();
  public getPrefferedLanguage = new EventEmitter();
  public setPrefferedLanguage = new Subject<any>();
  public getPlan = new Subject<any>();
  public setPlan = new Subject<any>();
  public setSavedCardKey = new EventEmitter();
  public getUpdatedPlanValue =  new EventEmitter();
  public bankAccountHistory =  new EventEmitter();
  public getCardHolderGeneralInfo =  new EventEmitter();
  public CardHolderViewMode = new EventEmitter();
  public setEditModeForCompany = new EventEmitter();
  public getHideIcons =  new EventEmitter();
  public emptyAccessToken =  new EventEmitter();
  public setCardHolderFormValue =  new EventEmitter();
  public resetCompanyName =  new EventEmitter();
  public cardStatus =  new EventEmitter();
  
  constructor() { }
  setCardHolderData(data) {
    return this.getCardHolderData.next(data);
  }

  setOptionForLanguage(language) {
    
    return this.getPrefferedLanguage.next(language);
  }

  setGeneralInfoForLanguage(language) {
    return this.setPrefferedLanguage.next(language);
  }

  setOptionForPlan(plan) {
    return this.getPlan.next(plan);
  }

  setCardEligibilityForPlan(plan) {
    return this.setPlan.next(plan);
  }
}
