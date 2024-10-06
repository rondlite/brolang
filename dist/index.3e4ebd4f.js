// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"5GAdG":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "1be433863e4ebd4f";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && ![
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ].includes(hostname) ? "wss" : "ws";
    var ws;
    if (HMR_USE_SSE) ws = new EventSource("/__parcel_hmr");
    else try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    if (ws instanceof WebSocket) {
        ws.onerror = function(e) {
            if (e.message) console.error(e.message);
        };
        ws.onclose = function() {
            console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
        };
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"dXVTy":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "interpretBroLang", ()=>interpretBroLang);
var _lexer = require("./lexer");
var _astJs = require("./ast.js");
var _analyzerJs = require("./analyzer.js");
var _interpreterJs = require("./interpreter.js");
function interpretBroLang(sourceCode) {
    const lexer = new (0, _lexer.Lexer)(sourceCode);
    const tokens = lexer.tokenize();
    console.log("Tokens:", tokens);
    const parser = new (0, _astJs.Parser)(tokens);
    const ast = parser.parse();
    console.log(JSON.stringify(ast, null, 2)); // Debugging: Print the AST structure
    const semanticAnalyzer = new (0, _analyzerJs.SemanticAnalyzer)(ast);
    semanticAnalyzer.analyze();
    console.log("Semantic analysis completed successfully.");
    const interpreter = new (0, _interpreterJs.Interpreter)();
    interpreter.interpret(ast);
}

},{"./lexer":"6irEJ","./ast.js":"gPgUJ","./analyzer.js":"4wLGn","./interpreter.js":"5bxnA","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6irEJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Lexer", ()=>Lexer);
class Lexer {
    constructor(input){
        this.input = input;
        this.position = 0;
        this.tokens = [];
    }
    tokenize() {
        while(this.position < this.input.length){
            let char = this.input[this.position];
            if (/\s/.test(char)) {
                this.position++;
                continue;
            }
            switch(char){
                case ";":
                    this._addToken("SEMICOLON", char);
                    break;
                case "+":
                    this._addToken("PLUS", char);
                    break;
                case "-":
                    this._addToken("MINUS", char);
                    break;
                case "*":
                    this._addToken("MULTIPLY", char);
                    break;
                case "/":
                    this._addToken("DIVIDE", char);
                    break;
                case "%":
                    this._addToken("MODULO", char);
                    break;
                case "=":
                    this._addToken("EQUALS", char);
                    break;
                case ">":
                    this._addToken("GREATER_THAN", char);
                    break;
                case "<":
                    this._addToken("LESS_THAN", char);
                    break;
                case "{":
                    this._addToken("LBRACE", char);
                    break;
                case "}":
                    this._addToken("RBRACE", char);
                    break;
                case "(":
                    this._addToken("LPAREN", char);
                    break;
                case ")":
                    this._addToken("RPAREN", char);
                    break;
                case "[":
                    this._addToken("LBRACKET", char);
                    break;
                case "]":
                    this._addToken("RBRACKET", char);
                    break;
                case ",":
                    this._addToken("COMMA", char);
                    break;
                case '"':
                    this.tokens.push(this._readString());
                    break;
                default:
                    if (/[a-zA-Z]/.test(char)) this.tokens.push(this._readIdentifierOrKeyword());
                    else if (/\d/.test(char)) this.tokens.push(this._readNumber());
                    else throw new Error(`Unexpected character: ${char}`);
            }
        }
        return this.tokens;
    }
    _addToken(type, value) {
        this.tokens.push({
            type,
            value
        });
        this.position++;
    }
    _readIdentifierOrKeyword() {
        let start = this.position;
        while(/[a-zA-Z]/.test(this.input[this.position]))this.position++;
        let value = this.input.slice(start, this.position);
        const keywords = [
            "yo",
            "brofunc",
            "bounce",
            "spill",
            "if",
            "else",
            "forEvery",
            "squadGoals",
            "dope",
            "nope"
        ];
        const type = keywords.includes(value) ? "KEYWORD" : "IDENTIFIER";
        return {
            type,
            value
        };
    }
    _readNumber() {
        let start = this.position;
        while(/\d/.test(this.input[this.position]))this.position++;
        let value = this.input.slice(start, this.position);
        return {
            type: "NUMBER",
            value
        };
    }
    _readString() {
        let start = ++this.position; // Skip the opening quote
        while(this.input[this.position] !== '"')this.position++;
        let value = this.input.slice(start, this.position);
        this.position++; // Skip the closing quote
        return {
            type: "STRING",
            value
        };
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"gPgUJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Parser", ()=>Parser);
class ASTNode {
    constructor(type, value){
        this.type = type;
        this.value = value;
        this.children = [];
    }
}
class Parser {
    constructor(tokens){
        this.tokens = tokens;
        this.position = 0;
    }
    parse() {
        const root = new ASTNode("Program", null);
        while(this.position < this.tokens.length)root.children.push(this._parseStatement());
        return root;
    }
    _parseStatement() {
        const token = this.tokens[this.position];
        console.log(`Parsing statement at position ${this.position}: ${token ? token.type : "EOF"}`);
        switch(token.type){
            case "KEYWORD":
                return this._parseKeywordStatement();
            case "IDENTIFIER":
                return this._parseExpressionStatement();
            default:
                throw new Error(`Unexpected token: ${token.type}`);
        }
    }
    _parseKeywordStatement() {
        const token = this.tokens[this.position++];
        let statementNode;
        switch(token.value){
            case "yo":
                statementNode = this._parseVariableDeclaration();
                break;
            case "brofunc":
                statementNode = this._parseFunctionDeclaration();
                break;
            case "spill":
                statementNode = this._parsePrintStatement();
                break;
            case "if":
                statementNode = this._parseIfStatement();
                break;
            case "forEvery":
                statementNode = this._parseForEachLoop();
                break;
            case "squadGoals":
                statementNode = this._parseConcurrencyBlock();
                break;
            default:
                throw new Error(`Unexpected keyword: ${token.value}`);
        }
        this._consume("SEMICOLON");
        return statementNode;
    }
    _parseVariableDeclaration() {
        const identifierToken = this.tokens[this.position++];
        this._consume("EQUALS");
        const expressionNode = this._parseExpression();
        return new ASTNode("VariableDeclaration", {
            identifier: identifierToken.value,
            expression: expressionNode
        });
    }
    _parseFunctionDeclaration() {
        const nameToken = this.tokens[this.position++];
        const params = this._parseParameters();
        const body = this._parseBlock();
        return new ASTNode("FunctionDeclaration", {
            name: nameToken.value,
            parameters: params,
            body: body
        });
    }
    _parsePrintStatement() {
        const expressionNode = this._parseExpression();
        if (!expressionNode) throw new Error("Failed to parse expression for spill statement");
        return new ASTNode("PrintStatement", {
            expression: expressionNode
        });
    }
    _parseIfStatement() {
        const condition = this._parseExpression();
        const thenBranch = this._parseBlock();
        let elseBranch = null;
        if (this._match("KEYWORD", "else")) elseBranch = this._parseBlock();
        return new ASTNode("IfStatement", {
            condition: condition,
            thenBranch: thenBranch,
            elseBranch: elseBranch
        });
    }
    _parseForEachLoop() {
        const elementToken = this.tokens[this.position++];
        this._consume("KEYWORD", "in");
        const listToken = this.tokens[this.position++];
        const body = this._parseBlock();
        return new ASTNode("ForEachLoop", {
            element: elementToken.value,
            list: listToken.value,
            body: body
        });
    }
    _parseConcurrencyBlock() {
        const body = this._parseBlock();
        return new ASTNode("ConcurrencyBlock", body);
    }
    _parseExpressionStatement() {
        const expressionNode = this._parseExpression();
        this._consume("SEMICOLON");
        return new ASTNode("ExpressionStatement", expressionNode);
    }
    _parseExpression() {
        let left = this._parsePrimary();
        while(this._check("PLUS") || this._check("MINUS") || this._check("MULTIPLY") || this._check("DIVIDE") || this._check("MODULO")){
            const operatorToken = this.tokens[this.position++];
            const right = this._parsePrimary();
            left = new ASTNode("BinaryExpression", {
                operator: operatorToken.value,
                left: left,
                right: right
            });
        }
        return left;
    }
    _parsePrimary() {
        const token = this.tokens[this.position++];
        switch(token.type){
            case "IDENTIFIER":
                return new ASTNode("Identifier", token.value);
            case "NUMBER":
            case "STRING":
                return new ASTNode("Literal", token.value);
            default:
                throw new Error(`Unexpected token in expression: ${token.type}`);
        }
    }
    _parseParameters() {
        const params = [];
        this._consume("LPAREN");
        while(!this._check("RPAREN")){
            const paramToken = this.tokens[this.position++];
            params.push(paramToken.value);
            if (!this._check("RPAREN")) this._consume("COMMA");
        }
        this._consume("RPAREN");
        return params;
    }
    _parseBlock() {
        this._consume("LBRACE");
        const statements = [];
        while(!this._check("RBRACE"))statements.push(this._parseStatement());
        this._consume("RBRACE");
        return new ASTNode("Block", statements);
    }
    _consume(expectedType, expectedValue = null) {
        if (this.position >= this.tokens.length) throw new Error(`Unexpected end of input, expected token type ${expectedType}`);
        const token = this.tokens[this.position];
        if (token.type !== expectedType || expectedValue !== null && token.value !== expectedValue) throw new Error(`Expected token type ${expectedType} but found ${token.type}`);
        this.position++;
    }
    _check(type) {
        if (this.position >= this.tokens.length) return false;
        return this.tokens[this.position].type === type;
    }
    _match(type, value) {
        if (this._check(type) && this.tokens[this.position].value === value) {
            this.position++;
            return true;
        }
        return false;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4wLGn":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "SemanticAnalyzer", ()=>SemanticAnalyzer);
class SemanticAnalyzer {
    constructor(ast){
        this.ast = ast;
    }
    analyze() {
        this._checkNode(this.ast);
    }
    _checkNode(node) {
        if (node.type === "Program") node.children.forEach((child)=>this._checkNode(child));
        else if (node.type === "Expression") {
            // Example check: ensure identifiers are defined
            if (!this._isDefined(node.value)) throw new Error(`Undefined identifier: ${node.value}`);
            node.children.forEach((child)=>this._checkNode(child));
        }
    }
    _isDefined(identifier) {
        // Placeholder for checking if an identifier is defined
        return true;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5bxnA":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Interpreter", ()=>Interpreter);
class Interpreter {
    constructor(){
        this.variables = {};
    }
    interpret(ast) {
        this._executeBlock(ast.children);
    }
    _executeBlock(statements) {
        for (const statement of statements)this._execute(statement);
    }
    _execute(node) {
        switch(node.type){
            case "Program":
                this._executeBlock(node.children);
                break;
            case "VariableDeclaration":
                this._executeVariableDeclaration(node);
                break;
            case "PrintStatement":
                this._executePrintStatement(node);
                break;
            case "ExpressionStatement":
                this._evaluate(node.value);
                break;
            case "IfStatement":
                this._executeIfStatement(node);
                break;
            case "ForEachLoop":
                this._executeForEachLoop(node);
                break;
            case "FunctionDeclaration":
                this._executeFunctionDeclaration(node);
                break;
            case "ConcurrencyBlock":
                this._executeBlock(node.value.children); // Simplified for single-thread execution
                break;
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
    _executeVariableDeclaration(node) {
        const value = this._evaluate(node.value.expression);
        this.variables[node.value.identifier] = value;
    }
    _executePrintStatement(node) {
        const value = this._evaluate(node.value.expression);
        console.log(value);
    }
    _executeIfStatement(node) {
        const condition = this._evaluate(node.value.condition);
        if (condition) this._executeBlock(node.value.thenBranch.children);
        else if (node.value.elseBranch) this._executeBlock(node.value.elseBranch.children);
    }
    _executeForEachLoop(node) {
        const list = this.variables[node.value.list];
        for (const item of list){
            this.variables[node.value.element] = item;
            this._executeBlock(node.value.body.children);
        }
    }
    _executeFunctionDeclaration(node) {
        // Store function in variables for later invocation
        this.variables[node.value.name] = node;
    }
    _evaluate(node) {
        if (!node) throw new Error("Attempted to evaluate a null or undefined node");
        console.log("Evaluating node:", node);
        switch(node.type){
            case "Literal":
                return node.value;
            case "BinaryExpression":
                return this._evaluateBinaryExpression(node);
            case "Identifier":
                return this.variables[node.value];
            default:
                throw new Error(`Unknown node type in evaluation: ${node.type}`);
        }
    }
    _evaluateBinaryExpression(node) {
        const left = this._evaluate(node.value.left);
        const right = this._evaluate(node.value.right);
        switch(node.value.operator){
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "/":
                return left / right;
            case "%":
                return left % right;
            default:
                throw new Error(`Unknown operator: ${node.value.operator}`);
        }
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["5GAdG","dXVTy"], "dXVTy", "parcelRequire94c2")

//# sourceMappingURL=index.3e4ebd4f.js.map
