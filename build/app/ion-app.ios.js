/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import './chunk1.js';
import './chunk2.js';
import { matchPath } from './chunk5.js';

const rootNavs = new Map();
class App {
    constructor() {
        this.hoverCSS = false;
        this.useRouter = false;
    }
    componentWillLoad() {
        this.modeCode = this.config.get("mode");
        this.useRouter = this.config.getBoolean("useRouter", false);
        this.hoverCSS = this.config.getBoolean("hoverCSS", true);
    }
    registerRootNav(event) {
        rootNavs.set(event.detail.navId, event.detail);
    }
    getRootNavs() {
        const navs = [];
        rootNavs.forEach((rootNav) => {
            navs.push(rootNav);
        });
        return navs;
    }
    isScrolling() {
        // TODO - sync with Manu
        return false;
    }
    getActiveNavs(rootNavId) {
        /*const portal = portals.get(PORTAL_MODAL);
        if (portal && portal.views && portal.views.length) {
          return findTopNavs(portal);
        }
        */
        // TODO - figure out if a modal is open, don't use portal
        if (!rootNavs.size) {
            return [];
        }
        if (rootNavId) {
            return findTopNavs(rootNavs.get(rootNavId));
        }
        if (rootNavs.size === 1) {
            return findTopNavs(rootNavs.values().next().value);
        }
        // fallback to just using all root navs
        let activeNavs = [];
        rootNavs.forEach(nav => {
            activeNavs = activeNavs.concat(findTopNavs(nav));
        });
        return activeNavs;
    }
    getNavByIdOrName(nameOrId) {
        const navs = Array.from(rootNavs.values());
        for (const navContainer of navs) {
            const match = getNavByIdOrNameImpl(navContainer, nameOrId);
            if (match) {
                return match;
            }
        }
        return null;
    }
    hostData() {
        return {
            class: {
                [this.modeCode]: true,
                "enable-hover": this.hoverCSS
            }
        };
    }
    render() {
        const dom = [h("slot", null)];
        if (this.useRouter) {
            dom.push(h("ion-router-controller", null));
        }
        return dom;
    }
}
function findTopNavs(nav) {
    let containers = [];
    const childNavs = nav.getActiveChildNavs();
    if (!childNavs || !childNavs.length) {
        containers.push(nav);
    }
    else {
        childNavs.forEach(childNav => {
            const topNavs = findTopNavs(childNav);
            containers = containers.concat(topNavs);
        });
    }
    return containers;
}
function getNavByIdOrNameImpl(nav, id) {
    if (nav.id === id || nav.name === id) {
        return nav;
    }
    for (const child of nav.getAllChildNavs()) {
        const tmp = getNavByIdOrNameImpl(child, id);
        if (tmp) {
            return tmp;
        }
    }
    return null;
}

