/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { createThemedClasses } from './chunk3.js';
import './chunk1.js';
import './chunk2.js';

class Item {
    constructor() {
        this.itemStyles = {};
    }
    itemStyle(ev) {
        ev.stopPropagation();
        let hasChildStyleChange = false;
        let tagName = ev.target.tagName;
        let updatedStyles = ev.detail;
        for (var key in updatedStyles) {
            if (("item-" + key) !== key) {
                Object.defineProperty(updatedStyles, "item-" + key, Object.getOwnPropertyDescriptor(updatedStyles, key));
                delete updatedStyles[key];
                hasChildStyleChange = true;
            }
        }
        this.itemStyles[tagName] = updatedStyles;
        if (hasChildStyleChange) {
            this.hasStyleChange = true;
        }
    }
    componentDidLoad() {
        // Change the button size to small for each ion-button in the item
        // unless the size is explicitly set
        const buttons = this.el.querySelectorAll("ion-button");
        for (var i = 0; i < buttons.length; i++) {
            if (!buttons[i].size) {
                buttons[i].size = "small";
            }
        }
    }
    render() {
        let childStyles = {};
        for (var key in this.itemStyles) {
            childStyles = Object.assign(childStyles, this.itemStyles[key]);
        }
        let themedClasses = Object.assign({}, childStyles, createThemedClasses(this.mode, this.color, "item"), { "item-block": true });
        this.hasStyleChange = false;
        // TODO add support for button items
        const TagType = this.href ? "a" : "div";
        return (h(TagType, { class: themedClasses }, h("slot", { name: "start" }), h("div", { class: "item-inner" }, h("div", { class: "input-wrapper" }, h("slot", null)), h("slot", { name: "end" })), h("div", { class: "button-effect" })));
    }
}
Item.is = "ion-item";
Item.properties = { "color": { "type": String, "attr": "color" }, "el": { "elementRef": true }, "hasStyleChange": { "state": true }, "href": { "type": String, "attr": "href" }, "mode": { "type": "Any", "attr": "mode" } };
Item.style = "ion-item {\n  display: block;\n  contain: content;\n}\n\n.item-block {\n  margin: 0;\n  padding: 0;\n  text-align: initial;\n  display: flex;\n  overflow: hidden;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  min-height: 44px;\n  border: 0;\n  font-weight: normal;\n  line-height: normal;\n  text-decoration: none;\n  color: inherit;\n}\n\n.item-inner {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  overflow: hidden;\n  flex: 1;\n  flex-direction: inherit;\n  align-items: inherit;\n  align-self: stretch;\n  min-height: inherit;\n  border: 0;\n}\n\n.input-wrapper {\n  display: flex;\n  overflow: hidden;\n  flex: 1;\n  flex-direction: inherit;\n  align-items: inherit;\n  align-self: stretch;\n  text-overflow: ellipsis;\n}\n\n.item[no-lines],\n.item.item[no-lines] .item-inner {\n  border: 0;\n}\n\nion-item-group {\n  display: block;\n}\n\n[vertical-align-top],\nion-input.item {\n  align-items: flex-start;\n}\n\n.item-cover {\n  left: 0;\n  top: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n}\n\n.item-md {\n  padding-left: 16px;\n  padding-right: 0;\n  position: relative;\n  font-size: 16px;\n  font-weight: normal;\n  text-transform: none;\n  color: #000;\n  background-color: #fff;\n  box-shadow: none;\n  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.item-md.activated {\n  background-color: #f1f1f1;\n}\n\n.item-md[no-lines] {\n  border-width: 0;\n}\n\n.item-md h1 {\n  margin: 0 0 2px;\n  font-size: 24px;\n  font-weight: normal;\n}\n\n.item-md h2 {\n  margin: 2px 0;\n  font-size: 16px;\n  font-weight: normal;\n}\n\n.item-md h3,\n.item-md h4,\n.item-md h5,\n.item-md h6 {\n  margin: 2px 0;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: normal;\n}\n\n.item-md p {\n  margin: 0 0 2px;\n  overflow: inherit;\n  font-size: 14px;\n  line-height: normal;\n  text-overflow: inherit;\n  color: #666;\n}\n\n.item-md.item-block .item-inner {\n  padding-right: 8px;\n  border-bottom: 1px solid #dedede;\n}\n\n.item-md [slot=\"start\"],\n.item-md [slot=\"end\"] {\n  margin: 9px 8px 9px 0;\n}\n\n.item-md ion-icon[slot=\"start\"],\n.item-md ion-icon[slot=\"end\"] {\n  margin-left: 0;\n  margin-top: 11px;\n  margin-bottom: 10px;\n}\n\n.item-md .item-button {\n  padding: 0 0.6em;\n  height: 25px;\n  font-size: 12px;\n}\n\n.item-md .item-button ion-icon[slot=\"icon-only\"] {\n  padding: 0;\n}\n\n.item-md ion-icon[slot=\"start\"] + .item-inner,\n.item-md ion-icon[slot=\"start\"] + .item-input {\n  margin-left: 24px;\n}\n\n.item-md ion-avatar[slot=\"start\"],\n.item-md ion-thumbnail[slot=\"start\"] {\n  margin: 8px 16px 8px 0;\n}\n\n.item-md ion-avatar[slot=\"end\"],\n.item-md ion-thumbnail[slot=\"end\"] {\n  margin: 8px;\n}\n\n.item-md.item-label-stacked [slot=\"end\"],\n.item-md.item-label-floating [slot=\"end\"] {\n  margin-top: 7px;\n  margin-bottom: 7px;\n}\n\n.item-md ion-avatar {\n  width: 40px;\n  height: 40px;\n}\n\n.item-md ion-thumbnail {\n  width: 80px;\n  height: 80px;\n}\n\nion-item-group .item-md:first-child .item-inner {\n  border-top-width: 0;\n}\n\nion-item-group .item-md:last-child .item-inner,\nion-item-group .item-md .item-wrapper:last-child .item-inner {\n  border: 0;\n}\n\n.item-md .text-md-primary {\n  color: #488aff;\n}\n\n.item-md-primary,\n.item-divider-md-primary {\n  color: #fff;\n  background-color: #488aff;\n}\n\n.item-md-primary p,\n.item-divider-md-primary p {\n  color: #fff;\n}\n\n.item-md-primary.activated,\n.item-divider-md-primary.activated {\n  background-color: #427feb;\n}\n\n.item-md .text-md-secondary {\n  color: #32db64;\n}\n\n.item-md-secondary,\n.item-divider-md-secondary {\n  color: #fff;\n  background-color: #32db64;\n}\n\n.item-md-secondary p,\n.item-divider-md-secondary p {\n  color: #fff;\n}\n\n.item-md-secondary.activated,\n.item-divider-md-secondary.activated {\n  background-color: #2ec95c;\n}\n\n.item-md .text-md-warning {\n  color: #ffeb3b;\n}\n\n.item-md-warning,\n.item-divider-md-warning {\n  color: #000;\n  background-color: #ffeb3b;\n}\n\n.item-md-warning p,\n.item-divider-md-warning p {\n  color: #000;\n}\n\n.item-md-warning.activated,\n.item-divider-md-warning.activated {\n  background-color: #ebd836;\n}\n\n.item-md .text-md-danger {\n  color: #f53d3d;\n}\n\n.item-md-danger,\n.item-divider-md-danger {\n  color: #fff;\n  background-color: #f53d3d;\n}\n\n.item-md-danger p,\n.item-divider-md-danger p {\n  color: #fff;\n}\n\n.item-md-danger.activated,\n.item-divider-md-danger.activated {\n  background-color: #e13838;\n}\n\n.item-md .text-md-light {\n  color: #f4f4f4;\n}\n\n.item-md-light,\n.item-divider-md-light {\n  color: #000;\n  background-color: #f4f4f4;\n}\n\n.item-md-light p,\n.item-divider-md-light p {\n  color: #000;\n}\n\n.item-md-light.activated,\n.item-divider-md-light.activated {\n  background-color: #e0e0e0;\n}\n\n.item-md .text-md-dark {\n  color: #222;\n}\n\n.item-md-dark,\n.item-divider-md-dark {\n  color: #fff;\n  background-color: #222;\n}\n\n.item-md-dark p,\n.item-divider-md-dark p {\n  color: #fff;\n}\n\n.item-md-dark.activated,\n.item-divider-md-dark.activated {\n  background-color: #343434;\n}\n\n.item-md ion-reorder {\n  font-size: 1.5em;\n  opacity: .3;\n}";
Item.styleMode = "md";

