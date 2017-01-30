export const createNodeElement = (cx, cy, value) => {
    let group = createGroup();
    let circle = createCircle(cx, cy, 25);
    let text = createText(value);

    text.setAttribute('x', cx);
    text.setAttribute('y', cy);

    group.appendChild(circle);
    group.appendChild(text);

    return group;
}

export const createTerminator = (cx, cy) => {
    let group = createGroup();
    let circle = createCircle(cx, cy, 25);
    let circleInternal = createCircle(cx, cy, 10);

    circleInternal.setAttribute('fill', '#ccc');

    // group.appendChild(circle);
    group.appendChild(circleInternal);

    return group;
}

export const createLine = (x1, y1, x2, y2) => {
    let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');

    line.setAttribute('x1', x1);
    line.setAttribute('x2', x2);
    line.setAttribute('y1', y1);
    line.setAttribute('y2', y2);

    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', 1);

    return line;
}

export const createText = (value, x, y) => {
    let text = document.createElementNS("http://www.w3.org/2000/svg", 'text');

    text.setAttribute('font-size', '40');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
    text.textContent = value;

    return text;
}

export const createGroup = () => {
    return document.createElementNS("http://www.w3.org/2000/svg", 'g');
}

export const createCircle = (cx, cy, r) => {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', 1);
    circle.setAttribute('fill', 'white');
    circle.setAttribute('r', r);
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);

    return circle;
}
