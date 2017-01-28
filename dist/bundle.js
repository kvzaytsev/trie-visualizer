/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _svgHelper = __webpack_require__(1);

	var _mocks = __webpack_require__(2);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var textArea = document.querySelector('.js-text');
	var startBtn = document.querySelector('.js-start');
	var resultContainer = document.querySelector('.js-result');
	var searchInput = document.querySelector('.js-input');

	var svg = document.querySelector('.js-tree-svg');

	var createNode = function createNode(value) {
	    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    return {
	        children: [],
	        value: value,
	        parent: parent
	    };
	};

	var fill = function fill(list, pNode) {
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
	    } else if (cNode.children.length === 0) {
	        var terminator = createNode(null, cNode);
	        cNode.children.push(terminator);
	    }
	};

	var handleWord = function handleWord(tree, word) {
	    var letters = word.split('');
	    fill(letters, tree.root);
	    return tree;
	};

	var parseText = function parseText(text) {
	    var words = text.split(/\s+/g);
	    var tree = { root: createNode("") };
	    words.reduce(handleWord, tree);
	    return tree;
	};

	var findApplicable = function findApplicable(root) {
	    var acc = [];
	    var results = [];

	    (function handleNode(node) {
	        acc.push(node.value);

	        node.children.length ? node.children.forEach(handleNode) : results.push(acc.filter(function (l) {
	            return l;
	        }).join(""));

	        acc.pop();
	    })(root);

	    return results;
	};

	var getSuitableNode = function getSuitableNode(root, path) {
	    var finalNode = root;
	    (function handleNode(node, subpath) {
	        var step = subpath.shift();
	        var potentialNode = node.children.find(function (cNode) {
	            return cNode.value === step;
	        });

	        if (potentialNode) {
	            if (subpath.length) {
	                handleNode(potentialNode, subpath);
	            } else {
	                finalNode = potentialNode;
	            }
	        } else {
	            finalNode = null;
	        }
	    })(finalNode, path);

	    return finalNode;
	};

	var getSuitableNodes = function getSuitableNodes(root, letter) {
	    var queue = [].concat(root.children),
	        result = [],
	        node = void 0;

	    while (node = queue.shift()) {
	        queue.push.apply(queue, _toConsumableArray(node.children));
	        if (node.value === letter) {
	            result.push(node);
	        }
	    }

	    return result;
	};

	var getPathForNode = function getPathForNode(node) {
	    var acc = [],
	        parent = void 0;

	    while (parent = node.parent) {
	        acc.unshift(parent.value);
	        node = parent;
	    }

	    return acc.filter(function (letter) {
	        return letter;
	    });
	};

	function drawTree(dictionary) {
	    var linesGroup = (0, _svgHelper.createGroup)();
	    var weight = 0,
	        depth = 0,
	        maxWeight = 0,
	        maxDepth = 0;

	    svg.appendChild(linesGroup);

	    var handleNode = function handleNode(node) {

	        depth++;
	        maxDepth = Math.max(maxDepth, depth);
	        node.depth = depth;

	        node.children.forEach(handleNode);

	        if (node.children.length === 0) {
	            node.weight = weight;
	            weight++;
	            maxWeight = Math.max(maxWeight, weight);

	            var terminator = (0, _svgHelper.createTerminator)(getX(node), getY(node));
	            svg.appendChild(terminator);
	        } else {
	            node.weight = node.children.reduce(function (res, child) {
	                return res += child.weight;
	            }, 0) / node.children.length;
	            node.children.forEach(function (child) {
	                linesGroup.appendChild((0, _svgHelper.createLine)(getX(node), getY(node), getX(child), getY(child)));
	            });

	            var nodeElement = (0, _svgHelper.createNodeElement)(getX(node), getY(node), node.value);
	            svg.appendChild(nodeElement);
	        }

	        depth--;
	    };

	    handleNode(dictionary.root);
	    svg.setAttribute('viewBox', '0 0 ' + (maxWeight * 75 + 25) + ' ' + (maxDepth * 75 + 25));
	}

	function getX(node) {
	    return node.weight * 75 + 50;
	}

	function getY(node) {
	    return (node.depth - 1) * 75 + 50;
	}

	textArea.addEventListener('input', function (e) {
	    var dictionary = parseText(e.target.value);
	    svg.innerHTML = "";
	    drawTree(dictionary);
	});

	// searchInput.addEventListener('input', (e) => {
	//     let mask = e.target.value;
	//
	//     resultContainer.innerHTML="";
	//     if (mask !== "") {
	//         let path = mask.split("");
	//         let nodes = getSuitableNodes(dictionary.root, path.shift());
	//         nodes.forEach(node => {
	//             let lPath = path.slice(0),
	//                 lNode = null;
	//
	//             if (lPath.length) {
	//                 lNode = getSuitableNode(node, lPath);
	//             } else {
	//                 lNode = node;
	//             }
	//
	//             if (lNode) {
	//                 let subPaths = findApplicable(lNode);
	//                 let prePath = getPathForNode(lNode).join("");
	//                 subPaths.forEach(subPath => {
	//                     resultContainer.innerHTML +=
	//                         `<div><span>${prePath}</span><span style="color: red">${subPath/*.substr(1, subPath.length-1)*/}</span></div>`;
	//                 })
	//             }
	//
	//         });
	//     }
	// });

/***/ },
/* 1 */
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

	    circleInternal.setAttribute('fill', 'black');

	    group.appendChild(circle);
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
	    line.setAttribute('stroke-width', 2);

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
	    circle.setAttribute('stroke-width', 2);
	    circle.setAttribute('fill', 'white');
	    circle.setAttribute('r', r);
	    circle.setAttribute('cx', cx);
	    circle.setAttribute('cy', cy);

	    return circle;
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var textMock = exports.textMock = "cabbage cabby cabdriver cabdriving cactus cackle coach coaching beacon beach beachcomber beard bearish bitch bitcoin";

/***/ }
/******/ ]);