App.is = "ion-app";
App.host = { "theme": "app" };
App.properties = { "config": { "context": "config" }, "element": { "elementRef": true }, "getActiveNavs": { "method": true }, "getNavByIdOrName": { "method": true }, "getRootNavs": { "method": true }, "hoverCSS": { "state": true }, "isScrolling": { "method": true }, "modeCode": { "state": true }, "useRouter": { "state": true } };
App.style = "audio,\ncanvas,\nprogress,\nvideo {\n  vertical-align: baseline;\n}\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\nb,\nstrong {\n  font-weight: bold;\n}\n\nimg {\n  max-width: 100%;\n  border: 0;\n}\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\nfigure {\n  margin: 1em 40px;\n}\n\nhr {\n  height: 1px;\n  border-width: 0;\n  box-sizing: content-box;\n}\n\npre {\n  overflow: auto;\n}\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\nlabel,\ninput,\nselect,\ntextarea {\n  font-family: inherit;\n  line-height: normal;\n}\n\ntextarea {\n  overflow: auto;\n  height: auto;\n  font: inherit;\n  color: inherit;\n}\n\ntextarea::placeholder {\n  padding-left: 2px;\n}\n\nform,\ninput,\noptgroup,\nselect {\n  margin: 0;\n  font: inherit;\n  color: inherit;\n}\n\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  cursor: pointer;\n  -webkit-appearance: button;\n}\n\na,\na div,\na span,\na ion-icon,\na ion-label,\nbutton,\nbutton div,\nbutton span,\nbutton ion-icon,\nbutton ion-label,\n[tappable],\n[tappable] div,\n[tappable] span,\n[tappable] ion-icon,\n[tappable] ion-label,\ninput,\ntextarea {\n  touch-action: manipulation;\n}\n\na ion-label,\nbutton ion-label {\n  pointer-events: none;\n}\n\nbutton {\n  border: 0;\n  border-radius: 0;\n  font-family: inherit;\n  font-style: inherit;\n  font-variant: inherit;\n  line-height: 1;\n  text-transform: none;\n  cursor: pointer;\n  -webkit-appearance: button;\n}\n\n[tappable] {\n  cursor: pointer;\n}\n\na[disabled],\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  padding: 0;\n  box-sizing: border-box;\n}\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\ntd,\nth {\n  padding: 0;\n}\n\n.hide,\n[hidden],\ntemplate {\n  display: none !important;\n}\n\n.sticky {\n  position: sticky;\n  top: 0;\n}\n\n:focus,\n:active {\n  outline: none;\n}\n\n.focus-outline :focus {\n  outline: thin dotted;\n  outline-offset: -1px;\n}\n\n.focus-outline button:focus,\n.focus-outline [ion-button]:focus {\n  border-color: #51a7e8;\n  outline: 2px solid #51a7e8;\n  box-shadow: 0 0 8px 1px #51a7e8;\n}\n\nion-input :focus {\n  outline: none;\n}\n\n.click-block {\n  display: none;\n}\n\n.click-block-enabled {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  transform: translate3d(0,  -100%,  0) translateY(1px);\n  position: absolute;\n  z-index: 99999;\n  display: block;\n  opacity: 0;\n  contain: strict;\n}\n\n.click-block-active {\n  transform: translate3d(0,  0,  0);\n}\n\n* {\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nhtml {\n  width: 100%;\n  height: 100%;\n  text-size-adjust: 100%;\n}\n\nbody {\n  margin: 0;\n  padding: 0;\n  position: fixed;\n  overflow: hidden;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  max-height: 100%;\n  -webkit-font-smoothing: antialiased;\n  font-smoothing: antialiased;\n  text-rendering: optimizeLegibility;\n  -webkit-user-drag: none;\n  -ms-content-zooming: none;\n  touch-action: manipulation;\n  word-wrap: break-word;\n  text-size-adjust: none;\n  user-select: none;\n}\n\na {\n  background-color: transparent;\n}\n\n.enable-hover a:not(.button):hover {\n  opacity: .7;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin-top: 16px;\n  margin-bottom: 10px;\n  font-weight: 500;\n  line-height: 1.2;\n}\n\n[padding] h1:first-child,\n[padding] h2:first-child,\n[padding] h3:first-child,\n[padding] h4:first-child,\n[padding] h5:first-child,\n[padding] h6:first-child {\n  margin-top: -3px;\n}\n\nh1 + h2,\nh1 + h3,\nh2 + h3 {\n  margin-top: -3px;\n}\n\nh1 {\n  margin-top: 20px;\n  font-size: 26px;\n}\n\nh2 {\n  margin-top: 18px;\n  font-size: 24px;\n}\n\nh3 {\n  font-size: 22px;\n}\n\nh4 {\n  font-size: 20px;\n}\n\nh5 {\n  font-size: 18px;\n}\n\nh6 {\n  font-size: 16px;\n}\n\nsmall {\n  font-size: 75%;\n}\n\nsub,\nsup {\n  position: relative;\n  font-size: 75%;\n  line-height: 0;\n  vertical-align: baseline;\n}\n\nsup {\n  top: -.5em;\n}\n\nsub {\n  bottom: -.25em;\n}\n\nion-app,\nion-nav,\nion-tabs,\n.ion-page {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  contain: layout size style;\n}\n\n.ion-page,\n.page-inner {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n\n.hide-page {\n  opacity: 0;\n}\n\nion-header,\nion-footer {\n  position: relative;\n  z-index: 10;\n  display: block;\n  order: 1;\n  width: 100%;\n}\n\nion-header {\n  order: -1;\n}\n\nion-route,\nion-route-controller,\nion-animation-controller,\nion-nav-controller,\nion-menu-controller,\nion-action-sheet-controller,\nion-alert-controller,\nion-loading-controller,\nion-modal-controller,\nion-picker-controller,\nion-toast-controller,\n[app-viewport],\n[overlay-portal],\n[nav-viewport],\n[tab-portal] {\n  display: none;\n}\n\n[text-center] {\n  text-align: center !important;\n}\n\n[text-justify] {\n  text-align: justify !important;\n}\n\n[text-start] {\n  text-align: left;\n  text-align: start !important;\n}\n\n[text-end] {\n  text-align: right;\n  text-align: end !important;\n}\n\n[text-left] {\n  text-align: left !important;\n}\n\n[text-right] {\n  text-align: right !important;\n}\n\n[text-nowrap] {\n  white-space: nowrap !important;\n}\n\n[text-wrap] {\n  white-space: normal !important;\n}\n\n\@media (min-width: 576px) {\n  [text-sm-center] {\n    text-align: center !important;\n  }\n  [text-sm-justify] {\n    text-align: justify !important;\n  }\n  [text-sm-start] {\n    text-align: left;\n    text-align: start !important;\n  }\n  [text-sm-end] {\n    text-align: right;\n    text-align: end !important;\n  }\n  [text-sm-left] {\n    text-align: left !important;\n  }\n  [text-sm-right] {\n    text-align: right !important;\n  }\n  [text-sm-nowrap] {\n    white-space: nowrap !important;\n  }\n  [text-sm-wrap] {\n    white-space: normal !important;\n  }\n}\n\n\@media (min-width: 768px) {\n  [text-md-center] {\n    text-align: center !important;\n  }\n  [text-md-justify] {\n    text-align: justify !important;\n  }\n  [text-md-start] {\n    text-align: left;\n    text-align: start !important;\n  }\n  [text-md-end] {\n    text-align: right;\n    text-align: end !important;\n  }\n  [text-md-left] {\n    text-align: left !important;\n  }\n  [text-md-right] {\n    text-align: right !important;\n  }\n  [text-md-nowrap] {\n    white-space: nowrap !important;\n  }\n  [text-md-wrap] {\n    white-space: normal !important;\n  }\n}\n\n\@media (min-width: 992px) {\n  [text-lg-center] {\n    text-align: center !important;\n  }\n  [text-lg-justify] {\n    text-align: justify !important;\n  }\n  [text-lg-start] {\n    text-align: left;\n    text-align: start !important;\n  }\n  [text-lg-end] {\n    text-align: right;\n    text-align: end !important;\n  }\n  [text-lg-left] {\n    text-align: left !important;\n  }\n  [text-lg-right] {\n    text-align: right !important;\n  }\n  [text-lg-nowrap] {\n    white-space: nowrap !important;\n  }\n  [text-lg-wrap] {\n    white-space: normal !important;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [text-xl-center] {\n    text-align: center !important;\n  }\n  [text-xl-justify] {\n    text-align: justify !important;\n  }\n  [text-xl-start] {\n    text-align: left;\n    text-align: start !important;\n  }\n  [text-xl-end] {\n    text-align: right;\n    text-align: end !important;\n  }\n  [text-xl-left] {\n    text-align: left !important;\n  }\n  [text-xl-right] {\n    text-align: right !important;\n  }\n  [text-xl-nowrap] {\n    white-space: nowrap !important;\n  }\n  [text-xl-wrap] {\n    white-space: normal !important;\n  }\n}\n\n[text-uppercase] {\n  text-transform: uppercase !important;\n}\n\n[text-lowercase] {\n  text-transform: lowercase !important;\n}\n\n[text-capitalize] {\n  text-transform: capitalize !important;\n}\n\n\@media (min-width: 576px) {\n  [text-sm-uppercase] {\n    text-transform: uppercase !important;\n  }\n  [text-sm-lowercase] {\n    text-transform: lowercase !important;\n  }\n  [text-sm-capitalize] {\n    text-transform: capitalize !important;\n  }\n}\n\n\@media (min-width: 768px) {\n  [text-md-uppercase] {\n    text-transform: uppercase !important;\n  }\n  [text-md-lowercase] {\n    text-transform: lowercase !important;\n  }\n  [text-md-capitalize] {\n    text-transform: capitalize !important;\n  }\n}\n\n\@media (min-width: 992px) {\n  [text-lg-uppercase] {\n    text-transform: uppercase !important;\n  }\n  [text-lg-lowercase] {\n    text-transform: lowercase !important;\n  }\n  [text-lg-capitalize] {\n    text-transform: capitalize !important;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [text-xl-uppercase] {\n    text-transform: uppercase !important;\n  }\n  [text-xl-lowercase] {\n    text-transform: lowercase !important;\n  }\n  [text-xl-capitalize] {\n    text-transform: capitalize !important;\n  }\n}\n\n[float-left] {\n  float: left !important;\n}\n\n[float-right] {\n  float: right !important;\n}\n\n[float-start] {\n  float: left !important;\n}\n\n[float-end] {\n  float: right !important;\n}\n\n\@media (min-width: 576px) {\n  [float-sm-left] {\n    float: left !important;\n  }\n  [float-sm-right] {\n    float: right !important;\n  }\n  [float-sm-start] {\n    float: left !important;\n  }\n  [float-sm-end] {\n    float: right !important;\n  }\n}\n\n\@media (min-width: 768px) {\n  [float-md-left] {\n    float: left !important;\n  }\n  [float-md-right] {\n    float: right !important;\n  }\n  [float-md-start] {\n    float: left !important;\n  }\n  [float-md-end] {\n    float: right !important;\n  }\n}\n\n\@media (min-width: 992px) {\n  [float-lg-left] {\n    float: left !important;\n  }\n  [float-lg-right] {\n    float: right !important;\n  }\n  [float-lg-start] {\n    float: left !important;\n  }\n  [float-lg-end] {\n    float: right !important;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [float-xl-left] {\n    float: left !important;\n  }\n  [float-xl-right] {\n    float: right !important;\n  }\n  [float-xl-start] {\n    float: left !important;\n  }\n  [float-xl-end] {\n    float: right !important;\n  }\n}\n\n.app-ios {\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif;\n  font-size: 14px;\n  background-color: #fff;\n}\n\n.app-ios ion-tabs ion-tabbar:not(.placement-top) {\n  padding-bottom: calc(constant(safe-area-inset-bottom) + 0);\n  padding-bottom: calc(env(safe-area-inset-bottom) + 0);\n  height: calc(50px + constant(safe-area-inset-bottom));\n  height: calc(50px + env(safe-area-inset-bottom));\n}\n\n.app-ios ion-footer .toolbar:last-child {\n  padding-bottom: calc(constant(safe-area-inset-bottom) + 4px);\n  padding-bottom: calc(env(safe-area-inset-bottom) + 4px);\n  min-height: calc(44px + constant(safe-area-inset-bottom));\n  min-height: calc(44px + env(safe-area-inset-bottom));\n}\n\n.app-ios .ion-page > .toolbar.statusbar-padding:first-child,\n.app-ios .ion-page > ion-header > .toolbar.statusbar-padding:first-child,\n.app-ios ion-tab ion-nav .ion-page > ion-header > .toolbar.statusbar-padding:first-child,\n.app-ios ion-menu > .menu-inner > .toolbar.statusbar-padding:first-child,\n.app-ios ion-menu > .menu-inner > ion-header > .toolbar.statusbar-padding:first-child {\n  padding-top: calc(20px + 4px);\n  padding-top: calc(constant(safe-area-inset-top) + 4px);\n  padding-top: calc(env(safe-area-inset-top) + 4px);\n  min-height: calc(44px + 20px);\n  min-height: calc(44px + constant(safe-area-inset-top));\n  min-height: calc(44px + env(safe-area-inset-top));\n}\n\n.app-ios .ion-page > ion-content.statusbar-padding:first-child .scroll-content,\n.app-ios .ion-page > ion-header > ion-content.statusbar-padding:first-child .scroll-content,\n.app-ios ion-tab ion-nav .ion-page > ion-header > ion-content.statusbar-padding:first-child .scroll-content,\n.app-ios ion-menu > .menu-inner > ion-content.statusbar-padding:first-child .scroll-content,\n.app-ios ion-menu > .menu-inner > ion-header > ion-content.statusbar-padding:first-child .scroll-content {\n  padding-top: 20px;\n  padding-top: calc(constant(safe-area-inset-top) + 0px);\n  padding-top: calc(env(safe-area-inset-top) + 0px);\n}\n\n.app-ios .ion-page > ion-content.statusbar-padding:first-child[padding] .scroll-content,\n.app-ios .ion-page > ion-content.statusbar-padding:first-child[padding-top] .scroll-content,\n.app-ios .ion-page > ion-header > ion-content.statusbar-padding:first-child[padding] .scroll-content,\n.app-ios .ion-page > ion-header > ion-content.statusbar-padding:first-child[padding-top] .scroll-content,\n.app-ios ion-tab ion-nav .ion-page > ion-header > ion-content.statusbar-padding:first-child[padding] .scroll-content,\n.app-ios ion-tab ion-nav .ion-page > ion-header > ion-content.statusbar-padding:first-child[padding-top] .scroll-content,\n.app-ios ion-menu > .menu-inner > ion-content.statusbar-padding:first-child[padding] .scroll-content,\n.app-ios ion-menu > .menu-inner > ion-content.statusbar-padding:first-child[padding-top] .scroll-content,\n.app-ios ion-menu > .menu-inner > ion-header > ion-content.statusbar-padding:first-child[padding] .scroll-content,\n.app-ios ion-menu > .menu-inner > ion-header > ion-content.statusbar-padding:first-child[padding-top] .scroll-content {\n  padding-top: calc(16px + 20px);\n  padding-top: calc(constant(safe-area-inset-top) + 0px);\n  padding-top: calc(env(safe-area-inset-top) + 0px);\n}\n\n.app-ios .ion-page > .toolbar.statusbar-padding:first-child ion-segment,\n.app-ios .ion-page > .toolbar.statusbar-padding:first-child ion-title,\n.app-ios .ion-page > ion-header > .toolbar.statusbar-padding:first-child ion-segment,\n.app-ios .ion-page > ion-header > .toolbar.statusbar-padding:first-child ion-title,\n.app-ios ion-tab ion-nav .ion-page > ion-header > .toolbar.statusbar-padding:first-child ion-segment,\n.app-ios ion-tab ion-nav .ion-page > ion-header > .toolbar.statusbar-padding:first-child ion-title,\n.app-ios ion-menu > .menu-inner > .toolbar.statusbar-padding:first-child ion-segment,\n.app-ios ion-menu > .menu-inner > .toolbar.statusbar-padding:first-child ion-title,\n.app-ios ion-menu > .menu-inner > ion-header > .toolbar.statusbar-padding:first-child ion-segment,\n.app-ios ion-menu > .menu-inner > ion-header > .toolbar.statusbar-padding:first-child ion-title {\n  padding-top: 20px;\n  padding-top: calc(constant(safe-area-inset-top) + 0px);\n  padding-top: calc(env(safe-area-inset-top) + 0px);\n  height: calc(44px + 20px);\n  height: calc(44px + constant(safe-area-inset-top));\n  height: calc(44px + env(safe-area-inset-top));\n  min-height: calc(44px + 20px);\n  min-height: calc(44px + constant(safe-area-inset-top));\n  min-height: calc(44px + env(safe-area-inset-top));\n}\n\n.app-ios .ion-page > ion-content.statusbar-padding:first-child ion-scroll,\n.app-ios .ion-page > ion-header > ion-content.statusbar-padding:first-child ion-scroll,\n.app-ios ion-tab ion-nav .ion-page > ion-header > ion-content.statusbar-padding:first-child ion-scroll,\n.app-ios ion-menu > .menu-inner > ion-content.statusbar-padding:first-child ion-scroll,\n.app-ios ion-menu > .menu-inner > ion-header > ion-content.statusbar-padding:first-child ion-scroll {\n  padding-top: 20px;\n  padding-top: calc(constant(safe-area-inset-top) + 0px);\n  padding-top: calc(env(safe-area-inset-top) + 0px);\n}\n\na {\n  color: #488aff;\n}\n\n.icon-ios-primary {\n  fill: #488aff;\n}\n\n.icon-ios-secondary {\n  fill: #32db64;\n}\n\n.icon-ios-warning {\n  fill: #ffeb3b;\n}\n\n.icon-ios-danger {\n  fill: #f53d3d;\n}\n\n.icon-ios-light {\n  fill: #f4f4f4;\n}\n\n.icon-ios-dark {\n  fill: #222;\n}";
App.styleMode = "ios";

