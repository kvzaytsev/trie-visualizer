import React from 'react';

const trieDefinitions = (props) => {
    return (
        <defs>
            <filter id="dropShadow" x="-50%" y="-50%" width="250%" height="250%">
                <feOffset in="SourceGraphic" result="the-shadow" dx="5" dy="5"/>
                <feGaussianBlur in="SourceAlpha" result="blur-out" stdDeviation="4"/>
                <feOffset in="blur-out" result="the-shadow" dx="5" dy="5"/>
                <feColorMatrix in="the-shadow" result="color-out" type="matrix"
                               values=" 0 0 0 0   0
                                        0 0 0 0   0
                                        0 0 0 0   0
                                        0 0 0 .5  0"/>
                <feBlend in="SourceGraphic" in2="the-shadow" mode="normal"/>
            </filter>
        </defs>
    );
};

export default trieDefinitions;