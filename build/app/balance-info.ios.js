/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import './chunk1.js';
import { domControllerAsync, playAnimationAsync } from './chunk2.js';
import { createThemedClasses } from './chunk3.js';
import { S_WalletService, S_AppCashLessInfo } from './chunk4.js';

/**
 * iOS Action Sheet Enter Animation
 */
function iosEnterAnimation(Animation, baseElm) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseElm.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    wrapperAnimation.fromTo('translateY', '100%', '0%');
    return baseAnimation
        .addElement(baseElm)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation);
}

/**
 * iOS Action Sheet Leave Animation
 */
function iosLeaveAnimation(Animation, baseElm) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseElm.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.4, 0);
    wrapperAnimation.fromTo('translateY', '0%', '100%');
    return baseAnimation
        .addElement(baseElm)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .add(backdropAnimation)
        .add(wrapperAnimation);
}

/**
 * MD Action Sheet Enter Animation
 */
function mdEnterAnimation(Animation, baseElm) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseElm.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.26);
    wrapperAnimation.fromTo('translateY', '100%', '0%');
    return baseAnimation
        .addElement(baseElm)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation);
}

/**
 * MD Action Sheet Leave Animation
 */
function mdLeaveAnimation(Animation, baseElm) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseElm.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.26, 0);
    wrapperAnimation.fromTo('translateY', '0%', '100%');
    return baseAnimation
        .addElement(baseElm)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .add(backdropAnimation)
        .add(wrapperAnimation);
}