class RouterSegments {
    constructor(segments) {
        this.segments = segments;
    }
    next() {
        if (this.segments.length > 0) {
            return this.segments.shift();
        }
        return '';
    }
}
function writeNavState(root, segments) {
    const node = breadthFirstSearch(root);
    if (!node) {
        return Promise.resolve();
    }
    return node.componentOnReady()
        .then(() => node.getRoutes())
        .then(routes => mustMatchRoute(segments, routes))
        .then(route => node.setRouteId(route.id))
        .then(() => {
        const state = node.getState();
        if (!state) {
            throw new Error('setRouteId failed?');
        }
        writeNavState(state.focusNode, segments);
    });
}
function readNavState(node) {
    const stack = [];
    let pivot;
    let state;
    while (true) {
        pivot = breadthFirstSearch(node);
        if (pivot) {
            state = pivot.getState();
            if (state) {
                node = state.focusNode;
                stack.push(state);
            }
            else {
                break;
            }
        }
        else {
            break;
        }
    }
    return {
        stack: stack,
        pivot: pivot
    };
}
function mustMatchRoute(segments, routes) {
    const r = matchRoute(segments, routes);
    if (!r) {
        throw 'no route found';
    }
    return r;
}
function matchRoute(segments, routes) {
    if (!routes) {
        return null;
    }
    let index = 0;
    routes = routes.map(initRoute);
    let selectedRoute = null;
    let ambiguous = false;
    let segment;
    let l;
    while (true) {
        routes = routes.filter(r => r.segments.length > index);
        if (routes.length === 0) {
            break;
        }
        segment = segments.next();
        routes = routes.filter(r => r.segments[index] === segment);
        l = routes.length;
        if (l === 0) {
            selectedRoute = null;
            ambiguous = false;
        }
        else {
            selectedRoute = routes[0];
            ambiguous = l > 1;
        }
        index++;
    }
    if (ambiguous) {
        throw new Error('ambiguious match');
    }
    return selectedRoute;
}
function generateURL(stack) {
    const segments = [];
    for (let state of stack) {
        segments.push(...parseURL(state.path));
    }
    const path = segments
        .filter(s => s.length > 0)
        .join('/');
    return '/' + path;
}
function initRoute(route) {
    if (route.segments === undefined || route.segments === null) {
        route.segments = parseURL(route.path);
    }
    return route;
}
function parseURL(url) {
    if (url === null || url === undefined) {
        return [''];
    }
    const segments = url.split('/')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    if (segments.length === 0) {
        return [''];
    }
    else {
        return segments;
    }
}
const navs = ['ION-NAV', 'ION-TABS'];
function breadthFirstSearch(root) {
    if (!root) {
        console.error('search root is null');
        return null;
    }
    // we do a Breadth-first search
    // Breadth-first search (BFS) is an algorithm for traversing or searching tree
    // or graph data structures.It starts at the tree root(or some arbitrary node of a graph,
    // sometimes referred to as a 'search key'[1]) and explores the neighbor nodes
    // first, before moving to the next level neighbours.
    const queue = [root];
    while (queue.length > 0) {
        const node = queue.shift();
        // visit node
        if (navs.indexOf(node.tagName) >= 0) {
            return node;
        }
        // queue children
        const children = node.children;
        for (let i = 0; i < children.length; i++) {
            queue.push(children[i]);
        }
    }
    return null;
}

