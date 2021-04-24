"use strict";function deepFreeze(e){Object.freeze(e);var n="function"==typeof e;return Object.getOwnPropertyNames(e).forEach(function(t){!e.hasOwnProperty(t)||null===e[t]||"object"!=typeof e[t]&&"function"!=typeof e[t]||n&&("caller"===t||"callee"===t||"arguments"===t)||Object.isFrozen(e[t])||deepFreeze(e[t])}),e}function escapeHTML(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function inherit(e){var n,t={},r=Array.prototype.slice.call(arguments,1);for(n in e)t[n]=e[n];return r.forEach(function(e){for(n in e)t[n]=e[n]}),t}function tag(e){return e.nodeName.toLowerCase()}function nodeStream(e){var n=[];return function e(t,r){for(var a=t.firstChild;a;a=a.nextSibling)3===a.nodeType?r+=a.nodeValue.length:1===a.nodeType&&(n.push({event:"start",offset:r,node:a}),r=e(a,r),tag(a).match(/br|hr|img|input/)||n.push({event:"stop",offset:r,node:a}));return r}(e,0),n}function mergeStreams(e,n,t){var r=0,a="",i=[];function s(){return e.length&&n.length?e[0].offset!==n[0].offset?e[0].offset<n[0].offset?e:n:"start"===n[0].event?e:n:e.length?e:n}function o(e){a+="<"+tag(e)+[].map.call(e.attributes,function(e){return" "+e.nodeName+'="'+escapeHTML(e.value).replace(/"/g,"&quot;")+'"'}).join("")+">"}function l(e){a+="</"+tag(e)+">"}function c(e){("start"===e.event?o:l)(e.node)}for(;e.length||n.length;){var u=s();if(a+=escapeHTML(t.substring(r,u[0].offset)),r=u[0].offset,u===e){i.reverse().forEach(l);do{c(u.splice(0,1)[0]),u=s()}while(u===e&&u.length&&u[0].offset===r);i.reverse().forEach(o)}else"start"===u[0].event?i.push(u[0].node):i.pop(),c(u.splice(0,1)[0])}return a+escapeHTML(t.substr(r))}var utils=Object.freeze({__proto__:null,escapeHTML:escapeHTML,inherit:inherit,nodeStream:nodeStream,mergeStreams:mergeStreams});const SPAN_CLOSE="</span>",emitsWrappingTags=e=>!!e.kind;class HTMLRenderer{constructor(e,n){this.buffer="",this.classPrefix=n.classPrefix,e.walk(this)}addText(e){this.buffer+=escapeHTML(e)}openNode(e){if(!emitsWrappingTags(e))return;let n=e.kind;e.sublanguage||(n=`${this.classPrefix}${n}`),this.span(n)}closeNode(e){emitsWrappingTags(e)&&(this.buffer+=SPAN_CLOSE)}span(e){this.buffer+=`<span class="${e}">`}value(){return this.buffer}}class TokenTree{constructor(){this.rootNode={children:[]},this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){let n={kind:e,children:[]};this.add(n),this.stack.push(n)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,n){return"string"==typeof n?e.addText(n):n.children&&(e.openNode(n),n.children.forEach(n=>this._walk(e,n)),e.closeNode(n)),e}static _collapse(e){e.children&&(e.children.every(e=>"string"==typeof e)?(e.text=e.children.join(""),delete e.children):e.children.forEach(e=>{"string"!=typeof e&&TokenTree._collapse(e)}))}}class TokenTreeEmitter extends TokenTree{constructor(e){super(),this.options=e}addKeyword(e,n){""!==e&&(this.openNode(n),this.addText(e),this.closeNode())}addText(e){""!==e&&this.add(e)}addSublanguage(e,n){let t=e.root;t.kind=n,t.sublanguage=!0,this.add(t)}toHTML(){return new HTMLRenderer(this,this.options).value()}finalize(){}}function escape(e){return new RegExp(e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),"m")}function source(e){return e&&e.source||e}function countMatchGroups(e){return new RegExp(e.toString()+"|").exec("").length-1}function startsWith(e,n){var t=e&&e.exec(n);return t&&0===t.index}function join(e,n){for(var t=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./,r=0,a="",i=0;i<e.length;i++){var s=r+=1,o=source(e[i]);for(i>0&&(a+=n),a+="(";o.length>0;){var l=t.exec(o);if(null==l){a+=o;break}a+=o.substring(0,l.index),o=o.substring(l.index+l[0].length),"\\"==l[0][0]&&l[1]?a+="\\"+String(Number(l[1])+s):(a+=l[0],"("==l[0]&&r++)}a+=")"}return a}const IDENT_RE="[a-zA-Z]\\w*",UNDERSCORE_IDENT_RE="[a-zA-Z_]\\w*",NUMBER_RE="\\b\\d+(\\.\\d+)?",C_NUMBER_RE="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",BINARY_NUMBER_RE="\\b(0b[01]+)",RE_STARTERS_RE="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",BACKSLASH_ESCAPE={begin:"\\\\[\\s\\S]",relevance:0},APOS_STRING_MODE={className:"string",begin:"'",end:"'",illegal:"\\n",contains:[BACKSLASH_ESCAPE]},QUOTE_STRING_MODE={className:"string",begin:'"',end:'"',illegal:"\\n",contains:[BACKSLASH_ESCAPE]},PHRASAL_WORDS_MODE={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},COMMENT=function(e,n,t){var r=inherit({className:"comment",begin:e,end:n,contains:[]},t||{});return r.contains.push(PHRASAL_WORDS_MODE),r.contains.push({className:"doctag",begin:"(?:TODO|FIXME|NOTE|BUG|XXX):",relevance:0}),r},C_LINE_COMMENT_MODE=COMMENT("//","$"),C_BLOCK_COMMENT_MODE=COMMENT("/\\*","\\*/"),HASH_COMMENT_MODE=COMMENT("#","$"),NUMBER_MODE={className:"number",begin:NUMBER_RE,relevance:0},C_NUMBER_MODE={className:"number",begin:C_NUMBER_RE,relevance:0},BINARY_NUMBER_MODE={className:"number",begin:"\\b(0b[01]+)",relevance:0},CSS_NUMBER_MODE={className:"number",begin:NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},REGEXP_MODE={begin:/(?=\/[^\/\n]*\/)/,contains:[{className:"regexp",begin:/\//,end:/\/[gimuy]*/,illegal:/\n/,contains:[BACKSLASH_ESCAPE,{begin:/\[/,end:/\]/,relevance:0,contains:[BACKSLASH_ESCAPE]}]}]},TITLE_MODE={className:"title",begin:IDENT_RE,relevance:0},UNDERSCORE_TITLE_MODE={className:"title",begin:"[a-zA-Z_]\\w*",relevance:0},METHOD_GUARD={begin:"\\.\\s*[a-zA-Z_]\\w*",relevance:0};var MODES=Object.freeze({__proto__:null,IDENT_RE:IDENT_RE,UNDERSCORE_IDENT_RE:"[a-zA-Z_]\\w*",NUMBER_RE:NUMBER_RE,C_NUMBER_RE:C_NUMBER_RE,BINARY_NUMBER_RE:"\\b(0b[01]+)",RE_STARTERS_RE:RE_STARTERS_RE,BACKSLASH_ESCAPE:BACKSLASH_ESCAPE,APOS_STRING_MODE:APOS_STRING_MODE,QUOTE_STRING_MODE:QUOTE_STRING_MODE,PHRASAL_WORDS_MODE:PHRASAL_WORDS_MODE,COMMENT:COMMENT,C_LINE_COMMENT_MODE:C_LINE_COMMENT_MODE,C_BLOCK_COMMENT_MODE:C_BLOCK_COMMENT_MODE,HASH_COMMENT_MODE:HASH_COMMENT_MODE,NUMBER_MODE:NUMBER_MODE,C_NUMBER_MODE:C_NUMBER_MODE,BINARY_NUMBER_MODE:BINARY_NUMBER_MODE,CSS_NUMBER_MODE:CSS_NUMBER_MODE,REGEXP_MODE:REGEXP_MODE,TITLE_MODE:TITLE_MODE,UNDERSCORE_TITLE_MODE:UNDERSCORE_TITLE_MODE,METHOD_GUARD:METHOD_GUARD}),COMMON_KEYWORDS="of and for in not or if then".split(" ");function compileLanguage(e){function n(n,t){return new RegExp(source(n),"m"+(e.case_insensitive?"i":"")+(t?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(e,n){n.position=this.position++,this.matchIndexes[this.matchAt]=n,this.regexes.push([n,e]),this.matchAt+=countMatchGroups(e)+1}compile(){0===this.regexes.length&&(this.exec=(()=>null));let e=this.regexes.map(e=>e[1]);this.matcherRe=n(join(e,"|"),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex;let n=this.matcherRe.exec(e);if(!n)return null;let t=n.findIndex((e,n)=>n>0&&void 0!=e),r=this.matchIndexes[t];return Object.assign(n,r)}}class r{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){if(this.multiRegexes[e])return this.multiRegexes[e];let n=new t;return this.rules.slice(e).forEach(([e,t])=>n.addRule(e,t)),n.compile(),this.multiRegexes[e]=n,n}considerAll(){this.regexIndex=0}addRule(e,n){this.rules.push([e,n]),"begin"===n.type&&this.count++}exec(e){let n=this.getMatcher(this.regexIndex);n.lastIndex=this.lastIndex;let t=n.exec(e);return t&&(this.regexIndex+=t.position+1,this.regexIndex===this.count&&(this.regexIndex=0)),t}}function a(e){let n=e.input[e.index-1],t=e.input[e.index+e[0].length];if("."===n||"."===t)return{ignoreMatch:!0}}if(e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");!function t(i,s){i.compiled||(i.compiled=!0,i.__onBegin=null,i.keywords=i.keywords||i.beginKeywords,i.keywords&&(i.keywords=compileKeywords(i.keywords,e.case_insensitive)),i.lexemesRe=n(i.lexemes||/\w+/,!0),s&&(i.beginKeywords&&(i.begin="\\b("+i.beginKeywords.split(" ").join("|")+")(?=\\b|\\s)",i.__onBegin=a),i.begin||(i.begin=/\B|\b/),i.beginRe=n(i.begin),i.endSameAsBegin&&(i.end=i.begin),i.end||i.endsWithParent||(i.end=/\B|\b/),i.end&&(i.endRe=n(i.end)),i.terminator_end=source(i.end)||"",i.endsWithParent&&s.terminator_end&&(i.terminator_end+=(i.end?"|":"")+s.terminator_end)),i.illegal&&(i.illegalRe=n(i.illegal)),null==i.relevance&&(i.relevance=1),i.contains||(i.contains=[]),i.contains=[].concat(...i.contains.map(function(e){return expand_or_clone_mode("self"===e?i:e)})),i.contains.forEach(function(e){t(e,i)}),i.starts&&t(i.starts,s),i.matcher=function(e){let n=new r;return e.contains.forEach(e=>n.addRule(e.begin,{rule:e,type:"begin"})),e.terminator_end&&n.addRule(e.terminator_end,{type:"end"}),e.illegal&&n.addRule(e.illegal,{type:"illegal"}),n}(i))}(e)}function dependencyOnParent(e){return!!e&&(e.endsWithParent||dependencyOnParent(e.starts))}function expand_or_clone_mode(e){return e.variants&&!e.cached_variants&&(e.cached_variants=e.variants.map(function(n){return inherit(e,{variants:null},n)})),e.cached_variants?e.cached_variants:dependencyOnParent(e)?inherit(e,{starts:e.starts?inherit(e.starts):null}):Object.isFrozen(e)?inherit(e):e}function compileKeywords(e,n){var t={};return"string"==typeof e?r("keyword",e):Object.keys(e).forEach(function(n){r(n,e[n])}),t;function r(e,r){n&&(r=r.toLowerCase()),r.split(" ").forEach(function(n){var r=n.split("|");t[r[0]]=[e,scoreForKeyword(r[0],r[1])]})}}function scoreForKeyword(e,n){return n?Number(n):commonKeyword(e)?0:1}function commonKeyword(e){return COMMON_KEYWORDS.includes(e.toLowerCase())}var version="10.0.0-beta.0";const escape$1=escapeHTML,inherit$1=inherit,{nodeStream:nodeStream$1,mergeStreams:mergeStreams$1}=utils,HLJS=function(e){var n=[],t={},r={},a=[],i=!0,s=/((^(<[^>]+>|\t|)+|(?:\n)))/gm,o="Could not find the language '{}', did you forget to load/include a language module?",l={noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0,__emitter:TokenTreeEmitter};function c(e){return l.noHighlightRe.test(e)}function u(e,n,t,r){var a={code:n,language:e};R("before:highlight",a);var i=a.result?a.result:d(a.language,a.code,t,r);return i.code=a.code,R("after:highlight",i),i}function d(e,n,r,a){var s=n;function c(e,n){var t=R.case_insensitive?n[0].toLowerCase():n[0];return e.keywords.hasOwnProperty(t)&&e.keywords[t]}function u(){null!=b.subLanguage?function(){if(""!==S){var e="string"==typeof b.subLanguage;if(!e||t[b.subLanguage]){var n=e?d(b.subLanguage,S,!0,v[b.subLanguage]):g(S,b.subLanguage.length?b.subLanguage:void 0);b.relevance>0&&(T+=n.relevance),e&&(v[b.subLanguage]=n.top),N.addSublanguage(n.emitter,n.language)}else N.addText(S)}}():function(){var e,n,t,r;if(b.keywords){for(n=0,b.lexemesRe.lastIndex=0,t=b.lexemesRe.exec(S),r="";t;){r+=S.substring(n,t.index);var a=null;(e=c(b,t))?(N.addText(r),r="",T+=e[1],a=e[0],N.addKeyword(t[0],a)):r+=t[0],n=b.lexemesRe.lastIndex,t=b.lexemesRe.exec(S)}r+=S.substr(n),N.addText(r)}else N.addText(S)}(),S=""}function h(e){e.className&&N.openNode(e.className),b=Object.create(e,{parent:{value:b}})}function f(e){var n=e[0],t=e.rule;if(t.__onBegin){if((t.__onBegin(e)||{}).ignoreMatch)return function(e){return 0===b.matcher.regexIndex?(S+=e[0],1):(w=!0,0)}(n)}return t&&t.endSameAsBegin&&(t.endRe=escape(n)),t.skip?S+=n:(t.excludeBegin&&(S+=n),u(),t.returnBegin||t.excludeBegin||(S=n)),h(t),t.returnBegin?0:n.length}function E(e){var n=e[0],t=s.substr(e.index),r=function e(n,t){if(startsWith(n.endRe,t)){for(;n.endsParent&&n.parent;)n=n.parent;return n}if(n.endsWithParent)return e(n.parent,t)}(b,t);if(r){var a=b;a.skip?S+=n:(a.returnEnd||a.excludeEnd||(S+=n),u(),a.excludeEnd&&(S=n));do{b.className&&N.closeNode(),b.skip||b.subLanguage||(T+=b.relevance),b=b.parent}while(b!==r.parent);return r.starts&&(r.endSameAsBegin&&(r.starts.endRe=r.endRe),h(r.starts)),a.returnEnd?0:n.length}}var _={};function m(n,t){var a,o=t&&t[0];if(S+=n,null==o)return u(),0;if("begin"==_.type&&"end"==t.type&&_.index==t.index&&""===o){if(S+=s.slice(t.index,t.index+1),!i)throw(a=new Error("0 width match regex")).languageName=e,a.badRule=_.rule,a;return 1}if(_=t,"begin"===t.type)return f(t);if("illegal"===t.type&&!r)throw(a=new Error('Illegal lexeme "'+o+'" for mode "'+(b.className||"<unnamed>")+'"')).mode=b,a;if("end"===t.type){var l=E(t);if(void 0!=l)return l}return S+=o,o.length}var R=p(e);if(!R)throw console.error(o.replace("{}",e)),new Error('Unknown language: "'+e+'"');compileLanguage(R);var M,b=a||R,v={},N=new l.__emitter(l);!function(){for(var e=[],n=b;n!==R;n=n.parent)n.className&&e.unshift(n.className);e.forEach(e=>N.openNode(e))}();var O,x,S="",T=0,D=0;try{var w=!1;for(b.matcher.considerAll();w?w=!1:(b.matcher.lastIndex=D,b.matcher.considerAll()),O=b.matcher.exec(s);){x=m(s.substring(D,O.index),O),D=O.index+x}return m(s.substr(D)),N.closeAllNodes(),N.finalize(),M=N.toHTML(),{relevance:T,value:M,language:e,illegal:!1,emitter:N,top:b}}catch(n){if(n.message&&n.message.includes("Illegal"))return{illegal:!0,illegalBy:{msg:n.message,context:s.slice(D-100,D+100),mode:n.mode},sofar:M,relevance:0,value:escape$1(s),emitter:N};if(i)return{relevance:0,value:escape$1(s),emitter:N,language:e,top:b,errorRaised:n};throw n}}function g(e,n){n=n||l.languages||Object.keys(t);var r={relevance:0,emitter:new l.__emitter(l),value:escape$1(e)},a=r;return n.filter(p).filter(m).forEach(function(n){var t=d(n,e,!1);t.language=n,t.relevance>a.relevance&&(a=t),t.relevance>r.relevance&&(a=r,r=t)}),a.language&&(r.second_best=a),r}function h(e){return l.tabReplace||l.useBR?e.replace(s,function(e,n){return l.useBR&&"\n"===e?"<br>":l.tabReplace?n.replace(/\t/g,l.tabReplace):""}):e}function f(e){var n,t,a,i,s,d=function(e){var n,t=e.className+" ";if(t+=e.parentNode?e.parentNode.className:"",n=l.languageDetectRe.exec(t)){var r=p(n[1]);return r||(console.warn(o.replace("{}",n[1])),console.warn("Falling back to no-highlight mode for this block.",e)),r?n[1]:"no-highlight"}return t.split(/\s+/).find(e=>c(e)||p(e))}(e);c(d)||(R("before:highlightBlock",{block:e,language:d}),l.useBR?(n=document.createElement("div")).innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n"):n=e,s=n.textContent,a=d?u(d,s,!0):g(s),(t=nodeStream$1(n)).length&&((i=document.createElement("div")).innerHTML=a.value,a.value=mergeStreams$1(t,nodeStream$1(i),s)),a.value=h(a.value),R("after:highlightBlock",{block:e,result:a}),e.innerHTML=a.value,e.className=function(e,n,t){var a=n?r[n]:t,i=[e.trim()];return e.match(/\bhljs\b/)||i.push("hljs"),e.includes(a)||i.push(a),i.join(" ").trim()}(e.className,d,a.language),e.result={language:a.language,re:a.relevance},a.second_best&&(e.second_best={language:a.second_best.language,re:a.second_best.relevance}))}function E(){if(!E.called){E.called=!0;var e=document.querySelectorAll("pre code");n.forEach.call(e,f)}}var _={disableAutodetect:!0};function p(e){return e=(e||"").toLowerCase(),t[e]||t[r[e]]}function m(e){var n=p(e);return n&&!n.disableAutodetect}function R(e,n){var t=e;a.forEach(function(e){e[t]&&e[t](n)})}Object.assign(e,{highlight:u,highlightAuto:g,fixMarkup:h,highlightBlock:f,configure:function(e){l=inherit$1(l,e)},initHighlighting:E,initHighlightingOnLoad:function(){window.addEventListener("DOMContentLoaded",E,!1)},registerLanguage:function(n,a){var s;try{s=a(e)}catch(e){if(console.error("Language definition for '{}' could not be registered.".replace("{}",n)),!i)throw e;console.error(e),s=_}s.name||(s.name=n),t[n]=s,s.rawDefinition=a.bind(null,e),s.aliases&&s.aliases.forEach(function(e){r[e]=n})},listLanguages:function(){return Object.keys(t)},getLanguage:p,requireLanguage:function(e){var n=p(e);if(n)return n;throw new Error("The '{}' language is required, but not loaded.".replace("{}",e))},autoDetection:m,inherit:inherit$1,addPlugin:function(e,n){a.push(e)}}),e.debugMode=function(){i=!1},e.safeMode=function(){i=!0},e.versionString=version;for(const e in MODES)"object"==typeof MODES[e]&&deepFreeze(MODES[e]);return Object.assign(e,MODES),e};var highlight=HLJS({});module.exports=highlight;