class ActionSheet {
    constructor() {
        /**
         * If true, the action-sheet will be dismissed when the backdrop is clicked.
         */
        this.enableBackdropDismiss = true;
        /**
         * If true, action-sheet will become translucent. Requires support for backdrop-filters.
         */
        this.translucent = false;
        /**
         * Enable action-sheet animations. If false, action-sheet will not animate in
         */
        this.animate = true;
    }
    /**
     * Present the action-sheet after is has been created
     */
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionActionSheetWillPresent.emit();
        this.el.style.zIndex = `${20000 + this.actionSheetId}`;
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get("actionSheetEnter", this.mode === "ios" ? iosEnterAnimation : mdEnterAnimation);
        // build the animation and kick it off
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            if (!this.animate) {
                // if the duration is 0, it won't actually animate I don't think
                // TODO - validate this
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.ionActionSheetDidPresent.emit();
        });
    }
    /**
     * Dismiss the action-sheet programatically
     */
    dismiss(data, role) {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionActionSheetWillDismiss.emit({
            data,
            role
        });
        const animationBuilder = this.leaveAnimation || this.config.get("actionSheetLeave", this.mode === "ios" ? iosLeaveAnimation : mdLeaveAnimation);
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            return domControllerAsync(Context.dom.write, () => {
                this.el.parentNode.removeChild(this.el);
            });
        }).then(() => {
            this.ionActionSheetDidDismiss.emit({
                data,
                role
            });
        });
    }
    componentDidLoad() {
        this.ionActionSheetDidLoad.emit();
    }
    componentDidUnload() {
        this.ionActionSheetDidUnload.emit();
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    backdropClick() {
        if (this.enableBackdropDismiss) {
            this.dismiss();
        }
    }
    buttonClass(button) {
        let buttonClass = !button.role
            ? ["action-sheet-button"]
            : [`action-sheet-button`, `action-sheet-${button.role}`];
        if (button.cssClass) {
            let customClass = button.cssClass.split(" ").filter(b => b.trim() !== "").join(" ");
            buttonClass.push(customClass);
        }
        return buttonClass.reduce((prevValue, cssClass) => {
            prevValue[cssClass] = true;
            return prevValue;
        }, {});
    }
    buttonClick(button) {
        let shouldDismiss = true;
        if (button.handler) {
            if (button.handler() === false) {
                shouldDismiss = false;
            }
        }
        if (shouldDismiss) {
            this.dismiss();
        }
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, "action-sheet-translucent") : {};
        const hostClasses = Object.assign({}, themedClasses);
        return {
            class: hostClasses
        };
    }
    render() {
        if (this.cssClass) {
            this.cssClass.split(" ").forEach(cssClass => {
                if (cssClass.trim() !== "")
                    this.el.classList.add(cssClass);
            });
        }
        let cancelButton;
        let buttons = this.buttons
            .map(b => {
            if (typeof b === "string") {
                b = { text: b };
            }
            if (!b.cssClass) {
                b.cssClass = "";
            }
            if (b.role === "cancel") {
                cancelButton = b;
                return null;
            }
            return b;
        })
            .filter(b => b !== null);
        return [
            h("ion-backdrop", { onClick: this.backdropClick.bind(this), class: "action-sheet-backdrop" }),
            h("div", { class: "action-sheet-wrapper", role: "dialog" }, h("div", { class: "action-sheet-container" }, h("div", { class: "action-sheet-group" }, this.title
                ? h("div", { class: "action-sheet-title" }, this.title)
                : null, this.subTitle
                ? h("div", { class: "action-sheet-sub-title" }, this.subTitle)
                : null, buttons.map(b => h("button", { class: this.buttonClass(b), onClick: () => this.buttonClick(b) }, h("span", { class: "button-inner" }, b.icon
                ? h("ion-icon", { name: b.icon, class: "action-sheet-icon" })
                : null, b.text)))), cancelButton
                ? h("div", { class: "action-sheet-group action-sheet-group-cancel" }, h("button", { class: this.buttonClass(cancelButton), onClick: () => this.buttonClick(cancelButton) }, h("span", { class: "button-inner" }, cancelButton.icon
                    ? h("ion-icon", { name: cancelButton.icon, class: "action-sheet-icon" })
                    : null, cancelButton.text)))
                : null))
        ];
    }
}
ActionSheet.is = "ion-action-sheet";
ActionSheet.host = { "theme": "action-sheet" };
ActionSheet.properties = { "animate": { "type": Boolean, "attr": "animate" }, "animationCtrl": { "connect": "ion-animation-controller" }, "buttons": { "type": "Any", "attr": "buttons" }, "config": { "context": "config" }, "cssClass": { "type": String, "attr": "css-class" }, "dismiss": { "method": true }, "el": { "elementRef": true }, "enableBackdropDismiss": { "type": Boolean, "attr": "enable-backdrop-dismiss" }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "present": { "method": true }, "subTitle": { "type": String, "attr": "sub-title" }, "title": { "type": String, "attr": "title" }, "translucent": { "type": Boolean, "attr": "translucent" } };
ActionSheet.events = [{ "name": "ionActionSheetDidDismiss", "method": "ionActionSheetDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetDidLoad", "method": "ionActionSheetDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetDidPresent", "method": "ionActionSheetDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetDidUnload", "method": "ionActionSheetDidUnload", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetWillDismiss", "method": "ionActionSheetWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetWillPresent", "method": "ionActionSheetWillPresent", "bubbles": true, "cancelable": true, "composed": true }];
ActionSheet.style = "ion-action-sheet {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 1000;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n.action-sheet-wrapper {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  transform: translate3d(0,  100%,  0);\n  position: absolute;\n  z-index: 10;\n  display: block;\n  width: 100%;\n  max-width: 500px;\n  pointer-events: none;\n}\n\n.action-sheet-button {\n  width: 100%;\n}\n\n.action-sheet-container {\n  display: flex;\n  flex-flow: column;\n  justify-content: flex-end;\n  height: 100%;\n  max-height: 100%;\n}\n\n.action-sheet-group {\n  overflow: scroll;\n  flex-shrink: 2;\n  pointer-events: all;\n}\n\n.action-sheet-group-cancel {\n  overflow: hidden;\n  flex-shrink: 0;\n}\n\n.action-sheet-ios {\n  text-align: center;\n}\n\n.action-sheet-ios .action-sheet-wrapper {\n  margin: constant(safe-area-inset-top) auto constant(safe-area-inset-bottom);\n  margin: env(safe-area-inset-top) auto env(safe-area-inset-bottom);\n}\n\n.action-sheet-ios .action-sheet-container {\n  padding: 0 10px;\n}\n\n.action-sheet-ios .action-sheet-group {\n  border-radius: 13px;\n  margin-bottom: 8px;\n  background: #f9f9f9;\n}\n\n.action-sheet-ios .action-sheet-group:first-child {\n  margin-top: 10px;\n}\n\n.action-sheet-ios .action-sheet-group:last-child {\n  margin-bottom: 10px;\n}\n\n.action-sheet-translucent-ios .action-sheet-group {\n  background: rgba(249, 249, 249, 0.88);\n  backdrop-filter: saturate(180%) blur(20px);\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n}\n\n.action-sheet-ios .action-sheet-title {\n  padding: 15px;\n  text-align: center;\n  border-bottom: 0.55px solid rgba(0, 0, 0, 0.1);\n  font-size: 13px;\n  font-weight: 400;\n  color: #8f8f8f;\n}\n\n.action-sheet-ios .action-sheet-button {\n  margin: 0;\n  padding: 18px;\n  min-height: 56px;\n  border-bottom: 0.55px solid rgba(0, 0, 0, 0.1);\n  font-size: 20px;\n  color: #007aff;\n  background: transparent;\n}\n\n.action-sheet-ios .action-sheet-button .action-sheet-icon {\n  margin-top: -10px;\n  padding-right: 0.1em;\n  width: 23px;\n  height: 0.7em;\n  font-size: 1.4em;\n  vertical-align: middle;\n  fill: #007aff;\n}\n\n.action-sheet-ios .action-sheet-button:last-child {\n  border-bottom-color: transparent;\n}\n\n.action-sheet-ios .action-sheet-button.activated {\n  margin-top: -0.55px;\n  border-top: 0.55px solid rgba(115, 115, 115, 0.1);\n  border-bottom-color: rgba(115, 115, 115, 0.1);\n  background: rgba(115, 115, 115, 0.1);\n}\n\n.action-sheet-ios .action-sheet-selected {\n  font-weight: bold;\n  background: #fff;\n}\n\n.action-sheet-ios .action-sheet-destructive {\n  color: #f53d3d;\n}\n\n.action-sheet-ios .action-sheet-destructive .action-sheet-icon {\n  fill: #f53d3d;\n}\n\n.action-sheet-ios .action-sheet-cancel {\n  font-weight: 600;\n  background: #fff;\n}";
ActionSheet.styleMode = "ios";

class CardHeader {
    constructor() {
        /**
         * @input {boolean} If true, adds transparency to the card header.
         * Only affects `ios` mode. Defaults to `false`.
         */
        this.translucent = false;
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, "card-header-translucent") : {};
        const hostClasses = Object.assign({}, themedClasses);
        return {
            class: hostClasses
        };
    }
    render() {
        return h("slot", null);
    }
}
CardHeader.is = "ion-card-header";
CardHeader.host = { "theme": "card-header" };
CardHeader.properties = { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" }, "translucent": { "type": Boolean, "attr": "translucent" } };
CardHeader.style = "ion-card-header {\n  position: relative;\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.card-header-ios {\n  padding: 20px 20px 16px;\n}\n\n.card-header-translucent-ios {\n  background-color: rgba(255, 255, 255, 0.88);\n  -webkit-backdrop-filter: saturate(180%) blur(30px);\n  backdrop-filter: saturate(180%) blur(30px);\n}";
CardHeader.styleMode = "ios";

class Dashboard {
    constructor() {
        this.slidesImage = [
            {
                image: "assets/dark/banner-0.png",
            },
            {
                image: "assets/dark/banner-1.png",
            },
            {
                image: "assets/dark/banner-2.png",
            },
            {
                image: "assets/dark/banner-3.png",
            }
        ];
        this.dashbordComponent = [];
        this.type = {
            "type": "player-balance"
        };
    }
    componentWillLoad() {
        // if (this.match && this.match.params.pageNum) {
        //   this.page = parseInt(this.match.params.pageNum);
        // } else {
        this.page = 1;
        // }
    }
    forward() {
        // this.page = this.page + 1;
        // this.history.push(`/news/${this.page}`, {});
    }
    back() {
        // console.log('updating page', this.page);
        // if (this.page !== 1) {
        //   this.page = this.page - 1;
        //   console.log(this.page);
        //   this.history.push(`/news/${this.page}`, {});
        // }
    }
    showCardlessOption() {
        debugger;
        // let actionSheet = {
        //   title: 'CONNECTUSING',
        //   buttons: [
        //     {
        //       text: 'SCAN_CODE',
        //       icon: "md-qr-scanner",
        //       handler: () => {
        //         //this.navCtrl.push(CardLessPage, { type: "qrcode" });
        //       }
        //     },
        //     {
        //       text: 'DETECT',
        //       icon: "md-wifi",
        //       handler: () => {
        //         //this.navCtrl.push(CardLessPage, { type: "nfc" });
        //       }
        //     },
        //     {
        //       text: 'VIRTUAL CARD',
        //       icon: "md-card",
        //       handler: () => {
        //         //this.navCtrl.push(CardLessPage, { type: "optical" });
        //       }
        //     },
        //     {
        //       text: "SG_AIR",
        //       icon: "icon-beacon",
        //       handler: () => {
        //         // this.navCtrl.push(CardLessPage, { type: "beacon" });
        //       }
        //     },
        //     {
        //       text: 'CANCEL_BUTTON',
        //       icon: 'md-close',
        //       role: 'cancel',
        //       handler: () => {
        //         console.log('Cancel clicked');
        //       }
        //     }]
        // }
        // this.actionSheetCtrl.create(actionSheet).then((alert) => {
        //   alert.present();
        // }, (err) => {
        //   console.log(err)
        // })
        //return actionSheet;
    }
    render() {
        return (h("ion-page", null,
            h("ion-header", { class: "dashboard-header" },
                h("ion-title", null,
                    " ",
                    h("img", { src: "assets/dark/appLogo.png", class: "dashboard-title-image title-image" }),
                    " ")),
            h("ion-content", null,
                h("list-container", { pageNum: this.page, type: 'news' }),
                h("ion-slides", { pager: true, class: "dashboard_slider", autoplay: 4000, loop: true, speed: 1000 }, this.slidesImage.map((slide) => h("ion-slide", null,
                    h("img", { src: slide.image, class: "slide-image" })))),
                h("stencil-route-link", { url: `/qrcode` },
                    h("ion-button", null, "Connect to Slot")),
                h("ion-icon", { id: 'ionic-icon', name: 'ionic' }),
                h("stencil-route-link", { url: `/wallet` },
                    h("wallet-balance", { mini: true })),
                h("div", null,
                    h("sg-events-mini", null)))));
    }
    static get is() { return "dash-board"; }
    static get properties() { return { "actionSheetCtrl": { "connect": "ion-action-sheet" }, "dashbordComponent": { "type": "Any", "attr": "dashbord-component" }, "history": { "type": "Any", "attr": "history" }, "match": { "type": "Any", "attr": "match" }, "page": { "state": true }, "slidesImage": { "type": "Any", "attr": "slides-image" }, "type": { "state": true } }; }
    static get style() { return "h1 {\n  color: var(--app-primary-color)\n}\n.dashboard_grid {\n  padding: 0px;\n  margin: 10px 0 0 0;\nwidth:100%;    \n}"; }
}

class SGEventsMini {
    constructor() {
        this.myCalendarEvents = [
            {
                "title": "BACKSTREET_BOYS",
                "startDate": "2017-07-19T11:00:00",
                "startTime": "11.40 AM",
                "img": "assets/img/PinkFloyd.jpg",
                "description": "BACKSTREET_BOYS_DESC",
                "tRate": "$59.50",
                "place": "GALAXY_HOTEL"
            },
            {
                "title": "PITBULL",
                "startDate": "2017-07-19T11:00:00",
                "startTime": "10.30 PM",
                "img": "assets/img/RKelly.jpg",
                "description": "PITBULL_RETURNS",
                "tRate": "$59.50",
                "place": "GALAXY_HOTEL"
            },
            {
                "title": "RINGO_STARR",
                "startDate": "2017-07-19T11:00:00",
                "startTime": "11.30 PM",
                "img": "assets/img/Incubus.jpg",
                "description": "RINGO_STARR",
                "tRate": "$59.50",
                "place": "GALAXY_HOTEL"
            },
            {
                "title": "PITBULL",
                "startDate": "2017-07-19T11:00:00",
                "startTime": "10.30 PM",
                "img": "assets/img/RKelly.jpg",
                "description": "PITBULL_RETURNS",
                "tRate": "$59.50",
                "place": "GALAXY_HOTEL"
            },
            {
                "title": "RINGO_STARR",
                "startDate": "2017-07-19T11:00:00",
                "startTime": "11.30 PM",
                "img": "assets/img/Incubus.jpg",
                "description": "RINGO_STARR",
                "tRate": "$59.50",
                "place": "GALAXY_HOTEL"
            }
        ];
    }
    render() {
        return (h("div", null,
            h("ion-card", { class: "outer-card events-card" },
                h("ion-card-header", null,
                    "My Events",
                    h("button", { "ion-button": true, class: "event-button tiny-btn" },
                        h("stencil-route-link", { url: `/events`, activeClass: "active", class: "event-link" },
                            " ",
                            'View More'))),
                h("ion-card-content", { class: "inner-card-content" },
                    h("ion-card", { class: "inner-card" },
                        h("stencil-route-link", { url: `/events`, activeClass: "active" },
                            h("ion-card-content", null,
                                h("ion-slides", { pager: true, class: "dashboard_slider", slidesPerView: 4 }, this.myCalendarEvents.map((events) => h("ion-slide", { class: "event-slide" },
                                    h("div", null,
                                        h("ion-row", null,
                                            h("img", { src: events.img, class: "events-slide-image slide-image" })),
                                        h("ion-row", null,
                                            h("p", { class: "event-details" }, events.title)))))))))))));
    }
    static get is() { return "sg-events-mini"; }
    static get style() { return ".events-card {\n  background: #b62359;\n  color: #fff;\n}\n\n.tiny-btn {\n  background: #5724b8;\n  border-radius: 4px;\n  padding: 6px 8px;\n  font-size: 12px;\n}\n\n.inner-card {\n  border-top-left-radius: 4px !important;\n  border-bottom-left-radius: 4px !important;\n  display: flex;\n  overflow-y: auto;\n  margin: 0px;\n  border-radius: 0px;\n  width: 100%;\n}\n\n.outer-card {\n  height: 160px;\n  position: relative;\n  overflow: visible;\n  width: 100%;\n  margin: 0px;\n  border-radius: 0px;\n  margin-top: 15px;\n}\n\n.event-button {\n  background: rgba(0, 0, 0, 0.3);\n  float: right;\n}\n\n.event-link a {\n  color: #fff;\n}\n\n.inner-card-content {\n  padding: 0 0 0 15px;\n  overflow: visible;\n}\n\n.event-details {\n  font-size: 7px !important;\n}\n\nion-card {\n  position: relative;\n  margin: 0px;\n  border-radius: 0px;\n  width: 100%;\n}\n\n.card-title {\n  position: absolute;\n  top: 36%;\n  font-size: 2.0em;\n  width: 100%;\n  font-weight: bold;\n  color: #fff;\n}\n\n.card-subtitle {\n  font-size: 1.0em;\n  position: absolute;\n  top: 52%;\n  width: 100%;\n  color: #fff;\n}\n\n.event-slide {\n  width: 90px !important;\n  justify-content: initial;\n}\n\nstencil-route-link a {\n  text-decoration: none;\n}\n\n.events-slide-image {\n  max-height: 70px !important;\n}"; }
}

//import { EventEmitter } from "events";
class BalanceInfo {
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
        //  this.data.type = this.Type;
        // this.data.action = value;
        // this.statusChange.emit(this.data);
    }
    render() {
        return (h("ion-card", null,
            h("ion-card-content", { class: "account_panel" },
                h("ion-grid", null,
                    h("ion-row", null,
                        h("ion-col", null,
                            h("button", null,
                                h("div", { class: "panel_heading" },
                                    " ",
                                    this.Type,
                                    " BALANCE"),
                                h("div", { class: "price" }, this.FormattedAmount),
                                this.Type == 'CASH'
                                    ? h("button", { class: "btn btn-sm btn-primary", "md-width": "100%", onClick: () => this.showAccount('add-cash') }, "Add Cash")
                                    : '')),
                        h("ion-col", null,
                            h("stencil-route-link", { url: `/balancetransfer/Download` },
                                h("ion-row", { class: "panel_right", "align-items-center": true, onClick: () => this.showAccount('Download') },
                                    h("ion-col", { "col-3": true, "text-center": true, class: "icon_download" },
                                        h("ion-icon", { name: "icon-download-symbol" })),
                                    h("ion-col", { "col-9": true, class: "account_content" },
                                        h("ion-row", { class: "head" },
                                            h("ion-col", null, 'DOWNLOAD')),
                                        h("ion-row", { class: "sub" },
                                            h("ion-col", null, 'TO GAME'))))),
                            h("stencil-route-link", { url: `/balancetransfer/Upload` },
                                h("ion-row", { class: "panel_right", "align-items-center": true, onClick: () => this.showAccount('Upload') },
                                    h("ion-col", { "col-3": true, "text-center": true, class: "icon_download" },
                                        h("ion-icon", { name: "icon-upload-symbol" })),
                                    h("ion-col", { "col-9": true, class: "account_content" },
                                        h("ion-row", { class: "head" },
                                            h("ion-col", null, 'UPLOAD')),
                                        h("ion-row", { class: "sub" },
                                            h("ion-col", null, 'TO CARD')))))))))));
    }
    static get is() { return "balance-info"; }
    static get properties() { return { "data": { "state": true }, "FormattedAmount": { "type": String, "attr": "formatted-amount" }, "mode": { "type": String, "attr": "mode" }, "navPrams": { "type": "Any", "attr": "nav-prams" }, "Type": { "type": String, "attr": "type" }, "TypeValue": { "type": Boolean, "attr": "type-value" } }; }
    static get events() { return [{ "name": "statusChange", "method": "statusChange", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "balance-info .account_panel {\n  background-color: rgba(0, 0, 0, 0.42);\n  border-radius: 4px;\n  border-left: 10px solid #be8000;\n  padding: 0;\n}\n\nbalance-info .account_panel ion-grid {\n  padding: 0;\n}\n\nbalance-info .account_panel ion-grid ion-col {\n  padding: 0;\n}\n\nbalance-info .account_panel ion-grid ion-col > button {\n  height: 100%;\n  background-color: transparent;\n  text-align: left;\n  padding-top: 10px;\n  padding-left: 10px;\n}\n\nbalance-info .account_panel ion-grid ion-col > button .panel_heading {\n  font-size: 18px;\n  color: #f4f4f4;\n  text-transform: uppercase;\n}\n\nbalance-info .account_panel ion-grid ion-col > button .price, balance-info .account_panel ion-grid ion-col > button .price p {\n  font-size: 28px;\n  padding: 4px 0;\n  background: -webkit-linear-gradient(#ffd34e, #b5873a);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\nbalance-info .account_panel ion-grid ion-col > button .price p, balance-info .account_panel ion-grid ion-col > button .price p p {\n  font-size: 20px;\n}\n\nbalance-info .account_panel ion-grid ion-col .panel_right {\n  padding: 4px 0;\n  cursor: pointer;\n}\n\nbalance-info .account_panel ion-grid ion-col .panel_right .icon_download {\n  font-size: 26px;\n  color: #cf8305;\n  margin-top: 8px;\n}\n\nbalance-info .account_panel ion-grid ion-col .panel_right .account_content {\n  color: #cf8305;\n  text-transform: uppercase;\n}\n\nbalance-info .account_panel ion-grid ion-col .panel_right .account_content .head {\n  font-size: 16px;\n  color: #f4f4f4;\n  padding-left: 6px;\n}\n\nbalance-info .account_panel ion-grid ion-col .panel_right .account_content .sub {\n  font-size: 13px;\n  padding-left: 6px;\n  color: #cf8305;\n}\n\nbalance-info .account_panel .amazon_box {\n  padding: 10px;\n  background-color: #000;\n}\n\nbalance-info .account_panel .amazon_box p {\n  color: #cf8305;\n  text-align: center;\n  font-size: 12px;\n  font-size: 1.2rem;\n}\n\nbalance-info .account_panel .amazon_box .amz {\n  width: 50%;\n  display: inline-block;\n}"; }
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

class WalletMini {
    constructor() {
        this.balance = S_WalletService.getWalletBalance();
    }
    componentWillLoad() {
        debugger;
    }
    //onClick={() => this.statusChange.emit({"action":"player-balance","type":"player-balance"})}
    render() {
        return (h("ion-card", { class: "dashboard_grid" },
            h("ion-row", { class: "account-info-container row" },
                h("ion-col", { class: "col", "col-8": "" },
                    h("player-card", null),
                    ","),
                h("ion-col", { class: "col balance-container", "col-4": "" },
                    h("ion-row", null,
                        h("ion-col", { class: "col", "col-12": "" },
                            h("div", { class: "account-info text-uppercase" },
                                h("span", null, "CASH"),
                                h("p", { "no-margin": "" }, this.balance.cash.FormattedAmount)))),
                    h("ion-row", null,
                        h("ion-col", { class: "col", "col-12": "" },
                            h("div", { class: "account-info text-uppercase divider" },
                                h("span", null, "POINTS"),
                                h("p", { "no-margin": "" }, this.balance.points.FormattedAmount)))),
                    h("ion-row", null,
                        h("ion-col", { class: "col", "col-12": "" },
                            h("div", { class: "account-info text-uppercase" },
                                h("span", null, "PROMO"),
                                h("p", { "no-margin": "" }, this.balance.promo.FormattedAmount))))))));
    }
    static get is() { return "wallet-mini"; }
    static get properties() { return { "balance": { "type": "Any", "attr": "balance" } }; }
    static get events() { return [{ "name": "statusChange", "method": "statusChange", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return ".account-info-container {\n  \n  margin: -6px -14px 14px;\n}\n\n.dashboard_grid {\n  padding: 0px;\n  margin: 10px 0 0 0;\n  width:100%;  \n  border-radius: 0px;\n  height: 165px;  \n}\n\n\n.account-info-container ion-col {\n\n}\n\n.account-info {\n  padding: 0px 4px;\n}\n\n.account-info span {\n  font-size: 12px;\n}\n\n.account-info p {\n  font-size: 16px;\n  font-weight: 500;\n  color: #cf8305;\n}\n\n.account-info ::last-child {\n  border: none;\n}\n\n.account-info.divider {\n  border-right: 1px solid rgba(255, 255, 255, 0.2);\n  border-left: 1px solid rgba(255, 255, 255, 0.2);\n}\nwallet-mini .dashboard_grid .membership{\nwidth: 240px;\n}\nwallet-mini .dashboard_grid .walletimg_bg{   \n    background: none;\n}\nwallet-mini .dashboard_grid .balance-container {\n    margin-top: 19px;\n}"; }
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

class WalletBalance {
    constructor() {
        this.DeviceInfo = {
            UUID: 'ChIJbdJJrjBoI0URnsmjtgFdUcYSD1JlbGF0aW9uYWxTdG9yZRoSCck-ZwX25D1MEYmyxUnT37RdIgsI2O78n6mmsjIQBQ', Platform: 'iOS',
            Version: '10.2', Model: 'iPhone', SecurityToken: ''
        };
        this.PlayerInfo = new PlayerInfo({
            accountNumber: "000012345",
            pin: "1234"
        });
        this.LocationInfo = new LocationInfo({ casinoId: "512", slotNumber: "1234" });
        //@State() Cash: string;
        //@State() Points: string;
        // @State() Promo: string;
        this.wallet = S_WalletService.getWalletBalance();
        // this.slotService = new SlotService()
        // debugger;
        // this.navBar;
        // Navbar
    }
    backButtonClick() {
        this.history.goBack();
    }
    // @Listen('statusChange')
    //   statusChangeHandler(event: CustomEvent) {
    //   debugger;
    //   // alert("trigger");
    //   if (event.detail.action !== "player-balance") {
    //     this.history.push(Object.assign({}, this.stateValue));
    //   }
    //   this.stateValue = event.detail;
    //   // console.log('Received the custom todoCompleted event: ', event.detail);
    // }
    // @Listen('backButton')
    // backButtonListner(event: CustomEvent) {
    //   debugger;
    //   //  alert("back");
    //   console.log(event);
    //   if (!this.history.length) {
    //     this.message.emit({});
    //   } else {
    //     this.stateValue = this.history.pop();
    //   }
    //   // this.state = event.detail;
    //   // console.log('Received the custom todoCompleted event: ', event.detail);
    // }
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
        //console.log( Navbar)
        //     this.navBar.backButtonClick=()=>{
        // alert("over");
        //     };
        //this.toastCtrl.
        // this.navbar.backButtonClick = (e:UIEvent)=>{
        //      // todo something
        //     // this.navController.pop();
        //     });   //  // todo something
        // this.navbar.backButtonClick = (e:UIEvent)=>{
        //  // todo something
        //  this.navController.pop();
        // }
    }
    // updateWalletBalance(accountBalances: AccountBalance[]) {
    //   if (!accountBalances) return;
    //   this.cashBalance = accountBalances[0].Disposition.filter(item => item.DispositionType.toLowerCase() == 'cash')[0];
    //   this.Cash = accountBalances[0].Disposition.filter(item => item.DispositionType.toLowerCase() == 'cash')[0].FormattedAmount;
    //   this.Promo = accountBalances[0].Disposition.filter(item => item.DispositionType.toLowerCase() == 'promotional')[0].FormattedAmount;
    //   this.Points = accountBalances[0].Disposition.filter(item => item.DispositionType.toLowerCase() == 'restricted')[0].FormattedAmount;
    //   this.wallet.push({ "value": this.Cash, "key": "CASH" });
    //   this.wallet.push({ "value": this.Promo, "key": "PROMO" });
    //   this.wallet.push({ "value": this.Points, "key": "POINTS" });
    //   console.log('cash---- ' + this.Cash);
    //   console.log('promotional---- ' + this.Promo);
    //   console.log('restricted---- ' + this.Points);
    // }
    getAccountBalance() {
        debugger;
        S_WalletService.getAccountBalance().then(response => {
            response.json().then(data => {
                debugger;
                var balanceResponse = data;
                console.log(balanceResponse);
                if (balanceResponse.IsSuccess)
                    S_WalletService.parseAccountBalance(balanceResponse);
                this.wallet = S_WalletService.getWalletBalance();
                // S_WalletService.parseAccountBalance()
                // if (balanceResponse.Balance && balanceResponse.Balance.length) {
                //   S_WalletService.updateWalletBalance(balanceResponse.Balance.filter(item => item.Bank == "EbsWallet"))
                //   console.log(balanceResponse);
                //   S_SlotService.updateGameBalance(balanceResponse);
                // }
            });
        }, error => { console.log('Error' + error); }).catch(error => console.log('Error while fetching balance' + error));
    }
    // forward() {
    //   // this.page = this.page + 1;
    //   // this.history.push(`/news/${this.page}`, {});
    // }
    // back() {
    //   // console.log('updating page', this.page);
    //   // if (this.page !== 1) {
    //   //   this.page = this.page - 1;
    //   //   console.log(this.page);
    //   //   this.history.push(`/news/${this.page}`, {});
    //   // }
    // }
    render() {
        if (!this.mini) {
            return (h("ion-page", null,
                h("ion-header", { class: "dashboard-header" },
                    h("ion-navbar", { hideBackButton: true },
                        h("ion-buttons", null,
                            h("button", { "ion-button": true, onClick: () => this.backButtonClick() },
                                h("ion-icon", { class: "customIcon", name: "arrow-back" }, "back"))),
                        h("ion-title", null,
                            " ",
                            h("img", { src: "assets/dark/appLogo.png", class: "dashboard-title-image title-image" }),
                            " "))),
                h("ion-content", null,
                    h("player-card", null),
                    ",",
                    Object.keys(this.wallet).map((key) => h("balance-info", { Type: key, FormattedAmount: this.wallet[key].FormattedAmount, TypeValue: true }, " ")))));
        }
        else {
            return (h("wallet-mini", null));
        }
    }
    static get is() { return "wallet-balance"; }
    static get properties() { return { "DeviceInfo": { "type": "Any", "attr": "device-info" }, "history": { "type": "Any", "attr": "history" }, "LocationInfo": { "type": "Any", "attr": "location-info" }, "mini": { "type": Boolean, "attr": "mini" }, "PlayerInfo": { "type": "Any", "attr": "player-info" }, "wallet": { "state": true } }; }
    static get events() { return [{ "name": "message", "method": "message", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "wallet-balance h4 {\n  background-color: #f4f4f4;\n  margin: 0;\n  text-transform: uppercase;\n  color: #000;\n  padding: 10px;\n}\n\nwallet-balance h4 ion-icon:before {\n  /*font-size: 24px !important;*/\n  background: transparent !important;\n  -webkit-text-fill-color: #000 !important;\n  margin: 0 10px;\n}\n\n\n\n.card-type {\n  padding: 10px;\n  width: 100%;\n  text-align: right;\n}\n\n.name-on-card {\n  /*font-size: 20px;\n  font-size: 2rem;*/\n  text-align: right;\n  padding: 0 10px;\n  margin: 75px 0 6px;\n}\n\n.card-number.row {\n  padding: 0 6px;\n}\n\n.card-copyrights {\n  font-size: 8px;\n  padding-right: 10px;\n}\n\n.account_panel {\n  background-color: rgba(0, 0, 0, 0.42);\n  border-radius: 4px;\n  border-left: 10px solid #be8000;\n  padding: 0;\n}\n\n.account_panel .grid {\n  padding: 0;\n}\n\n.account_panel .grid .col {\n  padding: 0;\n}\n\n.account_panel .grid .col > button {\n  height: 100%;\n  background-color: transparent;\n  text-align: left;\n  padding-top: 10px;\n  padding-left: 10px;\n}\n\n.account_panel .grid .col > button .panel_heading {\n  /*font-size: 20px;\n  font-size: 2rem;*/\n  color: #f4f4f4;\n  text-transform: uppercase;\n}\n\n.account_panel .grid .col > button .price, .account_panel .grid .col > button .price p {\n  /*font-size: 28px;\n  font-size: 2.8rem;*/\n  padding: 4px 0;\n  background: -webkit-linear-gradient(#ffd34e, #b5873a);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\n.account_panel .grid .col > button .price p, .account_panel .grid .col > button .price p p {\n  /*font-size: 20px;\n  font-size: 2rem;*/\n}\n\n.account_panel .grid .col .panel_right {\n  padding: 4px 0;\n  cursor: pointer;\n}\n\n.account_panel .grid .col .panel_right .icon_download {\n  /*font-size: 26px;*/\n  color: #cf8305;\n  margin-top: 8px;\n}\n\n.account_panel .grid .col .panel_right .account_content {\n  color: #cf8305;\n  text-transform: uppercase;\n}\n\n.account_panel .grid .col .panel_right .account_content .head {\n  /*font-size: 16px;\n  font-size: 1.6rem;*/\n  color: #f4f4f4;\n  padding-left: 6px;\n}\n\n.account_panel .grid .col .panel_right .account_content .sub {\n  /*font-size: 13px;\n  font-size: 1.3rem;*/\n  padding-left: 6px;\n  color: #cf8305;\n}\n\n.account_panel .amazon_box {\n  padding: 10px;\n  background-color: #000;\n}\n\n.account_panel .amazon_box p {\n  color: #cf8305;\n  text-align: center;\n  /*font-size: 12px;\n  font-size: 1.2rem;*/\n}\n\n.account_panel .amazon_box .amz {\n  width: 50%;\n  display: inline-block;\n}\n.dark-theme ion-page, .dark-theme ion-page ion-content ion-scroll.content {\n  background: #000;\n}"; }
}

export { ActionSheet as IonActionSheet, CardHeader as IonCardHeader, Dashboard as DashBoard, SGEventsMini as SgEventsMini, BalanceInfo, WalletMini, WalletBalance };
