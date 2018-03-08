/*! Built with http://stenciljs.com */
const { h, Context } = window.cashless;

class DataValidator {
    static isDefined(value) {
        return value !== undefined && value != null;
    }
}

class DispositionTemplate {
    constructor(init) {
        Object.assign(this, init);
    }
    update(dispositionTemplate) {
        if (!DataValidator.isDefined(dispositionTemplate))
            return;
        this.Amount = dispositionTemplate.Amount;
        this.CurrencyCode = dispositionTemplate.CurrencyCode;
        this.DispositionType = dispositionTemplate.DispositionType;
        this.FormattedAmount = dispositionTemplate.FormattedAmount;
    }
    updateAmount(amount) {
        if (!DataValidator.isDefined(amount))
            return;
        this.Amount = amount;
        this.FormattedAmount = "$" + this.Amount;
    }
}

class BaseRequest {
    constructor(baseRequest) {
        Object.assign(this, baseRequest);
    }
}

class TransferRequest extends BaseRequest {
    constructor(transferRequest) {
        super();
        Object.assign(this, transferRequest);
    }
}

var S_AppCashLessInfo;
(function (S_AppCashLessInfo) {
    let _deviceInfo;
    let _playerInfo;
    let _locationInfo;
    S_AppCashLessInfo.setDevicInfo = (deviceInfo) => {
        _deviceInfo = deviceInfo;
    };
    S_AppCashLessInfo.setPlayerInfo = (playerInfo) => {
        _playerInfo = playerInfo;
    };
    S_AppCashLessInfo.setLocationInfo = (locationInfo) => {
        _locationInfo = locationInfo;
    };
    S_AppCashLessInfo.getDevicInfo = () => {
        return _deviceInfo;
    };
    S_AppCashLessInfo.getPlayerInfo = () => {
        return _playerInfo;
    };
    S_AppCashLessInfo.getLocationInfo = () => {
        return _locationInfo;
    };
})(S_AppCashLessInfo || (S_AppCashLessInfo = {}));

class Wallet {
    constructor(init) {
        this.Name = '';
        this.AccountNumber = '';
        this.CasinoID = '';
        this.Pin = '';
        this.SecondaryIdentifier = '';
        Object.assign(this, init);
    }
}

//import { BankName } from "./bankName";
var S_WalletInfoService;
(function (S_WalletInfoService) {
    let deviceInfo;
    let playerInfo;
    let locationInfo;
    S_WalletInfoService.setAppStatus = () => {
        playerInfo = S_AppCashLessInfo.getPlayerInfo();
        locationInfo = S_AppCashLessInfo.getLocationInfo();
        deviceInfo = S_AppCashLessInfo.getDevicInfo();
    };
    // let getAllWallets = (): Wallet[] => {
    //     var allWallets = new Array();
    //     allWallets.push(getWallet("EbsWallet"));
    //     allWallets.push(getWallet("GamingMachine"));
    //     // allWallets.push(this.getWallet(BankName.Sightline));
    //     return allWallets;
    // }
    S_WalletInfoService.getWallet = (bankName) => {
        return new Wallet({
            Name: bankName,
            AccountNumber: playerInfo.accountNumber,
            CasinoID: locationInfo.casinoId,
            Pin: playerInfo.pin,
            SecondaryIdentifier: locationInfo.casinoId,
        });
    };
    S_WalletInfoService.getDisposition = (amount, dispositionType) => {
        return new DispositionTemplate({
            Amount: amount,
            FormattedAmount: "" + amount,
            CurrencyCode: "$",
            DispositionType: dispositionType
        });
    };
})(S_WalletInfoService || (S_WalletInfoService = {}));

var S_Settings;
(function (S_Settings) {
    S_Settings.mobileAppServerApi = "http://10.2.44.206/MobileAppServer/wallet/";
    S_Settings.walletApi = "http://localhost/EBSWalletService/api/v1/Wallet/";
})(S_Settings || (S_Settings = {}));

var S_UrlBuilder;
(function (S_UrlBuilder) {
    S_UrlBuilder.buildwalletBalanceUrl = (accountNumber) => {
        return S_Settings.walletApi + accountNumber + "/Balance";
    };
    S_UrlBuilder.buildWalletFundsTransferUrl = () => {
        return S_Settings.mobileAppServerApi + "FundsTransfer";
    };
    S_UrlBuilder.buildWalletBalanceEnquiryUrl = () => {
        return S_Settings.mobileAppServerApi + "GetBalance";
    };
})(S_UrlBuilder || (S_UrlBuilder = {}));

var S_API;
(function (S_API) {
    S_API.post = (url, body, header) => {
        return fetch(url, {
            body: body,
            headers: header,
            method: 'POST',
        });
    };
})(S_API || (S_API = {}));

class BankName {
}
BankName.GamingMachine = 'GamingMachine';
BankName.EbsWallet = 'EbsWallet';
BankName.Sightline = 'Sightline';

class BalanceRequest extends BaseRequest {
    constructor(balanceRequest) {
        super();
        Object.assign(this, balanceRequest);
    }
}

