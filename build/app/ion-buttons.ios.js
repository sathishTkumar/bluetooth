/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import './chunk1.js';
import { createThemedClasses, getElementClassObject } from './chunk3.js';
import { getPageElement } from './chunk2.js';

class Buttons {
    componentDidLoad() {
        const buttons = this.el.querySelectorAll("ion-button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute("button-type", "bar-button");
        }
    }
    render() {
        return h("slot", null);
    }
}
Buttons.is = "ion-buttons";
Buttons.host = { "theme": "bar-buttons" };
Buttons.properties = { "el": { "elementRef": true } };

class Content {
    constructor() {
        this.cTop = 0;
        this.cBottom = 0;
        this.dirty = false;
        /**
         * @input {boolean} If true, the content will scroll behind the headers
         * and footers. This effect can easily be seen by setting the toolbar
         * to transparent.
         */
        this.fullscreen = false;
    }
    onNavChanged() {
        this.resize();
    }
    componentDidLoad() {
        this.scrollEl = this.el.querySelector("ion-scroll");
        this.resize();
    }
    componentDidUnload() {
        this.scrollEl = null;
    }
    hostData() {
        return {
            class: {
                "statusbar-padding": this.config.getBoolean("statusbarPadding")
            }
        };
    }
    enableJsScroll() {
        this.scrollEl.jsScroll = true;
    }
    /**
     * Scroll to the top of the content component.
     *
     * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
     */
    scrollToTop(duration = 300) {
        return this.scrollEl.scrollToTop(duration);
    }
    /**
     * Scroll to the bottom of the content component.
     *
     * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
     */
    scrollToBottom(duration = 300) {
        return this.scrollEl.scrollToBottom(duration);
    }
    resize() {
        if (!this.scrollEl) {
            return;
        }
        if (this.fullscreen) {
            Context.dom.raf(() => {
                Context.dom.read(this.readDimensions.bind(this));
                Context.dom.write(this.writeDimensions.bind(this));
            });
        }
        else {
            this.cTop = this.cBottom = null;
            Context.dom.write(() => this.scrollEl.removeAttribute("style"));
        }
    }
    readDimensions() {
        const page = getPageElement(this.el);
        const top = Math.max(this.el.offsetTop, 0);
        const bottom = Math.max(page.offsetHeight - top - this.el.offsetHeight, 0);
        this.dirty = top !== this.cTop || bottom !== this.cBottom;
        this.cTop = top;
        this.cBottom = bottom;
    }
    writeDimensions() {
        if (this.dirty && this.scrollEl) {
            const style = this.scrollEl.style;
            style.paddingTop = this.cTop + "px";
            style.paddingBottom = this.cBottom + "px";
            style.top = -this.cTop + "px";
            style.bottom = -this.cBottom + "px";
            this.dirty = false;
        }
    }
    render() {
        const themedClasses = createThemedClasses(this.mode, this.color, "content");
        const hostClasses = getElementClassObject(this.el.classList);
        const scrollClasses = Object.assign({}, themedClasses, hostClasses);
        this.resize();
        return [
            h("ion-scroll", { class: scrollClasses }, h("slot", null)),
            h("slot", { name: "fixed" })
        ];
    }
}
Content.is = "ion-content";
Content.properties = { "config": { "context": "config" }, "el": { "elementRef": true }, "enableJsScroll": { "method": true }, "fullscreen": { "type": Boolean, "attr": "fullscreen" }, "ionScroll": { "type": "Any", "attr": "ion-scroll" }, "ionScrollEnd": { "type": "Any", "attr": "ion-scroll-end" }, "ionScrollStart": { "type": "Any", "attr": "ion-scroll-start" }, "scrollToBottom": { "method": true }, "scrollToTop": { "method": true } };
Content.style = "ion-content {\n  position: relative;\n  display: block;\n  flex: 1;\n  width: 100%;\n  contain: layout size style;\n  padding: 0 !important;\n}\n\nion-scroll {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  z-index: 1;\n  display: block;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  -webkit-overflow-scrolling: touch;\n  will-change: scroll-position;\n  contain: size style layout;\n}\n\nion-content.js-scroll ion-scroll {\n  position: relative;\n  min-height: 100%;\n  overflow-x: initial;\n  overflow-y: initial;\n  -webkit-overflow-scrolling: auto;\n  will-change: initial;\n}\n\nion-content.has-refresher ion-scroll {\n  background-color: inherit;\n}\n\nion-app [no-padding],\nion-app [no-padding] ion-scroll {\n  padding: 0;\n}\n\nion-app [no-margin],\nion-app [no-margin] ion-scroll {\n  margin: 0;\n}\n\n.content-ios {\n  color: #000;\n  background-color: #fff;\n}\n\n.content-ios.outer-content {\n  background: #efeff4;\n}\n\n.content-ios hr {\n  height: 0.55px;\n  background-color: rgba(0, 0, 0, 0.12);\n}\n\n.app-ios [padding],\n.app-ios [padding] .scroll-inner {\n  padding: 16px;\n}\n\n.app-ios [padding-top],\n.app-ios [padding-top] .scroll-inner {\n  padding-top: 16px;\n}\n\n.app-ios [padding-left],\n.app-ios [padding-left] .scroll-inner {\n  padding-left: 16px;\n}\n\n.app-ios [padding-right],\n.app-ios [padding-right] .scroll-inner {\n  padding-right: 16px;\n}\n\n.app-ios [padding-bottom],\n.app-ios [padding-bottom] .scroll-inner {\n  padding-bottom: 16px;\n}\n\n.app-ios [padding-vertical],\n.app-ios [padding-vertical] .scroll-inner {\n  padding-top: 16px;\n  padding-bottom: 16px;\n}\n\n.app-ios [padding-horizontal],\n.app-ios [padding-horizontal] .scroll-inner {\n  padding-left: 16px;\n  padding-right: 16px;\n}\n\n.app-ios [margin],\n.app-ios [margin] ion-scroll {\n  margin: 16px;\n}\n\n.app-ios [margin-top],\n.app-ios [margin-top] ion-scroll {\n  margin-top: 16px;\n}\n\n.app-ios [margin-left],\n.app-ios [margin-left] ion-scroll {\n  margin-left: 16px;\n}\n\n.app-ios [margin-start],\n.app-ios [margin-start] ion-scroll {\n  margin-left: 16px;\n}\n\n.app-ios [margin-right],\n.app-ios [margin-right] ion-scroll {\n  margin-right: 16px;\n}\n\n.app-ios [margin-end],\n.app-ios [margin-end] ion-scroll {\n  margin-right: 16px;\n}\n\n.app-ios [margin-bottom],\n.app-ios [margin-bottom] ion-scroll {\n  margin-bottom: 16px;\n}\n\n.app-ios [margin-vertical],\n.app-ios [margin-vertical] ion-scroll {\n  margin-top: 16px;\n  margin-bottom: 16px;\n}\n\n.app-ios [margin-horizontal],\n.app-ios [margin-horizontal] ion-scroll {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n\n.content-ios:not([no-bounce]) > .scroll-content::before,\n.content-ios:not([no-bounce]) > .scroll-content::after {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  content: \"\";\n}\n\n.content-ios:not([no-bounce]) > .scroll-content::before {\n  bottom: -1px;\n}\n\n.content-ios:not([no-bounce]) > .scroll-content::after {\n  top: -1px;\n}\n\n.platform-core .content-ios .scroll-content::after,\n.platform-core .content-ios .scroll-content::before {\n  position: initial;\n  top: initial;\n  bottom: initial;\n  width: initial;\n  height: initial;\n}";
Content.styleMode = "ios";

