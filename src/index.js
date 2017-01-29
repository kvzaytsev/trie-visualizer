import {createGroup, createLine, createTerminator, createNodeElement} from './svg-helper';
import {textMock} from './mocks';

const textArea = document.querySelector('.js-text');
const startBtn = document.querySelector('.js-start');
const resultContainer = document.querySelector('.js-result');
const searchInput = document.querySelector('.js-input');
const svg = document.querySelector('.js-tree-svg');

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

const createNode = (value, parent = null) => ({
    children: [],
    value: value,
    parent: parent,
    id: idGenerator.next().value
});

const fill = (list, pNode) => {
    let letter = list.shift();
    let cNode = pNode.children.find(child => child.value === letter);

    if (!cNode) {
        cNode = createNode(letter, pNode);
        pNode.children.push(cNode);
    }

    if (list.length) {
        fill(list, cNode);
    } else if (cNode.children.length === 0) {
        let terminator = createNode(null, cNode);
        cNode.children.push(terminator);
    }
};

const handleWord = (tree, word) => {
    if (word) {
      let letters = word.split('');
      fill(letters, tree.root);
    }
    return tree;
};

const parseText = (text) => {
    let words = text.split(/\s+/);
    let tree = {root: createNode("")};
    words.reduce(handleWord, tree);
    return tree;
};

const findApplicable = (root) => {
    let acc = [];
    let results = [];

    (function handleNode(node) {
        acc.push(node.value);

        node.children.length
            ? node.children.forEach(handleNode)
            : results.push(acc.filter(l => l).join(""));

        acc.pop();
    })(root);

    return results;
};

const getSuitableNode = (root, path) => {
    let finalNode = root;
    let nodeList = [];
    (function handleNode(node, subpath) {
        let step = subpath.shift();
        let potentialNode = node.children.find(cNode => cNode.value === step);

        if (potentialNode) {
            nodeList.push(potentialNode);
            if (subpath.length) {
                handleNode(potentialNode, subpath);
            } else {
                finalNode = potentialNode;
            }
        } else {
            finalNode = null;
            nodeList.length = 0;
        }

    })(finalNode, path);

    return nodeList;
};

const bfsForNodes = (root, letter) => {
    let queue = [].concat(root.children),
        result = [],
        node;

    while (node = queue.shift()) {
        queue.push(...node.children);
        if (node.value === letter){
            result.push(node);
        }
    }

    return result;
};

const dfsFromNode = (root, handler) => {
  const handleNode = (node) => {
    handler(node)
    node.children.forEach(handleNode);
  }
  handleNode (root);
}

const getPathForNode = (node) => {
    let acc = [],
        parent;

    while(parent = node.parent) {
        acc.unshift(parent);
        node = parent;
    }

    return acc.filter(letter => letter);
}

function drawTree(dictionary) {
    let linesGroup = createGroup();
    let weight = 0,
        depth = 0,
        maxWeight = 0,
        maxDepth = 0;

    svg.appendChild(linesGroup);

    const handleNode = (node) => {

        depth++;
        maxDepth = Math.max(maxDepth, depth)
        node.depth = depth;

        node.children.forEach(handleNode);

        if (node.children.length === 0) {
            node.weight = weight;
            weight ++;
            maxWeight = Math.max(maxWeight, weight);

            let terminator = createTerminator(getX(node),getY(node));
            svg.appendChild(terminator);
            node.$ = terminator;

        } else {
            node.weight = node.children.reduce((res, child) => res += child.weight, 0) / node.children.length;
            node.children.forEach(child => {
                linesGroup.appendChild(createLine(getX(node),getY(node),getX(child),getY(child)));
            });

            let nodeElement = createNodeElement(getX(node),getY(node), node.value);
            svg.appendChild(nodeElement);
            node.$ = nodeElement;
            nodeElement.setAttribute('id', node.id);
        }

        depth--;
    }

    handleNode(dictionary.root);
    svg.setAttribute('viewBox', `0 0 ${maxWeight * 75 + 25} ${maxDepth * 75 + 25}`);
}

const start = text => {
  dictionary = parseText(text);
  svg.innerHTML = "";
  drawTree(dictionary);
}

textArea.addEventListener('input', (e) => {
  start(textArea.value);
});
start(textArea.value);

const highlightNode = (node, className) => {
  let element = node.$;
  if (element) {
    let circle = element.getElementsByTagName('circle')[0];
    circle.classList.add(className);
    highlighted.push(circle);
  }
}

const search = mask => {
  let path = mask.split("");
  let nodes = bfsForNodes(dictionary.root, path.shift());
  nodes.forEach(node => {
    let lPath = path.slice(0);

    if (lPath.length ) {
      let nodeList = getSuitableNode(node, lPath);
      if (nodeList.length) {
        getPathForNode(node).forEach(node => highlightNode(node, 'path'));
        [node].concat(nodeList).forEach(node => highlightNode(node, 'mask'));
        dfsFromNode(nodeList[nodeList.length-1], node => highlightNode(node, 'path'));
      }
    } else {
      getPathForNode(node).forEach(node => highlightNode(node, 'path'));
      highlightNode(node, 'mask');
    }
  });
};

searchInput.addEventListener('input', (e) => {
  let mask = e.target.value;
  highlighted.forEach(c => {
    c.classList.remove('mask');
    c.classList.remove('path');
  });
  highlighted.length = 0;
  if (mask !== "") {
    search(mask);
  }
});