class BalanceRequestBuilder {
    constructor(playerInfo, deviceInfo, locationInfo) {
        this.playerInfo = playerInfo;
        this.deviceInfo = deviceInfo;
        this.locationInfo = locationInfo;
    }
    getBankInfo(bankName) {
        var bankData = {
            Name: bankName,
            AccountNumber: this.playerInfo.accountNumber,
            CasinoID: this.locationInfo.casinoId,
            Pin: this.playerInfo.pin,
            SecondaryIdentifier: this.locationInfo.slotNumber
        };
        return bankData;
        // return new Wallet();
    }
    getAllWallets() {
        var allWallets = new Array();
        allWallets.push(this.getBankInfo(BankName.EbsWallet));
        allWallets.push(this.getBankInfo(BankName.GamingMachine));
        // allWallets.push(this.getWallet(BankName.Sightline));
        return allWallets;
    }
    buildBalanceRequest() {
        return JSON.stringify(new BalanceRequest({
            AccountNumber: this.playerInfo.accountNumber,
            CasinoID: this.locationInfo.casinoId,
            Pin: this.playerInfo.pin,
            Wallet: this.getAllWallets(),
            DeviceInfo: this.deviceInfo
        }));
    }
}

//import { Http, Response, RequestOptions, Headers, RequestMethod } from "@angular/http";
//import { UrlBuilderService } from "./urlBuilderService";
//import { Observable } from "rxjs/Observable";
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
//import { Injectable } from "@angular/core";
//import { HostService } from "./hostService";
//import { DataValidator } from "../models/dataValidator";
//import { WalletInfoService } from "./walletInfoService";
//import { DeviceProfileService } from "./deviceProfileService";
//import { BankName } from "./bankName";
//import { LocationService } from "./locationService";
//import { BalanceResponse } from "../models/balanceResponse";
//import { AccountDisposition } from "../models/accountDisposition";
//import { AccountBalance } from "../models/accountBalance";
///import { DispositionTemplate } from "../models/dispositionTemplate";
///import { WalletDispositionTypes } from "../models/walletDispositionTypes";
//import { TransferResponse } from "../models/transferResponse";
///import { BalanceRequest } from "../models/balanceRequest";
//import { SlotService } from "./slotService";
//import { PlayerProfileService } from "./playerProfileService";
//import { DepositTransactionDto } from "../models/depositTransactionDto";
//import { RequestOptions } from "http";
//import { CommonService } from "./commonService";
//@Injectable()
var S_WalletService;
(function (S_WalletService) {
    let deviceInfo;
    let playerInfo;
    let locationInfo;
    let buildHeader = () => {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return headers;
    };
    let setAppStatus = () => {
        playerInfo = S_AppCashLessInfo.getPlayerInfo();
        locationInfo = S_AppCashLessInfo.getLocationInfo();
        deviceInfo = S_AppCashLessInfo.getDevicInfo();
    };
    S_WalletService.withdrawFromSlot = (amount, dispositionType) => {
        var withDrawalRequest = JSON.stringify(new TransferRequest({
            AccountNumber: playerInfo.accountNumber,
            CasinoID: locationInfo.casinoId,
            Pin: playerInfo.pin,
            // RequestOriginatorType: "",
            DeviceInfo: deviceInfo,
            CorrelationId: new Date().getTime(),
            Source: S_WalletInfoService.getWallet("EbsWallet"),
            Destination: S_WalletInfoService.getWallet("GamingMachine"),
            Disposition: S_WalletInfoService.getDisposition(amount, dispositionType)
        }));
        return S_API.post(S_UrlBuilder.buildWalletFundsTransferUrl(), withDrawalRequest, buildHeader());
    };
    S_WalletService.depositFromSlot = (amount, dispositionType) => {
        var depositRequest = JSON.stringify(new TransferRequest({
            AccountNumber: playerInfo.accountNumber,
            CasinoID: locationInfo.casinoId,
            Pin: playerInfo.pin,
            // RequestOriginatorType: this.deviceProfileService.getDeviceType(),
            DeviceInfo: deviceInfo,
            CorrelationId: new Date().getTime(),
            Source: S_WalletInfoService.getWallet("GamingMachine"),
            Destination: S_WalletInfoService.getWallet("EbsWallet"),
            Disposition: S_WalletInfoService.getDisposition(amount, dispositionType)
        }));
        return S_API.post(S_UrlBuilder.buildWalletFundsTransferUrl(), depositRequest, buildHeader());
    };
    S_WalletService.getAccountBalance = () => {
        setAppStatus();
        S_WalletInfoService.setAppStatus();
        var balanceRequest = new BalanceRequestBuilder(playerInfo, deviceInfo, locationInfo).buildBalanceRequest();
        return S_API.post(S_UrlBuilder.buildWalletBalanceEnquiryUrl(), balanceRequest, buildHeader());
    };
})(S_WalletService || (S_WalletService = {}));