class RouterController {
    constructor() {
        this.busy = false;
        this.enabled = false;
        this.basePrefix = "#";
    }
    componentDidLoad() {
        const enabled = this.enabled = this.config.getBoolean("useRouter", false);
        if (enabled) {
            const base = document.querySelector("head > base");
            if (base) {
                const baseURL = base.getAttribute("href");
                if (baseURL.length > 0) {
                    this.basePrefix = baseURL;
                }
            }
            Context.dom.raf(() => {
                console.debug("[OUT] page load -> write nav state");
                this.writeNavStateRoot();
            });
        }
    }
    onURLHashChanged() {
        if (!this.isBlocked()) {
            console.debug("[OUT] hash changed -> write nav state");
            this.writeNavStateRoot();
        }
    }
    onNavChanged(ev) {
        if (this.isBlocked()) {
            return;
        }
        debugger;
        console.debug("[IN] nav changed -> update URL");
        const { stack, pivot } = this.readNavState();
        if (pivot) {
            // readNavState() found a pivot that is not initialized
            console.debug("[IN] pivot uninitialized -> write partial nav state");
            this.writeNavState(pivot, []);
        }
        const isPop = ev.detail.isPop === true;
        this.setURL(generateURL(stack), isPop);
    }
    setURL(url, isPop) {
        url = this.basePrefix + url;
        const history = window.history;
        if (isPop) {
            history.back();
            history.replaceState(null, null, url);
        }
        else {
            history.pushState(null, null, url);
        }
    }
    isBlocked() {
        return this.busy || !this.enabled;
    }
    writeNavStateRoot() {
        const node = document.querySelector("ion-app");
        return this.writeNavState(node, this.readURL());
    }
    writeNavState(node, url) {
        const segments = new RouterSegments(url);
        this.busy = true; //  prevents reentrance
        return writeNavState(node, segments)
            .catch(err => console.error(err))
            .then(() => this.busy = false);
    }
    readNavState() {
        let root = document.querySelector("ion-app");
        return readNavState(root);
    }
    isHash() {
        return this.basePrefix.length > 0 && this.basePrefix[0] === "#";
    }
    readURL() {
        const url = this.isHash()
            ? window.location.hash.substr(1)
            : window.location.pathname;
        return parseURL(url);
    }
}
RouterController.is = "ion-router-controller";
RouterController.properties = { "config": { "context": "config" } };

/**
  * @name Route
  * @module ionic
  * @description
 */
class Route {
    constructor() {
        this.unsubscribe = () => { return; };
        this.componentProps = {};
        this.exact = false;
        this.group = null;
        this.routeRender = null;
        this.match = null;
    }
    // Identify if the current route is a match.
    computeMatch(pathname) {
        if (!pathname) {
            const location = this.activeRouter.get("location");
            pathname = location.pathname;
        }
        const newMatch = matchPath(pathname, {
            path: this.url,
            exact: this.exact,
            strict: true
        });
        // If we have a match and we've already matched for the group, don't set the match
        if (newMatch) {
            if (this.group && this.activeRouter.didGroupAlreadyMatch(this.group)) {
                return null;
            }
            this.group && this.activeRouter.setGroupMatched(this.group);
        }
        return newMatch;
    }
    componentWillLoad() {
        // subscribe the project's active router and listen
        // for changes. Recompute the match if any updates get
        // pushed
        if (this.group) {
            this.activeRouter.addToGroup(this, this.group);
        }
        this.unsubscribe = this.activeRouter.subscribe(() => {
            this.match = this.computeMatch();
        });
        this.match = this.computeMatch();
    }
    componentDidUnload() {
        // be sure to unsubscribe to the router so that we don't
        // get any memory leaks
        this.activeRouter.removeFromGroups(this);
        this.unsubscribe();
    }
    render() {
        // If there is no activeRouter then do not render
        // Check if this route is in the matching URL (for example, a parent route)
        if (!this.activeRouter || !this.match) {
            return null;
        }
        // component props defined in route
        // the history api
        // current match data including params
        const childProps = Object.assign({}, this.componentProps, { history: this.activeRouter.get("history"), match: this.match });
        // If there is a routerRender defined then use
        // that and pass the component and component props with it.
        if (this.routeRender) {
            return this.routeRender(Object.assign({}, childProps, { component: this.component }));
        }
        if (this.component) {
            const ChildComponent = this.component;
            return h(ChildComponent, Object.assign({}, childProps));
        }
    }
    static get is() { return "stencil-route"; }
    static get properties() { return { "activeRouter": { "context": "activeRouter" }, "component": { "type": String, "attr": "component" }, "componentProps": { "type": "Any", "attr": "component-props" }, "exact": { "type": Boolean, "attr": "exact" }, "group": { "type": String, "attr": "group" }, "location": { "context": "location" }, "match": { "state": true }, "routeRender": { "type": "Any", "attr": "route-render" }, "url": { "type": "Any", "attr": "url" } }; }
}

