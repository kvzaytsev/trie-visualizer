import {createGroup, createLine, createTerminator, createNodeElement} from './svg-helper';
import {textMock} from './mocks';

const textArea = document.querySelector('.js-text');
const startBtn = document.querySelector('.js-start');
const resultContainer = document.querySelector('.js-result');
const searchInput = document.querySelector('.js-input');

const svg = document.querySelector('.js-tree-svg');

const createNode = (value, parent = null) => ({
    children: [],
    value: value,
    parent: parent
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
    let letters = word.split('');
    fill(letters, tree.root);
    return tree;
};

const parseText = (text) => {
    let words = text.split(/\s+/g);
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
    (function handleNode(node, subpath) {
        let step = subpath.shift();
        let potentialNode = node.children.find(cNode => cNode.value === step);

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

const getSuitableNodes = (root, letter) => {
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

const getPathForNode = (node) => {
    let acc = [],
        parent;

    while(parent = node.parent) {
        acc.unshift(parent.value);
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

        } else {
            node.weight = node.children.reduce((res, child) => res += child.weight, 0) / node.children.length;
            node.children.forEach(child => {
                linesGroup.appendChild(createLine(getX(node),getY(node),getX(child),getY(child)));
            });

            let nodeElement = createNodeElement(getX(node),getY(node), node.value);
            svg.appendChild(nodeElement);
        }

        depth--;
    }

    handleNode(dictionary.root);
    svg.setAttribute('viewBox', `0 0 ${maxWeight * 75 + 25} ${maxDepth * 75 + 25}`);
}

function getX(node) {
    return node.weight * 75 + 50;
}

function getY(node) {
    return (node.depth-1) * 75 + 50;
}

textArea.addEventListener('input', (e) => {
    let dictionary = parseText(e.target.value);
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