class List {
    getOpenedItem() {
        return this.openedItem;
    }
    setOpenedItem(itemSliding) {
        this.openedItem = itemSliding;
    }
    closeSlidingItems() {
        if (this.openedItem) {
            this.openedItem.close();
            this.openedItem = null;
            return true;
        }
        return false;
    }
    render() {
        return h("slot", null);
    }
}
List.is = "ion-list";
List.host = { "theme": "list" };
List.properties = { "closeSlidingItems": { "method": true }, "getOpenedItem": { "method": true }, "setOpenedItem": { "method": true } };
List.style = "ion-list {\n  margin: 0;\n  padding: 0;\n  display: block;\n  contain: content;\n  list-style-type: none;\n}\n\nion-list[inset] {\n  overflow: hidden;\n  transform: translateZ(0);\n}\n\n.list-md {\n  margin: -1px 0 16px;\n}\n\n.list-md .item-block .item-inner {\n  border-bottom: 1px solid #dedede;\n}\n\n.list-md > .item-block:last-child ion-label,\n.list-md > .item-block:last-child .item-inner,\n.list-md > .item-wrapper:last-child ion-label,\n.list-md > .item-wrapper:last-child .item-inner {\n  border-bottom: 0;\n}\n\n.list-md > ion-input:last-child::after {\n  left: 0;\n}\n\n.list-md .item[no-lines],\n.list-md .item[no-lines] .item-inner {\n  border-width: 0;\n}\n\n.list-md + ion-list ion-list-header {\n  margin-top: -16px;\n}\n\n.list-md[inset] {\n  margin: 16px;\n  border-radius: 2px;\n}\n\n.list-md[inset] .item:first-child {\n  border-top-left-radius: 2px;\n  border-top-right-radius: 2px;\n  border-top-width: 0;\n}\n\n.list-md[inset] .item:last-child {\n  border-bottom-right-radius: 2px;\n  border-bottom-left-radius: 2px;\n  border-bottom-width: 0;\n}\n\n.list-md[inset] .item-input {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.list-md[inset] + ion-list[inset] {\n  margin-top: 0;\n}\n\n.list-md[inset] ion-list-header {\n  background-color: #fff;\n}\n\n.list-md[no-lines] .item-block,\n.list-md[no-lines] .item .item-inner {\n  border-width: 0;\n}\n\n.list-md .item-input:last-child {\n  border-bottom: 1px solid #dedede;\n}";
List.styleMode = "md";

export { Item as IonItem, List as IonList };
