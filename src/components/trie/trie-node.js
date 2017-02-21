import React from 'react';

import NodeLink from './node-link';

const trieNode = (props) => {
    let classes = props.highlight
        ? `found ${props.highlight}`
        : '';

    return (
        <g
            id={props.id}
            className={classes}
        >
            {
                props.line && <line
                    x1={props.x}
                    y1={props.y}
                    x2={props.line.x2}
                    y2={props.line.y2}
                    stroke="black"
                    strokeWidth="1"
                />
            }
            <circle
                stroke="black"
                strokeWidth="1"
                fill="white"
                r="25"
                cx={props.x}
                cy={props.y}
            />
            <text
                fontSize="40"
                textAnchor="middle"
                alignmentBaseline="middle"
                x={props.x}
                y={props.y}
            >{props.value}</text>
        </g>
    );
};

export default trieNode;