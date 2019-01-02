import { Component, OnInit,ViewChild, Inject,ViewChildren  } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { GeneralInformationComponent } from './general-information/general-information.component'
import { CardEligibilityComponent} from './card-eligibility/card-eligibility.component'
import { CardHolderComponent} from './card-holder/card-holder.component'
import { CardAddressComponent} from './card-address/card-address.component'
import { CardBankAccComponent} from './card-bank-acc/card-bank-acc.component'
import { CardApi } from './card-api'
import { CardHolderGeneralInformationComponent } from '../card-module/card-holder/card-holder-general-information/card-holder-general-information.component';
import { DOCUMENT } from '@angular/platform-browser';
import { HmsDataServiceService } from '../common-module/shared-services/hms-data-api/hms-data-service.service'
import { CurrentUserService } from '../common-module/shared-services/hms-data-api/current-user.service'
import { Constants} from './../common-module/Constants'
import { BankAccountComponent } from '../common-module/shared-component/bank-account/bank-account.component'
import { ChangeDateFormatService } from '../common-module/shared-services/change-date-format.service'; // Import date format method from common service
import { CommentModelComponent } from './../common-module/shared-component/CommentsModal/comment-model/comment-model.component'; // Import comments json
import { CommentEditModelComponent } from './../common-module/shared-component/CommentsModal/comment-edit-model/comment-edit-model.component'; // Import comments json
import { DatatableService } from './../common-module/shared-services/datatable.service'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CardServiceService} from './card-service.service';
import { ToastrService } from 'ngx-toastr'; //add toster service
import { FormCanDeactivate} from './../common-module/shared-resources/screen-lock/form-can-deactivate/form-can-deactivate';
import { ExDialog } from "./../common-module/shared-component/ngx-dialog/dialog.module";

@Component({
  selector: 'app-card-module',
  templateUrl: './card-module.component.html',
  styleUrls: ['./card-module.component.css'],
  providers:[ChangeDateFormatService,DatatableService]
})
export class CardModuleComponent extends FormCanDeactivate implements OnInit {
  @ViewChild('FormGroup')
  // @ViewChildren('input') vc;
  @ViewChild(GeneralInformationComponent) generalInformationComponent; // to acces variable of general information form
  @ViewChild(CardEligibilityComponent) cardEligibilityComponent; // to acces variable of general information form
  @ViewChild(CardAddressComponent) cardAddressComponent; // to acces variable of general information form
  @ViewChild(CardBankAccComponent) cardBankAccComponent; // to acces variable of card holder form
  @ViewChild(CommentModelComponent) commentFormData; // to acces variable of Comment from 
  
  FormGroup: FormGroup //intailize Form
  commentForm: FormGroup; //intailize Edit Comment Form
  commentApiUrl; // comment api url which url is needed
  addMode:boolean = true; //Enable true when user add a new card
  viewMode:boolean = false; //Enable true after a new card added
  editMode:boolean = false; //Enable true after viewMode when user clicks edit button
  cardHeading:string = "Add New" //Heading name change on add/edit
  addCrdHlderDetails:boolean = false // show add cardHolder section
  isCardHolder:boolean = false 
  cardContactDetailsObj
  getDetailsCompanyCokey:number;
  //savedCardKey:string // card key get value after savind card details
  companyCoKey; //company co key value gets when user select company
  getSavedCardKey; //get saved card kEY value after card is saved
  savedCardkey:number //holds card key that will come when gets card details by cardId
  savedCardBankAcctKey:number //holds card Bank Acct key that will come when gets card details by cardId
  savedCardBaKey:number //holds card Ba key that will come when gets card details by cardId
  savedcardContactKey:number //holds card contact key that will come when gets card details by cardId
  savedcdEligibilityKey:number //holds card Eligibility key that will come when gets card details by cardId
  cardKey;
  unTerminateButton:boolean=false;
  terminateMessage;//show terminate message
  activateCardMessage;//show activated card message 
  companyStatus;//for terminate/Activate card 
  terminateButton:boolean = false;
  getSavedCardValue
  cardStatus
  cardCommentImportance:boolean = false;
  error:any
  breadCrumbText:string="Add New Card";
  constructor(
    
    private fb: FormBuilder,
    private hmsDataServiceService: HmsDataServiceService,
    private currentUserService:CurrentUserService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDateFormatService:ChangeDateFormatService,
    private cardService: CardServiceService,
    private toastrService: ToastrService,
    private dataTableService: DatatableService,
    private exDialog: ExDialog
  ) {
    super();
    cardService.getCompanyCoKey.subscribe((value) => { 
      this.companyCoKey = value
    });
    cardService.setSavedCardKey.subscribe((value) => {
      this.getSavedCardKey = value
    })
    cardService.getPrefferedLanguage.subscribe((value) => {
      this.getSavedCardValue = value.cardKery
    })
    this.error = { isError:false, errorMessage:'' };
  } 
  commentsParams ={
    getCommentsListUrl:"card-service/getCardCommentsByCardId",
    addCommentUrl:"card-service/saveCardComments",
    requestMode: 'post' ,
    coKey: this.getSavedCardValue,
  }
  commentColumns = [
    {'title':'Date', 'data':'createdOn'},
    {'title':'User Name', 'data':'username'},
    {'title':'Department', 'data':'department'},
    {'title':'Comments', 'data':'cardCoTxt'},
    {'title':'Importance', 'data':'commentImportance'}
  ]
  