class CashBalanceTransfer {
    constructor() {
        //  walletService: any;
        this.mode = "test";
        //@State() isActive:any
        this.selectedItem = 0;
        this.balance = new DispositionTemplate();
        this.slotBalance = new DispositionTemplate();
        this.partialAmounts = [];
        // transferType: string;
        this.defaultAmtTransfer = [10, 25, 50, 100];
    }
    componentWillLoad() {
        debugger;
        // alert(this.stateValue);
        this.fIcon = (this.stateValue.action === "Download") ? "icon-wallet2" : "icon-slot-machine";
        this.sIcon = (this.stateValue.action === "Download") ? "icon-slot-machine" : "icon-wallet2";
        //  this.logData();
        //this.getAccountBalance();
        this.balance = this.navPrams.balance;
        this.slotBalance = this.navPrams.slotBalance;
        //  this.walletService = new WalletService();
        debugger;
        // S_AppCashLessInfo.getDevicInfo();
    }
    isActive(value) {
        //return 'btn ' + ((value === this.state.selected) ? 'active' : 'default');
        return "disable-hover button button-" + this.mode + " button-default button-default-" + this.mode + ((value === this.selectedItem) ? ' btn-active' : '');
    }
    onDownloadSelected(amt) {
        this.selectedItem = amt;
    }
    isValidTransferAmount(amount) {
        if (this.stateValue.action == 'Download')
            return amount <= this.balance.Amount;
        else
            return amount <= this.slotBalance.Amount;
    }
    createToaster(msg, duration, pos, cssClass = '') {
        this.toastCtrl.create({
            // message: 'New version available',
            // showCloseButton: true,
            // closeButtonText: 'Reload'
            message: msg,
            duration: duration,
            position: pos,
            cssClass: cssClass
        }).then((toast) => {
            toast.present();
        });
    }
    transfer() {
        //  this.updateCurrentBalance(this.balance.DispositionType, this.selectedItem);
        if (this.selectedItem == 0) {
            //ToastController.create
            this.toastCtrl.create({
                // message: 'New version available',
                // showCloseButton: true,
                // closeButtonText: 'Reload'
                message: 'PLEASE_SELECT_AMOUNT',
                duration: 3000,
                position: "top",
                cssClass: "toast-danger"
            }).then((toast) => {
                toast.present();
            });
            this.createToaster('PLEASE_SELECT_AMOUNT', 3000, "top", "toast-danger");
            //  alert("please select amount");
            return;
        }
        else if (!this.isValidTransferAmount(this.selectedItem)) {
            //   this.commonService.createToaster(this.translate.instant('PLEASE_SELECT_AMOUNT'), 3000, "top", "toast-danger");
            alert("please select amount");
            return;
        }
        //  this.loading = this.commonService.createSpinner('Transfer In Progress..', true);
        //  if (this.userService.isSessionCreated())
        this.fundTransfer();
        // else {
        //  this.commonService.createToaster(this.translate.instant('PLEASE_CREATE_SESSION'), 3000, "top", "toast-danger");
        //  this.loading.dismiss();
        // }
    }
    parseTransferResponse(transferResponse) {
        console.log("Transfer Status: ", transferResponse.IsSuccess);
        if (transferResponse.IsSuccess && transferResponse.Status && transferResponse.Status.toLowerCase() == 'completed') {
            // this.getBalance(this.profileService.accountNumber);
            //this.observers.next(true);
            return;
        }
        //this.observers.next(false);
    }
    fundTransfer() {
        switch (this.stateValue.action) {
            case 'Download':
                S_WalletService.withdrawFromSlot(this.selectedItem, this.balance.DispositionType)
                    .then(response => {
                    response.json().then(data => {
                        debugger;
                        var transferResponse = data;
                        if (DataValidator.isDefined(transferResponse))
                            this.parseTransferResponse(transferResponse);
                    });
                }, error => { console.log('Error' + error); }).catch(error => console.log('Error while fetching balance' + error));
                break;
            case 'Upload':
                S_WalletService.depositFromSlot(this.selectedItem, this.balance.DispositionType)
                    .then(response => {
                    response.json().then(data => {
                        var transferResponse = data;
                        if (DataValidator.isDefined(transferResponse))
                            this.parseTransferResponse(transferResponse);
                    });
                }, error => { console.log('Error' + error); }).catch(error => console.log('Error while fetching balance' + error));
                break;
        }
    }
    showPrompt() {
        alert("show Prompt");
        this.alertCtrl.create({
            title: 'ENTER_AMOUNT',
            message: 'TRANSFER_AMOUNT_MESSAGE',
            inputs: [
                {
                    name: 'amount',
                    placeholder: 'ENTER_AMOUNT',
                    type: 'number'
                },
            ],
            buttons: [
                {
                    text: 'CANCEL_BUTTON',
                    handler: data => {
                        console.log('Cancel clicked' + data);
                    }
                },
                {
                    text: 'OK',
                    handler: data => {
                        console.log('Saved clicked');
                        if (!this.isValidTransferAmount(data.amount)) {
                            this.createToaster('PLEASE_SELECT_AMOUNT', 3000, "top", "toast-danger");
                            //alert("pls");
                            return false;
                        }
                        else {
                            this.selectedItem = data.amount;
                        }
                    }
                }
            ]
        }).then((alert) => {
            alert.present();
        });
    }
    selectFullAmt() {
        if (this.stateValue.action == 'Download')
            this.selectedItem = this.balance.Amount;
        else
            this.selectedItem = this.slotBalance.Amount;
    }
    clearAmt() {
        this.selectedItem = 0;
    }
    render() {
        return (h("div", { class: "animated flipInY " },
            h("div", { class: "section-header" }, "Cash Balance Transfer"),
            h("div", { class: "elevated-box bal-transfer text-center" },
                h("div", { class: "bal-to-game margin-bottom" },
                    h("ion-icon", { class: "icon-white icon icon-" + this.mode + " ion-" + this.mode + "-" + this.fIcon, role: "img", "aria-label": "icon wallet2", "ng-reflect-name": this.fIcon }),
                    h("ion-icon", { name: "icon-arrow-right", role: "img", class: "icon icon-" + this.mode + " ion-" + this.mode + "-icon-arrow-right", "aria-label": "icon arrow-right", "ng-reflect-name": "icon-arrow-right" }, " "),
                    h("ion-icon", { class: "icon-white icon icon-" + this.mode + " ion-" + this.mode + "-" + this.sIcon, role: "img", "aria-label": "icon slot-machine", "ng-reflect-name": this.sIcon })),
                h("p", { class: "text-primary" }, "Download Cash Balance to Game"),
                h("ion-grid", { class: "cash-bal-info grid" },
                    h("ion-row", { class: "row" },
                        h("ion-col", { class: "text-gray2 font-14 col", "col-6": "" },
                            "Cash Balance ",
                            h("div", { class: "text-primary font-16" }, this.navPrams.balance.FormattedAmount)),
                        h("ion-col", { class: "text-gray2 font-14 col", "col-6": "" },
                            "Slot Balance ",
                            h("div", { class: "text-primary font-16" }, this.navPrams.slotBalance.FormattedAmount)))),
                h("p", null, "Selected Amount"),
                h("h3", { class: "gradient-text font-40 no-margin" },
                    "$",
                    this.selectedItem),
                h("div", { class: "margin-top" },
                    h("p", { class: "text-primary" }, "Transfer Amount Now"),
                    h("ion-grid", { class: "grid" },
                        h("ion-row", { class: "btn-bar row" },
                            h("ion-col", { class: "col", "col-3": "" },
                                h("button", { "ion-button": "", class: "disable-hover button button-" + this.mode + " button-default button-default-" + this.mode + ((this.selectedItem == 10) ? " btn-active" : ""), onClick: () => this.onDownloadSelected(10) },
                                    h("span", { class: "button-inner" },
                                        h("span", { class: "gradient-text" }, "$10")),
                                    h("div", { class: "button-effect" }))),
                            h("ion-col", { class: "col", "col-3": "" },
                                h("button", { "ion-button": "", class: "disable-hover button button-" + this.mode + " button-default button-default-" + this.mode + ((this.selectedItem == 25) ? " btn-active" : ""), onClick: () => this.onDownloadSelected(25) },
                                    h("span", { class: "button-inner" },
                                        h("span", { class: "gradient-text" }, "$25")),
                                    h("div", { class: "button-effect" }))),
                            h("ion-col", { class: "col", "col-3": "" },
                                h("button", { "ion-button": "", class: "disable-hover button button-" + this.mode + " button-default button-default-" + this.mode + ((this.selectedItem == 50) ? " btn-active" : ""), onClick: () => this.onDownloadSelected(50) },
                                    h("span", { class: "button-inner" },
                                        h("span", { class: "gradient-text" }, "$50")),
                                    h("div", { class: "button-effect" }))),
                            h("ion-col", { class: "col", "col-3": "" },
                                h("button", { "ion-button": "", class: "disable-hover button button-" + this.mode + " button-default button-default-" + this.mode + ((this.selectedItem == 100) ? " btn-active" : ""), onClick: () => this.onDownloadSelected(100) },
                                    h("span", { class: "button-inner" },
                                        h("span", { class: "gradient-text" }, "$100")),
                                    h("div", { class: "button-effect" })))),
                        h("ion-row", { class: "btn-bar row" },
                            h("ion-col", { class: "col", "col-6": "" },
                                h("button", { onClick: () => this.showPrompt(), "ion-button": "", class: "disable-hover button button-" + this.mode + " button-default button-default-" + this.mode },
                                    h("span", { class: "button-inner" },
                                        h("span", { class: "gradient-text" }, "Other")),
                                    h("div", { class: "button-effect" }))),
                            h("ion-col", { class: "col", "col-3": "" },
                                h("button", { onClick: () => this.selectFullAmt(), "ion-button": "", class: "disable-hover button button-" + this.mode + " button-default button-default-" + this.mode },
                                    h("span", { class: "button-inner" },
                                        h("span", { class: "gradient-text" }, "All")),
                                    h("div", { class: "button-effect" }))),
                            h("ion-col", { class: "col", "col-3": "" },
                                h("button", { onClick: () => this.clearAmt(), "ion-button": "", class: "disable-hover button button-" + this.mode + " button-default button-default-" + this.mode },
                                    h("span", { class: "button-inner" },
                                        h("span", { class: "gradient-text" }, "Clear ")),
                                    h("div", { class: "button-effect" }))))),
                    h("div", { class: "btn-box" },
                        h("button", { onClick: () => this.transfer(), class: "btn btn-primary disable-hover button button-" + this.mode + " button-default button-default-" + this.mode, "ion-button": "" },
                            h("span", { class: "button-inner" }, "Transfer Now"),
                            h("div", { class: "button-effect" })))))));
    }
    static get is() { return "cash-balance-transfer"; }
    static get properties() { return { "alertCtrl": { "connect": "ion-alert-controller" }, "fIcon": { "state": true }, "mode": { "type": "Any", "attr": "mode" }, "navPrams": { "type": "Any", "attr": "nav-prams" }, "selectedItem": { "state": true }, "sIcon": { "state": true }, "stateValue": { "type": "Any", "attr": "state-value" }, "toastCtrl": { "connect": "ion-toast-controller" } }; }
}

