import {createGroup, createLine, createTerminator, createNodeElement} from './svg-helper';
import {getPathForNode, dfsFromNode, bfsForNodes, getSuitableNode, findApplicable, parseText, handleWord, fill, createNode, clearClassList} from './utils';
import {textMock} from './mocks';

const textArea = document.querySelector('.js-text');
const startBtn = document.querySelector('.js-start');
const resultContainer = document.querySelector('.js-result');
const searchInput = document.querySelector('.js-input');

const svg = document.querySelector('.js-tree-svg');
const svgContentG = document.querySelector('.js-tree-content');

const styleSheet = document.styleSheets[0];

const getX = node => node.weight * 75 + 50;
const getY = node => (node.depth-1) * 75 + 50;

let dictionary;
let highlighted = [];

function * createGenerator() {
  let i=0;
  while (true) {
    yield i++;
  }
}

const idGenerator = createGenerator();

function drawTree(dictionary) {
    let linesGroup = createGroup();
    let weight = 0,
        depth = 0,
        maxWeight = 0,
        maxDepth = 0;

    svgContentG.appendChild(linesGroup);

    const handleNode = (node) => {

        depth++;
        maxDepth = Math.max(maxDepth, depth)
        node.depth = depth;

        node.children.forEach(handleNode);

        if (node.children.length === 0) {
            node.weight = weight ++;
            // weight ++;
            maxWeight = Math.max(maxWeight, weight);

            let terminator = createTerminator(getX(node),getY(node));
            svgContentG.appendChild(terminator);
            node.$ = terminator;

        } else {
            node.weight = node.children.reduce((res, child) => res += child.weight, 0) / node.children.length;

            let nodeElement = createNodeElement(getX(node),getY(node), node.value);
            node.children.forEach(child => {
                let line = createLine(getX(node),getY(node),getX(child),getY(child));
                child.$_l = line;
                child.$.insertBefore(line, child.$.firstChild);
            });


            svgContentG.appendChild(nodeElement);
            node.$ = nodeElement;
        }

        depth--;
    }

    handleNode(dictionary.root);
    svg.setAttribute('viewBox', `0 0 ${maxWeight * 75 + 25} ${maxDepth * 75 + 25}`);
}

const start = text => {
  dictionary = parseText(text);
  svgContentG.innerHTML = "";
  drawTree(dictionary);
}

textArea.addEventListener('input', (e) => {
  start(textArea.value);
  search();
});
start(textArea.value);

const highlightNode = (node, className) => {
  let element = node.$;
  if (element) {
      element.classList.add(className);
      element.classList.add('found');
      highlighted.push(element);
  }
}

const search = () => {
    let mask = searchInput.value;

    clearClassList(svgContentG);
    highlighted.forEach(clearClassList);
    highlighted.length = 0;

    if (mask !== "") {
      let path = mask.split("");
      let nodes = bfsForNodes(dictionary.root, path.shift());
      if (nodes.length) {
          svgContentG.classList.add('grey-out');
      }
      nodes.forEach(node => {
        let lPath = path.slice(0);

        if (lPath.length ) {
          let nodeList = getSuitableNode(node, lPath);
          if (nodeList.length) {
            getPathForNode(node).forEach(node => highlightNode(node, 'path'));
            [node].concat(nodeList).forEach(node => highlightNode(node, 'mask'));
            dfsFromNode(nodeList[nodeList.length-1], node => highlightNode(node, 'rest'));
        }
        } else {
          getPathForNode(node).forEach(node => highlightNode(node, 'path'));
          highlightNode(node, 'mask');
        }
      });
  }
};

searchInput.addEventListener('input', (e) => {
  search();
});
