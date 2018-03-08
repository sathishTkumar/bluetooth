/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

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

class BalanceRequest extends BaseRequest {
    constructor(balanceRequest) {
        super();
        Object.assign(this, balanceRequest);
    }
}

//import { BankName } from "./BankName";
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
        allWallets.push(this.getBankInfo("EbsWallet"));
        allWallets.push(this.getBankInfo("GamingMachine"));
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

class WalletDispositionTypes {
}
WalletDispositionTypes.Cash = 'Cash';
WalletDispositionTypes.Points = 'Restricted';
WalletDispositionTypes.Promo = 'Promotional';

//export namespace S_WalletService {
var S_SlotService;
(function (S_SlotService) {
    let cash = new DispositionTemplate({ FormattedAmount: '$0', Amount: 0, DispositionType: 'cash' });
    let promo = new DispositionTemplate({ FormattedAmount: '$0', Amount: 0, DispositionType: 'promotional' });
    let points = new DispositionTemplate({ FormattedAmount: '$0', Amount: 0, DispositionType: 'points' });
    S_SlotService.updateGameBalance = (balanceResponse) => {
        var gameBalances = balanceResponse.Balance.filter(item => item.Bank == "GamingMachine");
        if (!DataValidator.isDefined(gameBalances[0]) || !DataValidator.isDefined(gameBalances[0].Disposition))
            return;
        updateBalance(gameBalances[0].Disposition);
    };
    let updateBalance = (dispositions) => {
        var disposition = dispositions.filter(item => item.DispositionType == WalletDispositionTypes.Cash);
        if (disposition.length)
            cash.update(disposition[0]);
        else
            cash.updateAmount(0);
        disposition = dispositions.filter(item => item.DispositionType == WalletDispositionTypes.Promo);
        if (disposition.length)
            promo.update(disposition[0]);
        else
            promo.updateAmount(0);
        disposition = dispositions.filter(item => item.DispositionType == WalletDispositionTypes.Points);
        if (disposition.length)
            points.update(disposition[0]);
        else
            points.updateAmount(0);
    };
    S_SlotService.getGameBalance = () => {
        return { cash: cash, promo: promo, points: points };
    };
})(S_SlotService || (S_SlotService = {}));

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
//import { BankName } from "../models/BankName";
//import { RequestOptions } from "http";
//import { CommonService } from "./commonService";
//@Injectable()
var S_WalletService;
(function (S_WalletService) {
    let deviceInfo;
    let playerInfo;
    let locationInfo;
    let cash = new DispositionTemplate({ FormattedAmount: '$100', Amount: 100, DispositionType: 'cash' });
    let promo = new DispositionTemplate({ FormattedAmount: '$11,100', Amount: 11100, DispositionType: 'promotional' });
    let points = new DispositionTemplate({ FormattedAmount: '$3,200', Amount: 3200, DispositionType: 'points' });
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
        console.log(balanceRequest);
        return S_API.post(S_UrlBuilder.buildWalletBalanceEnquiryUrl(), balanceRequest, buildHeader());
    };
    S_WalletService.parseAccountBalance = (balanceResponse) => {
        var accountBalance = balanceResponse.Balance.filter(item => item.Bank == "EbsWallet");
        if (!DataValidator.isDefined(accountBalance[0]) || !DataValidator.isDefined(accountBalance[0].Disposition))
            return;
        var walletBalance = accountBalance[0];
        updateWalletBalance(walletBalance.Disposition);
        S_SlotService.updateGameBalance(balanceResponse);
    };
    let updateWalletBalance = (dispositions) => {
        var disposition = dispositions.filter(item => item.DispositionType == WalletDispositionTypes.Cash);
        if (disposition.length)
            cash.update(disposition[0]);
        else
            cash.updateAmount(0);
        disposition = dispositions.filter(item => item.DispositionType == WalletDispositionTypes.Promo);
        if (disposition.length)
            promo.update(disposition[0]);
        else
            promo.updateAmount(0);
        disposition = dispositions.filter(item => item.DispositionType == WalletDispositionTypes.Points);
        if (disposition.length)
            points.update(disposition[0]);
        else
            points.updateAmount(0);
    };
    S_WalletService.getWalletBalance = () => {
        return { cash: cash, promo: promo, points: points };
    };
})(S_WalletService || (S_WalletService = {}));

export { S_WalletService, S_AppCashLessInfo, DispositionTemplate, DataValidator, S_SlotService };
