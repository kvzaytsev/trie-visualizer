import React from 'react';

const trieNode = (props) => {
    return (
        <g>
            {
                props.line && <line
                    x1={props.line.x1}
                    x2={props.line.x2}
                    y1={props.line.y1}
                    y2={props.line.y2}
                    stroke="black"
                    strokeWidth="1"/>
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