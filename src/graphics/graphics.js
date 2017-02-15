import {createGroup, createLine, createTerminator, createNodeElement} from './svg-helper';
import {clearClassList} from '../utils';

let highlighted = [];

const getX = node => node.weight * 75 + 50;
const getY = node => (node.depth - 1) * 75 + 50;

export const drawTree = (dictionary, svgContentG, svg) => {
    let linesGroup = createGroup();
    let weight = 0,
        depth = 0,
        maxWeight = 0,
        maxDepth = 0;

    svgContentG.appendChild(linesGroup);

    const handleNode = (node) => {
        let nodeElement;

        depth++;
        maxDepth = Math.max(maxDepth, depth);
        node.depth = depth;

        node.children.forEach(handleNode);

        if (node.children.length === 0) {
            node.weight = weight++;
            maxWeight = Math.max(maxWeight, weight);
            nodeElement = createTerminator(getX(node), getY(node));
        } else {
            node.weight = node.children.reduce((res, child) => res += child.weight, 0) / node.children.length;
            nodeElement = createNodeElement(getX(node), getY(node), node.value);
            node.children.forEach(child => {
                let x1 = getX(node),
                    x2 = getX(child);
                let line = createLine(
                    x1,
                    getY(node),
                    x2 === x1 ? x1 + 1 : x2,
                    getY(child)
                );
                child.$.insertBefore(line, child.$.firstChild);
            });
        }

        svgContentG.appendChild(nodeElement);
        node.$ = nodeElement;
        depth--;
    };

    handleNode(dictionary.root);
    svg.setAttribute('viewBox', `0 0 ${maxWeight * 75 + 25} ${maxDepth * 75 + 25}`);
};

export const clearHighlighted = () => {
    highlighted.forEach(clearClassList);
    highlighted.length = 0;
};

export const highlightNode = (node, className) => {
    let element = node.$;
    if (element) {
        element.classList.add(className);
        element.classList.add('found');
        highlighted.push(element);
    }
};