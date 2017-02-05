import {createGroup, createLine, createTerminator, createNodeElement} from './svg-helper';
import {getNodesBetween, breadthFirstTraversal, dfsForPath, getPathForNode, dfsFromNode, bfsForNodes, getSuitableNode, findApplicable, parseText, handleWord, fill, createNode, clearClassList} from './utils';
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
            maxWeight = Math.max(maxWeight, weight);

            let terminator = createTerminator(getX(node),getY(node));
            svgContentG.appendChild(terminator);
            node.$ = terminator;

        } else {
            node.weight = node.children.reduce((res, child) => res += child.weight, 0) / node.children.length;

            let nodeElement = createNodeElement(getX(node),getY(node), node.value);
            node.children.forEach(child => {
                let line = createLine(getX(node),getY(node),getX(child),getY(child));
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
    let mask = searchInput.value.toLowerCase();

    clearClassList(svgContentG);
    highlighted.forEach(clearClassList);
    highlighted.length = 0;
    resultContainer.innerHTML = "";

    if (mask !== "") {
      let path = mask.split("");
      svgContentG.classList.add('grey-out');

      dfsForPath(dictionary.root, path).forEach(nodeList => {
          let tail = nodeList[0];
          let head = nodeList[nodeList.length-1];
          let betweenList = [];

          let beforeTail = getPathForNode(tail);
          beforeTail.forEach(node => highlightNode(node, 'path'));
          let wordStart = `<span class="word-regular">${beforeTail.map(n => n.value).join('')}</span>`;
          wordStart += `<span class="word-target">${tail.value}</span>`;
          nodeList.reverse().reduce((below, above) => {
            let betweens = getNodesBetween(below, above);
            betweenList.push(...betweens);
            wordStart += `<span class="word-regular">${betweens.map(n => n.value).join('')}</span>`;
            wordStart += `<span class="word-target">${below.value}</span>`;
            return above;
          })

          betweenList.forEach(node => highlightNode(node, 'path'));

          nodeList.forEach(node => highlightNode(node, 'mask'));
          dfsFromNode(head).forEach(path => {
            path.forEach(node => highlightNode(node, 'rest'));
            let wordDiv = document.createElement('div');
            wordDiv.innerHTML = wordStart + `<span class="word-regular">${path.map(n => n.value).join('')}</span>`;
            resultContainer.appendChild(wordDiv);
          });
      });
  }
};

searchInput.addEventListener('input', (e) => {
  search();
});