  ngOnInit() {
    $("input[type='text']").attr("autocomplete","off");
    this.FormGroup = this.fb.group({ /* combine all components together in a single form */
      CardGeneralInformationFormGroup: this.fb.group(this.generalInformationComponent.cardGeneralInformationVal),
      CardEligibilityFormGroup: this.fb.group(this.cardEligibilityComponent.CardEligibilityVal),
      cardaddress: this.fb.group(this.cardAddressComponent.cardAddressVal),
      cardbankacc: this.fb.group(this.cardBankAccComponent.cardBankAccVal)
    })
    if(this.route.snapshot.url[0]){
      if(this.route.snapshot.url[0].path == "view" ){
        this.enableViewMode();
      }
    }
   
    this.commentForm = new FormGroup({
      commentTxt: new FormControl('', [Validators.required,Validators.maxLength(500)]), 
      isImportant: new FormControl('')
    });
    window.scrollTo(0,0)
  }   
 
  /* to fire validation of all form fields together */
  validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {       
        this.validateAllFormFields(control);            
      }
    });
  }
  
  /* Submit Card form with all other integarted modules @Harsh*/
  submitCardForm(myFormGroupForm,isCardHolder) {
    if(this.FormGroup.valid){
      var cardHolderAdminCm=[];
      var cardHolderAdminCmImportance=[];
      debugger;
      if (this.commentFormData && this.commentFormData.commentjson){
        for(var i=0;i<this.commentFormData.commentjson.length;i++)
        {
          var commentImportance
          if(this.commentFormData.commentjson[i].companyImportance){
            commentImportance= 'Y'
          }else{
            commentImportance= 'N'
          }
          cardHolderAdminCm.push({'cardCoTxt':this.commentFormData.commentjson[i].companyCoTxt,
          'commentImportance':this.commentFormData.commentjson[i].companyImportance
        });
      }
    }
    
    let submitData = {
      "coKey":+this.companyCoKey,
      "cardNum":+this.FormGroup.value.CardGeneralInformationFormGroup.card_id,
      "cardEmploymentDate":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.CardGeneralInformationFormGroup.employment_date),
      "languageKey":this.FormGroup.value.CardGeneralInformationFormGroup.prefered_language,
      "cardContact":{
        "cardContactLine1MailAdd":this.FormGroup.value.cardaddress.cca_line,
        "cardContactLine2MailAdd":this.FormGroup.value.cardaddress.cca_line2,
        "cardContactPhoneNum":this.FormGroup.value.cardaddress.cca_phone.replace(/[^0-9 ]/g, ""),
        "cardContactFaxNum":this.FormGroup.value.cardaddress.cca_fax.replace(/[^0-9 ]/g, ""),
        "cardContactEmailAdd":this.FormGroup.value.cardaddress.cca_email,
        "postalCD":this.FormGroup.value.cardaddress.cca_postalcode,
        "countryName":this.FormGroup.value.cardaddress.cca_country,
        "provinceName":this.FormGroup.value.cardaddress.cca_province,
        "cityName":this.FormGroup.value.cardaddress.cca_city,
        "expiredOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.cardaddress.cca_expirydate),
        "effectiveOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.cardaddress.cca_effectivedate)
      },
      "cardBankAccount":{
        "cardBankNum":this.FormGroup.value.cardbankacc.bank,
        "cardBankBranchNum":this.FormGroup.value.cardbankacc.branch,
        "cardBankAccountNum":this.FormGroup.value.cardbankacc.account,
        "cardExpiredOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.cardbankacc.expdate),
        "cardBaEffectiveOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.cardbankacc.effdate),
        "cardBaClientName":this.FormGroup.value.cardbankacc.client
      },
      "cardEligibility":{
        "unitKey":this.FormGroup.value.CardEligibilityFormGroup.plan,
        "effectiveOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.CardEligibilityFormGroup.effective_date),
        "expireOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.CardEligibilityFormGroup.expiry_date)
      },
      "cardCommentsDtoList":cardHolderAdminCm
    }
    this.hmsDataServiceService.post(CardApi.saveCardUrl,submitData).subscribe(data=>{
      
      if(data.code == 200 && data.status==="OK"){
        this.savedCardkey = data.result.cardKey;
        this.toastrService.success('Card Added  Successfully!')
        this.router.navigate(['/card/view',this.savedCardkey])
        this.cardService.setSavedCardKey.emit(this.savedCardkey)
      }else {
        if(data.hmsMessage.messageShort == "CARD_NUMBER_ALREADY_USED"){
          this.toastrService.error('Card Id Already Used!!')
        }else if(data.hmsMessage.messageShort == "BANK_ACCOUNT_ALREADY_USED"){
          this.toastrService.error('Bank Details Already In Use!!')
        }else{
          this.toastrService.error('Card Details Are Not Added Successfully')
          
        }
      }
      error=>{
        console.log('error='+ error)
      }
      
    })
  }else {
    this.validateAllFormFields(this.FormGroup);//Form Validations
    $('html, body').animate({
      scrollTop: $(".validation-errors:first-child")
    }, 'slow');
    
  }
}