class AddCash {
    constructor() {
    }
    componentWillLoad() {
    }
    //onClick={() => this.statusChange.emit({"action":"player-balance","type":"player-balance"})}
    render() {
        return (h("ion-card", { class: "card card-md" },
            h("ion-row", { class: "account-info-container row" },
                h("ion-col", { class: "col", "col-4": "" },
                    h("div", { class: "account-info text-uppercase" },
                        h("span", null, "Cash"),
                        h("p", { "no-margin": "" }, this.cashBalance))),
                h("ion-col", { class: "col", "col-4": "" },
                    h("div", { class: "account-info text-uppercase divider" },
                        h("span", null, "Points"),
                        h("p", { "no-margin": "" }, this.pointsBalance))),
                h("ion-col", { class: "col", "col-4": "" },
                    h("div", { class: "account-info text-uppercase" },
                        h("span", null, "Promo"),
                        h("p", { "no-margin": "" }, this.promoBalance))))));
    }
    static get is() { return "cash-less-home"; }
    static get properties() { return { "cashBalance": { "type": String, "attr": "cash-balance" }, "mode": { "type": String, "attr": "mode" }, "pointsBalance": { "type": String, "attr": "points-balance" }, "promoBalance": { "type": String, "attr": "promo-balance" } }; }
    static get events() { return [{ "name": "statusChange", "method": "statusChange", "bubbles": true, "cancelable": true, "composed": true }]; }
}

