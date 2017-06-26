import React, {Component} from 'react';
import {connect} from 'react-redux';

import Defs from './trie-definitions';
import Terminator from './terminator';
import TrieNode from './trie-node';
import {getNodesBetween, dfsForPath, getPathForNode, dfsFromNode} from '../../utils';

import {parseText} from './tree-utils';
import Styles from './trie.css';

class Trie extends Component {

    constructor(props) {
        super(props);
        this._trie = null;
    }

    render() {

        if (!this.props._trie.root) {
            return <div/>;
        }

        const trieParams = this.calculateTrie(this.props._trie.root);
        const viewBox = `0 0 ${trieParams.maxWeight * 75 + 25} ${trieParams.maxDepth * 75 + 25}`;

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                height="800"
                viewBox={viewBox}
                className={Styles.container}
            >
                <Defs/>
                <g className={this.props._mask ? Styles['grey-out'] : ''}>
                    {trieParams.nodeList.map((child, idx) =>
                        child.type === 'terminator'
                            ? Trie.createTerminator(child)
                            : Trie.createChildNode(child)
                    )};
                </g>
            </svg>
        );
    }

    calculateTrie(root) {
        let weight = 0,
            depth = 0,
            maxWeight = 0,
            maxDepth = 0,
            nodeList = [],
            nodeElement = null;

        const handleNode = (node) => {
            node.depth = ++depth;
            maxDepth = Math.max(maxDepth, depth);
            node.children.forEach(handleNode);

            if (node.children.length === 0) {
                node.weight = weight++;
                maxWeight = Math.max(maxWeight, weight);
                nodeElement = {
                    type: 'terminator',
                    key: `#__${node.weight}__${node.depth}`,
                    x: Trie.getX(node),
                    y: Trie.getY(node)
                };
            } else {
                node.weight = node.children.reduce((res, child) => res += child.weight, 0) / node.children.length;
                node.children.forEach(child => {
                    child.$.line = {
                        x2: Trie.getX(node),
                        y2: Trie.getY(node)
                    }
                });
                nodeElement = {
                    type: 'node',
                    key: `${node.value}__${node.weight}__${node.depth}`,
                    x: Trie.getX(node),
                    y: Trie.getY(node),
                    value: node.value
                };
            }

            node.$ = nodeElement;
            nodeList.push(nodeElement);
            depth--;
        };

        handleNode(root);
        this.doSearch();

        return {
            nodeList,
            maxWeight,
            maxDepth
        };
    }

    doSearch() {
        if (this.props._mask === '') {
            return;
        }

        let path = this.props._mask.split("");
        dfsForPath(this.props._trie.root, path).forEach(nodeList => {
            let tail = nodeList[0];
            let head = nodeList[nodeList.length - 1];
            let beforeTail = getPathForNode(tail);
            let betweenList = [];

            nodeList.reduce((above, below) => {
                betweenList.push(...getNodesBetween(below, above));
                return below;
            });

            beforeTail.forEach(node => Trie.addHighlighting(node.$, 'path'));
            betweenList.forEach(node => Trie.addHighlighting(node.$, 'path'));
            nodeList.forEach(node => Trie.addHighlighting(node.$, 'mask'));
            dfsFromNode(head).forEach(path => path.forEach(node => Trie.addHighlighting(node.$, 'path')));

        });
    }

    static createTerminator(child) {
        return (
            <Terminator
                id={child.key}
                key={child.key}
                {...child}
            />
        );
    }

    static createChildNode(child) {
        return (
            <TrieNode
                id={child.key}
                key={child.key}
                {...child}
            />
        );
    }

    static addHighlighting(node, value) {
        switch (value) {
            case 'mask':
                node.highlight = value;
                break;
            default:
                if (!node.highlight) {
                    node.highlight = value;
                }
                break;
        }

    }

    static getX(node) {
        return node.weight * 75 + 50;
    }

    static getY(node) {
        return (node.depth - 1) * 75 + 50;
    }
}

export default connect(
    state => ({
        _trie: parseText(state.text),
        _mask: state.searchMask
    })
)(Trie);