function hasBasename(path, prefix) {
    return (new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i')).test(path);
}
function stripBasename(path, prefix) {
    return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}
function stripTrailingSlash(path) {
    return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}
function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path;
}
function stripLeadingSlash(path) {
    return path.charAt(0) === '/' ? path.substr(1) : path;
}

function parsePath(path) {
    let pathname = path || '/';
    let search = '';
    let hash = '';
    const hashIndex = pathname.indexOf('#');
    if (hashIndex !== -1) {
        hash = pathname.substr(hashIndex);
        pathname = pathname.substr(0, hashIndex);
    }
    const searchIndex = pathname.indexOf('?');
    if (searchIndex !== -1) {
        search = pathname.substr(searchIndex);
        pathname = pathname.substr(0, searchIndex);
    }
    return {
        pathname,
        search: search === '?' ? '' : search,
        hash: hash === '#' ? '' : hash
    };
}
function createPath(location) {
    const { pathname, search, hash } = location;
    let path = pathname || '/';
    if (search && search !== '?') {
        path += (search.charAt(0) === '?' ? search : `?${search}`);
    }
    if (hash && hash !== '#') {
        path += (hash.charAt(0) === '#' ? hash : `#${hash}`);
    }
    return path;
}
function parseQueryString(query) {
    if (!query) {
        return {};
    }
    return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
        let [key, value] = param.split('=');
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
    }, {});
}

function isAbsolute(pathname) {
    return pathname.charAt(0) === '/';
}
// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
    for (let i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
        list[i] = list[k];
    }
    list.pop();
}
// This implementation is based heavily on node's url.parse
function resolvePathname(to, from = '') {
    const toParts = to && to.split('/') || [];
    let fromParts = from && from.split('/') || [];
    const isToAbs = to && isAbsolute(to);
    const isFromAbs = from && isAbsolute(from);
    const mustEndAbs = isToAbs || isFromAbs;
    if (to && isAbsolute(to)) {
        // to is absolute
        fromParts = toParts;
    }
    else if (toParts.length) {
        // to is relative, drop the filename
        fromParts.pop();
        fromParts = fromParts.concat(toParts);
    }
    if (!fromParts.length) {
        return '/';
    }
    let hasTrailingSlash;
    if (fromParts.length) {
        const last = fromParts[fromParts.length - 1];
        hasTrailingSlash = (last === '.' || last === '..' || last === '');
    }
    else {
        hasTrailingSlash = false;
    }
    let up = 0;
    for (let i = fromParts.length; i >= 0; i--) {
        const part = fromParts[i];
        if (part === '.') {
            spliceOne(fromParts, i);
        }
        else if (part === '..') {
            spliceOne(fromParts, i);
            up++;
        }
        else if (up) {
            spliceOne(fromParts, i);
            up--;
        }
    }
    if (!mustEndAbs) {
        for (; up--; up) {
            fromParts.unshift('..');
        }
    }
    if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) {
        fromParts.unshift('');
    }
    let result = fromParts.join('/');
    if (hasTrailingSlash && result.substr(-1) !== '/') {
        result += '/';
    }
    return result;
}
function valueEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a == null || b == null) {
        return false;
    }
    if (Array.isArray(a)) {
        return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
            return valueEqual(item, b[index]);
        });
    }
    const aType = typeof a;
    const bType = typeof b;
    if (aType !== bType) {
        return false;
    }
    if (aType === 'object') {
        const aValue = a.valueOf();
        const bValue = b.valueOf();
        if (aValue !== a || bValue !== b) {
            return valueEqual(aValue, bValue);
        }
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        return aKeys.every(function (key) {
            return valueEqual(a[key], b[key]);
        });
    }
    return false;
}
function locationsAreEqual(a, b) {
    return a.pathname === b.pathname &&
        a.search === b.search &&
        a.hash === b.hash &&
        a.key === b.key &&
        valueEqual(a.state, b.state);
}
function createLocation(path, state, key, currentLocation) {
    let location;
    if (typeof path === 'string') {
        // Two-arg form: push(path, state)
        location = parsePath(path);
        location.state = state;
    }
    else {
        // One-arg form: push(location)
        location = Object.assign({}, path);
        if (location.pathname === undefined) {
            location.pathname = '';
        }
        if (location.search) {
            if (location.search.charAt(0) !== '?') {
                location.search = '?' + location.search;
            }
        }
        else {
            location.search = '';
        }
        if (location.hash) {
            if (location.hash.charAt(0) !== '#') {
                location.hash = '#' + location.hash;
            }
        }
        else {
            location.hash = '';
        }
        if (state !== undefined && location.state === undefined) {
            location.state = state;
        }
    }
    try {
        location.pathname = decodeURI(location.pathname);
    }
    catch (e) {
        if (e instanceof URIError) {
            throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' +
                'This is likely caused by an invalid percent-encoding.');
        }
        else {
            throw e;
        }
    }
    if (key) {
        location.key = key;
    }
    if (currentLocation) {
        // Resolve incomplete/relative pathname relative to current location.
        if (!location.pathname) {
            location.pathname = currentLocation.pathname;
        }
        else if (location.pathname.charAt(0) !== '/') {
            location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
        }
    }
    else {
        // When there is no prior location and pathname is empty, set it to /
        if (!location.pathname) {
            location.pathname = '/';
        }
    }
    location.query = parseQueryString(location.search);
    return location;
}

function invariant(value, ...args) {
    if (!value) {
        console.error(...args);
    }
}
function warning(value, ...args) {
    if (!value) {
        console.warn(...args);
    }
}

const createTransitionManager = () => {
    let prompt;
    const setPrompt = (nextPrompt) => {
        warning(prompt == null, 'A history supports only one prompt at a time');
        prompt = nextPrompt;
        return () => {
            if (prompt === nextPrompt) {
                prompt = null;
            }
        };
    };
    const confirmTransitionTo = (location, action, getUserConfirmation, callback) => {
        // TODO: If another transition starts while we're still confirming
        // the previous one, we may end up in a weird state. Figure out the
        // best way to handle this.
        if (prompt != null) {
            const result = typeof prompt === 'function' ? prompt(location, action) : prompt;
            if (typeof result === 'string') {
                if (typeof getUserConfirmation === 'function') {
                    getUserConfirmation(result, callback);
                }
                else {
                    warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message');
                    callback(true);
                }
            }
            else {
                // Return false from a transition hook to cancel the transition.
                callback(result !== false);
            }
        }
        else {
            callback(true);
        }
    };
    let listeners = [];
    const appendListener = (fn) => {
        let isActive = true;
        const listener = (...args) => {
            if (isActive) {
                fn(...args);
            }
        };
        listeners.push(listener);
        return () => {
            isActive = false;
            listeners = listeners.filter(item => item !== listener);
        };
    };
    const notifyListeners = (...args) => {
        listeners.forEach(listener => listener(...args));
    };
    return {
        setPrompt,
        confirmTransitionTo,
        appendListener,
        notifyListeners
    };
};

