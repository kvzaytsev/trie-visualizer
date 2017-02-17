import React from 'react';

const pointD = 6;

const nodeLink = (props) => {
    let acc = [];
    let distance = Math.sqrt( Math.pow(props.x2 - props.x1, 2) + Math.pow(props.y2 - props.y1, 2)) - 50;
    let count = Math.round((distance - 5) / 10);

    for (let i = 1; i < count; i++) {
        let x0 = Math.min(props.x1,props.x2);
        let y0 = Math.min(props.y1,props.y2);

        let x = props.x2 + 25 + i * (props.x1 - props.x2) / (count );
        let y = props.y2 + 25 + i * (props.y1 - props.y2) / (count );

        acc.push([x,y]);
    }

    return (
        <g>
            {
                acc.map(([x,y]) =>
                   <circle cx={x} cy={y} r="5" strokeWidth="1" stroke="black"/>
                )
            }
        </g>
    );
};

export default nodeLink;