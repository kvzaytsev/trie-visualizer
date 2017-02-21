const createNode = (value, parent = null) => ({
    children: [],
    value: value,
    parent: parent
});

const fill = (list, pNode) => {
    let letter = list.shift();
    let cNode = pNode.children.find(child => child.value === letter);

    if (!cNode) {
        cNode = createNode(letter, pNode);
        pNode.children.push(cNode);
    }

    if (list.length) {
        fill(list, cNode);
    } else if (cNode.children.length === 0) {
        let terminator = createNode(null, cNode);
        cNode.children.push(terminator);
    }
};

const handleWord = (tree, word) => {
    if (word) {
        let letters = word.split('');
        fill(letters, tree.root);
    }
    return tree;
};

export const parseText = (text) => {
    let words = text.split(/\s+/);
    let tree = {root: createNode("")};
    words.reduce(handleWord, tree);
    return tree;
};