const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
const addEventListener = (node, event, listener) => (node.addEventListener
    ? node.addEventListener(event, listener, false)
    : node.attachEvent('on' + event, listener));
const removeEventListener = (node, event, listener) => (node.removeEventListener
    ? node.removeEventListener(event, listener, false)
    : node.detachEvent('on' + event, listener));
const getConfirmation = (message, callback) => (callback(window.confirm(message)));
/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
const supportsHistory = () => {
    const ua = window.navigator.userAgent;
    if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1) {
        return false;
    }
    return window.history && 'pushState' in window.history;
};
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
const supportsPopStateOnHashChange = () => (window.navigator.userAgent.indexOf('Trident') === -1);
/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
const supportsGoWithoutReloadUsingHash = () => (window.navigator.userAgent.indexOf('Firefox') === -1);
const isExtraneousPopstateEvent = (event) => (event.state === undefined &&
    navigator.userAgent.indexOf('CriOS') === -1);

const PopStateEvent = 'popstate';
const HashChangeEvent = 'hashchange';
const getHistoryState = () => {
    try {
        return window.history.state || {};
    }
    catch (e) {
        // IE 11 sometimes throws when accessing window.history.state
        // See https://github.com/ReactTraining/history/pull/289
        return {};
    }
};
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
const createBrowserHistory = (props = {}) => {
    invariant(canUseDOM, 'Browser history needs a DOM');
    const globalHistory = window.history;
    const canUseHistory = supportsHistory();
    const needsHashChangeListener = !supportsPopStateOnHashChange();
    const { forceRefresh = false, getUserConfirmation = getConfirmation, keyLength = 6 } = props;
    const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
    const getDOMLocation = (historyState) => {
        historyState = historyState || {};
        const { key, state } = historyState;
        const { pathname, search, hash } = window.location;
        let path = pathname + search + hash;
        warning((!basename || hasBasename(path, basename)), 'You are attempting to use a basename on a page whose URL path does not begin ' +
            'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
        if (basename) {
            path = stripBasename(path, basename);
        }
        return createLocation(path, state, key);
    };
    const createKey = () => (Math.random().toString(36).substr(2, keyLength));
    const transitionManager = createTransitionManager();
    const setState = (nextState) => {
        Object.assign(history, nextState);
        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
    };
    const handlePopState = (event) => {
        // Ignore extraneous popstate events in WebKit.
        if (isExtraneousPopstateEvent(event)) {
            return;
        }
        handlePop(getDOMLocation(event.state));
    };
    const handleHashChange = () => {
        handlePop(getDOMLocation(getHistoryState()));
    };
    let forceNextPop = false;
    const handlePop = (location) => {
        if (forceNextPop) {
            forceNextPop = false;
            setState();
        }
        else {
            const action = 'POP';
            transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
                if (ok) {
                    setState({ action, location });
                }
                else {
                    revertPop(location);
                }
            });
        }
    };
    const revertPop = (fromLocation) => {
        const toLocation = history.location;
        // TODO: We could probably make this more reliable by
        // keeping a list of keys we've seen in sessionStorage.
        // Instead, we just default to 0 for keys we don't know.
        let toIndex = allKeys.indexOf(toLocation.key);
        if (toIndex === -1) {
            toIndex = 0;
        }
        let fromIndex = allKeys.indexOf(fromLocation.key);
        if (fromIndex === -1) {
            fromIndex = 0;
        }
        const delta = toIndex - fromIndex;
        if (delta) {
            forceNextPop = true;
            go(delta);
        }
    };
    const initialLocation = getDOMLocation(getHistoryState());
    let allKeys = [initialLocation.key];
    // Public interface
    const createHref = (location) => {
        return basename + createPath(location);
    };
    const push = (path, state) => {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' +
            'argument is a location-like object that already has state; it is ignored');
        const action = 'PUSH';
        const location = createLocation(path, state, createKey(), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const href = createHref(location);
            const { key, state } = location;
            if (canUseHistory) {
                globalHistory.pushState({ key, state }, null, href);
                if (forceRefresh) {
                    window.location.href = href;
                }
                else {
                    const prevIndex = allKeys.indexOf(history.location.key);
                    const nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
                    nextKeys.push(location.key);
                    allKeys = nextKeys;
                    setState({ action, location });
                }
            }
            else {
                warning(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history');
                window.location.href = href;
            }
        });
    };
    const replace = (path, state) => {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' +
            'argument is a location-like object that already has state; it is ignored');
        const action = 'REPLACE';
        const location = createLocation(path, state, createKey(), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const href = createHref(location);
            const { key, state } = location;
            if (canUseHistory) {
                globalHistory.replaceState({ key, state }, null, href);
                if (forceRefresh) {
                    window.location.replace(href);
                }
                else {
                    const prevIndex = allKeys.indexOf(history.location.key);
                    if (prevIndex !== -1) {
                        allKeys[prevIndex] = location.key;
                    }
                    setState({ action, location });
                }
            }
            else {
                warning(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history');
                window.location.replace(href);
            }
        });
    };
    const go = (n) => {
        globalHistory.go(n);
    };
    const goBack = () => go(-1);
    const goForward = () => go(1);
    let listenerCount = 0;
    const checkDOMListeners = (delta) => {
        listenerCount += delta;
        if (listenerCount === 1) {
            addEventListener(window, PopStateEvent, handlePopState);
            if (needsHashChangeListener) {
                addEventListener(window, HashChangeEvent, handleHashChange);
            }
        }
        else if (listenerCount === 0) {
            removeEventListener(window, PopStateEvent, handlePopState);
            if (needsHashChangeListener) {
                removeEventListener(window, HashChangeEvent, handleHashChange);
            }
        }
    };
    let isBlocked = false;
    const block = (prompt = '') => {
        const unblock = transitionManager.setPrompt(prompt);
        if (!isBlocked) {
            checkDOMListeners(1);
            isBlocked = true;
        }
        return () => {
            if (isBlocked) {
                isBlocked = false;
                checkDOMListeners(-1);
            }
            return unblock();
        };
    };
    const listen = (listener) => {
        const unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(1);
        return () => {
            checkDOMListeners(-1);
            unlisten();
        };
    };
    const history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref,
        push,
        replace,
        go,
        goBack,
        goForward,
        block,
        listen
    };
    return history;
};

