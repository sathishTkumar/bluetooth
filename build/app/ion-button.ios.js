/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { getElementClassObject } from './chunk3.js';

class Button {
    constructor() {
        /**
         * The type of button.
         * Possible values are: `"button"`, `"bar-button"`.
         */
        this.buttonType = "button";
        /**
         * If true, sets the button into a disabled state.
         */
        this.disabled = false;
        /**
         * Set to `"clear"` for a transparent button, to `"outline"` for a transparent
         * button with a border, or to `"solid"`. The default style is `"solid"` except inside of
         * a toolbar, where the default is `"clear"`.
         */
        this.fill = "default";
        /**
         * If true, activates a button with rounded corners.
         */
        this.round = false;
        /**
         * If true, activates a button with a heavier font weight.
         */
        this.strong = false;
    }
    render() {
        const { buttonType, color, expand, fill, mode, round, size, strong } = this;
        const elementClasses = []
            .concat(getButtonClassList(buttonType, mode), getClassList(buttonType, expand, mode), getClassList(buttonType, size, mode), getClassList(buttonType, round ? "round" : null, mode), getClassList(buttonType, strong ? "strong" : null, mode), getColorClassList(buttonType, color, fill, mode));
        const TagType = this.href ? "a" : "button";
        const buttonClasses = Object.assign({}, getElementClassObject(this.el.classList), getElementClassObject(elementClasses));
        return (h(TagType, { class: buttonClasses, disabled: this.disabled, href: this.href }, h("span", { class: "button-inner" }, h("slot", { name: "icon-only" }), h("slot", { name: "start" }), h("slot", null), h("slot", { name: "end" })), h("div", { class: "button-effect" })));
    }
}
/**
 * Get the classes based on the button type
 * e.g. alert-button, action-sheet-button
 */
function getButtonClassList(buttonType, mode) {
    if (!buttonType) {
        return [];
    }
    return [
        buttonType,
        `${buttonType}-${mode}`
    ];
}
/**
 * Get the classes based on the type
 * e.g. block, full, round, large
 */
