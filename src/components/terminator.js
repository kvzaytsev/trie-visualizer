import React from 'react';

const terminator = (props) => {
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
                fill="#ccc"
                r="10"
                cx={props.x}
                cy={props.y}
            />
        </g>
    );
};

export default terminator;