class Header {
    constructor() {
        /**
         * @input {boolean} If true, adds transparency to the header.
         * Note: In order to scroll content behind the header, the `fullscreen`
         * attribute needs to be set on the content.
         * Only affects `ios` mode. Defaults to `false`.
         */
        this.translucent = false;
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, "header-translucent") : {};
        const hostClasses = Object.assign({}, themedClasses);
        return {
            class: hostClasses
        };
    }
    render() {
        return h("slot", null);
    }
}
Header.is = "ion-header";
Header.host = { "theme": "header" };
Header.properties = { "translucent": { "type": Boolean, "attr": "translucent" } };
Header.style = ".header-translucent-ios {\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n  backdrop-filter: saturate(180%) blur(20px);\n}";
Header.styleMode = "ios";

class Icon {
    constructor() {
        /**
         * @input {string} Specifies the label to use for accessibility. Defaults to the icon name.
         */
        this.ariaLabel = "";
        /**
         * @input {string} Specifies which icon to use. The appropriate icon will be used based on the mode.
         * For more information, see [Ionicons](/docs/ionicons/).
         */
        this.name = "";
        /**
         * @input {string} Specifies which icon to use on `ios` mode.
         */
        this.ios = "";
        /**
         * @input {string} Specifies which icon to use on `md` mode.
         */
        this.md = "";
        this.svgContent = null;
    }
    get iconName() {
        // if no name was passed set iconName to null
        if (!this.name) {
            return null;
        }
        let iconName = this.name.toLowerCase();
        // default to "md" if somehow the mode wasn't set
        const mode = this.mode || "md";
        if (!(/^md-|^ios-|^logo-/.test(iconName))) {
            // this does not have one of the defaults
            // so lets auto add in the mode prefix for them
            iconName = mode + "-" + iconName;
        }
        else if (this.ios && mode === "ios") {
            // if an icon was passed in using the ios or md attributes
            // set the iconName to whatever was passed in
            // when we're also on that mode
            // basically, use the ios attribute when you're on ios
            iconName = this.ios;
        }
        else if (this.md && mode === "md") {
            // use the md attribute when you're in md mode
            // and the md attribute has been set
            iconName = this.md;
        }
        // only allow alpha characters and dash
        const invalidChars = iconName.replace(/[a-z]|-|\d/g, "");
        if (invalidChars !== "") {
            console.error(`invalid characters in ion-icon name: ${invalidChars}`);
            return null;
        }
        return iconName;
    }
    hostData() {
        const attrs = {
            "role": "img"
        };
        if (this.ariaLabel) {
            // user provided label
            attrs["aria-label"] = this.ariaLabel;
        }
        else {
            // come up with the label based on the icon name
            const iconName = this.iconName;
            if (iconName) {
                attrs["aria-label"] = iconName
                    .replace("ios-", "")
                    .replace("md-", "")
                    .replace("-outline", "")
                    .replace(/\-/g, " ");
            }
        }
        return attrs;
    }
    render() {
        if (this.isServer) {
            return h("div", { class: "icon-inner" });
        }
        const iconName = this.iconName;
        if (!iconName) {
            // we don't have good data
            return h("div", { class: "icon-inner" });
        }
        const svgContent = svgContents[iconName];
        if (svgContent === this.svgContent) {
            // we've already loaded up this svg at one point
            // and the svg content we've loaded and assigned checks out
            // render this svg!!
            return h("div", { class: "icon-inner", innerHTML: svgContent });
        }
        // haven't loaded this svg yet
        // start the request
        loadSvgContent(iconName, loadedSvgContent => {
            // we're finished loading the svg content!
            // set to this.svgContent so we do another render
            this.svgContent = loadedSvgContent;
        });
        // actively requesting the svg, so let's just render a div for now
        return h("div", { class: "icon-inner" });
    }
}
function loadSvgContent(iconName, callback) {
    // static since all IonIcons use this same function and pointing at global/shared data
    // passed in callback will have instance info
    // add to the list of callbacks to fiure when this url is finished loading
    (loadCallbacks[iconName] = loadCallbacks[iconName] || []).push(callback);
    if (activeRequests[iconName]) {
        // already requesting this icon, don't bother kicking off another
        return;
    }
    // add this icons to our list of active requests
    activeRequests[iconName] = true;
    // kick off the request for the external svg file
    // create a script element to add to the document.head
    var scriptElm = document.createElement("script");
    scriptElm.charset = "utf-8";
    scriptElm.async = true;
    scriptElm.src = `${publicPath}svg/${iconName}.js`;
    // create a fallback timeout if something goes wrong
    var tmrId = setTimeout(onScriptComplete, 120000);
    function onScriptComplete() {
        clearTimeout(tmrId);
        scriptElm.onerror = scriptElm.onload = null;
        scriptElm.parentNode.removeChild(scriptElm);
        // remove from our list of active requests
        delete activeRequests[iconName];
    }
    // add script completed listener to this script element
    scriptElm.onerror = scriptElm.onload = onScriptComplete;
    // inject a script tag in the head
    // kick off the actual request
    document.head.appendChild(scriptElm);
}
const activeRequests = {};
const loadCallbacks = [];
const svgContents = {};
// add a jsonp handler to the window
// as svg jsonp files are requested
// once they load they'll call this method
window.loadIonicon = function loadIonicon(svgContent, iconName) {
    // awesome, we've finished loading the svg file
    // remove this url from the active requests
    delete activeRequests[iconName];
    svgContents[iconName] = svgContent;
    // find any callbacks waiting on this icon
    const svgLoadCallbacks = loadCallbacks[iconName];
    if (svgLoadCallbacks) {
        // loop through all the callbacks that are waiting on the svg content
        svgLoadCallbacks.forEach(cb => {
            // fire off this callback which was provided by an instance
            cb(svgContent);
        });
        delete loadCallbacks[iconName];
    }
};
Icon.is = "ion-icon";
Icon.host = { "theme": "icon" };
Icon.properties = { "ariaLabel": { "type": String, "attr": "aria-label" }, "ios": { "type": String, "attr": "ios" }, "isServer": { "context": "isServer" }, "md": { "type": String, "attr": "md" }, "mode": { "context": "mode" }, "name": { "type": String, "attr": "name" }, "svgContent": { "state": true } };
Icon.style = "";
Icon.styleMode = "ios";