const HashChangeEvent$1 = 'hashchange';
const HashPathCoders = {
    hashbang: {
        encodePath: (path) => path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path),
        decodePath: (path) => path.charAt(0) === '!' ? path.substr(1) : path
    },
    noslash: {
        encodePath: stripLeadingSlash,
        decodePath: addLeadingSlash
    },
    slash: {
        encodePath: addLeadingSlash,
        decodePath: addLeadingSlash
    }
};
const getHashPath = () => {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    const href = window.location.href;
    const hashIndex = href.indexOf('#');
    return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
};
const pushHashPath = (path) => (window.location.hash = path);
const replaceHashPath = (path) => {
    const hashIndex = window.location.href.indexOf('#');
    window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
};
const createHashHistory = (props = {}) => {
    invariant(canUseDOM, 'Hash history needs a DOM');
    const globalHistory = window.history;
    const canGoWithoutReload = supportsGoWithoutReloadUsingHash();
    const { getUserConfirmation = getConfirmation, hashType = 'slash' } = props;
    const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
    const { encodePath, decodePath } = HashPathCoders[hashType];
    const getDOMLocation = () => {
        let path = decodePath(getHashPath());
        warning((!basename || hasBasename(path, basename)), 'You are attempting to use a basename on a page whose URL path does not begin ' +
            'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
        if (basename) {
            path = stripBasename(path, basename);
        }
        return createLocation(path);
    };
    const transitionManager = createTransitionManager();
    const setState = (nextState) => {
        Object.assign(history, nextState);
        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
    };
    let forceNextPop = false;
    let ignorePath = null;
    const handleHashChange = () => {
        const path = getHashPath();
        const encodedPath = encodePath(path);
        if (path !== encodedPath) {
            // Ensure we always have a properly-encoded hash.
            replaceHashPath(encodedPath);
        }
        else {
            const location = getDOMLocation();
            const prevLocation = history.location;
            if (!forceNextPop && locationsAreEqual(prevLocation, location)) {
                return; // A hashchange doesn't always == location change.
            }
            if (ignorePath === createPath(location)) {
                return; // Ignore this change; we already setState in push/replace.
            }
            ignorePath = null;
            handlePop(location);
        }
    };
    const handlePop = (location) => {
        if (forceNextPop) {
            forceNextPop = false;
            setState();
        }
        else {
            const action = 'POP';
            transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
                if (ok) {
                    setState({ action, location });
                }
                else {
                    revertPop(location);
                }
            });
        }
    };
    const revertPop = (fromLocation) => {
        const toLocation = history.location;
        // TODO: We could probably make this more reliable by
        // keeping a list of paths we've seen in sessionStorage.
        // Instead, we just default to 0 for paths we don't know.
        let toIndex = allPaths.lastIndexOf(createPath(toLocation));
        if (toIndex === -1) {
            toIndex = 0;
        }
        let fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
        if (fromIndex === -1) {
            fromIndex = 0;
        }
        const delta = toIndex - fromIndex;
        if (delta) {
            forceNextPop = true;
            go(delta);
        }
    };
    // Ensure the hash is encoded properly before doing anything else.
    const path = getHashPath();
    const encodedPath = encodePath(path);
    if (path !== encodedPath) {
        replaceHashPath(encodedPath);
    }
    const initialLocation = getDOMLocation();
    let allPaths = [createPath(initialLocation)];
    // Public interface
    const createHref = (location) => ('#' + encodePath(basename + createPath(location)));
    const push = (path, state) => {
        warning(state === undefined, 'Hash history cannot push state; it is ignored');
        const action = 'PUSH';
        const location = createLocation(path, undefined, undefined, history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const path = createPath(location);
            const encodedPath = encodePath(basename + path);
            const hashChanged = getHashPath() !== encodedPath;
            if (hashChanged) {
                // We cannot tell if a hashchange was caused by a PUSH, so we'd
                // rather setState here and ignore the hashchange. The caveat here
                // is that other hash histories in the page will consider it a POP.
                ignorePath = path;
                pushHashPath(encodedPath);
                const prevIndex = allPaths.lastIndexOf(createPath(history.location));
                const nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
                nextPaths.push(path);
                allPaths = nextPaths;
                setState({ action, location });
            }
            else {
                warning(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');
                setState();
            }
        });
    };
    const replace = (path, state) => {
        warning(state === undefined, 'Hash history cannot replace state; it is ignored');
        const action = 'REPLACE';
        const location = createLocation(path, undefined, undefined, history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const path = createPath(location);
            const encodedPath = encodePath(basename + path);
            const hashChanged = getHashPath() !== encodedPath;
            if (hashChanged) {
                // We cannot tell if a hashchange was caused by a REPLACE, so we'd
                // rather setState here and ignore the hashchange. The caveat here
                // is that other hash histories in the page will consider it a POP.
                ignorePath = path;
                replaceHashPath(encodedPath);
            }
            const prevIndex = allPaths.indexOf(createPath(history.location));
            if (prevIndex !== -1) {
                allPaths[prevIndex] = path;
            }
            setState({ action, location });
        });
    };
    const go = (n) => {
        warning(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');
        globalHistory.go(n);
    };
    const goBack = () => go(-1);
    const goForward = () => go(1);
    let listenerCount = 0;
    const checkDOMListeners = (delta) => {
        listenerCount += delta;
        if (listenerCount === 1) {
            addEventListener(window, HashChangeEvent$1, handleHashChange);
        }
        else if (listenerCount === 0) {
            removeEventListener(window, HashChangeEvent$1, handleHashChange);
        }
    };
    let isBlocked = false;
    const block = (prompt = '') => {
        const unblock = transitionManager.setPrompt(prompt);
        if (!isBlocked) {
            checkDOMListeners(1);
            isBlocked = true;
        }
        return () => {
            if (isBlocked) {
                isBlocked = false;
                checkDOMListeners(-1);
            }
            return unblock();
        };
    };
    const listen = (listener) => {
        const unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(1);
        return () => {
            checkDOMListeners(-1);
            unlisten();
        };
    };
    const history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref,
        push,
        replace,
        go,
        goBack,
        goForward,
        block,
        listen
    };
    return history;
};

const HISTORIES = {
    "browser": createBrowserHistory,
    "hash": createHashHistory
};
/**
  * @name Router
  * @module ionic
  * @description
 */
class Router {
    constructor() {
        this.root = "/";
        this.historyType = "browser";
        // A suffix to append to the page title whenever
        // it's updated through RouteTitle
        this.titleSuffix = "";
        this.unsubscribe = () => { };
        this.match = null;
    }
    titleSuffixChanged(newValue) {
        this.activeRouter.set({
            titleSuffix: newValue
        });
    }
    computeMatch(pathname) {
        return {
            path: this.root,
            url: this.root,
            isExact: pathname === this.root,
            params: {}
        };
    }
    componentWillLoad() {
        const history = HISTORIES[this.historyType]();
        history.listen((location) => {
            this.activeRouter.set({ location: this.getLocation(location) });
        });
        this.activeRouter.set({
            location: this.getLocation(history.location),
            titleSuffix: this.titleSuffix,
            root: this.root,
            history
        });
        // subscribe the project's active router and listen
        // for changes. Recompute the match if any updates get
        // pushed
        this.unsubscribe = this.activeRouter.subscribe(() => {
            this.match = this.computeMatch();
        });
        this.match = this.computeMatch();
    }
    getLocation(location) {
        // Remove the root URL if found at beginning of string
        const pathname = location.pathname.indexOf(this.root) == 0 ?
            "/" + location.pathname.slice(this.root.length) :
            location.pathname;
        return Object.assign({}, location, { pathname });
    }
    componentDidUnload() {
        // be sure to unsubscribe to the router so that we don't
        // get any memory leaks
        this.unsubscribe();
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "stencil-router"; }
    static get properties() { return { "activeRouter": { "context": "activeRouter" }, "historyType": { "type": "Any", "attr": "history-type" }, "match": { "state": true }, "root": { "type": String, "attr": "root" }, "titleSuffix": { "type": String, "attr": "title-suffix", "watchCallbacks": ["titleSuffixChanged"] } }; }
}