/** Enable Form */
enableViewMode(){
  var cardKEY
  this.breadCrumbText="View Card";
  this.viewMode = true;
  this.addMode = false;
  this.editMode = false;
  this.terminateButton=false;
  this.unTerminateButton=false;
  this.cardHeading = "Details"
  this.FormGroup.disable();
  this.route.params.subscribe(params => {
    cardKEY = +params['id']; // (+) converts string 'id' to a number
    
  });
  let submitData = {
    "cardKey":  cardKEY
  }
  this.hmsDataServiceService.postApi(CardApi.getCardDetails,submitData).subscribe(data => {
    if(data.code == 200 && data.status==="OK"){
      
      let editData = 
      {CardGeneralInformationFormGroup:{
        company_name:'seasia',
        program:'Quikcard',
        card_id:data.result.cardNum,
        employment_date:this.changeDateFormatService.convertStringDateToObject(data.result.cardEmploymentDate),
        prefered_language:data.result.languageName,
      },
      cardaddress:
      {
        cca_line:data.result.cardContact.cardContactLine1MailAdd,
        cca_line2:data.result.cardContact.cardContactLine2MailAdd,
        cca_postalcode:data.result.cardContact.postalCD,
        cca_city:data.result.cardContact.cityName,
        cca_province:data.result.cardContact.provinceName,
        cca_country:data.result.cardContact.countryName,
        cca_fax:data.result.cardContact.cardContactFaxNum.trim(),
        cca_phone:data.result.cardContact.cardContactPhoneNum.trim(),
        cca_email:data.result.cardContact.cardContactEmailAdd,
        cca_effectivedate:this.changeDateFormatService.convertStringDateToObject(data.result.cardContact.effectiveOn),
        cca_expirydate:this.changeDateFormatService.convertStringDateToObject(data.result.cardContact.expiredOn),
      },
      CardEligibilityFormGroup:{
        plan: data.result.cardEligibility.unitDesc,
        effective_date:this.changeDateFormatService.convertStringDateToObject(data.result.cardEligibility.effectiveOn),
        expiry_date:this.changeDateFormatService.convertStringDateToObject(data.result.cardEligibility.expireOn),
      },
      cardbankacc:{
        bank:data.result.cardBankAccount.cardBankNum,
        branch:data.result.cardBankAccount.cardBankBranchNum,
        account:data.result.cardBankAccount.cardBankAccountNum,
        client:data.result.cardBankAccount.cardBaClientName,
        effdate:this.changeDateFormatService.convertStringDateToObject(data.result.cardBankAccount.cardBaEffectiveOn),
        expdate:this.changeDateFormatService.convertStringDateToObject(data.result.cardBankAccount.cardExpiredOn),
      }
    }
    this.FormGroup.patchValue(editData);
    this.savedCardkey = data.result.cardKey
    this.savedCardBankAcctKey = data.result.cardBankAccount.cardBankAcctKey
    this.savedCardBaKey = data.result.cardBankAccount.cardBaKey
    this.savedcardContactKey = data.result.cardContact.cardContactKey
    this.savedcdEligibilityKey = data.result.cardEligibility.cdEligibilityKey
    this.getDetailsCompanyCokey = data.result.coKey
    this.cardStatus =  data.result.status
    if(data.result.commentFlag == 'Y'){
      this.cardCommentImportance = true
    }
    let editgeneralFormValue = {
      'savedCompanyStatus':data.result.coStatus,
      'businessType':data.result.businessType,
      'businessTypeKey':data.result.businessTypeKey,
      'languageKey':data.result.languageKey,
      'companyCoKey':data.result.coKey,
      'coName':data.result.coName,
      'unitKey':data.result.cardEligibility.unitKey,
      'cardNumber': data.result.cardNum,
      'cardKery':data.result.cardKey,
      'companyId':data.result.companyId,
      'cardType':data.result.cardType,
      'cardContactBaKey':data.result.cardBankAccount.cardBaKey,
      'cardBankAcctKey': data.result.cardBankAccount.cardBankAcctKey,
      'commentFlag':data.result.commentFlag
    }
    this.cardService.cardStatus.emit(this.cardStatus)
    this.companyStatus=data.result.coStatus;
    this.cardService.getPrefferedLanguage.emit(editgeneralFormValue);
    this.cardService.setOptionForPlan(data.result.cardEligibility.unitKey);
    var self = this
    var tableId = "cardComments"
    if(this.commentsParams.requestMode == 'post'){
      var url = CardApi.getCardCommentsByCardIdUrl;
    }else{
      var url = CardApi.getCardCommentsByCardIdUrl;
    }
    //var reqParam = [{'key':'cardKey','value':data.result.cardKey}]
    var userId = localStorage.getItem('id')
    var reqParam = [{'key':'cardKey','value':this.savedCardkey},{'key':'userId','value':+userId}]
    console.log(reqParam)
    var tableActions = []
    this.dataTableService.jqueryDataTableComment(tableId, url, 'full_numbers',this.commentColumns,5,true,true, 't', 'irp',undefined, [0,'asc'], '', reqParam, tableActions, undefined, 4)
    
  }else {
    /* failure Message here-------------- */
  }
  error=>{
    console.log('error='+ error)
  }
});
}