class Navbar {
    constructor() {
        this.hideBackButton = false;
        this.hidden = false;
    }
    backButtonClick(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        console.log("back button click");
    }
    componentDidLoad() {
        const buttons = this.el.querySelectorAll("ion-button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute("button-type", "bar-button");
        }
    }
    hostData() {
        return {
            class: {
                "statusbar-padding": this.config.getBoolean("statusbarPadding")
            }
        };
    }
    render() {
        const backButtonIcon = this.backButtonIcon || this.config.get("backButtonText", "Back");
        const backButtonText = this.backButtonText || this.config.get("backButtonIcon", "Back");
        const backgroundCss = createThemedClasses(this.mode, this.color, "toolbar-background");
        const contentCss = createThemedClasses(this.mode, this.color, "toolbar-content");
        const backButtonCss = createThemedClasses(this.mode, this.color, "back-button");
        const backButtonIconCss = createThemedClasses(this.mode, this.color, "back-button-icon");
        const backButtonTextCss = createThemedClasses(this.mode, this.color, "back-button-text");
        return [
            h("div", { class: backgroundCss }),
            h("button", { onClick: this.backButtonClick.bind(this), class: backButtonCss, hidden: this.hideBackButton }, backButtonIcon
                ? h("ion-icon", { class: backButtonIconCss, name: backButtonIcon })
                : null, h("span", { class: backButtonTextCss }, backButtonText)),
            h("slot", { name: "start" }),
            h("slot", { name: "mode-start" }),
            h("slot", { name: "mode-end" }),
            h("slot", { name: "end" }),
            h("div", { class: contentCss }, h("slot", null))
        ];
    }
}
Navbar.is = "ion-navbar";
Navbar.host = { "theme": "toolbar" };
Navbar.properties = { "backButtonIcon": { "type": String, "attr": "back-button-icon" }, "backButtonText": { "type": String, "attr": "back-button-text" }, "config": { "context": "config" }, "el": { "elementRef": true }, "hidden": { "type": Boolean, "attr": "hidden" }, "hideBackButton": { "type": Boolean, "attr": "hide-back-button" } };