class PlayerInfo {
    constructor(PlayerInfo) {
        Object.assign(this, PlayerInfo);
    }
}

class LocationInfo {
    constructor(locationInfo) {
        Object.assign(this, locationInfo);
    }
}

class WalletDispositionTypes {
}
WalletDispositionTypes.Cash = 'Cash';
WalletDispositionTypes.Points = 'Restricted';
WalletDispositionTypes.Promo = 'Promotional';

class SlotService {
    constructor() {
        this.cash = new DispositionTemplate({ FormattedAmount: '$0', Amount: 0, DispositionType: 'cash' });
        this.promo = new DispositionTemplate({ FormattedAmount: '$0', Amount: 0, DispositionType: 'promotional' });
        this.points = new DispositionTemplate({ FormattedAmount: '$0', Amount: 0, DispositionType: 'points' });
    }
    updateGameBalance(balanceResponse) {
        var gameBalances = balanceResponse.Balance.filter(item => item.Bank == "GamingMachine");
        if (!DataValidator.isDefined(gameBalances[0]) || !DataValidator.isDefined(gameBalances[0].Disposition))
            return;
        this.updateBalance(gameBalances[0].Disposition);
    }
    updateBalance(dispositions) {
        var disposition = dispositions.filter(item => item.DispositionType == WalletDispositionTypes.Cash);
        if (disposition.length)
            this.cash.update(disposition[0]);
        else
            this.cash.updateAmount(0);
        disposition = dispositions.filter(item => item.DispositionType == WalletDispositionTypes.Promo);
        if (disposition.length)
            this.promo.update(disposition[0]);
        else
            this.promo.updateAmount(0);
        disposition = dispositions.filter(item => item.DispositionType == WalletDispositionTypes.Points);
        if (disposition.length)
            this.points.update(disposition[0]);
        else
            this.points.updateAmount(0);
    }
}

