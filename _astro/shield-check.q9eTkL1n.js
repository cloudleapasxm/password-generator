import{r as h}from"./index.-iFofLld.js";var m={exports:{}},k={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var N;function P(){if(N)return k;N=1;var t=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function n(o,r,s){var c=null;if(s!==void 0&&(c=""+s),r.key!==void 0&&(c=""+r.key),"key"in r){s={};for(var l in r)l!=="key"&&(s[l]=r[l])}else s=r;return r=s.ref,{$$typeof:t,type:o,key:c,ref:r!==void 0?r:null,props:s}}return k.Fragment=e,k.jsx=n,k.jsxs=n,k}var R;function $(){return R||(R=1,m.exports=P()),m.exports}var V=$();/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=t=>t?.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function I(t,e,n=[]){if(e==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:B(t),size:24,node:e,...n.length>0?{aliases:n}:{}}}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=t=>{let e="",n=!1;for(const o of t){if(o==="-"||o==="_"||o<=" "){n=e.length>0;continue}e.length===0?e+=o.toLowerCase():e+=n?o.toUpperCase():o,n=!1}return e};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=t=>{const e=T(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=(...t)=>t.filter((e,n,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function v(t){return t!=null}function J(t,e={}){const n=e.attributeNames??{},o=i=>n[i]??i,r=t.size??t.width??d.width,s=t.size??t.height??d.height,c=t.aliases?.filter(i=>typeof i=="string"&&i.trim()!=="").map(i=>`lucide-${i}`)??[],l=[...t.name?[`lucide-${t.name}`]:[],...c],u=e.className?.split(" ").filter(Boolean)??[],x=e.includeDefaultClasses===!1?S(...u):S("lucide",...l,...u),b=e.absoluteStrokeWidth?Number(e.strokeWidth??d["stroke-width"])*Number(t.size??t.width??d.width)/Number(e.size??e.width??d.width):e.strokeWidth??d["stroke-width"];return["svg",{...Object.entries(d).reduce((i,[a,f])=>(i[o(a)]=f,i),{}),..."color"in e&&e.color&&{[o("stroke")]:e.color},..."size"in e&&v(e.size)&&{[o("width")]:e.size,[o("height")]:e.size},..."width"in e&&v(e.width)&&{[o("width")]:e.width},..."height"in e&&v(e.height)&&{[o("height")]:e.height},[o("stroke-width")]:b,...x&&{[o("class")]:x},[o("viewBox")]:`0 0 ${r} ${s}`,...e.hasA11yProp===!1?{[o("aria-hidden")]:"true"}:{},..."attributes"in e&&e.attributes},t.node.map(i=>{const[a,f,w]=i,C=e.nonScalingStroke?{[o("vector-effect")]:"non-scaling-stroke",...f}:f;return w?[a,C,w]:[a,C]})]}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function F(t,e={}){return J(t,{...e,attributeNames:{...e.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},M=h.createContext({}),U=()=>h.useContext(M),Y=h.forwardRef(({color:t,size:e,width:n,height:o,strokeWidth:r,absoluteStrokeWidth:s,nonScalingStroke:c,className:l="",children:u,iconNode:x=[],icon:b={node:x,aliases:[],size:24},...g},i)=>{const{size:a=24,strokeWidth:f=2,absoluteStrokeWidth:w=!1,nonScalingStroke:C=!1,color:z="currentColor",className:E=""}=U()??{},p=!!u||D(g),[W,j,L=[]]=F(b,{color:t??z,width:n??e??a,height:o??e??a,strokeWidth:r??f,absoluteStrokeWidth:s??w,nonScalingStroke:c??C,className:S(E,l),hasA11yProp:p,attributes:g});return h.createElement(W,{ref:i,...j},[...L.map(([_,y])=>h.createElement(_,y)),...Array.isArray(u)?u:[u]])});/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function G(t,e=[],n=[]){const o=typeof t=="string"?I(t,e,n):t,r=h.forwardRef(({className:s,...c},l)=>h.createElement(Y,{ref:l,icon:o,className:s,...c}));return o.name&&(r.displayName=q(o.name)),r}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A={name:"shield-check",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]};A.node;const Z=G(A);export{Z as S,G as c,V as j};