class Page {
    hostData() {
        return {
            class: {
                "ion-page": true
            }
        };
    }
    render() {
        return h("slot", null);
    }
}
Page.is = "ion-page";

class GestureController {
    constructor() {
        this.gestureId = 0;
        this.requestedStart = {};
        this.disabledGestures = {};
        this.disabledScroll = new Set();
        this.capturedId = null;
    }
    createGesture(gestureName, gesturePriority, disableScroll) {
        return new GestureDelegate(this, this.newID(), gestureName, gesturePriority, disableScroll);
    }
    createBlocker(opts = {}) {
        return new BlockerDelegate(this.newID(), this, opts.disable, !!opts.disableScroll);
    }
    newID() {
        return this.gestureId++;
    }
    start(gestureName, id, priority) {
        if (!this.canStart(gestureName)) {
            delete this.requestedStart[id];
            return false;
        }
        this.requestedStart[id] = priority;
        return true;
    }
    capture(gestureName, id, priority) {
        if (!this.start(gestureName, id, priority)) {
            return false;
        }
        let requestedStart = this.requestedStart;
        let maxPriority = -10000;
        for (let gestureID in requestedStart) {
            maxPriority = Math.max(maxPriority, requestedStart[gestureID]);
        }
        if (maxPriority === priority) {
            this.capturedId = id;
            this.requestedStart = {};
            return true;
        }
        delete requestedStart[id];
        return false;
    }
    release(id) {
        delete this.requestedStart[id];
        if (this.capturedId && id === this.capturedId) {
            this.capturedId = null;
        }
    }
    disableGesture(gestureName, id) {
        let set = this.disabledGestures[gestureName];
        if (!set) {
            set = new Set();
            this.disabledGestures[gestureName] = set;
        }
        set.add(id);
    }
    enableGesture(gestureName, id) {
        let set = this.disabledGestures[gestureName];
        if (set) {
            set.delete(id);
        }
    }
    disableScroll(id) {
        // let isEnabled = !this.isScrollDisabled();
        this.disabledScroll.add(id);
        // if (this._app && isEnabled && this.isScrollDisabled()) {
        //   console.debug('GestureController: Disabling scrolling');
        //   this._app._setDisableScroll(true);
        // }
    }
    enableScroll(id) {
        // let isDisabled = this.isScrollDisabled();
        this.disabledScroll.delete(id);
        // if (this._app && isDisabled && !this.isScrollDisabled()) {
        //   console.debug('GestureController: Enabling scrolling');
        //   this._app._setDisableScroll(false);
        // }
    }
    canStart(gestureName) {
        if (this.capturedId) {
            // a gesture already captured
            return false;
        }
        if (this.isDisabled(gestureName)) {
            return false;
        }
        return true;
    }
    isCaptured() {
        return !!this.capturedId;
    }
    isScrollDisabled() {
        return this.disabledScroll.size > 0;
    }
    isDisabled(gestureName) {
        let disabled = this.disabledGestures[gestureName];
        if (disabled && disabled.size > 0) {
            return true;
        }
        return false;
    }
}
class GestureDelegate {
    constructor(ctrl, gestureDelegateId, name, priority, disableScroll) {
        this.ctrl = ctrl;
        this.gestureDelegateId = gestureDelegateId;
        this.name = name;
        this.priority = priority;
        this.disableScroll = disableScroll;
    }
    canStart() {
        if (!this.ctrl) {
            return false;
        }
        return this.ctrl.canStart(this.name);
    }
    start() {
        if (!this.ctrl) {
            return false;
        }
        return this.ctrl.start(this.name, this.gestureDelegateId, this.priority);
    }
    capture() {
        if (!this.ctrl) {
            return false;
        }
        let captured = this.ctrl.capture(this.name, this.gestureDelegateId, this.priority);
        if (captured && this.disableScroll) {
            this.ctrl.disableScroll(this.gestureDelegateId);
        }
        return captured;
    }
    release() {
        if (this.ctrl) {
            this.ctrl.release(this.gestureDelegateId);
            if (this.disableScroll) {
                this.ctrl.enableScroll(this.gestureDelegateId);
            }
        }
    }
    destroy() {
        this.release();
        this.ctrl = null;
    }
}
class BlockerDelegate {
    constructor(blockerDelegateId, controller, disable, disableScroll) {
        this.blockerDelegateId = blockerDelegateId;
        this.controller = controller;
        this.disable = disable;
        this.disableScroll = disableScroll;
        this.blocked = false;
    }
    block() {
        if (!this.controller) {
            return;
        }
        if (this.disable) {
            this.disable.forEach(gesture => {
                this.controller.disableGesture(gesture, this.blockerDelegateId);
            });
        }
        if (this.disableScroll) {
            this.controller.disableScroll(this.blockerDelegateId);
        }
        this.blocked = true;
    }
    unblock() {
        if (!this.controller) {
            return;
        }
        if (this.disable) {
            this.disable.forEach(gesture => {
                this.controller.enableGesture(gesture, this.blockerDelegateId);
            });
        }
        if (this.disableScroll) {
            this.controller.enableScroll(this.blockerDelegateId);
        }
        this.blocked = false;
    }
    destroy() {
        this.unblock();
        this.controller = null;
    }
}