/** Edit Mode Enable */
enableEditMode(){
  this.FormGroup.enable();
  this.breadCrumbText="Edit Card";
  this.viewMode = false;
  this.addMode = false;
  this.editMode = true;
  this.cardHeading = "Edit"
  this.cardService.setEditModeForCompany.emit(true)
  this.terminateButton = true;  
  $('html, body').animate({
    scrollTop: 0
  }, 'slow');
}

/**Update Card */
updateCardData(){
  if(this.FormGroup.valid){
    var companyValue
    if(this.companyCoKey){
      companyValue = this.companyCoKey
    }else{
      companyValue = this.getDetailsCompanyCokey
    }
    let updateData=
    {
      "coKey":+companyValue,
      "languageKey":this.FormGroup.value.CardGeneralInformationFormGroup.prefered_language,
      "cardKey":this.savedCardkey,
      "cardNum":+this.FormGroup.value.CardGeneralInformationFormGroup.card_id,
      "cardEmploymentDate":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.CardGeneralInformationFormGroup.employment_date),
      "cardBankAccount": {
        "cardBankAcctKey":this.savedCardBankAcctKey,
        "cardBankNum":this.FormGroup.value.cardbankacc.bank,
        "cardBankBranchNum":this.FormGroup.value.cardbankacc.branch,
        "cardBankAccountNum":this.FormGroup.value.cardbankacc.account,
        "cardExpiredOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.cardbankacc.expdate),
        "cardBaKey":this.savedCardBaKey,
        "cardBaEffectiveOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.cardbankacc.effdate),
        "cardBaClientName":this.FormGroup.value.cardbankacc.client
      },
      "cardContact": {
        "cardContactKey":this.savedcardContactKey,
        "postalCD":this.FormGroup.value.cardaddress.cca_postalcode,
        "countryName":this.FormGroup.value.cardaddress.cca_country,
        "provinceName":this.FormGroup.value.cardaddress.cca_province,
        "cityName":this.FormGroup.value.cardaddress.cca_city,
        "cardContactLine1MailAdd":this.FormGroup.value.cardaddress.cca_line,
        "cardContactLine2MailAdd":this.FormGroup.value.cardaddress.cca_line2,
        "cardContactPhoneNum":this.FormGroup.value.cardaddress.cca_phone.replace(/[^0-9 ]/g, ""),
        "cardContactFaxNum":this.FormGroup.value.cardaddress.cca_fax.replace(/[^0-9 ]/g, ""),
        "cardContactEmailAdd":this.FormGroup.value.cardaddress.cca_email,
        "expiredOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.cardaddress.cca_expirydate),
        "effectiveOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.cardaddress.cca_effectivedate),
      },
      "cardEligibility": {
        "unitKey": this.FormGroup.value.CardEligibilityFormGroup.plan,
        "cdEligibilityKey":this.savedcdEligibilityKey,
        "effectiveOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.CardEligibilityFormGroup.effective_date),
        "expireOn":this.changeDateFormatService.convertDateObjectToString(this.FormGroup.value.CardEligibilityFormGroup.expiry_date),
      }
    }
    
    this.hmsDataServiceService.post(CardApi.updateCardDetailsUrl,updateData).subscribe(data=>{
      if(data.code == 200 && data.status==="OK"){
        this.savedCardkey = data.result.cardKey;
        this.FormGroup.disable();
        this.cardService.setSavedCardKey.emit(this.savedCardkey)
        this.toastrService.success('Card Updated Successfully!')
        this.FormGroup.reset()
        var delay = 1000; 
        setTimeout(function(){ window.location.reload() }, delay);
        
      }else {
        this.toastrService.error('Card Details Are Not Updated Successfully')
      }
      error=>{
        console.log('error='+ error)
      }
    })
  }else {
    this.validateAllFormFields(this.FormGroup);//Form Validations
    $('html, body').animate({
      scrollTop: $(".validation-errors:first-child")
    }, 'slow');
    
  }
}


