/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _toConsumableArray2 = __webpack_require__(/*! babel-runtime/helpers/toConsumableArray */ 1);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	var _svgHelper = __webpack_require__(/*! ./svg-helper */ 59);
	
	var _utils = __webpack_require__(/*! ./utils */ 60);
	
	var _mocks = __webpack_require__(/*! ./mocks */ 61);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var textArea = document.querySelector('.js-text');
	var startBtn = document.querySelector('.js-start');
	var resultContainer = document.querySelector('.js-result');
	var searchInput = document.querySelector('.js-input');
	
	var svg = document.querySelector('.js-tree-svg');
	var svgContentG = document.querySelector('.js-tree-content');
	
	var styleSheet = document.styleSheets[0];
	
	var getX = function getX(node) {
	    return node.weight * 75 + 50;
	};
	var getY = function getY(node) {
	    return (node.depth - 1) * 75 + 50;
	};
	
	var dictionary = void 0;
	var highlighted = [];
	
	function drawTree(dictionary) {
	    var linesGroup = (0, _svgHelper.createGroup)();
	    var weight = 0,
	        depth = 0,
	        maxWeight = 0,
	        maxDepth = 0;
	
	    svgContentG.appendChild(linesGroup);
	
	    var handleNode = function handleNode(node) {
	
	        depth++;
	        maxDepth = Math.max(maxDepth, depth);
	        node.depth = depth;
	
	        node.children.forEach(handleNode);
	
	        if (node.children.length === 0) {
	            node.weight = weight++;
	            maxWeight = Math.max(maxWeight, weight);
	
	            var terminator = (0, _svgHelper.createTerminator)(getX(node), getY(node));
	            svgContentG.appendChild(terminator);
	            node.$ = terminator;
	        } else {
	            node.weight = node.children.reduce(function (res, child) {
	                return res += child.weight;
	            }, 0) / node.children.length;
	
	            var nodeElement = (0, _svgHelper.createNodeElement)(getX(node), getY(node), node.value);
	            node.children.forEach(function (child) {
	                var x1 = getX(node),
	                    x2 = getX(child);
	                var line = (0, _svgHelper.createLine)(x1, getY(node), x2 === x1 ? x1 + 1 : x2, getY(child));
	                child.$.insertBefore(line, child.$.firstChild);
	            });
	
	            svgContentG.appendChild(nodeElement);
	            node.$ = nodeElement;
	        }
	
	        depth--;
	    };
	
	    handleNode(dictionary.root);
	    svg.setAttribute('viewBox', '0 0 ' + (maxWeight * 75 + 25) + ' ' + (maxDepth * 75 + 25));
	}
	
	var start = function start(text) {
	    dictionary = (0, _utils.parseText)(text);
	    svgContentG.innerHTML = "";
	    drawTree(dictionary);
	};
	
	textArea.addEventListener('input', function (e) {
	    start(textArea.value);
	    search();
	});
	start(textArea.value);
	
	var highlightNode = function highlightNode(node, className) {
	    var element = node.$;
	    if (element) {
	        element.classList.add(className);
	        element.classList.add('found');
	        highlighted.push(element);
	    }
	};
	
	var search = function search() {
	    var mask = searchInput.value.toLowerCase();
	
	    (0, _utils.clearClassList)(svgContentG);
	    highlighted.forEach(_utils.clearClassList);
	    highlighted.length = 0;
	    resultContainer.innerHTML = "";
	
	    if (mask !== "") {
	        var path = mask.split("");
	        svgContentG.classList.add('grey-out');
	
	        (0, _utils.dfsForPath)(dictionary.root, path).forEach(function (nodeList) {
	            var tail = nodeList[0];
	            var head = nodeList[nodeList.length - 1];
	            var betweenList = [];
	
	            var beforeTail = (0, _utils.getPathForNode)(tail);
	            beforeTail.forEach(function (node) {
	                return highlightNode(node, 'path');
	            });
	            var wordStart = '<span class="word-regular">' + beforeTail.map(function (n) {
	                return n.value;
	            }).join('') + '</span>';
	            wordStart += '<span class="word-target">' + tail.value + '</span>';
	            nodeList.reduce(function (above, below) {
	                var betweens = (0, _utils.getNodesBetween)(below, above);
	                betweenList.push.apply(betweenList, (0, _toConsumableArray3.default)(betweens));
	                wordStart += '<span class="word-regular">' + betweens.reverse().map(function (n) {
	                    return n.value;
	                }).join('') + '</span>';
	                wordStart += '<span class="word-target">' + below.value + '</span>';
	                return below;
	            });
	
	            betweenList.forEach(function (node) {
	                return highlightNode(node, 'path');
	            });
	
	            nodeList.forEach(function (node) {
	                return highlightNode(node, 'mask');
	            });
	            (0, _utils.dfsFromNode)(head).forEach(function (path) {
	                path.forEach(function (node) {
	                    return highlightNode(node, 'rest');
	                });
	                var wordDiv = document.createElement('div');
	                wordDiv.innerHTML = wordStart + ('<span class="word-regular">' + path.map(function (n) {
	                    return n.value;
	                }).join('') + '</span>');
	                resultContainer.appendChild(wordDiv);
	            });
	        });
	    }
	};
	
	searchInput.addEventListener('input', function (e) {
	    search();
	});