class CashLess {
    constructor() {
        //  slotService: any;
        // slotService: SlotService;
        this.DeviceInfo = {
            UUID: 'ChIJbdJJrjBoI0URnsmjtgFdUcYSD1JlbGF0aW9uYWxTdG9yZRoSCck-ZwX25D1MEYmyxUnT37RdIgsI2O78n6mmsjIQBQ', Platform: 'iOS',
            Version: '10.2', Model: 'iPhone', SecurityToken: ''
        };
        this.PlayerInfo = new PlayerInfo({
            accountNumber: "000012345",
            pin: "1234"
        });
        this.LocationInfo = new LocationInfo({ casinoId: "512", slotNumber: "1234" });
        this.stateValue = {
            action: "",
            type: ""
        };
        this.history = [];
        this.slotService = new SlotService();
    }
    statusChangeHandler(event) {
        debugger;
        // alert("trigger");
        if (event.detail.action !== "player-balance") {
            this.history.push(Object.assign({}, this.stateValue));
        }
        this.stateValue = event.detail;
        // console.log('Received the custom todoCompleted event: ', event.detail);
    }
    backButtonListner(event) {
        debugger;
        //  alert("back");
        console.log(event);
        if (!this.history.length) {
            this.message.emit({});
        }
        else {
            this.stateValue = this.history.pop();
        }
        // this.state = event.detail;
        // console.log('Received the custom todoCompleted event: ', event.detail);
    }
    logData() {
        console.log(this.DeviceInfo.UUID);
        console.log(this.PlayerInfo.accountNumber);
        console.log(this.LocationInfo.slotNumber);
    }
    componentWillLoad() {
        debugger;
        //  this.logData();
        S_AppCashLessInfo.setDevicInfo(this.DeviceInfo);
        S_AppCashLessInfo.setPlayerInfo(this.PlayerInfo);
        S_AppCashLessInfo.setLocationInfo(this.LocationInfo);
        this.getAccountBalance();
        //@Prop() DeviceInfo: IDeviceInfo;
        //  @Prop() PlayerInfo: IPlayerInfo;
        // @Prop() LocationInfo: ILocationInfo;
        // localStorage.setItem("deviceInfo", JSON.stringify(this.DeviceInfo))
        //  localStorage.setItem("playerInfo", JSON.stringify(this.PlayerInfo))
        // localStorage.setItem("locationInfo", JSON.stringify(this.LocationInfo))
    }
    updateWalletBalance(accountBalances) {
        if (!accountBalances)
            return;
        this.cashBalance = accountBalances[0].Disposition.filter(item => item.DispositionType.toLowerCase() == 'cash')[0];
        this.Cash = accountBalances[0].Disposition.filter(item => item.DispositionType.toLowerCase() == 'cash')[0].FormattedAmount;
        this.Promo = accountBalances[0].Disposition.filter(item => item.DispositionType.toLowerCase() == 'promotional')[0].FormattedAmount;
        this.Points = accountBalances[0].Disposition.filter(item => item.DispositionType.toLowerCase() == 'restricted')[0].FormattedAmount;
        console.log('cash---- ' + this.Cash);
        console.log('promotional---- ' + this.Promo);
        console.log('restricted---- ' + this.Points);
    }
    getAccountBalance() {
        debugger;
        S_WalletService.getAccountBalance().then(response => {
            response.json().then(data => {
                debugger;
                var balanceResponse = data;
                this.updateWalletBalance(balanceResponse.Balance.filter(item => item.Bank == "EbsWallet"));
                console.log(balanceResponse);
                this.slotService.updateGameBalance(balanceResponse);
            });
        }, error => { console.log('Error' + error); }).catch(error => console.log('Error while fetching balance' + error));
    }
    render() {
        debugger;
        return (h("div", { class: "animated flipInY " },
            h("div", null, (() => {
                switch (this.stateValue.type) {
                    case 'player-balance':
                        return [
                            h("component-header", { headerName: "wallet", currentState: this.stateValue, showHome: false }),
                            h("club-status", null),
                            h("h4", { "text-center": "" },
                                h("ion-icon", { name: "icon-wallet2", role: "img", class: "icon icon-" + this.mode + " ion-" + this.mode + "-icon-wallet2", "aria-label": "icon wallet2", "ng-reflect-name": "icon-wallet2" }),
                                "My Wallet"),
                            h("player-balance", { Type: "CASH", FormattedAmount: this.Cash, TypeValue: true, mode: this.mode }, " "),
                            h("player-balance", { Type: "PROMO", FormattedAmount: this.Promo, mode: this.mode }, " "),
                            h("player-balance", { Type: "POINTS", FormattedAmount: this.Points, mode: this.mode }, " ")
                        ];
                    case 'CASH':
                        return (this.stateValue.action == "add-cash") ? [h("component-header", { headerName: "wallet", currentState: this.stateValue, showHome: false }), h("add-cash", null)] : [h("component-header", { headerName: "wallet", currentState: this.stateValue, showHome: false }), h("cash-balance-transfer", { class: "animated slideInRight", mode: this.mode, stateValue: this.stateValue, navPrams: { 'balance': this.cashBalance, 'slotBalance': this.slotService.cash } })];
                    default: return h("cash-less-home", { cashBalance: this.Cash, promoBalance: this.Promo, pointsBalance: this.Points });
                }
            })())));
    }
    static get is() { return "cash-less"; }
    static get properties() { return { "Cash": { "state": true }, "DeviceInfo": { "type": "Any", "attr": "device-info" }, "history": { "state": true }, "LocationInfo": { "type": "Any", "attr": "location-info" }, "mini": { "type": Boolean, "attr": "mini" }, "mode": { "type": String, "attr": "mode" }, "PlayerInfo": { "type": "Any", "attr": "player-info" }, "Points": { "state": true }, "Promo": { "state": true }, "stateValue": { "type": "Any", "attr": "state-value" }, "stateX": { "type": "Any", "attr": "state-x" }, "type": { "type": "Any", "attr": "type" } }; }
    static get events() { return [{ "name": "message", "method": "message", "bubbles": true, "cancelable": true, "composed": true }]; }
}