GestureController.is = "ion-gesture-controller";

class Scroll {
    constructor() {
        this.positions = [];
        this.queued = false;
        this.isScrolling = false;
        this.detail = {};
        this.enabled = true;
        this.jsScroll = false;
    }
    jsScrollChanged(js) {
        if (js) {
            throw "jsScroll: TODO!";
        }
    }
    componentDidLoad() {
        if (Context.isServer) {
            return;
        }
        const gestureCtrl = Context.gesture = Context.gesture || new GestureController;
        this.gesture = gestureCtrl.createGesture("scroll", 100, false);
    }
    componentDidUnload() {
        this.gesture && this.gesture.destroy();
        this.gesture = this.detail = this.detail.event = null;
    }
    scrollToTop(duration) {
        return this.scrollToPoint(0, 0, duration);
    }
    scrollToBottom(duration) {
        const y = (this.el)
            ? this.el.scrollHeight - this.el.clientHeight
            : 0;
        return this.scrollToPoint(0, y, duration);
    }
    scrollToPoint(x, y, duration, done) {
        // scroll animation loop w/ easing
        // credit https://gist.github.com/dezinezync/5487119
        let promise;
        if (done === undefined) {
            // only create a promise if a done callback wasn't provided
            // done can be a null, which avoids any functions
            promise = new Promise(resolve => {
                done = resolve;
            });
        }
        const self = this;
        const el = self.el;
        if (!el) {
            // invalid element
            done();
            return promise;
        }
        if (duration < 32) {
            self.setTop(y);
            self.setLeft(x);
            done();
            return promise;
        }
        const fromY = el.scrollTop;
        const fromX = el.scrollLeft;
        const maxAttempts = (duration / 16) + 100;
        let startTime;
        let attempts = 0;
        let stopScroll = false;
        // scroll loop
        function step(timeStamp) {
            attempts++;
            if (!self.el || stopScroll || attempts > maxAttempts) {
                self.isScrolling = false;
                el.style.transform = el.style.webkitTransform = "";
                done();
                return;
            }
            let time = Math.min(1, ((timeStamp - startTime) / duration));
            // where .5 would be 50% of time on a linear scale easedT gives a
            // fraction based on the easing method
            let easedT = (--time) * time * time + 1;
            if (fromY !== y) {
                self.setTop((easedT * (y - fromY)) + fromY);
            }
            if (fromX !== x) {
                self.setLeft(Math.floor((easedT * (x - fromX)) + fromX));
            }
            if (easedT < 1) {
                // do not use DomController here
                // must use nativeRaf in order to fire in the next frame
                Context.dom.raf(step);
            }
            else {
                stopScroll = true;
                self.isScrolling = false;
                el.style.transform = el.style.webkitTransform = "";
                done();
            }
        }
        // start scroll loop
        self.isScrolling = true;
        // chill out for a frame first
        Context.dom.write(() => {
            Context.dom.write(timeStamp => {
                startTime = timeStamp;
                step(timeStamp);
            });
        });
        return promise;
    }
    // Native Scroll *************************
    onNativeScroll() {
        if (!this.queued) {
            this.queued = true;
            Context.dom.read((timeStamp) => {
                this.queued = false;
                this.onScroll(timeStamp);
            });
        }
    }
    onScroll(timeStamp) {
        const detail = this.detail;
        const positions = this.positions;
        detail.timeStamp = timeStamp;
        // get the current scrollTop
        // ******** DOM READ ****************
        detail.scrollTop = this.getTop();
        // get the current scrollLeft
        // ******** DOM READ ****************
        detail.scrollLeft = this.getLeft();
        if (!this.isScrolling) {
            // currently not scrolling, so this is a scroll start
            this.isScrolling = true;
            // remember the start positions
            detail.startY = detail.scrollTop;
            detail.startX = detail.scrollLeft;
            // new scroll, so do some resets
            detail.velocityY = detail.velocityX = detail.deltaY = detail.deltaX = positions.length = 0;
            // emit only on the first scroll event
            if (this.onionScrollStart) {
                this.onionScrollStart(detail);
            }
            else {
                this.ionScrollStart.emit(detail);
            }
        }
        // actively scrolling
        positions.push(detail.scrollTop, detail.scrollLeft, detail.timeStamp);
        if (positions.length > 3) {
            // we've gotten at least 2 scroll events so far
            detail.deltaY = (detail.scrollTop - detail.startY);
            detail.deltaX = (detail.scrollLeft - detail.startX);
            var endPos = (positions.length - 1);
            var startPos = endPos;
            var timeRange = (detail.timeStamp - 100);
            // move pointer to position measured 100ms ago
            for (var i = endPos; i > 0 && positions[i] > timeRange; i -= 3) {
                startPos = i;
            }
            if (startPos !== endPos) {
                // compute relative movement between these two points
                var deltaY = (positions[startPos - 2] - positions[endPos - 2]);
                var deltaX = (positions[startPos - 1] - positions[endPos - 1]);
                var factor = 1 / (positions[startPos] - positions[endPos]);
                // based on XXms compute the movement to apply for each render step
                detail.velocityY = deltaY * factor;
                detail.velocityX = deltaX * factor;
            }
        }
        clearTimeout(this.tmr);
        this.tmr = setTimeout(() => {
            // haven't scrolled in a while, so it's a scrollend
            this.isScrolling = false;
            Context.dom.read((timeStamp) => {
                if (!this.isScrolling) {
                    this.onEnd(timeStamp);
                }
            });
        }, 80);
        // emit on each scroll event
        if (this.onionScroll) {
            this.onionScroll(detail);
        }
        else {
            this.ionScroll.emit(detail);
        }
    }
    onEnd(timeStamp) {
        const detail = this.detail;
        detail.timeStamp = timeStamp;
        // emit that the scroll has ended
        if (this.onionScrollEnd) {
            this.onionScrollEnd(detail);
        }
        else {
            this.ionScrollEnd.emit(detail);
        }
    }
    /** DOM READ */
    getTop() {
        if (this.jsScroll) {
            return this._t;
        }
        return this._t = this.el.scrollTop;
    }
    /** DOM READ */
    getLeft() {
        if (this.jsScroll) {
            return 0;
        }
        return this._l = this.el.scrollLeft;
    }
    /** DOM WRITE */
    setTop(top) {
        this._t = top;
        if (this.jsScroll) {
            this.el.style.transform = this.el.style.webkitTransform = `translate3d(${this._l * -1}px,${top * -1}px,0px)`;
        }
        else {
            this.el.scrollTop = top;
        }
    }
    /** DOM WRITE */
    setLeft(left) {
        this._l = left;
        if (this.jsScroll) {
            this.el.style.transform = this.el.style.webkitTransform = `translate3d(${left * -1}px,${this._t * -1}px,0px)`;
        }
        else {
            this.el.scrollLeft = left;
        }
    }
    render() {
        return (
        // scroll-inner is used to keep custom user padding
        h("div", { class: "scroll-inner" }, h("slot", null)));
    }
}
Scroll.is = "ion-scroll";
Scroll.properties = { "config": { "context": "config" }, "el": { "elementRef": true }, "enabled": { "type": Boolean, "attr": "enabled" }, "jsScroll": { "type": Boolean, "attr": "js-scroll", "watchCallbacks": ["jsScrollChanged"] }, "onionScroll": { "type": "Any", "attr": "onion-scroll" }, "onionScrollEnd": { "type": "Any", "attr": "onion-scroll-end" }, "onionScrollStart": { "type": "Any", "attr": "onion-scroll-start" }, "scrollToBottom": { "method": true }, "scrollToPoint": { "method": true }, "scrollToTop": { "method": true } };
Scroll.events = [{ "name": "ionScroll", "method": "ionScroll", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionScrollEnd", "method": "ionScrollEnd", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionScrollStart", "method": "ionScrollStart", "bubbles": true, "cancelable": true, "composed": true }];

