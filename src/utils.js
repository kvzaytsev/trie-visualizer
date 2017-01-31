export const createNode = (value, parent = null) => ({
    children: [],
    value: value,
    parent: parent
});

export const fill = (list, pNode) => {
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

export const handleWord = (tree, word) => {
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

export const findApplicable = (root) => {
    let acc = [];
    let results = [];

    (function handleNode(node) {
        acc.push(node.value);

        node.children.length
            ? node.children.forEach(handleNode)
            : results.push(acc.filter(l => l).join(""));

        acc.pop();
    })(root);

    return results;
};

export const getSuitableNode = (root, path) => {
    let finalNode = root;
    let nodeList = [];
    (function handleNode(node, subpath) {
        let step = subpath.shift();
        let potentialNode = node.children.find(cNode => cNode.value === step);

        if (potentialNode) {
            nodeList.push(potentialNode);
            if (subpath.length) {
                handleNode(potentialNode, subpath);
            } else {
                finalNode = potentialNode;
            }
        } else {
            finalNode = null;
            nodeList.length = 0;
        }

    })(finalNode, path);

    return nodeList;
};

export const bfsForNodes = (root, letter) => {
    let queue = [].concat(root.children),
        result = [],
        node;

    while (node = queue.shift()) {
        queue.push(...node.children);
        if (node.value === letter){
            result.push(node);
        }
    }

    return result;
};

export const dfsFromNode = (root, handler) => {
  const handleNode = (node) => {
    handler(node)
    node.children.forEach(handleNode);
  }
  handleNode (root);
}

export const getPathForNode = (node) => {
    let acc = [],
        parent;

    while(parent = node.parent) {
        acc.unshift(parent);
        node = parent;
    }

    return acc.filter(letter => letter);
}

export const clearClassList = element => {
    let acc = [];
    element.classList.forEach(c => acc.push(c));
    acc.forEach(c => element.classList.remove(c));
}