class ClubStatus {
    render() {
        return (h("div", { class: "walletimg_bg" },
            h("ion-grid", { class: "membership animated bounceIn grid" },
                h("ion-row", { class: "row" },
                    h("ion-col", { class: "name-on-card col" }, "Guest")),
                h("ion-row", { class: "card-number row" },
                    h("ion-col", { class: "col" },
                        h("strong", { class: "pull-right" }))),
                h("ion-row", { class: "row" },
                    h("ion-col", { class: "text-uppercase card-copyrights col", "text-right": "" }, "\u00A9 2017, Casino6601 International, Inc.")))));
    }
    static get is() { return "club-status"; }
}

class ComponentHeader {
    constructor() {
    }
    navigateToBack() {
        this.backButton.emit();
    }
    componentWillLoad() {
        //  this.logData();
        //this.getAccountBalance();
    }
    render() {
        return (h("div", null,
            h("ion-header", { class: "header header-md" },
                h("ion-navbar", { class: "toolbar toolbar-md" },
                    h("div", { class: "toolbar-background toolbar-background-md", "ng-reflect-klass": "toolbar-background", "ng-reflect-ng-class": "toolbar-background-md" }),
                    h("button", { class: "back-button disable-hover bar-button bar-button-md back-button-md bar-button-default bar-button-default-md show-back-button", "ion-button": "bar-button", "ng-reflect-klass": "back-button", "ng-reflect-ng-class": "back-button-md", onClick: () => this.navigateToBack() },
                        h("span", { class: "button-inner" },
                            h("ion-icon", { class: "back-button-icon icon icon-md back-button-icon-md ion-md-arrow-back", role: "img", "ng-reflect-klass": "back-button-icon", "ng-reflect-ng-class": "back-button-icon-md", "aria-label": "arrow back", "ng-reflect-name": "md-arrow-back" }),
                            h("span", { class: "back-button-text back-button-text-md", "ng-reflect-klass": "back-button-text", "ng-reflect-ng-class": "back-button-text-md" })),
                        h("div", { class: "button-effect" })),
                    h("ion-buttons", { "icon-only": "", "ion-button": "", class: "disable-hover bar-buttons bar-buttons-md bar-button bar-button-md bar-button-default bar-button-default-md" },
                        h("span", { class: "button-inner" }, (this.showHome) ? h("home-button", null,
                            h("div", null,
                                h("ion-icon", { name: "md-home", role: "img", class: "icon icon-md ion-md-home", "aria-label": "home", "ng-reflect-name": "md-home" }),
                                " "))
                            : ""),
                        h("div", { class: "button-effect" })),
                    h("div", { class: "toolbar-content toolbar-content-md", "ng-reflect-klass": "toolbar-content", "ng-reflect-ng-class": "toolbar-content-md" },
                        h("ion-title", { class: "title title-md" },
                            h("div", { class: "toolbar-title toolbar-title-md", "ng-reflect-klass": "toolbar-title", "ng-reflect-ng-class": "toolbar-title-md" }, "My Account")))))));
    }
    static get is() { return "component-header"; }
    static get properties() { return { "currentState": { "type": "Any", "attr": "current-state" }, "headerName": { "type": "Any", "attr": "header-name" }, "showHome": { "type": Boolean, "attr": "show-home" } }; }
    static get events() { return [{ "name": "backButton", "method": "backButton", "bubbles": true, "cancelable": true, "composed": true }]; }
}

