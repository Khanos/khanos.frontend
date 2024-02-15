import{r as u}from"./index.NEDEFKed.js";var p={exports:{}},s={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _=u,c=Symbol.for("react.element"),d=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,x=_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,y={key:!0,ref:!0,__self:!0,__source:!0};function f(n,e,t){var r,o={},l=null,a=null;t!==void 0&&(l=""+t),e.key!==void 0&&(l=""+e.key),e.ref!==void 0&&(a=e.ref);for(r in e)m.call(e,r)&&!y.hasOwnProperty(r)&&(o[r]=e[r]);if(n&&n.defaultProps)for(r in e=n.defaultProps,e)o[r]===void 0&&(o[r]=e[r]);return{$$typeof:c,type:n,key:l,ref:a,props:o,_owner:x.current}}s.Fragment=d;s.jsx=f;s.jsxs=f;p.exports=s;var i=p.exports;const g=n=>{const{lang:e}=n,t=()=>e==="en"?"🇪🇸 Español":"🇺🇸 English";return i.jsx("div",{style:{padding:"1rem"},children:i.jsx("a",{href:`/change/${e==="en"?"es":"en"}`,className:"hover:underline",children:t()})})};export{g as default};
