/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import './chunk1.js';
import { domControllerAsync, playAnimationAsync } from './chunk2.js';
import { createThemedClasses } from './chunk3.js';
import { DispositionTemplate, DataValidator, S_WalletService, S_SlotService } from './chunk4.js';

const BACKDROP = 'backdrop';

/**
 * iOS Alert Enter Animation
 */
function iosEnterAnimation(Animation, baseElm) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseElm.querySelector('.alert-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.3);
    wrapperAnimation.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
    return baseAnimation
        .addElement(baseElm)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
}

/**
 * iOS Alert Leave Animation
 */
function iosLeaveAnimation(Animation, baseElm) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseElm.querySelector('.alert-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.3, 0);
    wrapperAnimation.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
    return baseAnimation
        .addElement(baseElm)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
}

/**
 * Md Alert Enter Animation
 */
function mdEnterAnimation(Animation, baseElm) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseElm.querySelector('.alert-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.5);
    wrapperAnimation.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
    return baseAnimation
        .addElement(baseElm)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
}

/**
 * Md Alert Leave Animation
 */
function mdLeaveAnimation(Animation, baseElm) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseElm.querySelector('.alert-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.5, 0);
    wrapperAnimation.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
    return baseAnimation
        .addElement(baseElm)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
}

class Alert {
    constructor() {
        /**
         * Array of buttons to be added to the alert. See AlertButton type for valid options
         */
        this.buttons = [];
        /**
         * Array of input to show in the alert. See AlertInput type for valid options
         */
        this.inputs = [];
        /**
         * If true, the alert will be dismissed when the backdrop is clicked.
         */
        this.enableBackdropDismiss = true;
        /**
         * If true, alert will become translucent. Requires support for backdrop-filters.
         */
        this.translucent = false;
        /**
         * Enable alert animations. If false, alert will not animate in
         */
        this.animate = true;
    }
    /**
     * Present the alert after is has been created
     */
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionAlertWillPresent.emit();
        this.el.style.zIndex = `${20000 + this.alertId}`;
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get("alertEnter", this.mode === "ios" ? iosEnterAnimation : mdEnterAnimation);
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
            const firstInput = this.el.querySelector("[tabindex]");
            if (firstInput) {
                firstInput.focus();
            }
            this.ionAlertDidPresent.emit();
        });
    }
    /**
     * Dismiss the alert programatically
     */
    dismiss(data, role) {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionAlertWillDismiss.emit({
            data: data,
            role: role
        });
        // get the user's animation fn if one was provided
        const animationBuilder = this.leaveAnimation || this.config.get("alertLeave", this.mode === "ios" ? iosLeaveAnimation : mdLeaveAnimation);
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            return domControllerAsync(Context.dom.write, () => {
                this.el.parentNode.removeChild(this.el);
            });
        }).then(() => {
            this.ionAlertDidDismiss.emit({
                data: data,
                role: role
            });
        });
    }
    componentDidLoad() {
        this.ionAlertDidLoad.emit();
    }
    componentDidEnter() {
        this.ionAlertDidPresent.emit();
    }
    componentDidUnload() {
        this.ionAlertDidUnload.emit();
    }
    backdropClick() {
        if (this.enableBackdropDismiss) {
            this.dismiss(null, BACKDROP);
        }
    }
    rbClick(inputIndex) {
        this.inputs = this.inputs.map((input, index) => {
            input.checked = (inputIndex === index);
            return input;
        });
        const rbButton = this.inputs[inputIndex];
        this.activeId = rbButton.id;
        if (rbButton.handler) {
            rbButton.handler(rbButton);
        }
    }
    cbClick(inputIndex) {
        this.inputs = this.inputs.map((input, index) => {
            if (inputIndex === index) {
                input.checked = !input.checked;
            }
            return input;
        });
        const cbButton = this.inputs[inputIndex];
        if (cbButton.handler) {
            cbButton.handler(cbButton);
        }
    }
    buttonClick(button) {
        let shouldDismiss = true;
        if (button.handler) {
            // a handler has been provided, execute it
            // pass the handler the values from the inputs
            if (button.handler(this.getValues()) === false) {
                // if the return value of the handler is false then do not dismiss
                shouldDismiss = false;
            }
        }
        if (shouldDismiss) {
            this.dismiss(this.getValues(), button.role);
        }
    }
    getValues() {
        if (this.inputType === "radio") {
            // this is an alert with radio buttons (single value select)
            // return the one value which is checked, otherwise undefined
            const checkedInput = this.inputs.find(i => i.checked);
            console.debug("returning", checkedInput ? checkedInput.value : undefined);
            return checkedInput ? checkedInput.value : undefined;
        }
        if (this.inputType === "checkbox") {
            // this is an alert with checkboxes (multiple value select)
            // return an array of all the checked values
            console.debug("returning", this.inputs.filter(i => i.checked).map(i => i.value));
            return this.inputs.filter(i => i.checked).map(i => i.value);
        }
        if (this.inputs.length === 0) {
            // this is an alert without any options/inputs at all
            console.debug("returning", "undefined");
            return undefined;
        }
        // this is an alert with text inputs
        // return an object of all the values with the input name as the key
        const values = {};
        this.inputs.forEach(i => {
            values[i.name] = i.value;
        });
        console.debug("returning", values);
        return values;
    }
    buttonClass(button) {
        let buttonClass = ["alert-button"];
        if (button.cssClass) {
            let customClass = button.cssClass.split(" ").filter(b => b.trim() !== "").join(" ");
            buttonClass.push(customClass);
        }
        return buttonClass.reduce((prevValue, cssClass) => {
            prevValue[cssClass] = true;
            return prevValue;
        }, {});
    }
    renderCheckbox(inputs) {
        if (inputs.length === 0)
            return null;
        return (h("div", { class: "alert-checkbox-group" }, inputs.map((i, index) => (h("button", { onClick: () => this.cbClick(index), "aria-checked": i.checked, id: i.id, disabled: i.disabled, tabIndex: 0, role: "checkbox", class: "alert-tappable alert-checkbox alert-checkbox-button" }, h("div", { class: "button-inner" }, h("div", { class: "alert-checkbox-icon" }, h("div", { class: "alert-checkbox-inner" })), h("div", { class: "alert-checkbox-label" }, i.label)))))));
    }
    renderRadio(inputs) {
        if (inputs.length === 0)
            return null;
        return (h("div", { class: "alert-radio-group", role: "radiogroup", "aria-labelledby": this.hdrId, "aria-activedescendant": this.activeId }, inputs.map((i, index) => (h("button", { onClick: () => this.rbClick(index), "aria-checked": i.checked, disabled: i.disabled, id: i.id, tabIndex: 0, class: "alert-radio-button alert-tappable alert-radio", role: "radio" }, h("div", { class: "button-inner" }, h("div", { class: "alert-radio-icon" }, h("div", { class: "alert-radio-inner" })), h("div", { class: "alert-radio-label" }, i.label)))))));
    }
    renderInput(inputs) {
        if (inputs.length === 0)
            return null;
        return (h("div", { class: "alert-input-group" }, inputs.map(i => (h("div", { class: "alert-input-wrapper" }, h("input", { placeholder: i.placeholder, value: i.value, type: i.type, min: i.min, max: i.max, id: i.id, disabled: i.disabled, tabIndex: 0, class: "alert-input" }))))));
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, "alert-translucent") : {};
        const hostClasses = Object.assign({}, themedClasses);
        return {
            class: hostClasses,
            id: this.alertId
        };
    }
    render() {
        const hdrId = `${this.alertId}-hdr`;
        const subHdrId = `${this.alertId}-sub-hdr`;
        const msgId = `${this.alertId}-msg`;
        if (this.cssClass) {
            this.cssClass.split(" ").forEach(cssClass => {
                if (cssClass.trim() !== "")
                    this.el.classList.add(cssClass);
            });
        }
        if (this.title || !this.subTitle) {
            this.hdrId = hdrId;
        }
        else if (this.subTitle) {
            this.hdrId = subHdrId;
        }
        const alertButtonGroupClass = {
            "alert-button-group": true,
            "alert-button-group-vertical": this.buttons.length > 2
        };
        const buttons = this.buttons
            .map(b => {
            if (typeof b === "string") {
                b = { text: b };
            }
            return b;
        })
            .filter(b => b !== null);
        // An alert can be created with several different inputs. Radios,
        // checkboxes and inputs are all accepted, but they cannot be mixed.
        const inputTypes = [];
        this.inputs = this.inputs
            .map((i, index) => {
            let r = {
                type: i.type || "text",
                name: i.name ? i.name : index + "",
                placeholder: i.placeholder ? i.placeholder : "",
                value: i.value ? i.value : "",
                label: i.label,
                checked: !!i.checked,
                disabled: !!i.disabled,
                id: i.id ? i.id : `alert-input-${this.alertId}-${index}`,
                handler: i.handler ? i.handler : null,
                min: i.min ? i.min : null,
                max: i.max ? i.max : null
            };
            return r;
        })
            .filter(i => i !== null);
        this.inputs.forEach(i => {
            if (inputTypes.indexOf(i.type) < 0) {
                inputTypes.push(i.type);
            }
        });
        if (inputTypes.length > 1 && (inputTypes.indexOf("checkbox") > -1 || inputTypes.indexOf("radio") > -1)) {
            console.warn(`Alert cannot mix input types: ${(inputTypes.join("/"))}. Please see alert docs for more info.`);
        }
        this.inputType = inputTypes.length ? inputTypes[0] : null;
        return [
            h("ion-backdrop", { onClick: this.backdropClick.bind(this), class: "alert-backdrop" }),
            h("div", { class: "alert-wrapper" }, h("div", { class: "alert-head" }, this.title
                ? h("h2", { id: hdrId, class: "alert-title" }, this.title)
                : null, this.subTitle
                ? h("h2", { id: subHdrId, class: "alert-sub-title" }, this.subTitle)
                : null), h("div", { id: msgId, class: "alert-message", innerHTML: this.message }), (() => {
                switch (this.inputType) {
                    case "checkbox":
                        return this.renderCheckbox(this.inputs);
                    case "radio":
                        return this.renderRadio(this.inputs);
                    default:
                        return this.renderInput(this.inputs);
                }
            })(), h("div", { class: alertButtonGroupClass }, buttons.map(b => h("button", { class: this.buttonClass(b), tabIndex: 0, onClick: () => this.buttonClick(b) }, h("span", { class: "button-inner" }, b.text)))))
        ];
    }
}
Alert.is = "ion-alert";
Alert.host = { "theme": "alert" };
Alert.properties = { "animate": { "type": Boolean, "attr": "animate" }, "animationCtrl": { "connect": "ion-animation-controller" }, "buttons": { "type": "Any", "attr": "buttons" }, "config": { "context": "config" }, "cssClass": { "type": String, "attr": "css-class" }, "dismiss": { "method": true }, "el": { "elementRef": true }, "enableBackdropDismiss": { "type": Boolean, "attr": "enable-backdrop-dismiss" }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "inputs": { "type": "Any", "attr": "inputs", "mutable": true }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "message": { "type": String, "attr": "message" }, "present": { "method": true }, "subTitle": { "type": String, "attr": "sub-title" }, "title": { "type": String, "attr": "title" }, "translucent": { "type": Boolean, "attr": "translucent" } };
Alert.events = [{ "name": "ionAlertDidDismiss", "method": "ionAlertDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionAlertDidLoad", "method": "ionAlertDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionAlertDidPresent", "method": "ionAlertDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionAlertDidUnload", "method": "ionAlertDidUnload", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionAlertWillDismiss", "method": "ionAlertWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionAlertWillPresent", "method": "ionAlertWillPresent", "bubbles": true, "cancelable": true, "composed": true }];
Alert.style = "ion-alert {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  contain: strict;\n}\n\nion-alert.alert-top {\n  padding-top: 50px;\n  align-items: flex-start;\n}\n\nion-alert input {\n  width: 100%;\n}\n\n.alert-wrapper {\n  z-index: 10;\n  display: flex;\n  flex-direction: column;\n  min-width: 250px;\n  max-height: 90%;\n  opacity: 0;\n  contain: content;\n}\n\n.alert-title {\n  margin: 0;\n  padding: 0;\n}\n\n.alert-sub-title {\n  margin: 5px 0 0;\n  padding: 0;\n  font-weight: normal;\n}\n\n.alert-message {\n  overflow-y: scroll;\n  -webkit-overflow-scrolling: touch;\n}\n\n.alert-input {\n  padding: 10px 0;\n  border: 0;\n  background: inherit;\n}\n\n.alert-input::-moz-placeholder {\n  color: #999;\n}\n\n.alert-input:-ms-input-placeholder {\n  color: #999;\n}\n\n.alert-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: #999;\n}\n\n.alert-button-group {\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n}\n\n.alert-button-group-vertical {\n  flex-direction: column;\n  flex-wrap: nowrap;\n}\n\n.alert-button {\n  margin: 0;\n  z-index: 0;\n  display: block;\n  font-size: 14px;\n  line-height: 20px;\n}\n\n.alert-tappable {\n  text-align: left;\n  text-align: start;\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  font-size: inherit;\n  line-height: initial;\n  background: transparent;\n}\n\n.alert-ios .alert-wrapper {\n  border-radius: 13px;\n  overflow: hidden;\n  max-width: 270px;\n  background-color: #f8f8f8;\n  box-shadow: none;\n}\n\n.alert-translucent-ios .alert-wrapper {\n  background: rgba(248, 248, 248, 0.88);\n  backdrop-filter: saturate(180%) blur(20px);\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n}\n\n.alert-ios .alert-head {\n  text-align: center;\n  padding: 12px 16px 7px;\n}\n\n.alert-ios .alert-title {\n  margin-top: 8px;\n  font-size: 17px;\n  font-weight: 600;\n}\n\n.alert-ios .alert-sub-title {\n  font-size: 14px;\n  color: #666;\n}\n\n.alert-ios .alert-message,\n.alert-ios .alert-input-group {\n  padding: 0 16px 21px;\n  text-align: center;\n  font-size: 13px;\n  color: inherit;\n}\n\n.alert-ios .alert-message {\n  max-height: 240px;\n}\n\n.alert-ios .alert-message:empty {\n  padding: 0 0 12px;\n}\n\n.alert-ios .alert-input {\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n  border-radius: 4px;\n  margin-top: 10px;\n  padding: 6px;\n  border: 0.55px solid #ccc;\n  background-color: #fff;\n}\n\n.alert-ios .alert-radio-group,\n.alert-ios .alert-checkbox-group {\n  overflow: scroll;\n  max-height: 240px;\n  border-top: 0.55px solid rgba(0, 0, 0, 0.1);\n  -webkit-overflow-scrolling: touch;\n}\n\n.alert-ios .alert-tappable {\n  display: flex;\n  min-height: 44px;\n}\n\n.alert-ios .alert-radio-label {\n  padding: 13px;\n  overflow: hidden;\n  flex: 1;\n  order: 0;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: initial;\n}\n\n.alert-ios [aria-checked=true] .alert-radio-label {\n  color: #488aff;\n}\n\n.alert-ios .alert-radio-icon {\n  position: relative;\n  order: 1;\n  min-width: 30px;\n}\n\n.alert-ios [aria-checked=true] .alert-radio-inner {\n  left: 7px;\n  top: -7px;\n  position: absolute;\n  width: 6px;\n  height: 12px;\n  border-width: 2px;\n  border-top-width: 0;\n  border-left-width: 0;\n  border-style: solid;\n  border-color: #488aff;\n  transform: rotate(45deg);\n}\n\n.alert-ios .alert-checkbox-label {\n  padding: 13px;\n  overflow: hidden;\n  flex: 1;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: initial;\n}\n\n.alert-ios [aria-checked=true] .alert-checkbox-label {\n  color: initial;\n}\n\n.alert-ios .alert-checkbox-icon {\n  border-radius: 50%;\n  margin: 10px 6px 10px 16px;\n  position: relative;\n  width: 21px;\n  height: 21px;\n  border-width: 0.55px;\n  border-style: solid;\n  border-color: #c8c7cc;\n  background-color: #fff;\n}\n\n.alert-ios [aria-checked=true] .alert-checkbox-icon {\n  border-color: #488aff;\n  background-color: #488aff;\n}\n\n.alert-ios [aria-checked=true] .alert-checkbox-inner {\n  left: 7px;\n  top: 4px;\n  position: absolute;\n  width: 4px;\n  height: 9px;\n  border-width: 0.55px;\n  border-top-width: 0;\n  border-left-width: 0;\n  border-style: solid;\n  border-color: #fff;\n  transform: rotate(45deg);\n}\n\n.alert-ios .alert-button-group {\n  margin-right: -0.55px;\n  flex-wrap: wrap;\n}\n\n.alert-ios .alert-button {\n  margin: 0;\n  border-radius: 0;\n  overflow: hidden;\n  flex: 1 1 auto;\n  min-width: 50%;\n  height: 44px;\n  border-top: 0.55px solid rgba(0, 0, 0, 0.1);\n  border-right: 0.55px solid rgba(0, 0, 0, 0.1);\n  font-size: 17px;\n  color: #488aff;\n  background-color: transparent;\n}\n\n.alert-ios .alert-button:last-child {\n  border-right: 0;\n  font-weight: bold;\n}\n\n.alert-ios .alert-button.activated {\n  background-color: rgba(115, 115, 115, 0.1);\n}";
Alert.styleMode = "ios";

class AlertController {
    constructor() {
        this.ids = 0;
        this.alertResolves = {};
        this.alerts = [];
    }
    /**
     * Open an alert with a title, subTitle, and an array of buttons
     * @param {AlertOptions} opts Action sheet options
     */
    create(opts) {
        // create ionic's wrapping ion-alert component
        const alert = document.createElement("ion-alert");
        const id = this.ids++;
        // give this action sheet a unique id
        alert.alertId = `alert-${id}`;
        // convert the passed in action sheet options into props
        // that get passed down into the new action sheet
        Object.assign(alert, opts);
        // append the action sheet element to the document body
        const appRoot = document.querySelector("ion-app") || document.body;
        appRoot.appendChild(alert);
        // store the resolve function to be called later up when the action sheet loads
        return new Promise((resolve) => {
            this.alertResolves[alert.alertId] = resolve;
        });
    }
    didLoad(ev) {
        const alert = ev.target;
        const alertResolve = this.alertResolves[alert.alertId];
        if (alertResolve) {
            alertResolve(alert);
            delete this.alertResolves[alert.alertId];
        }
    }
    willPresent(event) {
        console.log("willPresent: ", event);
        this.alerts.push(event.target);
    }
    willDismiss(event) {
        console.log("willDismiss: ", event);
        const index = this.alerts.indexOf(event.target);
        if (index > -1) {
            this.alerts.splice(index, 1);
        }
    }
    escapeKeyUp() {
        const lastAlert = this.alerts[this.alerts.length - 1];
        if (lastAlert) {
            lastAlert.dismiss();
        }
    }
}
AlertController.is = "ion-alert-controller";
AlertController.properties = { "create": { "method": true } };

class Card {
    render() {
        return h("slot", null);
    }
}
Card.is = "ion-card";
Card.host = { "theme": "card" };
Card.properties = { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" } };
Card.style = "ion-card {\n  position: relative;\n  display: block;\n  overflow: hidden;\n}\n\nion-card img {\n  display: block;\n  width: 100%;\n}\n\n.card-ios {\n  margin: 30px 20px;\n  border-radius: 14px;\n  width: calc(100% - 40px);\n  font-size: 14px;\n  background: #fff;\n  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.18);\n  transform: translateZ(0);\n}\n\n.card-ios ion-list {\n  margin-bottom: 0;\n}\n\n.card-ios > .item:last-child,\n.card-ios > .item:last-child .item-inner,\n.card-ios > .item-wrapper:last-child .item {\n  border-bottom: 0;\n}\n\n.card-ios .item-ios.item-block .item-inner {\n  border: 0;\n}\n\n.card .note-ios {\n  font-size: 13px;\n}\n\n.card-ios h1 {\n  margin: 0 0 2px;\n  font-size: 24px;\n  font-weight: normal;\n}\n\n.card-ios h2 {\n  margin: 2px 0;\n  font-size: 16px;\n  font-weight: normal;\n}\n\n.card-ios h3,\n.card-ios h4,\n.card-ios h5,\n.card-ios h6 {\n  margin: 2px 0;\n  font-size: 14px;\n  font-weight: normal;\n}\n\n.card-ios p {\n  margin: 0 0 2px;\n  font-size: 14px;\n  color: #666;\n}\n\n.card-ios + ion-card {\n  margin-top: 0;\n}\n\n.card-ios .text-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-primary {\n  color: #fff;\n  background-color: #488aff;\n}\n\n.card-ios-primary p {\n  color: #fff;\n}\n\n.card-ios-primary .text-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-primary .text-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-primary .text-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-primary .text-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-primary .text-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-primary .text-ios-dark {\n  color: #222;\n}\n\n.card-ios .text-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-secondary {\n  color: #fff;\n  background-color: #32db64;\n}\n\n.card-ios-secondary p {\n  color: #fff;\n}\n\n.card-ios-secondary .text-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-secondary .text-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-secondary .text-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-secondary .text-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-secondary .text-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-secondary .text-ios-dark {\n  color: #222;\n}\n\n.card-ios .text-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-warning {\n  color: #000;\n  background-color: #ffeb3b;\n}\n\n.card-ios-warning p {\n  color: #000;\n}\n\n.card-ios-warning .text-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-warning .text-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-warning .text-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-warning .text-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-warning .text-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-warning .text-ios-dark {\n  color: #222;\n}\n\n.card-ios .text-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-danger {\n  color: #fff;\n  background-color: #f53d3d;\n}\n\n.card-ios-danger p {\n  color: #fff;\n}\n\n.card-ios-danger .text-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-danger .text-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-danger .text-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-danger .text-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-danger .text-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-danger .text-ios-dark {\n  color: #222;\n}\n\n.card-ios .text-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-light {\n  color: #000;\n  background-color: #f4f4f4;\n}\n\n.card-ios-light p {\n  color: #000;\n}\n\n.card-ios-light .text-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-light .text-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-light .text-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-light .text-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-light .text-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-light .text-ios-dark {\n  color: #222;\n}\n\n.card-ios .text-ios-dark {\n  color: #222;\n}\n\n.card-ios-dark {\n  color: #fff;\n  background-color: #222;\n}\n\n.card-ios-dark p {\n  color: #fff;\n}\n\n.card-ios-dark .text-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-dark .text-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-dark .text-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-dark .text-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-dark .text-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-dark .text-ios-dark {\n  color: #222;\n}";
Card.styleMode = "ios";

class CardContent {
    render() {
        return h("slot", null);
    }
}
CardContent.is = "ion-card-content";
CardContent.host = { "theme": "card-content" };
CardContent.properties = { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" } };
CardContent.style = "ion-card-content {\n  position: relative;\n  display: block;\n}\n\n.card-content-ios {\n  padding: 20px;\n  font-size: 16px;\n  line-height: 1.4;\n}\n\n.card-ios-primary .card-content-ios {\n  color: #fff;\n}\n\n.card-ios-primary .card-content-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-primary .card-content-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-primary .card-content-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-primary .card-content-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-primary .card-content-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-primary .card-content-ios-dark {\n  color: #222;\n}\n\n.card-content-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-secondary .card-content-ios {\n  color: #fff;\n}\n\n.card-ios-secondary .card-content-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-secondary .card-content-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-secondary .card-content-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-secondary .card-content-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-secondary .card-content-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-secondary .card-content-ios-dark {\n  color: #222;\n}\n\n.card-content-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-warning .card-content-ios {\n  color: #000;\n}\n\n.card-ios-warning .card-content-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-warning .card-content-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-warning .card-content-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-warning .card-content-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-warning .card-content-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-warning .card-content-ios-dark {\n  color: #222;\n}\n\n.card-content-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-danger .card-content-ios {\n  color: #fff;\n}\n\n.card-ios-danger .card-content-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-danger .card-content-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-danger .card-content-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-danger .card-content-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-danger .card-content-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-danger .card-content-ios-dark {\n  color: #222;\n}\n\n.card-content-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-light .card-content-ios {\n  color: #000;\n}\n\n.card-ios-light .card-content-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-light .card-content-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-light .card-content-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-light .card-content-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-light .card-content-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-light .card-content-ios-dark {\n  color: #222;\n}\n\n.card-content-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-dark .card-content-ios {\n  color: #fff;\n}\n\n.card-ios-dark .card-content-ios-primary {\n  color: #488aff;\n}\n\n.card-ios-dark .card-content-ios-secondary {\n  color: #32db64;\n}\n\n.card-ios-dark .card-content-ios-warning {\n  color: #ffeb3b;\n}\n\n.card-ios-dark .card-content-ios-danger {\n  color: #f53d3d;\n}\n\n.card-ios-dark .card-content-ios-light {\n  color: #f4f4f4;\n}\n\n.card-ios-dark .card-content-ios-dark {\n  color: #222;\n}\n\n.card-content-ios-dark {\n  color: #222;\n}";
CardContent.styleMode = "ios";

class Grid {
}
Grid.is = "ion-grid";
Grid.style = "ion-grid {\n  padding: 5px;\n  margin-left: auto;\n  margin-right: auto;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n}\n\nion-grid[no-padding] {\n  padding: 0;\n}\n\nion-grid[no-padding] > ion-row > ion-col {\n  padding: 0;\n}\n\n\@media (min-width: 576px) {\n  ion-grid[fixed] {\n    width: 540px;\n    max-width: 100%;\n  }\n}\n\n\@media (min-width: 768px) {\n  ion-grid[fixed] {\n    width: 720px;\n    max-width: 100%;\n  }\n}\n\n\@media (min-width: 992px) {\n  ion-grid[fixed] {\n    width: 960px;\n    max-width: 100%;\n  }\n}\n\n\@media (min-width: 1200px) {\n  ion-grid[fixed] {\n    width: 1140px;\n    max-width: 100%;\n  }\n}\n\nion-row {\n  display: flex;\n  flex-wrap: wrap;\n}\n\nion-row[nowrap] {\n  flex-wrap: nowrap;\n}\n\nion-row[wrap-reverse] {\n  flex-wrap: wrap-reverse;\n}\n\nion-row[align-items-start] {\n  align-items: flex-start;\n}\n\nion-row[align-items-center] {\n  align-items: center;\n}\n\nion-row[align-items-end] {\n  align-items: flex-end;\n}\n\nion-row[align-items-stretch] {\n  align-items: stretch;\n}\n\nion-row[align-items-baseline] {\n  align-items: baseline;\n}\n\nion-row[justify-content-start] {\n  justify-content: flex-start;\n}\n\nion-row[justify-content-center] {\n  justify-content: center;\n}\n\nion-row[justify-content-end] {\n  justify-content: flex-end;\n}\n\nion-row[justify-content-around] {\n  justify-content: space-around;\n}\n\nion-row[justify-content-between] {\n  justify-content: space-between;\n}\n\nion-col {\n  margin: 0;\n  padding: 5px;\n  position: relative;\n  width: 100%;\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  min-height: 1px;\n}\n\nion-col[align-self-start] {\n  align-self: flex-start;\n}\n\nion-col[align-self-end] {\n  align-self: flex-end;\n}\n\nion-col[align-self-center] {\n  align-self: center;\n}\n\nion-col[align-self-stretch] {\n  align-self: stretch;\n}\n\nion-col[align-self-baseline] {\n  align-self: baseline;\n}\n\n[col-1] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-1] {\n    padding: 5px;\n  }\n}\n\n[col-2] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-2] {\n    padding: 5px;\n  }\n}\n\n[col-3] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-3] {\n    padding: 5px;\n  }\n}\n\n[col-4] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-4] {\n    padding: 5px;\n  }\n}\n\n[col-5] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-5] {\n    padding: 5px;\n  }\n}\n\n[col-6] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-6] {\n    padding: 5px;\n  }\n}\n\n[col-7] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-7] {\n    padding: 5px;\n  }\n}\n\n[col-8] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-8] {\n    padding: 5px;\n  }\n}\n\n[col-9] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-9] {\n    padding: 5px;\n  }\n}\n\n[col-10] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-10] {\n    padding: 5px;\n  }\n}\n\n[col-11] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-11] {\n    padding: 5px;\n  }\n}\n\n[col-12] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-12] {\n    padding: 5px;\n  }\n}\n\n[col] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col] {\n    padding: 5px;\n  }\n}\n\n[col] {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n}\n\n[col-auto] {\n  flex: 0 0 auto;\n  width: auto;\n}\n\n[col-1] {\n  flex: 0 0 8.33333%;\n  width: 8.33333%;\n  max-width: 8.33333%;\n}\n\n[col-2] {\n  flex: 0 0 16.66667%;\n  width: 16.66667%;\n  max-width: 16.66667%;\n}\n\n[col-3] {\n  flex: 0 0 25%;\n  width: 25%;\n  max-width: 25%;\n}\n\n[col-4] {\n  flex: 0 0 33.33333%;\n  width: 33.33333%;\n  max-width: 33.33333%;\n}\n\n[col-5] {\n  flex: 0 0 41.66667%;\n  width: 41.66667%;\n  max-width: 41.66667%;\n}\n\n[col-6] {\n  flex: 0 0 50%;\n  width: 50%;\n  max-width: 50%;\n}\n\n[col-7] {\n  flex: 0 0 58.33333%;\n  width: 58.33333%;\n  max-width: 58.33333%;\n}\n\n[col-8] {\n  flex: 0 0 66.66667%;\n  width: 66.66667%;\n  max-width: 66.66667%;\n}\n\n[col-9] {\n  flex: 0 0 75%;\n  width: 75%;\n  max-width: 75%;\n}\n\n[col-10] {\n  flex: 0 0 83.33333%;\n  width: 83.33333%;\n  max-width: 83.33333%;\n}\n\n[col-11] {\n  flex: 0 0 91.66667%;\n  width: 91.66667%;\n  max-width: 91.66667%;\n}\n\n[col-12] {\n  flex: 0 0 100%;\n  width: 100%;\n  max-width: 100%;\n}\n\n[pull-0] {\n  right: auto;\n}\n\n[pull-1] {\n  right: 8.33333%;\n}\n\n[pull-2] {\n  right: 16.66667%;\n}\n\n[pull-3] {\n  right: 25%;\n}\n\n[pull-4] {\n  right: 33.33333%;\n}\n\n[pull-5] {\n  right: 41.66667%;\n}\n\n[pull-6] {\n  right: 50%;\n}\n\n[pull-7] {\n  right: 58.33333%;\n}\n\n[pull-8] {\n  right: 66.66667%;\n}\n\n[pull-9] {\n  right: 75%;\n}\n\n[pull-10] {\n  right: 83.33333%;\n}\n\n[pull-11] {\n  right: 91.66667%;\n}\n\n[pull-12] {\n  right: 100%;\n}\n\n[push-0] {\n  left: auto;\n}\n\n[push-1] {\n  left: 8.33333%;\n}\n\n[push-2] {\n  left: 16.66667%;\n}\n\n[push-3] {\n  left: 25%;\n}\n\n[push-4] {\n  left: 33.33333%;\n}\n\n[push-5] {\n  left: 41.66667%;\n}\n\n[push-6] {\n  left: 50%;\n}\n\n[push-7] {\n  left: 58.33333%;\n}\n\n[push-8] {\n  left: 66.66667%;\n}\n\n[push-9] {\n  left: 75%;\n}\n\n[push-10] {\n  left: 83.33333%;\n}\n\n[push-11] {\n  left: 91.66667%;\n}\n\n[push-12] {\n  left: 100%;\n}\n\n[offset-1] {\n  margin-left: 8.33333%;\n}\n\n[offset-2] {\n  margin-left: 16.66667%;\n}\n\n[offset-3] {\n  margin-left: 25%;\n}\n\n[offset-4] {\n  margin-left: 33.33333%;\n}\n\n[offset-5] {\n  margin-left: 41.66667%;\n}\n\n[offset-6] {\n  margin-left: 50%;\n}\n\n[offset-7] {\n  margin-left: 58.33333%;\n}\n\n[offset-8] {\n  margin-left: 66.66667%;\n}\n\n[offset-9] {\n  margin-left: 75%;\n}\n\n[offset-10] {\n  margin-left: 83.33333%;\n}\n\n[offset-11] {\n  margin-left: 91.66667%;\n}\n\n[col-sm-1] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-1] {\n    padding: 5px;\n  }\n}\n\n[col-sm-2] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-2] {\n    padding: 5px;\n  }\n}\n\n[col-sm-3] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-3] {\n    padding: 5px;\n  }\n}\n\n[col-sm-4] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-4] {\n    padding: 5px;\n  }\n}\n\n[col-sm-5] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-5] {\n    padding: 5px;\n  }\n}\n\n[col-sm-6] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-6] {\n    padding: 5px;\n  }\n}\n\n[col-sm-7] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-7] {\n    padding: 5px;\n  }\n}\n\n[col-sm-8] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-8] {\n    padding: 5px;\n  }\n}\n\n[col-sm-9] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-9] {\n    padding: 5px;\n  }\n}\n\n[col-sm-10] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-10] {\n    padding: 5px;\n  }\n}\n\n[col-sm-11] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-11] {\n    padding: 5px;\n  }\n}\n\n[col-sm-12] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm-12] {\n    padding: 5px;\n  }\n}\n\n[col-sm] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-sm] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-sm] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-sm] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-sm] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 576px) {\n  [col-sm] {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%;\n  }\n  [col-sm-auto] {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  [col-sm-1] {\n    flex: 0 0 8.33333%;\n    width: 8.33333%;\n    max-width: 8.33333%;\n  }\n  [col-sm-2] {\n    flex: 0 0 16.66667%;\n    width: 16.66667%;\n    max-width: 16.66667%;\n  }\n  [col-sm-3] {\n    flex: 0 0 25%;\n    width: 25%;\n    max-width: 25%;\n  }\n  [col-sm-4] {\n    flex: 0 0 33.33333%;\n    width: 33.33333%;\n    max-width: 33.33333%;\n  }\n  [col-sm-5] {\n    flex: 0 0 41.66667%;\n    width: 41.66667%;\n    max-width: 41.66667%;\n  }\n  [col-sm-6] {\n    flex: 0 0 50%;\n    width: 50%;\n    max-width: 50%;\n  }\n  [col-sm-7] {\n    flex: 0 0 58.33333%;\n    width: 58.33333%;\n    max-width: 58.33333%;\n  }\n  [col-sm-8] {\n    flex: 0 0 66.66667%;\n    width: 66.66667%;\n    max-width: 66.66667%;\n  }\n  [col-sm-9] {\n    flex: 0 0 75%;\n    width: 75%;\n    max-width: 75%;\n  }\n  [col-sm-10] {\n    flex: 0 0 83.33333%;\n    width: 83.33333%;\n    max-width: 83.33333%;\n  }\n  [col-sm-11] {\n    flex: 0 0 91.66667%;\n    width: 91.66667%;\n    max-width: 91.66667%;\n  }\n  [col-sm-12] {\n    flex: 0 0 100%;\n    width: 100%;\n    max-width: 100%;\n  }\n  [pull-sm-0] {\n    right: auto;\n  }\n  [pull-sm-1] {\n    right: 8.33333%;\n  }\n  [pull-sm-2] {\n    right: 16.66667%;\n  }\n  [pull-sm-3] {\n    right: 25%;\n  }\n  [pull-sm-4] {\n    right: 33.33333%;\n  }\n  [pull-sm-5] {\n    right: 41.66667%;\n  }\n  [pull-sm-6] {\n    right: 50%;\n  }\n  [pull-sm-7] {\n    right: 58.33333%;\n  }\n  [pull-sm-8] {\n    right: 66.66667%;\n  }\n  [pull-sm-9] {\n    right: 75%;\n  }\n  [pull-sm-10] {\n    right: 83.33333%;\n  }\n  [pull-sm-11] {\n    right: 91.66667%;\n  }\n  [pull-sm-12] {\n    right: 100%;\n  }\n  [push-sm-0] {\n    left: auto;\n  }\n  [push-sm-1] {\n    left: 8.33333%;\n  }\n  [push-sm-2] {\n    left: 16.66667%;\n  }\n  [push-sm-3] {\n    left: 25%;\n  }\n  [push-sm-4] {\n    left: 33.33333%;\n  }\n  [push-sm-5] {\n    left: 41.66667%;\n  }\n  [push-sm-6] {\n    left: 50%;\n  }\n  [push-sm-7] {\n    left: 58.33333%;\n  }\n  [push-sm-8] {\n    left: 66.66667%;\n  }\n  [push-sm-9] {\n    left: 75%;\n  }\n  [push-sm-10] {\n    left: 83.33333%;\n  }\n  [push-sm-11] {\n    left: 91.66667%;\n  }\n  [push-sm-12] {\n    left: 100%;\n  }\n  [offset-sm-0] {\n    margin-left: 0%;\n  }\n  [offset-sm-1] {\n    margin-left: 8.33333%;\n  }\n  [offset-sm-2] {\n    margin-left: 16.66667%;\n  }\n  [offset-sm-3] {\n    margin-left: 25%;\n  }\n  [offset-sm-4] {\n    margin-left: 33.33333%;\n  }\n  [offset-sm-5] {\n    margin-left: 41.66667%;\n  }\n  [offset-sm-6] {\n    margin-left: 50%;\n  }\n  [offset-sm-7] {\n    margin-left: 58.33333%;\n  }\n  [offset-sm-8] {\n    margin-left: 66.66667%;\n  }\n  [offset-sm-9] {\n    margin-left: 75%;\n  }\n  [offset-sm-10] {\n    margin-left: 83.33333%;\n  }\n  [offset-sm-11] {\n    margin-left: 91.66667%;\n  }\n}\n\n[col-md-1] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-1] {\n    padding: 5px;\n  }\n}\n\n[col-md-2] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-2] {\n    padding: 5px;\n  }\n}\n\n[col-md-3] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-3] {\n    padding: 5px;\n  }\n}\n\n[col-md-4] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-4] {\n    padding: 5px;\n  }\n}\n\n[col-md-5] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-5] {\n    padding: 5px;\n  }\n}\n\n[col-md-6] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-6] {\n    padding: 5px;\n  }\n}\n\n[col-md-7] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-7] {\n    padding: 5px;\n  }\n}\n\n[col-md-8] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-8] {\n    padding: 5px;\n  }\n}\n\n[col-md-9] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-9] {\n    padding: 5px;\n  }\n}\n\n[col-md-10] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-10] {\n    padding: 5px;\n  }\n}\n\n[col-md-11] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-11] {\n    padding: 5px;\n  }\n}\n\n[col-md-12] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md-12] {\n    padding: 5px;\n  }\n}\n\n[col-md] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-md] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-md] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-md] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-md] {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%;\n  }\n  [col-md-auto] {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  [col-md-1] {\n    flex: 0 0 8.33333%;\n    width: 8.33333%;\n    max-width: 8.33333%;\n  }\n  [col-md-2] {\n    flex: 0 0 16.66667%;\n    width: 16.66667%;\n    max-width: 16.66667%;\n  }\n  [col-md-3] {\n    flex: 0 0 25%;\n    width: 25%;\n    max-width: 25%;\n  }\n  [col-md-4] {\n    flex: 0 0 33.33333%;\n    width: 33.33333%;\n    max-width: 33.33333%;\n  }\n  [col-md-5] {\n    flex: 0 0 41.66667%;\n    width: 41.66667%;\n    max-width: 41.66667%;\n  }\n  [col-md-6] {\n    flex: 0 0 50%;\n    width: 50%;\n    max-width: 50%;\n  }\n  [col-md-7] {\n    flex: 0 0 58.33333%;\n    width: 58.33333%;\n    max-width: 58.33333%;\n  }\n  [col-md-8] {\n    flex: 0 0 66.66667%;\n    width: 66.66667%;\n    max-width: 66.66667%;\n  }\n  [col-md-9] {\n    flex: 0 0 75%;\n    width: 75%;\n    max-width: 75%;\n  }\n  [col-md-10] {\n    flex: 0 0 83.33333%;\n    width: 83.33333%;\n    max-width: 83.33333%;\n  }\n  [col-md-11] {\n    flex: 0 0 91.66667%;\n    width: 91.66667%;\n    max-width: 91.66667%;\n  }\n  [col-md-12] {\n    flex: 0 0 100%;\n    width: 100%;\n    max-width: 100%;\n  }\n  [pull-md-0] {\n    right: auto;\n  }\n  [pull-md-1] {\n    right: 8.33333%;\n  }\n  [pull-md-2] {\n    right: 16.66667%;\n  }\n  [pull-md-3] {\n    right: 25%;\n  }\n  [pull-md-4] {\n    right: 33.33333%;\n  }\n  [pull-md-5] {\n    right: 41.66667%;\n  }\n  [pull-md-6] {\n    right: 50%;\n  }\n  [pull-md-7] {\n    right: 58.33333%;\n  }\n  [pull-md-8] {\n    right: 66.66667%;\n  }\n  [pull-md-9] {\n    right: 75%;\n  }\n  [pull-md-10] {\n    right: 83.33333%;\n  }\n  [pull-md-11] {\n    right: 91.66667%;\n  }\n  [pull-md-12] {\n    right: 100%;\n  }\n  [push-md-0] {\n    left: auto;\n  }\n  [push-md-1] {\n    left: 8.33333%;\n  }\n  [push-md-2] {\n    left: 16.66667%;\n  }\n  [push-md-3] {\n    left: 25%;\n  }\n  [push-md-4] {\n    left: 33.33333%;\n  }\n  [push-md-5] {\n    left: 41.66667%;\n  }\n  [push-md-6] {\n    left: 50%;\n  }\n  [push-md-7] {\n    left: 58.33333%;\n  }\n  [push-md-8] {\n    left: 66.66667%;\n  }\n  [push-md-9] {\n    left: 75%;\n  }\n  [push-md-10] {\n    left: 83.33333%;\n  }\n  [push-md-11] {\n    left: 91.66667%;\n  }\n  [push-md-12] {\n    left: 100%;\n  }\n  [offset-md-0] {\n    margin-left: 0%;\n  }\n  [offset-md-1] {\n    margin-left: 8.33333%;\n  }\n  [offset-md-2] {\n    margin-left: 16.66667%;\n  }\n  [offset-md-3] {\n    margin-left: 25%;\n  }\n  [offset-md-4] {\n    margin-left: 33.33333%;\n  }\n  [offset-md-5] {\n    margin-left: 41.66667%;\n  }\n  [offset-md-6] {\n    margin-left: 50%;\n  }\n  [offset-md-7] {\n    margin-left: 58.33333%;\n  }\n  [offset-md-8] {\n    margin-left: 66.66667%;\n  }\n  [offset-md-9] {\n    margin-left: 75%;\n  }\n  [offset-md-10] {\n    margin-left: 83.33333%;\n  }\n  [offset-md-11] {\n    margin-left: 91.66667%;\n  }\n}\n\n[col-lg-1] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-1] {\n    padding: 5px;\n  }\n}\n\n[col-lg-2] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-2] {\n    padding: 5px;\n  }\n}\n\n[col-lg-3] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-3] {\n    padding: 5px;\n  }\n}\n\n[col-lg-4] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-4] {\n    padding: 5px;\n  }\n}\n\n[col-lg-5] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-5] {\n    padding: 5px;\n  }\n}\n\n[col-lg-6] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-6] {\n    padding: 5px;\n  }\n}\n\n[col-lg-7] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-7] {\n    padding: 5px;\n  }\n}\n\n[col-lg-8] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-8] {\n    padding: 5px;\n  }\n}\n\n[col-lg-9] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-9] {\n    padding: 5px;\n  }\n}\n\n[col-lg-10] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-10] {\n    padding: 5px;\n  }\n}\n\n[col-lg-11] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-11] {\n    padding: 5px;\n  }\n}\n\n[col-lg-12] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg-12] {\n    padding: 5px;\n  }\n}\n\n[col-lg] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-lg] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-lg] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-lg] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-lg] {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%;\n  }\n  [col-lg-auto] {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  [col-lg-1] {\n    flex: 0 0 8.33333%;\n    width: 8.33333%;\n    max-width: 8.33333%;\n  }\n  [col-lg-2] {\n    flex: 0 0 16.66667%;\n    width: 16.66667%;\n    max-width: 16.66667%;\n  }\n  [col-lg-3] {\n    flex: 0 0 25%;\n    width: 25%;\n    max-width: 25%;\n  }\n  [col-lg-4] {\n    flex: 0 0 33.33333%;\n    width: 33.33333%;\n    max-width: 33.33333%;\n  }\n  [col-lg-5] {\n    flex: 0 0 41.66667%;\n    width: 41.66667%;\n    max-width: 41.66667%;\n  }\n  [col-lg-6] {\n    flex: 0 0 50%;\n    width: 50%;\n    max-width: 50%;\n  }\n  [col-lg-7] {\n    flex: 0 0 58.33333%;\n    width: 58.33333%;\n    max-width: 58.33333%;\n  }\n  [col-lg-8] {\n    flex: 0 0 66.66667%;\n    width: 66.66667%;\n    max-width: 66.66667%;\n  }\n  [col-lg-9] {\n    flex: 0 0 75%;\n    width: 75%;\n    max-width: 75%;\n  }\n  [col-lg-10] {\n    flex: 0 0 83.33333%;\n    width: 83.33333%;\n    max-width: 83.33333%;\n  }\n  [col-lg-11] {\n    flex: 0 0 91.66667%;\n    width: 91.66667%;\n    max-width: 91.66667%;\n  }\n  [col-lg-12] {\n    flex: 0 0 100%;\n    width: 100%;\n    max-width: 100%;\n  }\n  [pull-lg-0] {\n    right: auto;\n  }\n  [pull-lg-1] {\n    right: 8.33333%;\n  }\n  [pull-lg-2] {\n    right: 16.66667%;\n  }\n  [pull-lg-3] {\n    right: 25%;\n  }\n  [pull-lg-4] {\n    right: 33.33333%;\n  }\n  [pull-lg-5] {\n    right: 41.66667%;\n  }\n  [pull-lg-6] {\n    right: 50%;\n  }\n  [pull-lg-7] {\n    right: 58.33333%;\n  }\n  [pull-lg-8] {\n    right: 66.66667%;\n  }\n  [pull-lg-9] {\n    right: 75%;\n  }\n  [pull-lg-10] {\n    right: 83.33333%;\n  }\n  [pull-lg-11] {\n    right: 91.66667%;\n  }\n  [pull-lg-12] {\n    right: 100%;\n  }\n  [push-lg-0] {\n    left: auto;\n  }\n  [push-lg-1] {\n    left: 8.33333%;\n  }\n  [push-lg-2] {\n    left: 16.66667%;\n  }\n  [push-lg-3] {\n    left: 25%;\n  }\n  [push-lg-4] {\n    left: 33.33333%;\n  }\n  [push-lg-5] {\n    left: 41.66667%;\n  }\n  [push-lg-6] {\n    left: 50%;\n  }\n  [push-lg-7] {\n    left: 58.33333%;\n  }\n  [push-lg-8] {\n    left: 66.66667%;\n  }\n  [push-lg-9] {\n    left: 75%;\n  }\n  [push-lg-10] {\n    left: 83.33333%;\n  }\n  [push-lg-11] {\n    left: 91.66667%;\n  }\n  [push-lg-12] {\n    left: 100%;\n  }\n  [offset-lg-0] {\n    margin-left: 0%;\n  }\n  [offset-lg-1] {\n    margin-left: 8.33333%;\n  }\n  [offset-lg-2] {\n    margin-left: 16.66667%;\n  }\n  [offset-lg-3] {\n    margin-left: 25%;\n  }\n  [offset-lg-4] {\n    margin-left: 33.33333%;\n  }\n  [offset-lg-5] {\n    margin-left: 41.66667%;\n  }\n  [offset-lg-6] {\n    margin-left: 50%;\n  }\n  [offset-lg-7] {\n    margin-left: 58.33333%;\n  }\n  [offset-lg-8] {\n    margin-left: 66.66667%;\n  }\n  [offset-lg-9] {\n    margin-left: 75%;\n  }\n  [offset-lg-10] {\n    margin-left: 83.33333%;\n  }\n  [offset-lg-11] {\n    margin-left: 91.66667%;\n  }\n}\n\n[col-xl-1] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-1] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-1] {\n    padding: 5px;\n  }\n}\n\n[col-xl-2] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-2] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-2] {\n    padding: 5px;\n  }\n}\n\n[col-xl-3] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-3] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-3] {\n    padding: 5px;\n  }\n}\n\n[col-xl-4] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-4] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-4] {\n    padding: 5px;\n  }\n}\n\n[col-xl-5] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-5] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-5] {\n    padding: 5px;\n  }\n}\n\n[col-xl-6] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-6] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-6] {\n    padding: 5px;\n  }\n}\n\n[col-xl-7] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-7] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-7] {\n    padding: 5px;\n  }\n}\n\n[col-xl-8] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-8] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-8] {\n    padding: 5px;\n  }\n}\n\n[col-xl-9] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-9] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-9] {\n    padding: 5px;\n  }\n}\n\n[col-xl-10] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-10] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-10] {\n    padding: 5px;\n  }\n}\n\n[col-xl-11] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-11] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-11] {\n    padding: 5px;\n  }\n}\n\n[col-xl-12] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl-12] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl-12] {\n    padding: 5px;\n  }\n}\n\n[col-xl] {\n  padding: 5px;\n}\n\n\@media (min-width: 576px) {\n  [col-xl] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 768px) {\n  [col-xl] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 992px) {\n  [col-xl] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl] {\n    padding: 5px;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [col-xl] {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%;\n  }\n  [col-xl-auto] {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  [col-xl-1] {\n    flex: 0 0 8.33333%;\n    width: 8.33333%;\n    max-width: 8.33333%;\n  }\n  [col-xl-2] {\n    flex: 0 0 16.66667%;\n    width: 16.66667%;\n    max-width: 16.66667%;\n  }\n  [col-xl-3] {\n    flex: 0 0 25%;\n    width: 25%;\n    max-width: 25%;\n  }\n  [col-xl-4] {\n    flex: 0 0 33.33333%;\n    width: 33.33333%;\n    max-width: 33.33333%;\n  }\n  [col-xl-5] {\n    flex: 0 0 41.66667%;\n    width: 41.66667%;\n    max-width: 41.66667%;\n  }\n  [col-xl-6] {\n    flex: 0 0 50%;\n    width: 50%;\n    max-width: 50%;\n  }\n  [col-xl-7] {\n    flex: 0 0 58.33333%;\n    width: 58.33333%;\n    max-width: 58.33333%;\n  }\n  [col-xl-8] {\n    flex: 0 0 66.66667%;\n    width: 66.66667%;\n    max-width: 66.66667%;\n  }\n  [col-xl-9] {\n    flex: 0 0 75%;\n    width: 75%;\n    max-width: 75%;\n  }\n  [col-xl-10] {\n    flex: 0 0 83.33333%;\n    width: 83.33333%;\n    max-width: 83.33333%;\n  }\n  [col-xl-11] {\n    flex: 0 0 91.66667%;\n    width: 91.66667%;\n    max-width: 91.66667%;\n  }\n  [col-xl-12] {\n    flex: 0 0 100%;\n    width: 100%;\n    max-width: 100%;\n  }\n  [pull-xl-0] {\n    right: auto;\n  }\n  [pull-xl-1] {\n    right: 8.33333%;\n  }\n  [pull-xl-2] {\n    right: 16.66667%;\n  }\n  [pull-xl-3] {\n    right: 25%;\n  }\n  [pull-xl-4] {\n    right: 33.33333%;\n  }\n  [pull-xl-5] {\n    right: 41.66667%;\n  }\n  [pull-xl-6] {\n    right: 50%;\n  }\n  [pull-xl-7] {\n    right: 58.33333%;\n  }\n  [pull-xl-8] {\n    right: 66.66667%;\n  }\n  [pull-xl-9] {\n    right: 75%;\n  }\n  [pull-xl-10] {\n    right: 83.33333%;\n  }\n  [pull-xl-11] {\n    right: 91.66667%;\n  }\n  [pull-xl-12] {\n    right: 100%;\n  }\n  [push-xl-0] {\n    left: auto;\n  }\n  [push-xl-1] {\n    left: 8.33333%;\n  }\n  [push-xl-2] {\n    left: 16.66667%;\n  }\n  [push-xl-3] {\n    left: 25%;\n  }\n  [push-xl-4] {\n    left: 33.33333%;\n  }\n  [push-xl-5] {\n    left: 41.66667%;\n  }\n  [push-xl-6] {\n    left: 50%;\n  }\n  [push-xl-7] {\n    left: 58.33333%;\n  }\n  [push-xl-8] {\n    left: 66.66667%;\n  }\n  [push-xl-9] {\n    left: 75%;\n  }\n  [push-xl-10] {\n    left: 83.33333%;\n  }\n  [push-xl-11] {\n    left: 91.66667%;\n  }\n  [push-xl-12] {\n    left: 100%;\n  }\n  [offset-xl-0] {\n    margin-left: 0%;\n  }\n  [offset-xl-1] {\n    margin-left: 8.33333%;\n  }\n  [offset-xl-2] {\n    margin-left: 16.66667%;\n  }\n  [offset-xl-3] {\n    margin-left: 25%;\n  }\n  [offset-xl-4] {\n    margin-left: 33.33333%;\n  }\n  [offset-xl-5] {\n    margin-left: 41.66667%;\n  }\n  [offset-xl-6] {\n    margin-left: 50%;\n  }\n  [offset-xl-7] {\n    margin-left: 58.33333%;\n  }\n  [offset-xl-8] {\n    margin-left: 66.66667%;\n  }\n  [offset-xl-9] {\n    margin-left: 75%;\n  }\n  [offset-xl-10] {\n    margin-left: 83.33333%;\n  }\n  [offset-xl-11] {\n    margin-left: 91.66667%;\n  }\n}";

/**
 * iOS Toast Enter Animation
 */
function iosEnterAnimation$1(Animation, baseElm, position) {
    const baseAnimation = new Animation();
    const wrapperAnimation = new Animation();
    const wrapperEle = baseElm.querySelector('.toast-wrapper');
    wrapperAnimation.addElement(wrapperEle);
    switch (position) {
        case 'top':
            wrapperAnimation.fromTo('translateY', '-100%', '10px');
            break;
        case 'middle':
            let topPosition = Math.floor(baseElm.clientHeight / 2 - wrapperEle.clientHeight / 2);
            wrapperEle.style.top = `${topPosition}px`;
            wrapperAnimation.fromTo('opacity', 0.01, 1);
            break;
        default:
            wrapperAnimation.fromTo('translateY', '100%', '-10px');
            break;
    }
    return baseAnimation
        .addElement(baseElm)
        .easing('cubic-bezier(.155,1.105,.295,1.12)')
        .duration(400)
        .add(wrapperAnimation);
}

/**
 * iOS Toast Leave Animation
 */
function iosLeaveAnimation$1(Animation, baseElm, position) {
    const baseAnimation = new Animation();
    const wrapperAnimation = new Animation();
    const wrapperEle = baseElm.querySelector('.toast-wrapper');
    wrapperAnimation.addElement(wrapperEle);
    switch (position) {
        case 'top':
            wrapperAnimation.fromTo('translateY', `${10}px`, '-100%');
            break;
        case 'middle':
            wrapperAnimation.fromTo('opacity', 0.99, 0);
            break;
        default:
            wrapperAnimation.fromTo('translateY', `${0 - 10}px`, '100%');
            break;
    }
    return baseAnimation
        .addElement(baseElm)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(300)
        .add(wrapperAnimation);
}

/**
 * MD Toast Enter Animation
 */
function mdEnterAnimation$1(Animation, baseElm, position) {
    const baseAnimation = new Animation();
    const wrapperAnimation = new Animation();
    const wrapperEle = baseElm.querySelector('.toast-wrapper');
    wrapperAnimation.addElement(wrapperEle);
    switch (position) {
        case 'top':
            wrapperAnimation.fromTo('translateY', '-100%', '0%');
            break;
        case 'middle':
            let topPosition = Math.floor(baseElm.clientHeight / 2 - wrapperEle.clientHeight / 2);
            wrapperEle.style.top = `${topPosition}px`;
            wrapperAnimation.fromTo('opacity', 0.01, 1);
            break;
        default:
            wrapperAnimation.fromTo('translateY', '100%', '0%');
            break;
    }
    return baseAnimation
        .addElement(baseElm)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(wrapperAnimation);
}

/**
 * md Toast Leave Animation
 */
function mdLeaveAnimation$1(Animation, baseElm, position) {
    const baseAnimation = new Animation();
    const wrapperAnimation = new Animation();
    const wrapperEle = baseElm.querySelector('.toast-wrapper');
    wrapperAnimation.addElement(wrapperEle);
    switch (position) {
        case 'top':
            wrapperAnimation.fromTo('translateY', '0px', '-100%');
            break;
        case 'middle':
            wrapperAnimation.fromTo('opacity', 0.99, 0);
            break;
        default:
            wrapperAnimation.fromTo('translateY', `0px`, '100%');
            break;
    }
    return baseAnimation
        .addElement(baseElm)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(300)
        .add(wrapperAnimation);
}

class Toast {
    constructor() {
        this.translucent = false;
        this.animate = true;
    }
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionToastWillPresent.emit();
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get("toastEnter", this.mode === "ios" ? iosEnterAnimation$1 : mdEnterAnimation$1);
        // build the animation and kick it off
        return this.animationCtrl.create(animationBuilder, this.el, this.position).then(animation => {
            this.animation = animation;
            if (!this.animate) {
                // if the duration is 0, it won't actually animate I don't think
                // TODO - validate this
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.componentDidEnter();
        });
    }
    dismiss(data, role) {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionToastWillDismiss.emit({
            data,
            role
        });
        const animationBuilder = this.leaveAnimation || this.config.get("toastLeave", this.mode === "ios" ? iosLeaveAnimation$1 : mdLeaveAnimation$1);
        return this.animationCtrl.create(animationBuilder, this.el, this.position).then(animation => {
            this.animation = animation;
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            return domControllerAsync(Context.dom.write, () => {
                this.el.parentNode.removeChild(this.el);
            });
        }).then(() => {
            this.ionToastDidDismiss.emit({
                data,
                role
            });
        });
    }
    componentDidLoad() {
        this.ionToastDidLoad.emit();
    }
    componentDidEnter() {
        this.ionToastDidPresent.emit();
        if (this.duration) {
            setTimeout(() => {
                this.dismiss();
            }, this.duration);
        }
    }
    componentDidUnload() {
        this.ionToastDidUnload.emit();
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    wrapperClass() {
        let wrapperClass = !this.position
            ? ["toast-wrapper", "toast-bottom"]
            : [`toast-wrapper`, `toast-${this.position}`];
        return wrapperClass.reduce((prevValue, cssClass) => {
            prevValue[cssClass] = true;
            return prevValue;
        }, {});
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, "toast-translucent") : {};
        const hostClasses = Object.assign({}, themedClasses);
        return {
            class: hostClasses
        };
    }
    render() {
        let userCssClass = "toast-content";
        if (this.cssClass) {
            userCssClass += " " + this.cssClass;
        }
        return (h("div", { class: this.wrapperClass() }, h("div", { class: "toast-container" }, this.message
            ? h("div", { class: "toast-message" }, this.message)
            : null, this.showCloseButton
            ? h("ion-button", { fill: "clear", color: "light", class: "toast-button", onClick: () => this.dismiss() }, this.closeButtonText || "Close")
            : null)));
    }
}
Toast.is = "ion-toast";
Toast.host = { "theme": "toast" };
Toast.properties = { "animate": { "type": Boolean, "attr": "animate" }, "animationCtrl": { "connect": "ion-animation-controller" }, "closeButtonText": { "type": String, "attr": "close-button-text" }, "config": { "context": "config" }, "cssClass": { "type": String, "attr": "css-class" }, "dismiss": { "method": true }, "dismissOnPageChange": { "type": Boolean, "attr": "dismiss-on-page-change" }, "duration": { "type": Number, "attr": "duration" }, "el": { "elementRef": true }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "message": { "type": String, "attr": "message" }, "position": { "type": String, "attr": "position" }, "present": { "method": true }, "showCloseButton": { "type": Boolean, "attr": "show-close-button" }, "toastId": { "type": String, "attr": "toast-id" }, "translucent": { "type": Boolean, "attr": "translucent" } };
Toast.events = [{ "name": "ionToastDidDismiss", "method": "ionToastDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionToastDidLoad", "method": "ionToastDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionToastDidPresent", "method": "ionToastDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionToastDidUnload", "method": "ionToastDidUnload", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionToastWillDismiss", "method": "ionToastWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionToastWillPresent", "method": "ionToastWillPresent", "bubbles": true, "cancelable": true, "composed": true }];
Toast.style = "ion-toast {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 1000;\n  display: block;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  contain: strict;\n}\n\n.toast-container {\n  display: flex;\n  align-items: center;\n  pointer-events: auto;\n  contain: content;\n}\n\n.toast-button {\n  font-size: 15px;\n}\n\n.toast-message {\n  flex: 1;\n}\n\n.toast-ios .toast-wrapper {\n  left: 10px;\n  right: 10px;\n  margin: auto;\n  border-radius: 14px;\n  position: absolute;\n  z-index: 10;\n  display: block;\n  max-width: 700px;\n  background: #ededef;\n}\n\n.toast-translucent-ios .toast-wrapper {\n  background: rgba(237, 237, 239, 0.88);\n  backdrop-filter: saturate(180%) blur(20px);\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n}\n\n.toast-ios .toast-wrapper.toast-top {\n  transform: translate3d(0,  -100%,  0);\n  top: 0;\n}\n\n.toast-ios .toast-wrapper.toast-bottom {\n  transform: translate3d(0,  100%,  0);\n  bottom: 0;\n}\n\n.toast-ios .toast-wrapper.toast-middle {\n  opacity: .01;\n}\n\n.toast-ios .toast-message {\n  padding: 15px;\n  font-size: 14px;\n  color: #474747;\n}\n\n.toast-ios .toast-button {\n  color: #474747;\n}";
Toast.styleMode = "ios";

class ToastController {
    constructor() {
        this.ids = 0;
        this.toastResolves = {};
        this.toasts = [];
    }
    create(opts) {
        // create ionic's wrapping ion-toast component
        const toast = document.createElement("ion-toast");
        const id = this.ids++;
        // give this toast a unique id
        toast.toastId = `toast-${id}`;
        toast.style.zIndex = (10000 + id).toString();
        // convert the passed in toast options into props
        // that get passed down into the new toast
        Object.assign(toast, opts);
        // append the toast element to the document body
        const appRoot = document.querySelector("ion-app") || document.body;
        appRoot.appendChild(toast);
        // store the resolve function to be called later up when the toast loads
        return new Promise(resolve => {
            this.toastResolves[toast.toastId] = resolve;
        });
    }
    didLoad(ev) {
        const toast = ev.target;
        const toastResolve = this.toastResolves[toast.toastId];
        if (toastResolve) {
            toastResolve(toast);
            delete this.toastResolves[toast.toastId];
        }
    }
    willPresent(ev) {
        this.toasts.push(ev.target);
    }
    willDismiss(ev) {
        const index = this.toasts.indexOf(ev.target);
        if (index > -1) {
            this.toasts.splice(index, 1);
        }
    }
    escapeKeyUp() {
        const lastToast = this.toasts[this.toasts.length - 1];
        if (lastToast) {
            lastToast.dismiss();
        }
    }
}
ToastController.is = "ion-toast-controller";
ToastController.properties = { "create": { "method": true } };

class BalanceTransfer {
    constructor() {
        //  walletService: any;
        this.mode = " test";
        //@State() isActive:any
        this.selectedItem = 0;
        this.balance = new DispositionTemplate();
        this.slotBalance = new DispositionTemplate();
        this.partialAmounts = [];
        // transferType: string;
        this.defaultAmtTransfer = [10, 25, 50, 100];
        this.stateValue = {};
    }
    backButtonClick() {
        this.history.goBack();
    }
    componentWillLoad() {
        debugger;
        if (this.match && this.match.params.type) {
            this.stateValue.action = this.match.params.type;
            // alert(this.stateValue);
            this.fIcon = (this.stateValue.action === "Download") ? "icon-wallet2" : "icon-slot-machine";
            this.sIcon = (this.stateValue.action === "Download") ? "icon-slot-machine" : "icon-wallet2";
            //  this.logData();
            //this.getAccountBalance();
            console.log("");
            this.balance = S_WalletService.getWalletBalance().cash; //this.navPrams.balance
            this.slotBalance = S_SlotService.getGameBalance().cash;
            //  this.walletService = new WalletService();
            debugger;
            // S_AppCashLessInfo.getDevicInfo();
        }
    }
    isActive(value) {
        //return 'btn ' + ((value === this.state.selected) ? 'active' : 'default');
        return "disable-hover button button-" + this.mode + " button-default button-default-" + this.mode + ((value === this.selectedItem) ? ' btn-active' : '');
    }
    onDownloadSelected(amt) {
        debugger;
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
        debugger;
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
                            debugger;
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
        //{transferType} {{'CASH_BALANCE_TO'|translate}} {{(transferType=="Download")?('Game'|translate):('Card'|translate)}}
    }
    render() {
        return (h("ion-page", null,
            h("ion-header", null,
                h("ion-navbar", { hideBackButton: true },
                    h("ion-buttons", null,
                        h("button", { "ion-button": true, onClick: () => this.backButtonClick() },
                            h("ion-icon", { class: "customIcon", name: "arrow-back" }, "back"))),
                    h("ion-title", null, "MY ACCOUNT"),
                    h("ion-buttons", { "ion-button": true, "icon-only": true },
                        h("home-button", null)))),
            h("ion-content", null,
                h("div", { class: "section-header" }, "CASH BALANCE TRANSFER"),
                h("div", { class: "elevated-box bal-transfer text-center" },
                    h("div", { class: "bal-to-game margin-bottom" },
                        h("ion-icon", { name: this.fIcon, class: "icon-white" }),
                        h("ion-icon", { name: "icon-arrow-right" }, " "),
                        h("ion-icon", { name: this.sIcon, class: "icon-white" })),
                    h("p", { class: "text-primary" }),
                    h("p", { class: "text-primary" }, `${this.stateValue.action} CASH BALANCE TO  ${this.stateValue.action == 'Download' ? "GAME" : "SLOT"} `),
                    h("ion-grid", { class: "cash-bal-info" },
                        h("ion-row", null,
                            h("ion-col", { "col-6": true, class: "text-gray2 font-14" },
                                "CASH BALANCE ",
                                h("div", { class: "text-primary font-16" }, this.balance.FormattedAmount)),
                            h("ion-col", { "col-6": true, class: "text-gray2 font-14" },
                                "SLOT BALANCE ",
                                h("div", { class: "text-primary font-16" }, this.slotBalance.FormattedAmount)))),
                    h("p", null, "SELECTED AMOUNT"),
                    h("h3", { class: "gradient-text font-40 no-margin" },
                        "$",
                        this.selectedItem),
                    h("div", { class: "margin-top" },
                        h("p", { class: "text-primary" }, "TRANSFER AMOUNT NOW"),
                        h("ion-grid", null,
                            h("ion-row", { class: "btn-bar" }, this.defaultAmtTransfer.map((partialAmount) => {
                                return (h("ion-col", { "col-3": true },
                                    h("button", { "ion-button": true, class: { 'btn-active': this.selectedItem == partialAmount }, onClick: () => this.onDownloadSelected(partialAmount) },
                                        h("span", { class: "gradient-text" },
                                            "$",
                                            partialAmount))));
                            })),
                            h("ion-row", { class: "btn-bar" },
                                h("ion-col", { "col-6": true },
                                    h("button", { "ion-button": true, onClick: () => this.showPrompt() },
                                        h("span", { class: "gradient-text" }, "OTHER"))),
                                h("ion-col", { "col-3": true },
                                    h("button", { "ion-button": true, onClick: () => this.selectFullAmt() },
                                        h("span", { class: "gradient-text" }, "ALL"))),
                                h("ion-col", { "col-3": true },
                                    h("button", { "ion-button": true, onClick: () => this.clearAmt() },
                                        h("span", { class: "gradient-text" }, "CLEAR "))))),
                        h("div", { class: "btn-box" },
                            h("ion-button", { class: "btn btn-primary", onClick: () => this.transfer() }, "TRANSFER NOW")))))));
    }
    static get is() { return "balance-transfer"; }
    static get properties() { return { "alertCtrl": { "connect": "ion-alert-controller" }, "fIcon": { "state": true }, "history": { "type": "Any", "attr": "history" }, "match": { "type": "Any", "attr": "match" }, "mode": { "type": "Any", "attr": "mode" }, "navPrams": { "type": "Any", "attr": "nav-prams" }, "selectedItem": { "state": true }, "sIcon": { "state": true }, "toastCtrl": { "connect": "ion-toast-controller" } }; }
    static get style() { return ".section-header {\n    font-weight: lighter;\n    font-size: larger; \n    text-transform: uppercase;\n    background-color: #0a0c12;\n    padding: 7px 10px 5px 10px;\n    margin: 0 0 15px;\n    color: #afafaf;\n}\n\n.elevated-box {\n    border-radius: 4px;\n    text-transform: uppercase;\n    padding: 16px;\n    width: calc(100% - 32px);\n    margin: 0 16px;\n    border: 1px solid #5e5e63;\n    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.75);\n    font-size: 16px;\n        text-align: center !important;\n}\n.text-primary {\n    color: #d5a843 !important;\n}\n.font-14 {\n    font-size: 14px !important;\n}\n\n.text-gray2 {\n    color: #afafaf !important;\n}\n.cash-bal-info {\n    margin: 10px -16px;\n    width: auto;\n    background: #0a0c12;\n    font-size: 16px;\n    font-size: 1.6rem;\n}\n\n.cash-bal-info ion-col + ion-col:before {\n    content: '';\n    width: 1px;\n    background: #afafaf;\n    height: 100%;\n    float: left;\n    margin-right: 2px;\n}\n.font-16 {\n    font-size: 16px !important;\n}\n.gradient-text {\n    background: -webkit-linear-gradient(#ffd34e, #b5873a);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n}\n.font-40 {\n    font-size: 40px !important;\n}\n.no-margin {\n    margin: 0 !important;\n}\n.margin-top {\n    margin-top: 16px !important;\n}\n.btn-bar button {\n    padding: 8px 12px;\n    height: auto;\n    border-radius: 0;\n    width: 100%;\n    background: transparent;\n    color: #000;\n    border: 1px solid #5e5e63;\n    margin: 0;\n    /* transition: all .2s ease; */\n}\npage-cash-balance-transfer h4 {\n  \n}\n\npage-cash-balance-transfer h4 ion-icon:before {\n \n}"; }
}

export { Alert as IonAlert, AlertController as IonAlertController, Card as IonCard, CardContent as IonCardContent, Grid as IonGrid, Toast as IonToast, ToastController as IonToastController, BalanceTransfer };