//import { EventEmitter } from "events";
class PlayerBalance {
    constructor() {
        this.data = {
            type: "",
            action: ''
        };
        // debugger;
        // this.Type;
        // this.data;
    }
    showAccount(value) {
        this.data.type = this.Type;
        this.data.action = value;
        this.statusChange.emit(this.data);
    }
    render() {
        return (
        // <div>
        //     <div class='card'>                    
        //         <div class="card-block custom">
        //             <h3 class="card-title"><b>{this.Type}</b></h3>
        //             <p class="card-text"><b>{this.FormattedAmount}</b></p>
        //             <a href="#" class="btn btn-primary">Download</a>
        //             <a href="#" class="btn btn-primary">Upload</a>
        //         </div>       
        //     </div>
        // </div>
        // <div class="card account_panel">
        //     <div class="row">
        //         <div class="col col-50 no-padding">
        //             <button class="">
        //                 <div class="panel_heading"> <b>{this.Type} </b> </div>
        //                 <div class="price">{this.FormattedAmount}</div>
        //                 {this.TypeValue
        //                     ? <button class="btn btn-sm btn-primary">Add Cash</button>
        //                     : <p></p>
        //                 }
        //             </button>
        //         </div>
        //         <div class="col col-50">
        //             <div class="row no-padding">
        //                 <div class="icon_download"><span>&#9650;</span></div>
        //                 <div class="no-padding">
        //                     <div class="no-padding panel_heading">Download</div>
        //                     <div class="no-padding font-13 color-primary">To Game</div>
        //                 </div>
        //             </div>
        //             <div class="row no-padding margin-top">
        //                 <div class="icon_download"><span>&#9660;</span></div>
        //                 <div class="no-padding">
        //                     <div class="no-padding panel_heading">Upload</div>
        //                     <div class="no-padding font-13 color-primary">To Game</div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        h("ion-card", { class: "card card-" + this.mode },
            h("ion-card-content", { class: "account_panel card-content card-content-" + this.mode },
                h("ion-grid", { class: "grid" },
                    h("ion-row", { class: "row" },
                        h("ion-col", { class: "col" },
                            h("button", null,
                                h("div", { class: "panel_heading" },
                                    " ",
                                    this.Type,
                                    " "),
                                h("div", { class: "price" }, this.FormattedAmount),
                                this.Type == 'CASH'
                                    ? h("button", { class: "btn btn-sm btn-primary", "md-width": "100%", onClick: () => this.showAccount('add-cash') }, "Add Cash")
                                    : '')),
                        h("ion-col", { class: "col" },
                            h("ion-row", { "align-items-center": "", class: "panel_right row" },
                                h("ion-col", { class: "icon_download col", "col-3": "", "text-center": "", onClick: () => this.showAccount('Download') },
                                    h("ion-icon", { name: "icon-download-symbol", role: "img", class: "icon icon-" + this.mode + " ion-" + this.mode + "-icon-download-symbol", "aria-label": "icon download-symbol", "ng-reflect-name": "icon-download-symbol" }, "  ")),
                                h("ion-col", { class: "account_content col", "col-9": "" },
                                    h("ion-row", { class: "head row" },
                                        h("ion-col", { class: "col" }, "Download")),
                                    h("ion-row", { class: "sub row" },
                                        h("ion-col", { class: "col" }, "To Game")))),
                            h("ion-row", { "align-items-center": "", class: "panel_right row" },
                                h("ion-col", { class: "icon_download col", "col-3": "", "text-center": "", onClick: () => this.showAccount('Upload') },
                                    h("ion-icon", { name: "icon-upload-symbol", role: "img", class: "icon icon-" + this.mode + " ion-" + this.mode + "-icon-upload-symbol", "aria-label": "icon upload-symbol", "ng-reflect-name": "icon-upload-symbol" }, "  ")),
                                h("ion-col", { class: "account_content col", "col-9": "" },
                                    h("ion-row", { class: "head row" },
                                        h("ion-col", { class: "col" }, "Upload")),
                                    h("ion-row", { class: "sub row" },
                                        h("ion-col", { class: "col" }, "To Card"))))))))));
    }
    static get is() { return "player-balance"; }
    static get properties() { return { "data": { "state": true }, "FormattedAmount": { "type": String, "attr": "formatted-amount" }, "mode": { "type": String, "attr": "mode" }, "Type": { "type": String, "attr": "type" }, "TypeValue": { "type": Boolean, "attr": "type-value" } }; }
    static get events() { return [{ "name": "statusChange", "method": "statusChange", "bubbles": true, "cancelable": true, "composed": true }]; }
}
/*

<ion-card class="card card-md">

                <ion-card-content class="account_panel card-content card-content-md">

                    <ion-grid class="grid">

                        <ion-row class="row">

                            <ion-col class="col">

                                <button>

                        <div class="panel_heading"> Cash Balance </div>

                        <div class="price">$100</div>

                        <button class="btn btn-sm btn-primary" style="width:100%">Add Cash</button>

                        </button>

                            </ion-col>

                            <ion-col class="col">

                                <ion-row align-items-center="" class="panel_right row">

                                    <ion-col class="icon_download col" col-3="" text-center="">

                                        <ion-icon name="icon-download-symbol" role="img" class="icon icon-md ion-md-icon-download-symbol" aria-label="icon download-symbol" ng-reflect-name="icon-download-symbol"></ion-icon>

                                    </ion-col>

                                    <ion-col class="account_content col" col-9="">

                                        <ion-row class="head row">

                                            <ion-col class="col">Download</ion-col>

                                        </ion-row>

                                        <ion-row class="sub row">

                                            <ion-col class="col">To Game</ion-col>

                                        </ion-row>

                                    </ion-col>

                                </ion-row>

                                <ion-row align-items-center="" class="panel_right row">

                                    <ion-col class="icon_download col" col-3="" text-center="">

                                        <ion-icon name="icon-upload-symbol" role="img" class="icon icon-md ion-md-icon-upload-symbol" aria-label="icon upload-symbol" ng-reflect-name="icon-upload-symbol"></ion-icon>

                                    </ion-col>

                                    <ion-col class="account_content col" col-9="">

                                        <ion-row class="head row">

                                            <ion-col class="col">Upload</ion-col>

                                        </ion-row>

                                        <ion-row class="sub row">

                                            <ion-col class="col">To Card</ion-col>

                                        </ion-row>

                                    </ion-col>

                                </ion-row>

                            </ion-col>

                        </ion-row>

                    </ion-grid>

                </ion-card-content>

            </ion-card>

*/

export { CashBalanceTransfer, AddCash as CashLessHome, CashLess, ClubStatus, ComponentHeader, PlayerBalance };
