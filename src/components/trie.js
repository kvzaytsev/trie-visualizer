import React, {Component} from 'react';
import {connect} from 'react-redux';

import Defs from './trie-definitions';
import Terminator from './terminator';
import TrieNode from './trie-node';

class Trie extends Component {

    constructor(props) {
        super(props);
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
                viewBox={viewBox}>
                <Defs/>
                {trieParams.nodeList.map((child, idx) =>
                    child.type === 'terminator'
                        ? <Terminator key={idx} x={child.x} y={child.y} line={child.line}/>
                        : <TrieNode key={idx} x={child.x} y={child.y} value={child.value} line={child.line} />
                )};
            </svg>
        );
    }

    getX(node) {
        return node.weight * 75 + 50;
    }

    getY(node) {
        return (node.depth - 1) * 75 + 50;
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
                    x: this.getX(node),
                    y: this.getY(node)
                };
            } else {
                node.weight = node.children.reduce((res, child) => res += child.weight, 0) / node.children.length;
                node.children.forEach(child => {
                    child.$.line = {
                        x1: this.getX(node),
                        y1: this.getY(node),
                        x2: this.getX(child),
                        y2: this.getY(child)
                    }
                });
                nodeElement = {
                    type: 'node',
                    x: this.getX(node),
                    y: this.getY(node),
                    value: node.value
                };
            }

            node.$ = nodeElement;
            nodeList.push(nodeElement);
            depth--;
        };

        handleNode(root);

        return {
            nodeList,
            maxWeight,
            maxDepth
        };
    }
}

export default connect(
    state => ({
        _trie: state.trie
    })
)(Trie);