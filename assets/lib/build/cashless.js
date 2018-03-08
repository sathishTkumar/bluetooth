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

})(window, document, "cashless","cashless","/build/cashless/","cashless.core.js","es5-build-disabled.js","hydrated",[["add-cash","add-cash"],["cash-balance-transfer","cash-balance-transfer",0,[["alertCtrl",4,0,0,"ion-alert-controller"],["fIcon",5],["mode",1,1,1],["navPrams",1,"nav-prams",1],["sIcon",5],["selectedItem",5],["stateValue",1,"state-value",1],["toastCtrl",4,0,0,"ion-toast-controller"]]],["cash-less","cash-balance-transfer",0,[["Cash",5],["DeviceInfo",1],["LocationInfo",1],["PlayerInfo",1],["Points",5],["Promo",5],["history",5],["mini",1,1,3],["mode",1,1,2],["stateValue",1,"state-value",1],["stateX",1,"state-x",1],["type",1,1,1]],0,[["statusChange","statusChangeHandler"],["backButton","backButtonListner"]]],["cash-less-home","cash-balance-transfer",0,[["cashBalance",1,"cash-balance",2],["mode",1,1,2],["pointsBalance",1,"points-balance",2],["promoBalance",1,"promo-balance",2]]],["club-status","cash-balance-transfer"],["component-header","cash-balance-transfer",0,[["currentState",1,"current-state",1],["headerName",1,"header-name",1],["showHome",1,"show-home",3]]],["player-balance","cash-balance-transfer",0,[["FormattedAmount",1,"formatted-amount",2],["Type",1,"type",2],["TypeValue",1,"type-value",3],["data",5],["mode",1,1,2]]]]);