class ToolbarTitle {
    render() {
        const themedClasses = createThemedClasses(this.mode, this.color, "toolbar-title");
        return [
            h("div", { class: themedClasses }, h("slot", null))
        ];
    }
}
ToolbarTitle.is = "ion-title";
ToolbarTitle.host = { "theme": "title" };
ToolbarTitle.style = "ion-title {\n  display: flex;\n  flex: 1;\n  align-items: center;\n  transform: translateZ(0);\n}\n\n.toolbar-title {\n  display: block;\n  overflow: hidden;\n  width: 100%;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.toolbar-ios ion-title {\n  left: 0;\n  top: 0;\n  padding: 0 90px 1px;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  transform: translateZ(0);\n  pointer-events: none;\n}\n\n.toolbar-title-ios {\n  text-align: center;\n  font-size: 17px;\n  font-weight: 600;\n  color: #000;\n  pointer-events: auto;\n}\n\n.toolbar-primary .toolbar-title-ios {\n  color: #fff;\n}\n\n.toolbar-secondary .toolbar-title-ios {\n  color: #fff;\n}\n\n.toolbar-warning .toolbar-title-ios {\n  color: #000;\n}\n\n.toolbar-danger .toolbar-title-ios {\n  color: #fff;\n}\n\n.toolbar-light .toolbar-title-ios {\n  color: #000;\n}\n\n.toolbar-dark .toolbar-title-ios {\n  color: #fff;\n}";
ToolbarTitle.styleMode = "ios";

export { Buttons as IonButtons, Content as IonContent, Header as IonHeader, Icon as IonIcon, Navbar as IonNavbar, Page as IonPage, Scroll as IonScroll, ToolbarTitle as IonTitle };