/** Update Comments */
updateComment(commentForm){
  if (this.commentForm.valid) {
    var updateCommentUrl = CardApi.saveCardCommentsUrl; 
    var commentImportance
    if(this.commentForm.value.isImportant){
      commentImportance = 'Y'
    }else{
      commentImportance = 'N'
    }
    
    if(commentImportance == 'Y'){
      this.cardCommentImportance = true
    }
    let commentData = {
      "cardKey":this.savedCardkey,
      "cardCoTxt":this.commentForm.value.commentTxt,
      "commentImportance":commentImportance
    }
    this.hmsDataServiceService.post(updateCommentUrl, commentData).subscribe(data=>{
      if(data.code == 200 && data.status=="OK"){
        var userId = localStorage.getItem('id')
        var reqParam = [{'key':'cardKey','value':this.savedCardkey},{'key':'userId','value':+userId}]
        this.dataTableService.jqueryDataTableReload("cardComments",CardApi.getCardCommentsByCardIdUrl, reqParam)
        this.toastrService.success('Comment Added Successfully!');
        this.commentForm.reset();
      }
    });
  } else {
    this.validateAllFormFields(this.commentForm);
  }
}

/*Terminate Card*/ 
terminateCard(){
  
  if(this.companyStatus=="Active"){
    
    this.exDialog.openConfirm("Are You Sure You Want To Terminate Card ?"
  ).subscribe((value) => {
    if(value){
      
    }  
    let submitData={
      "cardKey":this.savedCardkey
    }
    this.hmsDataServiceService.post(CardApi.terminateCardUrl,submitData).subscribe(data=>{
      if(data.code == 200 && data.status=="OK"){
        this.terminateMessage=data.hmsMessage.messageShort;
        this.toastrService.success('Card Terminated Successfully!');
        this.unTerminateButton = true
        var delay = 1000; 
        setTimeout(function(){ window.location.reload() }, delay);
      }else {
      }
      error=>{
        console.log('error='+ error)
      }
    })
  })
}}


/* Activate Card after Termination*/ 
unTerminateCard(){
  
  let submitData={
    "cardKey":this.savedCardkey
  }
  this.exDialog.openConfirm("Are You Sure You Want To Activate Card ?").subscribe((value) => {
    if(value){
      this.hmsDataServiceService.post(CardApi.activateCardUrl,submitData).subscribe(data=>{
        if(data.code == 200 && data.status==="OK"){
          this.activateCardMessage=data.hmsMessage.messageShort;
          this.toastrService.success('Card Activated Successfully!');
          this.terminateButton= true
          var delay = 1000; 
          setTimeout(function(){ window.location.reload() }, delay);
        }else {
        }
        error=>{
          console.log('error='+ error)
        }
      })
    }
  });
}
}
