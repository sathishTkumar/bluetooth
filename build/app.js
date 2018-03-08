/*! Built with http://stenciljs.com */
(function(win, doc, appNamespace, urlNamespace, publicPath, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components) {

function init(win, doc, appNamespace, urlNamespace, publicPath, appCore, appCorePolyfilled, hydratedCssClass, components, x, y) {
    // create global namespace if it doesn't already exist
    (win[appNamespace] = win[appNamespace] || {}).components = components;
    y = components.filter(function (c) { return c[2]; }).map(function (c) { return c[0]; });
    if (y.length) {
        // auto hide components until they been fully hydrated
        // reusing the "x" and "i" variables from the args for funzies
        x = doc.createElement('style');
        x.innerHTML = y.join() + '{visibility:hidden}.' + hydratedCssClass + '{visibility:inherit}';
        x.setAttribute('data-styles', '');
        doc.head.insertBefore(x, doc.head.firstChild);
    }
    // get this current script
    // script tag cannot use "async" attribute
    x = doc.scripts[doc.scripts.length - 1];
    if (x && x.src) {
        y = x.src.split('/').slice(0, -1);
        publicPath = (y.join('/')) + (y.length ? '/' : '') + urlNamespace + '/';
    }
    // request the core this browser needs
    // test for native support of custom elements and fetch
    // if either of those are not supported, then use the core w/ polyfills
    // also check if the page was build with ssr or not
    x = doc.createElement('script');
    x.src = publicPath + ((!urlContainsFlag(win) && supportsCustomElements(win) && supportsEsModules(x) && supportsFetch(win) && supportsCssVariables(win)) ? appCore : appCorePolyfilled);
    x.setAttribute('data-path', publicPath);
    x.setAttribute('data-namespace', urlNamespace);
    doc.head.appendChild(x);
}
function urlContainsFlag(win) {
    return win.location.search.indexOf('core=es5') > -1;
}
function supportsEsModules(scriptElm) {
    // detect static ES module support
    const staticModule = 'noModule' in scriptElm;
    if (!staticModule) {
        return false;
    }
    // detect dynamic import support
    try {
        new Function('import("")');
        return true;
    }
    catch (err) {
        return false;
    }
}
function supportsCustomElements(win) {
    return win.customElements;
}
function supportsFetch(win) {
    return win.fetch;
}
function supportsCssVariables(win) {
    return (win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'));
}


init(win, doc, appNamespace, urlNamespace, publicPath, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components);

})(window, document, "App","app","/build/app/","app.core.js","es5-build-disabled.js","hydrated",[["add-cash",{"ios":"add-cash.ios","md":"add-cash.md"}],["app-home","app-home",1],["app-profile","app-profile",1,[["match",1]]],["balance-info",{"ios":"balance-info.ios","md":"balance-info.md"},1,[["FormattedAmount",1,"formatted-amount",2],["Type",1,"type",2],["TypeValue",1,"type-value",3],["data",5],["mode",1,1,2],["navPrams",1,"nav-prams",1]]],["balance-transfer",{"ios":"balance-transfer.ios","md":"balance-transfer.md"},1,[["alertCtrl",4,0,0,"ion-alert-controller"],["fIcon",5],["history",1],["match",1,1,1],["mode",1,1,1],["navPrams",1,"nav-prams",1],["sIcon",5],["selectedItem",5],["toastCtrl",4,0,0,"ion-toast-controller"]]],["dash-board",{"ios":"balance-info.ios","md":"balance-info.md"},1,[["actionSheetCtrl",4,0,0,"ion-action-sheet"],["dashbordComponent",1],["history",1],["match",1,1,1],["page",5],["slidesImage",1],["type",5]]],["ion-action-sheet",{"ios":"balance-info.ios","md":"balance-info.md"},1,[["animate",1,1,3],["animationCtrl",4,0,0,"ion-animation-controller"],["buttons",1,1,1],["config",3,0,0,"config"],["cssClass",1,1,2],["dismiss",6],["el",7],["enableBackdropDismiss",1,1,3],["enterAnimation",1,1,1],["leaveAnimation",1,1,1],["present",6],["subTitle",1,1,2],["title",1,1,2],["translucent",1,1,3]],0,[["ionDismiss","onDismiss"]]],["ion-alert",{"ios":"balance-transfer.ios","md":"balance-transfer.md"},1,[["animate",1,1,3],["animationCtrl",4,0,0,"ion-animation-controller"],["buttons",1,1,1],["config",3,0,0,"config"],["cssClass",1,1,2],["dismiss",6],["el",7],["enableBackdropDismiss",1,1,3],["enterAnimation",1,1,1],["inputs",2,1,1],["leaveAnimation",1,1,1],["message",1,1,2],["present",6],["subTitle",1,1,2],["title",1,1,2],["translucent",1,1,3]]],["ion-alert-controller",{"ios":"balance-transfer.ios","md":"balance-transfer.md"},0,[["create",6]],0,[["body:ionAlertDidLoad","didLoad"],["body:ionAlertDidUnload","willDismiss"],["body:ionAlertWillDismiss","willDismiss"],["body:ionAlertWillPresent","willPresent"],["body:keyup.escape","escapeKeyUp"]]],["ion-animation-controller","ion-animation-controller",0,[["create",6]]],["ion-app",{"ios":"ion-app.ios","md":"ion-app.md"},1,[["config",3,0,0,"config"],["element",7],["getActiveNavs",6],["getNavByIdOrName",6],["getRootNavs",6],["hoverCSS",5],["isScrolling",6],["modeCode",5],["useRouter",5]],0,[["body:navInit","registerRootNav"]]],["ion-backdrop","ion-animation-controller",1],["ion-button",{"ios":"ion-button.ios","md":"ion-button.md"},1,[["buttonType",1,1,2],["color",1,1,2],["disabled",1,1,3],["el",7],["expand",1,1,1],["fill",1,1,1],["href",1,1,2],["mode",1,1,1],["round",1,1,3],["size",1,1,1],["strong",1,1,3]]],["ion-buttons",{"ios":"ion-buttons.ios","md":"ion-buttons.md"},0,[["el",7]]],["ion-card",{"ios":"balance-transfer.ios","md":"balance-transfer.md"},1,[["color",1,1,2],["mode",1,1,1]]],["ion-card-content",{"ios":"balance-transfer.ios","md":"balance-transfer.md"},1,[["color",1,1,2],["mode",1,1,1]]],["ion-card-header",{"ios":"balance-info.ios","md":"balance-info.md"},1,[["color",1,1,2],["mode",1,1,1],["translucent",1,1,3]]],["ion-col","ion-col"],["ion-content",{"ios":"ion-buttons.ios","md":"ion-buttons.md"},1,[["config",3,0,0,"config"],["el",7],["enableJsScroll",6],["fullscreen",1,1,3],["ionScroll",1,1,1],["ionScrollEnd",1,1,1],["ionScrollStart",1,1,1],["scrollToBottom",6],["scrollToTop",6]],0,[["body:ionNavChanged","onNavChanged"]]],["ion-grid",{"ios":"balance-transfer.ios","md":"balance-transfer.md"},1],["ion-header",{"ios":"ion-buttons.ios","md":"ion-buttons.md"},1,[["translucent",1,1,3]]],["ion-icon",{"ios":"ion-buttons.ios","md":"ion-buttons.md"},1,[["ariaLabel",1,1,2],["ios",1,1,2],["isServer",3,0,0,"isServer"],["md",1,1,2],["mode",3,0,0,"mode"],["name",1,1,2],["svgContent",5]]],["ion-item",{"ios":"ion-item.ios","md":"ion-item.md"},1,[["color",1,1,2],["el",7],["hasStyleChange",5],["href",1,1,2],["mode",1,1,1]],0,[["ionStyle","itemStyle"]]],["ion-label",{"ios":"add-cash.ios","md":"add-cash.md"},1,[["color",1,1,2],["el",7],["fixed",1,1,3],["floating",1,1,3],["getText",6],["mode",1,1,1],["stacked",1,1,3]]],["ion-list",{"ios":"ion-item.ios","md":"ion-item.md"},1,[["closeSlidingItems",6],["getOpenedItem",6],["setOpenedItem",6]]],["ion-list-header",{"ios":"add-cash.ios","md":"add-cash.md"},1,[["color",1,1,2],["mode",1,1,1]]],["ion-navbar",{"ios":"ion-buttons.ios","md":"ion-buttons.md"},0,[["backButtonIcon",1,1,2],["backButtonText",1,1,2],["config",3,0,0,"config"],["el",7],["hidden",1,1,3],["hideBackButton",1,1,3]]],["ion-page",{"ios":"ion-buttons.ios","md":"ion-buttons.md"}],["ion-radio",{"ios":"add-cash.ios","md":"add-cash.md"},1,[["checked",2,1,3],["color",1,1,2],["disabled",1,1,3],["keyFocus",5],["mode",1,1,1],["name",1,1,2],["value",2,1,2]]],["ion-router-controller",{"ios":"ion-app.ios","md":"ion-app.md"},0,[["config",3,0,0,"config"]],0,[["body:ionNavChanged","onNavChanged"],["window:hashchange","onURLHashChanged"]]],["ion-row","ion-col"],["ion-scroll",{"ios":"ion-buttons.ios","md":"ion-buttons.md"},0,[["config",3,0,0,"config"],["el",7],["enabled",1,1,3],["jsScroll",1,1,3],["onionScroll",1,1,1],["onionScrollEnd",1,1,1],["onionScrollStart",1,1,1],["scrollToBottom",6],["scrollToPoint",6],["scrollToTop",6]],0,[["scroll","onNativeScroll",0,1]]],["ion-segment",{"ios":"ion-segment.ios","md":"ion-segment.md"},1,[["color",1,1,2],["disabled",2,1,3],["el",7],["mode",1,1,1],["value",2,1,2]],0,[["ionClick","segmentClick"]]],["ion-segment-button",{"ios":"ion-segment.ios","md":"ion-segment.md"},0,[["activated",5],["checked",2,1,3],["color",1,1,2],["disabled",2,1,3],["el",7],["mode",1,1,1],["value",2,1,2]]],["ion-slide","ion-slide",1],["ion-slides","ion-slide",1,[["autoplay",1,1,4],["control",1,1,1],["direction",1,1,1],["effect",1,1,2],["el",7],["initialSlide",1,1,4],["keyboardControl",1,1,3],["loop",1,1,3],["pager",1,1,3],["paginationType",1,1,2],["parallax",1,1,3],["slidesPerView",1,1,1],["spaceBetween",1,1,4],["speed",1,1,4],["zoom",1,1,3]]],["ion-thumbnail",{"ios":"ion-segment.ios","md":"ion-segment.md"},1],["ion-title",{"ios":"ion-buttons.ios","md":"ion-buttons.md"},1],["ion-toast",{"ios":"balance-transfer.ios","md":"balance-transfer.md"},1,[["animate",1,1,3],["animationCtrl",4,0,0,"ion-animation-controller"],["closeButtonText",1,1,2],["config",3,0,0,"config"],["cssClass",1,1,2],["dismiss",6],["dismissOnPageChange",1,1,3],["duration",1,1,4],["el",7],["enterAnimation",1,1,1],["leaveAnimation",1,1,1],["message",1,1,2],["position",1,1,2],["present",6],["showCloseButton",1,1,3],["toastId",1,1,2],["translucent",1,1,3]],0,[["ionDismiss","onDismiss"]]],["ion-toast-controller",{"ios":"balance-transfer.ios","md":"balance-transfer.md"},0,[["create",6]],0,[["body:ionToastDidLoad","didLoad"],["body:ionToastDidUnload","willDismiss"],["body:ionToastWillDismiss","willDismiss"],["body:ionToastWillPresent","willPresent"],["body:keyup.escape","escapeKeyUp"]]],["my-app",{"ios":"ion-app.ios","md":"ion-app.md"},1,[["height",1,1,4],["history",5],["localheight",5],["localheightPercent",5]],0,[["window:scroll","handleScroll",0,1]]],["player-card","player-card",1],["sg-events",{"ios":"ion-segment.ios","md":"ion-segment.md"},1,[["formatDate",5],["history",1],["selectedDay",5],["seletedCalendar",5]],0,[["notify","changeSelectedDate"],["ionChange","ionChangeChangeHandler"]]],["sg-events-mini",{"ios":"balance-info.ios","md":"balance-info.md"},1],["sg-qr-code","sg-qr-code",1],["slider-calendar",{"ios":"ion-segment.ios","md":"ion-segment.md"},1,[["selectdate",1,1,1],["selectedDay",1,"selected-day",1],["slides",1,1,1],["totaldaysCal",1,"totaldays-cal",1]]],["stencil-route",{"ios":"ion-app.ios","md":"ion-app.md"},0,[["activeRouter",3,0,0,"activeRouter"],["component",1,1,2],["componentProps",1],["exact",1,1,3],["group",1,1,2],["location",3,0,0,"location"],["match",5],["routeRender",1],["url",1]]],["stencil-route-link","stencil-route-link",0,[["activeClass",1,1,2],["activeRouter",3,0,0,"activeRouter"],["custom",1,1,3],["exact",1,1,3],["location",3,0,0,"location"],["match",5],["url",1,1,2],["urlMatch",1]]],["stencil-router",{"ios":"ion-app.ios","md":"ion-app.md"},0,[["activeRouter",3,0,0,"activeRouter"],["historyType",1],["match",5],["root",1,1,2],["titleSuffix",1,1,2]]],["wallet-balance",{"ios":"balance-info.ios","md":"balance-info.md"},1,[["DeviceInfo",1],["LocationInfo",1],["PlayerInfo",1],["history",1],["mini",1,1,3],["wallet",5]]],["wallet-mini",{"ios":"balance-info.ios","md":"balance-info.md"},1,[["balance",1,1,1]]]]);