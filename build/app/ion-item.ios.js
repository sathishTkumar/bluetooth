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
Item.style = "ion-item {\n  display: block;\n  contain: content;\n}\n\n.item-block {\n  margin: 0;\n  padding: 0;\n  text-align: initial;\n  display: flex;\n  overflow: hidden;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  min-height: 44px;\n  border: 0;\n  font-weight: normal;\n  line-height: normal;\n  text-decoration: none;\n  color: inherit;\n}\n\n.item-inner {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  overflow: hidden;\n  flex: 1;\n  flex-direction: inherit;\n  align-items: inherit;\n  align-self: stretch;\n  min-height: inherit;\n  border: 0;\n}\n\n.input-wrapper {\n  display: flex;\n  overflow: hidden;\n  flex: 1;\n  flex-direction: inherit;\n  align-items: inherit;\n  align-self: stretch;\n  text-overflow: ellipsis;\n}\n\n.item[no-lines],\n.item.item[no-lines] .item-inner {\n  border: 0;\n}\n\nion-item-group {\n  display: block;\n}\n\n[vertical-align-top],\nion-input.item {\n  align-items: flex-start;\n}\n\n.item-cover {\n  left: 0;\n  top: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n}\n\n.item-ios {\n  padding-left: 16px;\n  padding-left: calc(constant(safe-area-inset-left) + 16px);\n  padding-left: calc(env(safe-area-inset-left) + 16px);\n  border-radius: 0;\n  position: relative;\n  font-size: 17px;\n  color: #000;\n  background-color: #fff;\n  transition: background-color 200ms linear;\n}\n\n.item-ios.activated {\n  background-color: #d9d9d9;\n  transition-duration: 0ms;\n}\n\n.item-ios h1 {\n  margin: 0 0 2px;\n  font-size: 24px;\n  font-weight: normal;\n}\n\n.item-ios h2 {\n  margin: 0 0 2px;\n  font-size: 17px;\n  font-weight: normal;\n}\n\n.item-ios h3,\n.item-ios h4,\n.item-ios h5,\n.item-ios h6 {\n  margin: 0 0 3px;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: normal;\n}\n\n.item-ios p {\n  margin: 0 0 2px;\n  overflow: inherit;\n  font-size: 14px;\n  line-height: normal;\n  text-overflow: inherit;\n  color: #8e9093;\n}\n\n.item-ios h2:last-child,\n.item-ios h3:last-child,\n.item-ios h4:last-child,\n.item-ios h5:last-child,\n.item-ios h6:last-child,\n.item-ios p:last-child {\n  margin-bottom: 0;\n}\n\n.item-ios.item-block .item-inner {\n  padding-right: 8px;\n  border-bottom: 0.55px solid #c8c7cc;\n}\n\n\@media screen and (orientation: landscape) {\n  .item-ios.item-block .item-inner {\n    padding-right: calc(constant(safe-area-inset-right) + 8px);\n    padding-right: calc(env(safe-area-inset-right) + 8px);\n  }\n}\n\n.item-ios [slot=\"start\"] {\n  margin: 8px 16px 8px 0;\n}\n\n.item-ios [slot=\"end\"] {\n  margin: 8px;\n}\n\n.item-ios ion-icon[slot=\"start\"],\n.item-ios ion-icon[slot=\"end\"] {\n  margin-left: 0;\n  margin-top: 9px;\n  margin-bottom: 8px;\n}\n\n.item-ios .item-button {\n  padding: 0 0.5em;\n  height: 24px;\n  font-size: 13px;\n}\n\n.item-ios .item-button ion-icon[slot=\"icon-only\"] {\n  padding: 0 1px;\n}\n\n.item-ios ion-avatar[slot=\"start\"],\n.item-ios ion-thumbnail[slot=\"start\"] {\n  margin: 8px 16px 8px 0;\n}\n\n.item-ios ion-avatar[slot=\"end\"],\n.item-ios ion-thumbnail[slot=\"end\"] {\n  margin: 8px;\n}\n\n.item-ios.item-label-stacked [slot=\"end\"],\n.item-ios.item-label-floating [slot=\"end\"] {\n  margin-top: 6px;\n  margin-bottom: 6px;\n}\n\n.item-ios ion-avatar {\n  width: 36px;\n  height: 36px;\n}\n\n.item-ios ion-thumbnail {\n  width: 56px;\n  height: 56px;\n}\n\n.item-ios[detail-push] .item-inner,\nbutton.item-ios:not([detail-none]) .item-inner,\na.item-ios:not([detail-none]) .item-inner {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2012%2020'><path%20d='M2,20l-2-2l8-8L0,2l2-2l10,10L2,20z'%20fill='%23c8c7cc'/></svg>\");\n  padding-right: 32px;\n  background-position: right 14px center;\n  background-position: right calc(14px + constant(safe-area-inset-right)) center;\n  background-position: right calc(14px + env(safe-area-inset-right)) center;\n  background-repeat: no-repeat;\n  background-size: 14px 14px;\n}\n\nion-item-group .item-ios:first-child .item-inner {\n  border-top-width: 0;\n}\n\nion-item-group .item-ios:last-child .item-inner,\nion-item-group .item-wrapper:last-child .item-ios .item-inner {\n  border: 0;\n}\n\n.item-ios .text-ios-primary {\n  color: #488aff;\n}\n\n.item-ios-primary,\n.item-divider-ios-primary {\n  color: #fff;\n  background-color: #488aff;\n}\n\n.item-ios-primary p,\n.item-divider-ios-primary p {\n  color: #fff;\n}\n\n.item-ios-primary.activated,\n.item-divider-ios-primary.activated {\n  background-color: #427feb;\n}\n\n.item-ios .text-ios-secondary {\n  color: #32db64;\n}\n\n.item-ios-secondary,\n.item-divider-ios-secondary {\n  color: #fff;\n  background-color: #32db64;\n}\n\n.item-ios-secondary p,\n.item-divider-ios-secondary p {\n  color: #fff;\n}\n\n.item-ios-secondary.activated,\n.item-divider-ios-secondary.activated {\n  background-color: #2ec95c;\n}\n\n.item-ios .text-ios-warning {\n  color: #ffeb3b;\n}\n\n.item-ios-warning,\n.item-divider-ios-warning {\n  color: #000;\n  background-color: #ffeb3b;\n}\n\n.item-ios-warning p,\n.item-divider-ios-warning p {\n  color: #000;\n}\n\n.item-ios-warning.activated,\n.item-divider-ios-warning.activated {\n  background-color: #ebd836;\n}\n\n.item-ios .text-ios-danger {\n  color: #f53d3d;\n}\n\n.item-ios-danger,\n.item-divider-ios-danger {\n  color: #fff;\n  background-color: #f53d3d;\n}\n\n.item-ios-danger p,\n.item-divider-ios-danger p {\n  color: #fff;\n}\n\n.item-ios-danger.activated,\n.item-divider-ios-danger.activated {\n  background-color: #e13838;\n}\n\n.item-ios .text-ios-light {\n  color: #f4f4f4;\n}\n\n.item-ios-light,\n.item-divider-ios-light {\n  color: #000;\n  background-color: #f4f4f4;\n}\n\n.item-ios-light p,\n.item-divider-ios-light p {\n  color: #000;\n}\n\n.item-ios-light.activated,\n.item-divider-ios-light.activated {\n  background-color: #e0e0e0;\n}\n\n.item-ios .text-ios-dark {\n  color: #222;\n}\n\n.item-ios-dark,\n.item-divider-ios-dark {\n  color: #fff;\n  background-color: #222;\n}\n\n.item-ios-dark p,\n.item-divider-ios-dark p {\n  color: #fff;\n}\n\n.item-ios-dark.activated,\n.item-divider-ios-dark.activated {\n  background-color: #343434;\n}";
Item.styleMode = "ios";

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
List.style = "ion-list {\n  margin: 0;\n  padding: 0;\n  display: block;\n  contain: content;\n  list-style-type: none;\n}\n\nion-list[inset] {\n  overflow: hidden;\n  transform: translateZ(0);\n}\n\n.list-ios {\n  margin: -1px 0 32px;\n}\n\n.list-ios > .item-block:first-child {\n  border-top: 0.55px solid #c8c7cc;\n}\n\n.list-ios > .item-block:last-child,\n.list-ios > .item-wrapper:last-child .item-block {\n  border-bottom: 0.55px solid #c8c7cc;\n}\n\n.list-ios > .item-block:last-child .item-inner,\n.list-ios > .item-wrapper:last-child .item-block .item-inner {\n  border-bottom: 0;\n}\n\n.list-ios .item-block .item-inner {\n  border-bottom: 0.55px solid #c8c7cc;\n}\n\n.list-ios .item[no-lines],\n.list-ios .item[no-lines] .item-inner {\n  border-width: 0;\n}\n\n.list-ios:not([inset]) + .list-ios:not([inset]) ion-list-header {\n  margin-top: -10px;\n  padding-top: 0;\n}\n\n.list-ios[inset] {\n  margin: 16px;\n  border-radius: 4px;\n}\n\n.list-ios[inset] ion-list-header {\n  background-color: #fff;\n}\n\n.list-ios[inset] .item {\n  border-bottom: 1px solid #c8c7cc;\n}\n\n.list-ios[inset] .item-inner {\n  border-bottom: 0;\n}\n\n.list-ios[inset] > .item:first-child,\n.list-ios[inset] > .item-wrapper:first-child .item {\n  border-top: 0;\n}\n\n.list-ios[inset] > .item:last-child,\n.list-ios[inset] > .item-wrapper:last-child .item {\n  border-bottom: 0;\n}\n\n.list-ios[inset] + ion-list[inset] {\n  margin-top: 0;\n}\n\n.list-ios[no-lines] ion-list-header,\n.list-ios[no-lines] .item,\n.list-ios[no-lines] .item .item-inner {\n  border-width: 0;\n}";
List.styleMode = "ios";

export { Item as IonItem, List as IonList };
