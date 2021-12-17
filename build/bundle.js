(()=>{"use strict";var t={28:(t,e,n)=>{n.d(e,{Z:()=>i});var r=n(81),o=n.n(r),a=n(645),s=n.n(a)()(o());s.push([t.id,"*{\n    margin: 0;\n    padding: 0;\n}\n\n.canvas_wrapper{\n    width: 100vw;\n    height: 100vh;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n#canvas {\n    width: calc(100% - 40px);\n    height: calc(100% - 40px);\n    border: 3px solid black;\n}",""]);const i=s},645:t=>{t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n="",r=void 0!==e[5];return e[4]&&(n+="@supports (".concat(e[4],") {")),e[2]&&(n+="@media ".concat(e[2]," {")),r&&(n+="@layer".concat(e[5].length>0?" ".concat(e[5]):""," {")),n+=t(e),r&&(n+="}"),e[2]&&(n+="}"),e[4]&&(n+="}"),n})).join("")},e.i=function(t,n,r,o,a){"string"==typeof t&&(t=[[null,t,void 0]]);var s={};if(r)for(var i=0;i<this.length;i++){var c=this[i][0];null!=c&&(s[c]=!0)}for(var u=0;u<t.length;u++){var d=[].concat(t[u]);r&&s[d[0]]||(void 0!==a&&(void 0===d[5]||(d[1]="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {").concat(d[1],"}")),d[5]=a),n&&(d[2]?(d[1]="@media ".concat(d[2]," {").concat(d[1],"}"),d[2]=n):d[2]=n),o&&(d[4]?(d[1]="@supports (".concat(d[4],") {").concat(d[1],"}"),d[4]=o):d[4]="".concat(o)),e.push(d))}},e}},81:t=>{t.exports=function(t){return t[1]}},379:t=>{var e=[];function n(t){for(var n=-1,r=0;r<e.length;r++)if(e[r].identifier===t){n=r;break}return n}function r(t,r){for(var a={},s=[],i=0;i<t.length;i++){var c=t[i],u=r.base?c[0]+r.base:c[0],d=a[u]||0,l="".concat(u," ").concat(d);a[u]=d+1;var f=n(l),p={css:c[1],media:c[2],sourceMap:c[3],supports:c[4],layer:c[5]};if(-1!==f)e[f].references++,e[f].updater(p);else{var h=o(p,r);r.byIndex=i,e.splice(i,0,{identifier:l,updater:h,references:1})}s.push(l)}return s}function o(t,e){var n=e.domAPI(e);return n.update(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap&&e.supports===t.supports&&e.layer===t.layer)return;n.update(t=e)}else n.remove()}}t.exports=function(t,o){var a=r(t=t||[],o=o||{});return function(t){t=t||[];for(var s=0;s<a.length;s++){var i=n(a[s]);e[i].references--}for(var c=r(t,o),u=0;u<a.length;u++){var d=n(a[u]);0===e[d].references&&(e[d].updater(),e.splice(d,1))}a=c}}},569:t=>{var e={};t.exports=function(t,n){var r=function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}e[t]=n}return e[t]}(t);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(n)}},216:t=>{t.exports=function(t){var e=document.createElement("style");return t.setAttributes(e,t.attributes),t.insert(e,t.options),e}},565:(t,e,n)=>{t.exports=function(t){var e=n.nc;e&&t.setAttribute("nonce",e)}},795:t=>{t.exports=function(t){var e=t.insertStyleElement(t);return{update:function(n){!function(t,e,n){var r="";n.supports&&(r+="@supports (".concat(n.supports,") {")),n.media&&(r+="@media ".concat(n.media," {"));var o=void 0!==n.layer;o&&(r+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),r+=n.css,o&&(r+="}"),n.media&&(r+="}"),n.supports&&(r+="}");var a=n.sourceMap;a&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),e.styleTagTransform(r,t,e.options)}(e,t,n)},remove:function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(e)}}}},589:t=>{t.exports=function(t,e){if(e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}},641:(t,e,n)=>{const r=JSON.parse('{"a":[{"name":"cube","dots":[[10,10],[60,10],[60,60],[10,60]]},{"name":"flag","dots":[[10,80],[50,100],[50,140],[10,140]]},{"name":"triangle","dots":[[40,160],[10,220],[70,220]]}]}');var o=n(379),a=n.n(o),s=n(795),i=n.n(s),c=n(569),u=n.n(c),d=n(565),l=n.n(d),f=n(216),p=n.n(f),h=n(589),v=n.n(h),m=n(28),g={};g.styleTagTransform=v(),g.setAttributes=l(),g.insert=u().bind(null,"head"),g.domAPI=i(),g.insertStyleElement=p(),a()(m.Z,g),m.Z&&m.Z.locals&&m.Z.locals;const y=document.getElementById("canvas"),x=y.getContext("2d"),b=window.innerWidth-40,w=window.innerHeight-40,E=r.a,T=[],C=new Set;let S,M;function A(){x.clearRect(0,0,y.width,y.height),I()}function I(){T.forEach((t=>{const e=C.has(t.name);t.draw(e)}))}y.setAttribute("width",b),y.setAttribute("height",w),E.forEach((t=>{T.push(new class{constructor(t,e,n){this.dots=t,this.canvas=e,this.ctx=e.getContext("2d"),this.name=n}draw(t){this.ctx.beginPath(),this.dots.forEach(((t,e)=>{0===e?this.ctx.moveTo(t[0],t[1]):this.ctx.lineTo(t[0],t[1])})),this.ctx.closePath(),this.ctx.stroke(),t&&(this.ctx.fillStyle="red",this.ctx.fill())}move(t,e){let n=this.dots.map((n=>[n[0]+t,n[1]+e]));this.dots=n}}(t.dots,y,t.name))})),I(),y.onmousedown=function(t){const e=t.offsetX,n=t.offsetY;T.forEach((t=>{const r=function(t,e,n){var r,o=n.length-1,a=!1,s=n.map((t=>t[0])),i=n.map((t=>t[1]));for(r=0;r<n.length;r++)(i[r]<e&&i[o]>=e||i[o]<e&&i[r]>=e)&&(s[r]<=t||s[o]<=t)&&(a^=s[r]+(e-i[r])/(i[o]-i[r])*(s[o]-s[r])<t),o=r;return!!a}(e,n,t.dots);r&&(S=e,M=n,y.onmousemove=e=>{const n=e.offsetX,r=e.offsetY,o=n-S,a=r-M;t.move(o,a),A(),S=n,M=r,y.onmouseup=()=>{C.clear(),T.forEach(((t,e)=>{t.dots.forEach(((n,r)=>{let o,a=n;o=r===t.dots.length-1?t.dots[0]:t.dots[r+1],T.forEach(((n,r)=>{r!==e&&n.dots.forEach(((e,r)=>{let s,i=e;if(s=r===n.dots.length-1?n.dots[0]:n.dots[r+1],function(t,e,n,r){const o=t[0],a=t[1],s=e[0],i=e[1],c=n[0],u=n[1];var d=s-o,l=i-a,f=r[0]-c,p=r[1]-u,h=(-l*(o-c)+d*(a-u))/(-f*l+d*p),v=(+f*(a-u)-p*(o-c))/(-f*l+d*p);if(h>=0&&h<=1&&v>=0&&v<=1)return!0}(a,o,i,s))return C.add(t.name),0}))}))}))})),A(),y.onmousemove=null}})}))}}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var a=e[r]={id:r,exports:{}};return t[r](a,a.exports,n),a.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n(641)})();