class MyApp {
    constructor() {
        this.localheight = this.height;
        this.localheightPercent = 100;
    }
    handleScroll() {
        if (window.scrollY > this.height) {
            this.localheight = 56;
            this.localheightPercent = 0;
        }
        else if ((this.height - window.scrollY) > 56 && window.scrollY <= this.height) {
            this.localheight = this.height - window.scrollY;
            this.localheightPercent = this.localheight / this.height;
        }
    }
    componentWillLoad() {
        debugger;
        this.handleScroll();
    }
    closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }
    openNav() {
        document.getElementById("mySidenav").style.width = "250px";
    }
    render() {
        return (h("div", null,
            h("div", { id: "mySidenav", class: "sidenav" },
                h("a", { href: "javascript:void(0)", class: "closebtn", onClick: () => this.closeNav() }, "\u00D7 close"),
                h("a", { href: "#" }, "About"),
                h("a", { href: "#" }, "Services"),
                h("a", { href: "#" }, "Clients"),
                h("a", { href: "#" }, "Contact")),
            h("span", { style: { 'font-size': '30px', 'cursor': 'pointer' }, onClick: () => this.openNav() }, "open"),
            h("div", { id: "main" },
                h("ion-app", { class: "dark-theme" },
                    h("main", null,
                        h("stencil-router", null,
                            h("stencil-route", { url: '/', component: 'dash-board', exact: true }),
                            h("stencil-route", { url: '/wallet', component: 'wallet-balance' }),
                            h("stencil-route", { url: '/balancetransfer/:type', component: 'balance-transfer' }),
                            h("stencil-route", { url: '/events', component: 'sg-events' }),
                            h("stencil-route", { url: '/qrcode', component: 'sg-qr-code' })))))));
    }
    static get is() { return "my-app"; }
    static get properties() { return { "height": { "type": Number, "attr": "height" }, "history": { "state": true }, "localheight": { "state": true }, "localheightPercent": { "state": true } }; }
    static get style() { return "/*header {\n  background: #5851ff;\n  color: white;\n  height: 56px;\n  display: flex;\n  align-items: center;\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);\n}\n\nh1 {\n  font-size: 1.4rem;\n  font-weight: 500;\n  color: #fff;\n  padding: 0 12px;\n}*/\n.dark-theme ion-content {\n    background-color: #15171c;\n    color: #fff;\n}\n\n  my-app ion-header {\n    color: white;\n    display: flex;\n    align-items: center;\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);\n    top: 0;\n    left: 0;\n    right: 0;\n    transition: height ease,visibility 0.5s linear;\n\n    position: absolute;\n    z-index: 10;\n    display: block;\n    width: 100%;\n  }\n  my-app ion-content{\n        margin-top: 56px;\n  }\n\n     ion-navbar.toolbar {\n        padding: 4px;\n    min-height: 56px;\n    }\n ion-navbar.toolbar .toolbar-background{\n    background-color: #1c1e24;\n    border-color: #b2b2b2;\n }\n\n  \n   my-app header {\n    width:100%;\n  }\n  my-app .headerParent {\n    width: 100%; \n    height: 100%;\n    background-color: black; /* fallback color */\n  }\n\n   my-app .headerChild {\n    width: 100%;\n    height: 100%;\n    background-image: url(\"../assets/bg.jpg\");\n    background-position: center; \n    background-size: cover;\n  }\n  my-app .applogo{\n    display:block;\n    margin-left:auto;\n    margin-right:auto;\n    height:auto;\n    transform-origin: center top 0px;\n  }\n\n  \n\n\n.title-image{\n  height:40px;\n}\n.btn-bar .btn-active {\n    background-image: linear-gradient(to bottom, #e0b346 0%, #b37103 100%);\n    background-repeat: repeat-x;\n    border-color: #ecc591;\n}\nion-button .btn-primary {\n    border-radius: 25px;\n    font-size: 18px;\n    box-shadow: 0 3px 6px rgba(11, 11, 32, 0.5);\n    background-image: linear-gradient(to bottom, #e0b346 0%, #b37103 100%);\n    background-repeat: repeat-x;\n    color: #000;\n}\n.toolbar-title{\n    color:#FFF;\n}\n.toolbar-title-ios {\n    font-weight: normal;\n}\nion-title {\n    text-transform: uppercase;\n    text-align: center;\n}\n\n/* The side navigation menu */\n.sidenav {\n    height: 100%; /* 100% Full-height */\n    width: 0; /* 0 width - change this with JavaScript */\n    position: fixed; /* Stay in place */\n    z-index: 1; /* Stay on top */\n    top: 0; /* Stay at the top */\n    left: 0;\n    background-color: #111; /* Black*/\n    overflow-x: hidden; /* Disable horizontal scroll */\n    padding-top: 60px; /* Place content 60px from the top */\n    transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */\n}\n\n/* The navigation menu links */\n.sidenav a {\n    padding: 8px 8px 8px 32px;\n    text-decoration: none;\n    font-size: 25px;\n    color: #818181;\n    display: block;\n    transition: 0.3s;\n}\n\n/* When you mouse over the navigation links, change their color */\n.sidenav a:hover {\n    color: #f1f1f1;\n}\n\n/* Position and style the close button (top right corner) */\n.sidenav .closebtn {\n    position: absolute;\n    top: 0;\n    right: 25px;\n    font-size: 36px;\n    margin-left: 50px;\n}\n\n/* Style page content - use this if you want to push the page content to the right when you open the side navigation */\n#main {\n    transition: margin-left .5s;\n    padding: 20px;\n}\n\n/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */\n\@media screen and (max-height: 450px) {\n    .sidenav {padding-top: 15px;}\n    .sidenav a {font-size: 18px;}\n}"; }
}
/*
import { Listen, State, Prop, Component } from '@stencil/core';


@Component({
  tag: 'my-app',
  styleUrl: 'my-app.css'
})
export class MyApp {
  @Prop() height: number;
  @State() history:Array<string>;
  @State() localheight: number = this.height;
  @State() localheightPercent: number = 100;
  @Listen('window:scroll')
  handleScroll() {
    if(window.scrollY > this.height)
    {
      this.localheight = 56;
      this.localheightPercent = 0;
    }
    else if((this.height -window.scrollY) >56 && window.scrollY <= this.height)
    {
      this.localheight = this.height - window.scrollY;
      this.localheightPercent = this.localheight/ this.height;
    }
  }
  componentWillLoad() {
    this.handleScroll();
  }
  render() {
    return (
      <div>
        <header style={{height:this.localheight+'px'}}>
          <div class="headerParent">
            <div class="headerChild" style={{display:this.localheight == 56 ? 'none':'block', opacity:this.localheightPercent%10+''}}>
                <img class="applogo" src="../assets/logo.png" style={{transform:'scale('+this.localheightPercent%10+','+this.localheightPercent%10+')'}}/>
            </div>
            <h1 style={{visibility:this.localheight == 56 ? 'visible':'hidden'}}>Hard Rock</h1>
          </div>
        </header>

        <main>
          <stencil-router>
            <stencil-route url='/' component='app-home' exact={true}>
            </stencil-route>

            <stencil-route url='/profile/:name' component='app-profile'>
            </stencil-route>
          </stencil-router>
        </main>
      </div>
    );
  }
}
*/

export { App as IonApp, RouterController as IonRouterController, Route as StencilRoute, Router as StencilRouter, MyApp };