/***/ },
/* 1 */
/*!******************************************************!*\
  !*** ./~/babel-runtime/helpers/toConsumableArray.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _from = __webpack_require__(/*! ../core-js/array/from */ 2);
	
	var _from2 = _interopRequireDefault(_from);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }
	
	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ },
/* 2 */
/*!***********************************************!*\
  !*** ./~/babel-runtime/core-js/array/from.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/array/from */ 3), __esModule: true };

/***/ },
/* 3 */
/*!********************************************!*\
  !*** ./~/core-js/library/fn/array/from.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.string.iterator */ 4);
	__webpack_require__(/*! ../../modules/es6.array.from */ 48);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 12).Array.from;

/***/ },
/* 4 */
/*!**********************************************************!*\
  !*** ./~/core-js/library/modules/es6.string.iterator.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(/*! ./_string-at */ 5)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(/*! ./_iter-define */ 8)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 5 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_string-at.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(/*! ./_to-integer */ 6)
	  , defined   = __webpack_require__(/*! ./_defined */ 7);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 6 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_to-integer.js ***!
  \**************************************************/
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 7 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_defined.js ***!
  \***********************************************/
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 8 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_iter-define.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(/*! ./_library */ 9)
	  , $export        = __webpack_require__(/*! ./_export */ 10)
	  , redefine       = __webpack_require__(/*! ./_redefine */ 25)
	  , hide           = __webpack_require__(/*! ./_hide */ 15)
	  , has            = __webpack_require__(/*! ./_has */ 26)
	  , Iterators      = __webpack_require__(/*! ./_iterators */ 27)
	  , $iterCreate    = __webpack_require__(/*! ./_iter-create */ 28)
	  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 44)
	  , getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ 46)
	  , ITERATOR       = __webpack_require__(/*! ./_wks */ 45)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 9 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_library.js ***!
  \***********************************************/
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 10 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_export.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(/*! ./_global */ 11)
	  , core      = __webpack_require__(/*! ./_core */ 12)
	  , ctx       = __webpack_require__(/*! ./_ctx */ 13)
	  , hide      = __webpack_require__(/*! ./_hide */ 15)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 11 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_global.js ***!
  \**********************************************/
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 12 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_core.js ***!
  \********************************************/
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 13 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_ctx.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(/*! ./_a-function */ 14);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 14 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_a-function.js ***!
  \**************************************************/
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 15 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_hide.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(/*! ./_object-dp */ 16)
	  , createDesc = __webpack_require__(/*! ./_property-desc */ 24);
	module.exports = __webpack_require__(/*! ./_descriptors */ 20) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 16 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_object-dp.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(/*! ./_an-object */ 17)
	  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 19)
	  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 23)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(/*! ./_descriptors */ 20) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 17 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_an-object.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(/*! ./_is-object */ 18);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 18 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_is-object.js ***!
  \*************************************************/
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 19 */
/*!******************************************************!*\
  !*** ./~/core-js/library/modules/_ie8-dom-define.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(/*! ./_descriptors */ 20) && !__webpack_require__(/*! ./_fails */ 21)(function(){
	  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ 22)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 20 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_descriptors.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(/*! ./_fails */ 21)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 21 */
/*!*********************************************!*\
  !*** ./~/core-js/library/modules/_fails.js ***!
  \*********************************************/
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 22 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_dom-create.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(/*! ./_is-object */ 18)
	  , document = __webpack_require__(/*! ./_global */ 11).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 23 */
/*!****************************************************!*\
  !*** ./~/core-js/library/modules/_to-primitive.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(/*! ./_is-object */ 18);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 24 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_property-desc.js ***!
  \*****************************************************/
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 25 */
/*!************************************************!*\
  !*** ./~/core-js/library/modules/_redefine.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./_hide */ 15);

