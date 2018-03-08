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
Button.style = ".button {\n  text-align: center;\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n  position: relative;\n  z-index: 0;\n  display: inline-block;\n  border: 0;\n  line-height: 1;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: none;\n  white-space: nowrap;\n  cursor: pointer;\n  vertical-align: top;\n  vertical-align: -webkit-baseline-middle;\n  transition: background-color, opacity 100ms linear;\n  font-kerning: none;\n  user-select: none;\n  contain: content;\n}\n\n.button-inner {\n  display: flex;\n  flex-flow: row nowrap;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n\na[disabled],\nbutton[disabled],\n.button[disabled] {\n  cursor: default;\n  opacity: .4;\n  pointer-events: none;\n}\n\n.button-block {\n  display: block;\n  clear: both;\n  width: 100%;\n  contain: strict;\n}\n\n.button-block::after {\n  clear: both;\n}\n\n.button-full {\n  display: block;\n  width: 100%;\n  contain: strict;\n}\n\n.button-full.button-outline {\n  border-radius: 0;\n  border-right-width: 0;\n  border-left-width: 0;\n}\n\n.button ion-icon {\n  width: 1.4em;\n  height: 1.4em;\n  pointer-events: none;\n}\n\n.button ion-icon[slot=\"start\"] {\n  margin: 0 0.3em 0 -0.3em;\n}\n\n.button ion-icon[slot=\"end\"] {\n  margin: 0 -0.2em 0 0.3em;\n}\n\n.button ion-icon[slot=\"icon-only\"] {\n  width: 1.8em;\n  height: 1.8em;\n}\n\n.button-md {\n  border-radius: 2px;\n  margin: 4px 2px;\n  padding: 0 1.1em;\n  overflow: hidden;\n  height: 36px;\n  font-size: 14px;\n  font-weight: 500;\n  text-transform: uppercase;\n  color: #fff;\n  background-color: #488aff;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.button-md:hover:not(.disable-hover) {\n  background-color: #488aff;\n}\n\n.button-md.activated {\n  background-color: #427feb;\n  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.14), 0 3px 5px rgba(0, 0, 0, 0.21), 0 0 0 0 transparent;\n}\n\n.button-md .button-effect {\n  background-color: #fff;\n}\n\n.button-md .icon {\n  fill: currentColor;\n}\n\n.button-large-md {\n  padding: 0 1em;\n  height: 2.8em;\n  font-size: 20px;\n}\n\n.button-small-md {\n  padding: 0 0.9em;\n  height: 2.1em;\n  font-size: 13px;\n}\n\n.button-block-md {\n  margin-left: 0;\n  margin-right: 0;\n}\n\n.button-full-md {\n  margin-left: 0;\n  margin-right: 0;\n  border-radius: 0;\n  border-right-width: 0;\n  border-left-width: 0;\n}\n\n.button-outline-md {\n  border-width: 1px;\n  border-style: solid;\n  border-color: #488aff;\n  color: #488aff;\n  background-color: transparent;\n  box-shadow: none;\n}\n\n.button-outline-md:hover:not(.disable-hover) {\n  background-color: rgba(158, 158, 158, 0.1);\n}\n\n.button-outline-md.activated {\n  background-color: transparent;\n  box-shadow: none;\n  opacity: 1;\n}\n\n.button-outline-md .button-effect {\n  background-color: #488aff;\n}\n\n.button-clear-md {\n  border-color: transparent;\n  color: #488aff;\n  background-color: transparent;\n  box-shadow: none;\n  opacity: 1;\n}\n\n.button-clear-md.activated {\n  background-color: rgba(158, 158, 158, 0.2);\n  box-shadow: none;\n}\n\n.button-clear-md:hover:not(.disable-hover) {\n  background-color: rgba(158, 158, 158, 0.1);\n}\n\n.button-clear-md .button-effect {\n  background-color: #999;\n}\n\n.button-round-md {\n  border-radius: 64px;\n  padding: 0 26px;\n}\n\n.button-md ion-icon[slot=\"icon-only\"] {\n  padding: 0;\n}\n\n.button-effect {\n  border-radius: 50%;\n  transform-origin: center center;\n  position: absolute;\n  z-index: 0;\n  display: none;\n  background-color: #555;\n  opacity: .2;\n  transition-timing-function: ease-in-out;\n  pointer-events: none;\n  top: 0;\n  left: 0;\n}\n\n.md .button-effect {\n  display: block;\n}\n\n.button-md-primary {\n  color: #fff;\n  background-color: #488aff;\n}\n\n.button-md-primary:hover:not(.disable-hover) {\n  background-color: #488aff;\n}\n\n.button-md-primary.activated {\n  background-color: #427feb;\n  opacity: 1;\n}\n\n.button-md-primary .button-effect {\n  background-color: #fff;\n}\n\n.button-outline-md-primary {\n  border-color: #4483f2;\n  color: #4483f2;\n  background-color: transparent;\n}\n\n.button-outline-md-primary:hover:not(.disable-hover) {\n  background-color: rgba(158, 158, 158, 0.1);\n}\n\n.button-outline-md-primary.activated {\n  background-color: transparent;\n}\n\n.button-outline-md-primary .button-effect {\n  background-color: #4483f2;\n}\n\n.button-clear-md-primary {\n  border-color: transparent;\n  color: #488aff;\n  background-color: transparent;\n}\n\n.button-clear-md-primary.activated {\n  background-color: rgba(158, 158, 158, 0.2);\n  box-shadow: none;\n}\n\n.button-clear-md-primary:hover:not(.disable-hover) {\n  color: #488aff;\n}\n\n.button-md-secondary {\n  color: #fff;\n  background-color: #32db64;\n}\n\n.button-md-secondary:hover:not(.disable-hover) {\n  background-color: #32db64;\n}\n\n.button-md-secondary.activated {\n  background-color: #2ec95c;\n  opacity: 1;\n}\n\n.button-md-secondary .button-effect {\n  background-color: #fff;\n}\n\n.button-outline-md-secondary {\n  border-color: #30d05f;\n  color: #30d05f;\n  background-color: transparent;\n}\n\n.button-outline-md-secondary:hover:not(.disable-hover) {\n  background-color: rgba(158, 158, 158, 0.1);\n}\n\n.button-outline-md-secondary.activated {\n  background-color: transparent;\n}\n\n.button-outline-md-secondary .button-effect {\n  background-color: #30d05f;\n}\n\n.button-clear-md-secondary {\n  border-color: transparent;\n  color: #32db64;\n  background-color: transparent;\n}\n\n.button-clear-md-secondary.activated {\n  background-color: rgba(158, 158, 158, 0.2);\n  box-shadow: none;\n}\n\n.button-clear-md-secondary:hover:not(.disable-hover) {\n  color: #32db64;\n}\n\n.button-md-warning {\n  color: #000;\n  background-color: #ffeb3b;\n}\n\n.button-md-warning:hover:not(.disable-hover) {\n  background-color: #ffeb3b;\n}\n\n.button-md-warning.activated {\n  background-color: #ebd836;\n  opacity: 1;\n}\n\n.button-md-warning .button-effect {\n  background-color: #000;\n}\n\n.button-outline-md-warning {\n  border-color: #f2df38;\n  color: #f2df38;\n  background-color: transparent;\n}\n\n.button-outline-md-warning:hover:not(.disable-hover) {\n  background-color: rgba(158, 158, 158, 0.1);\n}\n\n.button-outline-md-warning.activated {\n  background-color: transparent;\n}\n\n.button-outline-md-warning .button-effect {\n  background-color: #f2df38;\n}\n\n.button-clear-md-warning {\n  border-color: transparent;\n  color: #ffeb3b;\n  background-color: transparent;\n}\n\n.button-clear-md-warning.activated {\n  background-color: rgba(158, 158, 158, 0.2);\n  box-shadow: none;\n}\n\n.button-clear-md-warning:hover:not(.disable-hover) {\n  color: #ffeb3b;\n}\n\n.button-md-danger {\n  color: #fff;\n  background-color: #f53d3d;\n}\n\n.button-md-danger:hover:not(.disable-hover) {\n  background-color: #f53d3d;\n}\n\n.button-md-danger.activated {\n  background-color: #e13838;\n  opacity: 1;\n}\n\n.button-md-danger .button-effect {\n  background-color: #fff;\n}\n\n.button-outline-md-danger {\n  border-color: #e93a3a;\n  color: #e93a3a;\n  background-color: transparent;\n}\n\n.button-outline-md-danger:hover:not(.disable-hover) {\n  background-color: rgba(158, 158, 158, 0.1);\n}\n\n.button-outline-md-danger.activated {\n  background-color: transparent;\n}\n\n.button-outline-md-danger .button-effect {\n  background-color: #e93a3a;\n}\n\n.button-clear-md-danger {\n  border-color: transparent;\n  color: #f53d3d;\n  background-color: transparent;\n}\n\n.button-clear-md-danger.activated {\n  background-color: rgba(158, 158, 158, 0.2);\n  box-shadow: none;\n}\n\n.button-clear-md-danger:hover:not(.disable-hover) {\n  color: #f53d3d;\n}\n\n.button-md-light {\n  color: #000;\n  background-color: #f4f4f4;\n}\n\n.button-md-light:hover:not(.disable-hover) {\n  background-color: #f4f4f4;\n}\n\n.button-md-light.activated {\n  background-color: #e0e0e0;\n  opacity: 1;\n}\n\n.button-md-light .button-effect {\n  background-color: #000;\n}\n\n.button-outline-md-light {\n  border-color: #e8e8e8;\n  color: #e8e8e8;\n  background-color: transparent;\n}\n\n.button-outline-md-light:hover:not(.disable-hover) {\n  background-color: rgba(158, 158, 158, 0.1);\n}\n\n.button-outline-md-light.activated {\n  background-color: transparent;\n}\n\n.button-outline-md-light .button-effect {\n  background-color: #e8e8e8;\n}\n\n.button-clear-md-light {\n  border-color: transparent;\n  color: #f4f4f4;\n  background-color: transparent;\n}\n\n.button-clear-md-light.activated {\n  background-color: rgba(158, 158, 158, 0.2);\n  box-shadow: none;\n}\n\n.button-clear-md-light:hover:not(.disable-hover) {\n  color: #f4f4f4;\n}\n\n.button-md-dark {\n  color: #fff;\n  background-color: #222;\n}\n\n.button-md-dark:hover:not(.disable-hover) {\n  background-color: #222;\n}\n\n.button-md-dark.activated {\n  background-color: #343434;\n  opacity: 1;\n}\n\n.button-md-dark .button-effect {\n  background-color: #fff;\n}\n\n.button-outline-md-dark {\n  border-color: #2d2d2d;\n  color: #2d2d2d;\n  background-color: transparent;\n}\n\n.button-outline-md-dark:hover:not(.disable-hover) {\n  background-color: rgba(158, 158, 158, 0.1);\n}\n\n.button-outline-md-dark.activated {\n  background-color: transparent;\n}\n\n.button-outline-md-dark .button-effect {\n  background-color: #2d2d2d;\n}\n\n.button-clear-md-dark {\n  border-color: transparent;\n  color: #222;\n  background-color: transparent;\n}\n\n.button-clear-md-dark.activated {\n  background-color: rgba(158, 158, 158, 0.2);\n  box-shadow: none;\n}\n\n.button-clear-md-dark:hover:not(.disable-hover) {\n  color: #222;\n}\n\n.button-strong-md {\n  font-weight: bold;\n}";
Button.styleMode = "md";

export { Button as IonButton };
