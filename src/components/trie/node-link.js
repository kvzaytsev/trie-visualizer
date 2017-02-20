import React from 'react';

const pointD = 5;

const nodeLink = (props) => {
    let acc = [];
    let distance = Math.sqrt( Math.pow(props.x2 - props.x1, 2) + Math.pow(props.y2 - props.y1, 2)) ;
    let countTotal = Math.floor(distance / pointD);

    for (let i = 0; i < countTotal; i++) {
        acc.push([
            (props.x2) + (props.x1 - props.x2) / countTotal * i,
            (props.y2) + (props.y1 - props.y2) / countTotal * i,
        ]);
    }

    return (
        <g>
            {
                acc
                    .filter((v,i) => i % 2 === 0)
                    .map(([x,y]) =>
                       <circle cx={x} cy={y} r="1" strokeWidth="1" stroke="black"/>
                    )
            }
        </g>
    );
};

export default nodeLink;