/***/ },
/* 26 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_has.js ***!
  \*******************************************/
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 27 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_iterators.js ***!
  \*************************************************/
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 28 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_iter-create.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(/*! ./_object-create */ 29)
	  , descriptor     = __webpack_require__(/*! ./_property-desc */ 24)
	  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 44)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(/*! ./_hide */ 15)(IteratorPrototype, __webpack_require__(/*! ./_wks */ 45)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 29 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_object-create.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(/*! ./_an-object */ 17)
	  , dPs         = __webpack_require__(/*! ./_object-dps */ 30)
	  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 42)
	  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ 39)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(/*! ./_dom-create */ 22)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(/*! ./_html */ 43).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 30 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_object-dps.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(/*! ./_object-dp */ 16)
	  , anObject = __webpack_require__(/*! ./_an-object */ 17)
	  , getKeys  = __webpack_require__(/*! ./_object-keys */ 31);
	
	module.exports = __webpack_require__(/*! ./_descriptors */ 20) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 31 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_object-keys.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(/*! ./_object-keys-internal */ 32)
	  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 42);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 32 */
/*!************************************************************!*\
  !*** ./~/core-js/library/modules/_object-keys-internal.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(/*! ./_has */ 26)
	  , toIObject    = __webpack_require__(/*! ./_to-iobject */ 33)
	  , arrayIndexOf = __webpack_require__(/*! ./_array-includes */ 36)(false)
	  , IE_PROTO     = __webpack_require__(/*! ./_shared-key */ 39)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 33 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_to-iobject.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(/*! ./_iobject */ 34)
	  , defined = __webpack_require__(/*! ./_defined */ 7);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 34 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_iobject.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(/*! ./_cof */ 35);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 35 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_cof.js ***!
  \*******************************************/
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 36 */
/*!******************************************************!*\
  !*** ./~/core-js/library/modules/_array-includes.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 33)
	  , toLength  = __webpack_require__(/*! ./_to-length */ 37)
	  , toIndex   = __webpack_require__(/*! ./_to-index */ 38);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 37 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_to-length.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(/*! ./_to-integer */ 6)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 38 */
/*!************************************************!*\
  !*** ./~/core-js/library/modules/_to-index.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(/*! ./_to-integer */ 6)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 39 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_shared-key.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(/*! ./_shared */ 40)('keys')
	  , uid    = __webpack_require__(/*! ./_uid */ 41);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 40 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_shared.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(/*! ./_global */ 11)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 41 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_uid.js ***!
  \*******************************************/
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 42 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_enum-bug-keys.js ***!
  \*****************************************************/
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 43 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_html.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./_global */ 11).document && document.documentElement;