function getClassList(buttonType, type, mode) {
    if (!type) {
        return [];
    }
    type = type.toLocaleLowerCase();
    return [
        `${buttonType}-${type}`,
        `${buttonType}-${type}-${mode}`
    ];
}
function getColorClassList(buttonType, color, fill, mode) {
    let className = buttonType;
    if (buttonType !== "bar-button" && fill === "solid") {
        fill = "default";
    }
    if (fill && fill !== "default") {
        className += `-${fill.toLowerCase()}`;
    }
    // special case for a default bar button
    // if the bar button is default it should get the fill
    // but if a color is passed the fill shouldn't be added
    if (buttonType === "bar-button" && fill === "default") {
        className = buttonType;
        if (!color) {
            className += "-" + fill.toLowerCase();
        }
    }
    return [`${className}-${mode}`].concat(fill !== "default" ? `${className}` : [], color ? `${className}-${mode}-${color}` : []);
}
Button.is = "ion-button";
Button.properties = { "buttonType": { "type": String, "attr": "button-type" }, "color": { "type": String, "attr": "color" }, "disabled": { "type": Boolean, "attr": "disabled" }, "el": { "elementRef": true }, "expand": { "type": "Any", "attr": "expand" }, "fill": { "type": "Any", "attr": "fill" }, "href": { "type": String, "attr": "href" }, "mode": { "type": "Any", "attr": "mode" }, "round": { "type": Boolean, "attr": "round" }, "size": { "type": "Any", "attr": "size" }, "strong": { "type": Boolean, "attr": "strong" } };
Button.style = ".button {\n  text-align: center;\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n  position: relative;\n  z-index: 0;\n  display: inline-block;\n  border: 0;\n  line-height: 1;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: none;\n  white-space: nowrap;\n  cursor: pointer;\n  vertical-align: top;\n  vertical-align: -webkit-baseline-middle;\n  transition: background-color, opacity 100ms linear;\n  font-kerning: none;\n  user-select: none;\n  contain: content;\n}\n\n.button-inner {\n  display: flex;\n  flex-flow: row nowrap;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n\na[disabled],\nbutton[disabled],\n.button[disabled] {\n  cursor: default;\n  opacity: .4;\n  pointer-events: none;\n}\n\n.button-block {\n  display: block;\n  clear: both;\n  width: 100%;\n  contain: strict;\n}\n\n.button-block::after {\n  clear: both;\n}\n\n.button-full {\n  display: block;\n  width: 100%;\n  contain: strict;\n}\n\n.button-full.button-outline {\n  border-radius: 0;\n  border-right-width: 0;\n  border-left-width: 0;\n}\n\n.button ion-icon {\n  width: 1.4em;\n  height: 1.4em;\n  pointer-events: none;\n}\n\n.button ion-icon[slot=\"start\"] {\n  margin: 0 0.3em 0 -0.3em;\n}\n\n.button ion-icon[slot=\"end\"] {\n  margin: 0 -0.2em 0 0.3em;\n}\n\n.button ion-icon[slot=\"icon-only\"] {\n  width: 1.8em;\n  height: 1.8em;\n}\n\n.button-ios {\n  border-radius: 4px;\n  margin: 4px 2px;\n  padding: 0 1em;\n  height: 2.8em;\n  font-size: 16px;\n  color: #fff;\n  background-color: #488aff;\n}\n\n.button-ios.activated {\n  background-color: #427feb;\n  opacity: 1;\n}\n\n.button-ios:hover:not(.disable-hover) {\n  opacity: 0.8;\n}\n\n.button-ios .icon {\n  fill: currentColor;\n}\n\n.button-large-ios {\n  padding: 0 1em;\n  height: 2.8em;\n  font-size: 20px;\n}\n\n.button-small-ios {\n  padding: 0 0.9em;\n  height: 2.1em;\n  font-size: 13px;\n}\n\n.button-block-ios {\n  margin-left: 0;\n  margin-right: 0;\n}\n\n.button-full-ios {\n  margin-left: 0;\n  margin-right: 0;\n  border-radius: 0;\n  border-right-width: 0;\n  border-left-width: 0;\n}\n\n.button-outline-ios {\n  border-radius: 4px;\n  border-width: 1px;\n  border-style: solid;\n  border-color: #488aff;\n  color: #488aff;\n  background-color: transparent;\n}\n\n.button-outline-ios.activated {\n  color: #fff;\n  background-color: #488aff;\n  opacity: 1;\n}\n\n.button-clear-ios {\n  border-color: transparent;\n  color: #488aff;\n  background-color: transparent;\n}\n\n.button-clear-ios.activated {\n  background-color: transparent;\n  opacity: 0.4;\n}\n\n.button-clear-ios:hover:not(.disable-hover) {\n  color: #488aff;\n  opacity: 0.6;\n}\n\n.button-round-ios {\n  border-radius: 64px;\n  padding: 0 26px;\n}\n\n.button-ios-primary {\n  color: #fff;\n  background-color: #488aff;\n}\n\n.button-ios-primary.activated {\n  background-color: #427feb;\n}\n\n.button-outline-ios-primary {\n  border-color: #488aff;\n  color: #488aff;\n  background-color: transparent;\n}\n\n.button-outline-ios-primary.activated {\n  color: #fff;\n  background-color: #488aff;\n}\n\n.button-clear-ios-primary {\n  border-color: transparent;\n  color: #488aff;\n  background-color: transparent;\n}\n\n.button-clear-ios-primary.activated {\n  opacity: 0.4;\n}\n\n.button-clear-ios-primary:hover:not(.disable-hover) {\n  color: #488aff;\n}\n\n.button-ios-secondary {\n  color: #fff;\n  background-color: #32db64;\n}\n\n.button-ios-secondary.activated {\n  background-color: #2ec95c;\n}\n\n.button-outline-ios-secondary {\n  border-color: #32db64;\n  color: #32db64;\n  background-color: transparent;\n}\n\n.button-outline-ios-secondary.activated {\n  color: #fff;\n  background-color: #32db64;\n}\n\n.button-clear-ios-secondary {\n  border-color: transparent;\n  color: #32db64;\n  background-color: transparent;\n}\n\n.button-clear-ios-secondary.activated {\n  opacity: 0.4;\n}\n\n.button-clear-ios-secondary:hover:not(.disable-hover) {\n  color: #32db64;\n}\n\n.button-ios-warning {\n  color: #000;\n  background-color: #ffeb3b;\n}\n\n.button-ios-warning.activated {\n  background-color: #ebd836;\n}\n\n.button-outline-ios-warning {\n  border-color: #ffeb3b;\n  color: #ffeb3b;\n  background-color: transparent;\n}\n\n.button-outline-ios-warning.activated {\n  color: #000;\n  background-color: #ffeb3b;\n}\n\n.button-clear-ios-warning {\n  border-color: transparent;\n  color: #ffeb3b;\n  background-color: transparent;\n}\n\n.button-clear-ios-warning.activated {\n  opacity: 0.4;\n}\n\n.button-clear-ios-warning:hover:not(.disable-hover) {\n  color: #ffeb3b;\n}\n\n.button-ios-danger {\n  color: #fff;\n  background-color: #f53d3d;\n}\n\n.button-ios-danger.activated {\n  background-color: #e13838;\n}\n\n.button-outline-ios-danger {\n  border-color: #f53d3d;\n  color: #f53d3d;\n  background-color: transparent;\n}\n\n.button-outline-ios-danger.activated {\n  color: #fff;\n  background-color: #f53d3d;\n}\n\n.button-clear-ios-danger {\n  border-color: transparent;\n  color: #f53d3d;\n  background-color: transparent;\n}\n\n.button-clear-ios-danger.activated {\n  opacity: 0.4;\n}\n\n.button-clear-ios-danger:hover:not(.disable-hover) {\n  color: #f53d3d;\n}\n\n.button-ios-light {\n  color: #000;\n  background-color: #f4f4f4;\n}\n\n.button-ios-light.activated {\n  background-color: #e0e0e0;\n}\n\n.button-outline-ios-light {\n  border-color: #f4f4f4;\n  color: #f4f4f4;\n  background-color: transparent;\n}\n\n.button-outline-ios-light.activated {\n  color: #000;\n  background-color: #f4f4f4;\n}\n\n.button-clear-ios-light {\n  border-color: transparent;\n  color: #f4f4f4;\n  background-color: transparent;\n}\n\n.button-clear-ios-light.activated {\n  opacity: 0.4;\n}\n\n.button-clear-ios-light:hover:not(.disable-hover) {\n  color: #f4f4f4;\n}\n\n.button-ios-dark {\n  color: #fff;\n  background-color: #222;\n}\n\n.button-ios-dark.activated {\n  background-color: #343434;\n}\n\n.button-outline-ios-dark {\n  border-color: #222;\n  color: #222;\n  background-color: transparent;\n}\n\n.button-outline-ios-dark.activated {\n  color: #fff;\n  background-color: #222;\n}\n\n.button-clear-ios-dark {\n  border-color: transparent;\n  color: #222;\n  background-color: transparent;\n}\n\n.button-clear-ios-dark.activated {\n  opacity: 0.4;\n}\n\n.button-clear-ios-dark:hover:not(.disable-hover) {\n  color: #222;\n}\n\n.button-strong-ios {\n  font-weight: 600;\n}";
Button.styleMode = "ios";

export { Button as IonButton };
