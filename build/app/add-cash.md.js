/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { createThemedClasses } from './chunk3.js';

class Label {
    constructor() {
        /**
         * @output {Event} If true, the label will sit alongside an input. Defaults to `false`.
         */
        this.fixed = false;
        /**
         * @output {Event} If true, the label will float above an input when the value is empty or the input is focused. Defaults to `false`.
         */
        this.floating = false;
        /**
         * @output {Event} If true, the label will be stacked above an input. Defaults to `false`.
         */
        this.stacked = false;
    }
    /**
     * @hidden
     */
    getText() {
        return this.el.textContent || "";
    }
    componentDidLoad() {
        this.emitStyle();
    }
    emitStyle() {
        clearTimeout(this.styleTmr);
        let styles = {
            "label-fixed": this.fixed,
            "label-floating": this.floating,
            "label-stacked": this.stacked
        };
        this.styleTmr = setTimeout(() => {
            this.ionStyle.emit(styles);
        });
    }
    render() {
        return h("slot", null);
    }
}
Label.is = "ion-label";
Label.host = { "theme": "label" };
Label.properties = { "color": { "type": String, "attr": "color" }, "el": { "elementRef": true }, "fixed": { "type": Boolean, "attr": "fixed" }, "floating": { "type": Boolean, "attr": "floating" }, "getText": { "method": true }, "mode": { "type": "Any", "attr": "mode" }, "stacked": { "type": Boolean, "attr": "stacked" } };
Label.events = [{ "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }];
Label.style = "ion-label {\n  margin: 0;\n  display: block;\n  overflow: hidden;\n  flex: 1;\n  font-size: inherit;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.item-input ion-label {\n  flex: initial;\n  max-width: 200px;\n  pointer-events: none;\n}\n\n[text-wrap] ion-label {\n  white-space: normal;\n}\n\nion-label[fixed] {\n  flex: 0 0 100px;\n  width: 100px;\n  min-width: 100px;\n  max-width: 200px;\n}\n\n.item-label-stacked ion-label,\n.item-label-floating ion-label {\n  align-self: stretch;\n  width: auto;\n  max-width: 100%;\n}\n\nion-label[stacked],\nion-label[floating] {\n  margin-bottom: 0;\n}\n\n.item-label-stacked .input-wrapper,\n.item-label-floating .input-wrapper {\n  flex: 1;\n  flex-direction: column;\n}\n\n.item-label-stacked ion-select,\n.item-label-floating ion-select {\n  align-self: stretch;\n  max-width: 100%;\n}\n\n.label-md {\n  margin: 13px 8px 13px 0;\n}\n\n[text-wrap] .label-md {\n  font-size: 14px;\n  line-height: 1.5;\n}\n\n.item-input .label-md,\n.item-select .label-md,\n.item-datetime .label-md {\n  color: #999;\n}\n\n.label-md[stacked] {\n  font-size: 12px;\n}\n\n.label-md[floating] {\n  transform: translate3d(0,  27px,  0);\n  transform-origin: left top;\n  transition: transform 150ms ease-in-out;\n}\n\n.label-md[stacked],\n.label-md[floating] {\n  margin-left: 0;\n  margin-bottom: 0;\n}\n\n.item-input-has-focus .label-md[stacked],\n.item-input-has-focus .label-md[floating] {\n  color: #488aff;\n}\n\n.item-input-has-focus .label-md[floating],\n.item-input-has-value .label-md[floating] {\n  transform: translate3d(0,  0,  0) scale(0.8);\n}\n\n.label-md-primary,\n.item-input .label-md-primary,\n.item-select .label-md-primary,\n.item-datetime .label-md-primary {\n  color: #488aff;\n}\n\n.label-md-secondary,\n.item-input .label-md-secondary,\n.item-select .label-md-secondary,\n.item-datetime .label-md-secondary {\n  color: #32db64;\n}\n\n.label-md-warning,\n.item-input .label-md-warning,\n.item-select .label-md-warning,\n.item-datetime .label-md-warning {\n  color: #ffeb3b;\n}\n\n.label-md-danger,\n.item-input .label-md-danger,\n.item-select .label-md-danger,\n.item-datetime .label-md-danger {\n  color: #f53d3d;\n}\n\n.label-md-light,\n.item-input .label-md-light,\n.item-select .label-md-light,\n.item-datetime .label-md-light {\n  color: #f4f4f4;\n}\n\n.label-md-dark,\n.item-input .label-md-dark,\n.item-select .label-md-dark,\n.item-datetime .label-md-dark {\n  color: #222;\n}";
Label.styleMode = "md";

class ListHeader {
    render() {
        return h("slot", null);
    }
}
ListHeader.is = "ion-list-header";
ListHeader.host = { "theme": "list-header" };
ListHeader.properties = { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" } };
ListHeader.style = "ion-list-header {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  overflow: hidden;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  min-height: 40px;\n}\n\n.list-header-md {\n  padding-left: 16px;\n  margin-bottom: 13px;\n  min-height: 45px;\n  border-top: 1px solid #dedede;\n  font-size: 14px;\n  color: #757575;\n}\n\n.list-header-md-primary {\n  color: #fff;\n  background-color: #488aff;\n}\n\n.list-header-md-secondary {\n  color: #fff;\n  background-color: #32db64;\n}\n\n.list-header-md-warning {\n  color: #000;\n  background-color: #ffeb3b;\n}\n\n.list-header-md-danger {\n  color: #fff;\n  background-color: #f53d3d;\n}\n\n.list-header-md-light {\n  color: #000;\n  background-color: #f4f4f4;\n}\n\n.list-header-md-dark {\n  color: #fff;\n  background-color: #222;\n}";
ListHeader.styleMode = "md";

class Radio {
    constructor() {
        /*
         * @input {boolean} If true, the user cannot interact with the radio. Default false.
         */
        this.disabled = false;
        /**
         * @input {boolean} If true, the radio is selected. Defaults to `false`.
         */
        this.checked = false;
    }
    componentWillLoad() {
        this.inputId = "ion-rb-" + (radioButtonIds++);
        if (this.value === undefined) {
            this.value = this.inputId;
        }
        this.emitStyle();
    }
    componentDidLoad() {
        this.ionRadioDidLoad.emit({ radio: this });
        this.nativeInput.checked = this.checked;
        this.didLoad = true;
        const parentItem = this.nativeInput.closest("ion-item");
        if (parentItem) {
            const itemLabel = parentItem.querySelector("ion-label");
            if (itemLabel) {
                itemLabel.id = this.inputId + "-lbl";
                this.nativeInput.setAttribute("aria-labelledby", itemLabel.id);
            }
        }
    }
    componentDidUnload() {
        this.ionRadioDidUnload.emit({ radio: this });
    }
    colorChanged() {
        this.emitStyle();
    }
    checkedChanged(isChecked) {
        if (this.nativeInput.checked !== isChecked) {
            // keep the checked value and native input `nync
            this.nativeInput.checked = isChecked;
        }
        clearTimeout(this.checkedTmr);
        this.checkedTmr = setTimeout(() => {
            // only emit ionSelect when checked is true
            if (this.didLoad && isChecked) {
                this.ionSelect.emit({
                    checked: isChecked,
                    value: this.value
                });
            }
        });
        this.emitStyle();
    }
    disabledChanged(isDisabled) {
        this.nativeInput.disabled = isDisabled;
        this.emitStyle();
    }
    emitStyle() {
        clearTimeout(this.styleTmr);
        this.styleTmr = setTimeout(() => {
            this.ionStyle.emit(Object.assign({}, createThemedClasses(this.mode, this.color, "radio"), { "radio-checked": this.checked, "radio-disabled": this.disabled }));
        });
    }
    onClick() {
        this.checkedChanged(true);
    }
    onChange() {
        this.checked = true;
        this.nativeInput.focus();
    }
    onKeyUp() {
        this.keyFocus = true;
    }
    onFocus() {
        this.ionFocus.emit();
    }
    onBlur() {
        this.keyFocus = false;
        this.ionBlur.emit();
    }
    hostData() {
        const hostAttrs = {
            "class": {
                "radio-checked": this.checked,
                "radio-disabled": this.disabled,
                "radio-key": this.keyFocus
            }
        };
        return hostAttrs;
    }
    render() {
        const radioClasses = {
            "radio-icon": true,
            "radio-checked": this.checked
        };
        return [
            h("div", { class: radioClasses }, h("div", { class: "radio-inner" })),
            h("input", { type: "radio", onClick: this.onClick.bind(this), onChange: this.onChange.bind(this), onFocus: this.onFocus.bind(this), onBlur: this.onBlur.bind(this), onKeyUp: this.onKeyUp.bind(this), id: this.inputId, name: this.name, value: this.value, disabled: this.disabled, ref: r => this.nativeInput = r })
        ];
    }
}
let radioButtonIds = 0;
Radio.is = "ion-radio";
Radio.host = { "theme": "radio" };
Radio.properties = { "checked": { "type": Boolean, "attr": "checked", "mutable": true, "watchCallbacks": ["checkedChanged"] }, "color": { "type": String, "attr": "color", "watchCallbacks": ["colorChanged"] }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "keyFocus": { "state": true }, "mode": { "type": "Any", "attr": "mode" }, "name": { "type": String, "attr": "name" }, "value": { "type": String, "attr": "value", "mutable": true } };
Radio.events = [{ "name": "ionBlur", "method": "ionBlur", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionFocus", "method": "ionFocus", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionRadioDidLoad", "method": "ionRadioDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionRadioDidUnload", "method": "ionRadioDidUnload", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionSelect", "method": "ionSelect", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }];
Radio.style = "ion-radio {\n  position: relative;\n  display: inline-block;\n}\n\nion-radio input {\n  left: 0;\n  top: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\n.radio-md .radio-icon {\n  left: 0;\n  top: 0;\n  margin: 0;\n  border-radius: 50%;\n  position: relative;\n  display: block;\n  width: 16px;\n  height: 16px;\n  border-width: 2px;\n  border-style: solid;\n  border-color: #787878;\n}\n\n.radio-md .radio-inner {\n  left: 2px;\n  top: 2px;\n  border-radius: 50%;\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  background-color: #488aff;\n  transform: scale3d(0, 0, 0);\n  transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.radio-md .radio-checked {\n  border-color: #488aff;\n}\n\n.radio-md .radio-checked .radio-inner {\n  transform: scale3d(1, 1, 1);\n}\n\n.radio-md.radio-disabled,\n.item-md.item-radio-disabled ion-label {\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.radio-key .radio-icon::after {\n  border-radius: 50%;\n  left: -12px;\n  top: -12px;\n  position: absolute;\n  display: block;\n  width: 36px;\n  height: 36px;\n  background: #86a8df;\n  content: \"\";\n  opacity: .3;\n}\n\n.item-md .radio-md {\n  margin: 9px 10px 9px 0;\n  position: static;\n  display: block;\n}\n\n.item-md .radio-md[slot=\"start\"] {\n  margin: 11px 36px 10px 4px;\n}\n\n.item-radio.item-md ion-label {\n  margin-left: 0;\n}\n\n.item-radio-checked.item-md ion-label {\n  color: #488aff;\n}\n\n.item-radio-md-primary.item-radio-checked ion-label {\n  color: #488aff;\n}\n\n.radio-md-primary .radio-checked {\n  border-color: #488aff;\n}\n\n.radio-md-primary .radio-inner {\n  background-color: #488aff;\n}\n\n.item-radio-md-secondary.item-radio-checked ion-label {\n  color: #32db64;\n}\n\n.radio-md-secondary .radio-checked {\n  border-color: #32db64;\n}\n\n.radio-md-secondary .radio-inner {\n  background-color: #32db64;\n}\n\n.item-radio-md-warning.item-radio-checked ion-label {\n  color: #ffeb3b;\n}\n\n.radio-md-warning .radio-checked {\n  border-color: #ffeb3b;\n}\n\n.radio-md-warning .radio-inner {\n  background-color: #ffeb3b;\n}\n\n.item-radio-md-danger.item-radio-checked ion-label {\n  color: #f53d3d;\n}\n\n.radio-md-danger .radio-checked {\n  border-color: #f53d3d;\n}\n\n.radio-md-danger .radio-inner {\n  background-color: #f53d3d;\n}\n\n.item-radio-md-light.item-radio-checked ion-label {\n  color: #f4f4f4;\n}\n\n.radio-md-light .radio-checked {\n  border-color: #f4f4f4;\n}\n\n.radio-md-light .radio-inner {\n  background-color: #f4f4f4;\n}\n\n.item-radio-md-dark.item-radio-checked ion-label {\n  color: #222;\n}\n\n.radio-md-dark .radio-checked {\n  border-color: #222;\n}\n\n.radio-md-dark .radio-inner {\n  background-color: #222;\n}";
Radio.styleMode = "md";

class AddCash {
    constructor() {
    }
    componentWillLoad() {
        //  this.logData();
        //this.getAccountBalance();
        // this.divStyle = 
    }
    render() {
        return (h("div", { class: "animated flipInY", style: {
                background: "#eee",
                padding: "20px",
                margin: "20px"
            } },
            h("div", { class: "section-header" }, "Select Payment"),
            h("ion-list", { class: "list-cards list list-md", "padding-horizontal": "", "radio-group": "", role: "radiogroup", "aria-describedby": "rg-hdr-2" },
                h("ion-list-header", { class: "text-gray2 item item-md list-header list-header-md", "no-margin": "", "no-padding": "", "text-uppercase": "", id: "rg-hdr-2" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { class: "label label-md" }, "Providers"))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-53" },
                                h("img", { class: "list-img", src: "assets/img/alipay.png" }),
                                h("span", null, "Alipay"))),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "Alipay" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-53-0", "aria-checked": "false", "aria-labelledby": "lbl-53", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-54" },
                                h("img", { class: "list-img", src: "assets/img/amazonpay.png" }),
                                h("span", null, "Amazon Pay"))),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "Amazon Pay" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-54-0", "aria-checked": "false", "aria-labelledby": "lbl-54", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-55" },
                                h("img", { class: "list-img", src: "assets/img/bitcoin.png" }),
                                h("span", null, "BIT COIN"))),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "BIT COIN" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-55-0", "aria-checked": "false", "aria-labelledby": "lbl-55", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-56" },
                                h("img", { class: "list-img", src: "assets/img/wechatpay.png" }),
                                h("span", null, "WECHAT PAY"))),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "WECHAT PAY" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-56-0", "aria-checked": "false", "aria-labelledby": "lbl-56", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-57" },
                                h("img", { class: "list-img", src: "assets/img/paypal.png" }),
                                h("span", null, "PAYPAL"))),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "PAYPAL" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-57-0", "aria-checked": "false", "aria-labelledby": "lbl-57", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-58" },
                                h("img", { class: "list-img", src: "assets/img/applepay.png" }),
                                h("span", null, "APPLE PAY"))),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "APPLE PAY" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-58-0", "aria-checked": "false", "aria-labelledby": "lbl-58", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })),
                h("ion-list-header", { class: "text-gray2 item item-md list-header list-header-md", "no-margin": "", "no-padding": "", "text-uppercase": "" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { class: "label label-md" }, "Online Payment"))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-59" }, "Credit Card")),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "CREDIT_CARD" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-59-0", "aria-checked": "false", "aria-labelledby": "lbl-59", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-60" }, "Debit Card")),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "DEBIT_CARD" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-60-0", "aria-checked": "false", "aria-labelledby": "lbl-60", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-61" }, "Net Banking")),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "NET_BANKING" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-61-0", "aria-checked": "false", "aria-labelledby": "lbl-61", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })),
                h("ion-list-header", { class: "text-gray2 item item-md list-header list-header-md", "no-margin": "", "no-padding": "", "text-uppercase": "" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { class: "label label-md" }, "Others"))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-62" }, "Samsung Pay")),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "SAMSUNG_PAY" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-62-0", "aria-checked": "false", "aria-labelledby": "lbl-62", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })),
                h("ion-item", { class: "item item-block item-md item-radio" },
                    h("div", { class: "item-inner" },
                        h("div", { class: "input-wrapper" },
                            h("ion-label", { "text-uppercase": "", class: "label label-md", id: "lbl-63" }, "Kiosk")),
                        h("ion-radio", { class: "radio radio-md", "ng-reflect-value": "KIOSK" },
                            h("div", { class: "radio-icon" },
                                h("div", { class: "radio-inner" })),
                            h("button", { class: "item-cover disable-hover item-cover-md item-cover-default item-cover-default-md", "ion-button": "item-cover", role: "radio", type: "button", id: "rb-63-0", "aria-checked": "false", "aria-labelledby": "lbl-63", "aria-disabled": "false" },
                                h("span", { class: "button-inner" }, " "),
                                h("div", { class: "button-effect" })))),
                    h("div", { class: "button-effect" })))));
    }
    static get is() { return "add-cash"; }
}

export { Label as IonLabel, ListHeader as IonListHeader, Radio as IonRadio, AddCash };
