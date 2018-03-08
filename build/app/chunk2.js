/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import './chunk1.js';

/** @hidden */








function getParentElement(elm) {
    if (elm.parentElement) {
        // normal element with a parent element
        return elm.parentElement;
    }
    if (elm.parentNode && elm.parentNode.host) {
        // shadow dom's document fragment
        return elm.parentNode.host;
    }
    return null;
}
function getPageElement(el) {
    const tabs = el.closest('ion-tabs');
    if (tabs) {
        return tabs;
    }
    const page = el.closest('ion-page,.ion-page,page-inner');
    if (page) {
        return page;
    }
    return getParentElement(el);
}


/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 * @param defaultRight whether the default side is right
 */

/** @hidden */










/**
 * @private
 */

function playAnimationAsync(animation) {
    return new Promise((resolve) => {
        animation.onFinish((ani) => {
            resolve(ani);
        });
        animation.play();
    });
}
function domControllerAsync(domControllerFunction, callback) {
    return new Promise((resolve) => {
        domControllerFunction(() => {
            callback();
            resolve();
        });
    });
}

export { domControllerAsync, playAnimationAsync, getPageElement };
