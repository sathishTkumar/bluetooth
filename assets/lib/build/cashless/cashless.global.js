/*! Built with http://stenciljs.com */
(function(appNamespace,publicPath){"use strict";
(function(publicPath){function isCordova(){return!!(window.cordova||window.PhoneGap||window.phonegap)}const IPAD="ipad",IPHONE="iphone",IOS="ios",WINDOWS_PHONE=["windows phone"],PLATFORM_CONFIGS=[{name:IPAD,isMatch:(t,e)=>isPlatformMatch(t,e,IPAD,[IPAD],WINDOWS_PHONE)},{name:IPHONE,isMatch:(t,e)=>isPlatformMatch(t,e,IPHONE,[IPHONE],WINDOWS_PHONE)},{name:IOS,settings:{mode:IOS,tabsHighlight:!1,statusbarPadding:isCordova()},isMatch:(t,e)=>isPlatformMatch(t,e,IOS,[IPHONE,IPAD,"ipod"],WINDOWS_PHONE)},{name:"android",settings:{activator:"ripple",mode:"md"},isMatch:(t,e)=>isPlatformMatch(t,e,"android",["android","silk"],WINDOWS_PHONE)},{name:"core",settings:{mode:"md"}}];function detectPlatforms(t,e,n,o){let i=n.filter(n=>n.isMatch&&n.isMatch(t,e));return i.length||(i=n.filter(t=>t.name===o)),i}function isPlatformMatch(t,e,n,o,i){const r=queryParam(t,"ionicplatform");if(r)return r===n;if(e){e=e.toLowerCase();for(let t=0;t<o.length;t++)if(e.indexOf(o[t])>-1){for(let t=0;t<i.length;t++)if(e.indexOf(i[t])>-1)return!1;return!0}}return!1}function queryParam(t,e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");const n=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(t);return n?decodeURIComponent(n[1].replace(/\+/g," ")):null}function isDef(t){return void 0!==t&&null!==t}function createConfigController(t,e){function n(n,o){const i=queryParam(window.location.href,`ionic${n}`);if(isDef(i))return t[n]="true"===i||"false"!==i&&i;if(isDef(t[n]))return t[n];let r=null;for(let t=0;t<e.length;t++)if((r=e[t].settings)&&isDef(r[n]))return r[n];return void 0!==o?o:null}return t=t||{},{get:n,getBoolean:function(t,e){const o=n(t);return null===o?void 0!==e&&e:"string"==typeof o?"true"===o:!!o},getNumber:function(t,e){const o=parseFloat(n(t));return isNaN(o)?void 0!==e?e:NaN:o}}}function createDomControllerClient(t,e,n){const o=[],i=[],r=e=>t.requestAnimationFrame(e);function a(t,c,l,s){try{for(c=e();l=o.shift();)l(t);for(;(l=i.shift())&&(l(t),!(e()-c>8)););}catch(t){s=t}(n=o.length>0||i.length>0)&&r(a),s&&console.error(s)}return{read:t=>{o.push(t),n||(n=!0,r(a))},write:t=>{i.push(t),n||(n=!0,r(a))},raf:r}}const Ionic=window.Ionic=window.Ionic||{};if(!Context.dom){const t=()=>window.performance.now();Context.dom=createDomControllerClient(window,t)}Ionic.config=Context.config=createConfigController(Ionic.config,detectPlatforms(window.location.href,window.navigator.userAgent,PLATFORM_CONFIGS,"core")),Ionic.mode=Context.mode=document.documentElement.getAttribute("mode")||Context.config.get("mode","md"),document.documentElement.setAttribute("mode",Ionic.mode);
})(publicPath);
})("cashless","/build/cashless/");