/***/ },
/* 44 */
/*!*********************************************************!*\
  !*** ./~/core-js/library/modules/_set-to-string-tag.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(/*! ./_object-dp */ 16).f
	  , has = __webpack_require__(/*! ./_has */ 26)
	  , TAG = __webpack_require__(/*! ./_wks */ 45)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 45 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_wks.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(/*! ./_shared */ 40)('wks')
	  , uid        = __webpack_require__(/*! ./_uid */ 41)
	  , Symbol     = __webpack_require__(/*! ./_global */ 11).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 46 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_object-gpo.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(/*! ./_has */ 26)
	  , toObject    = __webpack_require__(/*! ./_to-object */ 47)
	  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ 39)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 47 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_to-object.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(/*! ./_defined */ 7);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 48 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/es6.array.from.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(/*! ./_ctx */ 13)
	  , $export        = __webpack_require__(/*! ./_export */ 10)
	  , toObject       = __webpack_require__(/*! ./_to-object */ 47)
	  , call           = __webpack_require__(/*! ./_iter-call */ 49)
	  , isArrayIter    = __webpack_require__(/*! ./_is-array-iter */ 50)
	  , toLength       = __webpack_require__(/*! ./_to-length */ 37)
	  , createProperty = __webpack_require__(/*! ./_create-property */ 51)
	  , getIterFn      = __webpack_require__(/*! ./core.get-iterator-method */ 52);
	
	$export($export.S + $export.F * !__webpack_require__(/*! ./_iter-detect */ 54)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 49 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_iter-call.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(/*! ./_an-object */ 17);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 50 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_is-array-iter.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(/*! ./_iterators */ 27)
	  , ITERATOR   = __webpack_require__(/*! ./_wks */ 45)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 51 */
/*!*******************************************************!*\
  !*** ./~/core-js/library/modules/_create-property.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(/*! ./_object-dp */ 16)
	  , createDesc      = __webpack_require__(/*! ./_property-desc */ 24);
	
	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 52 */
/*!***************************************************************!*\
  !*** ./~/core-js/library/modules/core.get-iterator-method.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(/*! ./_classof */ 53)
	  , ITERATOR  = __webpack_require__(/*! ./_wks */ 45)('iterator')
	  , Iterators = __webpack_require__(/*! ./_iterators */ 27);
	module.exports = __webpack_require__(/*! ./_core */ 12).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 53 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_classof.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(/*! ./_cof */ 35)
	  , TAG = __webpack_require__(/*! ./_wks */ 45)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 54 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_iter-detect.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(/*! ./_wks */ 45)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */
/*!***************************!*\
  !*** ./src/svg-helper.js ***!
  \***************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var createNodeElement = exports.createNodeElement = function createNodeElement(cx, cy, value) {
	    var group = createGroup();
	    var circle = createCircle(cx, cy, 25);
	    var text = createText(value);
	
	    text.setAttribute('x', cx);
	    text.setAttribute('y', cy);
	
	    group.appendChild(circle);
	    group.appendChild(text);
	
	    return group;
	};
	
	var createTerminator = exports.createTerminator = function createTerminator(cx, cy) {
	    var group = createGroup();
	    var circle = createCircle(cx, cy, 25);
	    var circleInternal = createCircle(cx, cy, 10);
	
	    circleInternal.setAttribute('fill', '#ccc');
	
	    // group.appendChild(circle);
	    group.appendChild(circleInternal);
	
	    return group;
	};
	
	var createLine = exports.createLine = function createLine(x1, y1, x2, y2) {
	    var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
	
	    line.setAttribute('x1', x1);
	    line.setAttribute('x2', x2);
	    line.setAttribute('y1', y1);
	    line.setAttribute('y2', y2);
	
	    line.setAttribute('stroke', 'black');
	    line.setAttribute('stroke-width', 1);
	
	    return line;
	};
	
	var createText = exports.createText = function createText(value, x, y) {
	    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	
	    text.setAttribute('font-size', '40');
	    text.setAttribute('text-anchor', 'middle');
	    text.setAttribute('alignment-baseline', 'middle');
	    text.textContent = value;
	
	    return text;
	};
	
	var createGroup = exports.createGroup = function createGroup() {
	    return document.createElementNS("http://www.w3.org/2000/svg", 'g');
	};
	
	var createCircle = exports.createCircle = function createCircle(cx, cy, r) {
	    var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	
	    circle.setAttribute('stroke', 'black');
	    circle.setAttribute('stroke-width', 1);
	    circle.setAttribute('fill', 'white');
	    circle.setAttribute('r', r);
	    circle.setAttribute('cx', cx);
	    circle.setAttribute('cy', cy);
	
	    return circle;
	};

/***/ },
/* 60 */
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.clearClassList = exports.getPathForNode = exports.getNodesBetween = exports.dfsFromNode = exports.dfsForPath = exports.bfsForNodes = exports.parseText = exports.handleWord = exports.fill = exports.createNode = undefined;
	
	var _toConsumableArray2 = __webpack_require__(/*! babel-runtime/helpers/toConsumableArray */ 1);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var createNode = exports.createNode = function createNode(value) {
	    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    return {
	        children: [],
	        value: value,
	        parent: parent
	    };
	};
	
	var fill = exports.fill = function fill(list, pNode) {
	    var letter = list.shift();
	    var cNode = pNode.children.find(function (child) {
	        return child.value === letter;
	    });
	
	    if (!cNode) {
	        cNode = createNode(letter, pNode);
	        pNode.children.push(cNode);
	    }
	
	    if (list.length) {
	        fill(list, cNode);
	    } else /*if (cNode.children.length === 0)*/{
	            var terminator = createNode(null, cNode);
	            cNode.children.push(terminator);
	        }
	};
	
	var handleWord = exports.handleWord = function handleWord(tree, word) {
	    if (word) {
	        var letters = word.split('');
	        fill(letters, tree.root);
	    }
	    return tree;
	};
	
	var parseText = exports.parseText = function parseText(text) {
	    var words = text.split(/\s+/);
	    var tree = { root: createNode("") };
	    words.reduce(handleWord, tree);
	    return tree;
	};
	
	var bfsForNodes = exports.bfsForNodes = function bfsForNodes(root, letter) {
	    var queue = [].concat(root.children),
	        result = [],
	        node = void 0;
	
	    while (node = queue.shift()) {
	        queue.push.apply(queue, (0, _toConsumableArray3.default)(node.children));
	        if (node.value === letter) {
	            result.push(node);
	        }
	    }
	
	    return result;
	};
	
	var dfsForPath = exports.dfsForPath = function dfsForPath(root, path) {
	    var originalLenght = path.length;
	    var results = [];
	    var accList = [];
	
	    function bfsForLetter(queue, letter) {
	        var result = [],
	            node = void 0;
	
	        if (letter) {
	            queue = [].concat(queue);
	            while (node = queue.shift()) {
	                var _queue;
	
	                (_queue = queue).push.apply(_queue, (0, _toConsumableArray3.default)(node.children));
	                if (node.value === letter) {
	                    result.push(node);
	                }
	            }
	        }
	
	        return result;
	    }
	
	    function handlePath(nodeList, path, acc) {
	        var letter = path.shift();
	        var nodes = bfsForLetter(nodeList, letter);
	
	        results.push.apply(results, (0, _toConsumableArray3.default)(nodes));
	        nodes.forEach(function (child) {
	            var clone = acc.slice(0);
	            clone.push(child);
	            accList.push(clone);
	            accList = accList.filter(function (acc) {
	                return acc.length === originalLenght;
	            });
	            handlePath(child.children, path.slice(0), clone);
	        });
	    }
	
	    handlePath(root.children, path, []);
	
	    return accList.filter(function (acc) {
	        return acc.length === originalLenght;
	    });
	};
	
	var dfsFromNode = exports.dfsFromNode = function dfsFromNode(root) {
	    var acc = [];
	    var path = [];
	
	    var handleNode = function handleNode(node) {
	        path.push(node);
	        node.value === null && acc.push(path.slice(0));
	        node.children.forEach(handleNode);
	        path.pop();
	    };
	
	    handleNode(root);
	    return acc.map(function (path) {
	        return path.slice(1);
	    });
	};
	
	var getNodesBetween = exports.getNodesBetween = function getNodesBetween(cNode, pNode) {
	    var parent = cNode.parent;
	    var acc = [];
	    while (parent && parent !== pNode) {
	        acc.push(parent);
	        parent = parent.parent;
	    }
	    return acc;
	};
	
	var getPathForNode = exports.getPathForNode = function getPathForNode(node) {
	    var acc = [],
	        parent = void 0;
	
	    while (parent = node.parent) {
	        acc.unshift(parent);
	        node = parent;
	    }
	
	    return acc.filter(function (letter) {
	        return letter;
	    });
	};
	
	var clearClassList = exports.clearClassList = function clearClassList(element) {
	    var acc = [];
	    element.classList.forEach(function (c) {
	        return acc.push(c);
	    });
	    acc.forEach(function (c) {
	        return element.classList.remove(c);
	    });
	};

/***/ },
/* 61 */
/*!**********************!*\
  !*** ./src/mocks.js ***!
  \**********************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var textMock = exports.textMock = "cabbage cabby cabdriver cabdriving cactus cackle coach coaching beacon beach beachcomber beard bearish bitch bitcoin";

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map