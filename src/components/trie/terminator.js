import React from 'react';

import NodeLink from './node-link';
import Styles from './trie.css';

const terminator = (props) => {
    let classes = [];

    if (props.highlight){
        classes.push('found');
        classes.push(props.highlight);
    }

    return (
        <g
            id={props.id}
            className={classes.map(c => Styles[c]).join(' ')}
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
                fill="#ccc"
                r="10"
                cx={props.x}
                cy={props.y}
            />
        </g>
    );
};

export default terminator;