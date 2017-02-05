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

export const dfsForPath = (root, path) => {
    let originalLenght = path.length;
    let results = [];
    let accList = [];

    function bfsForLetter(queue, letter) {
        let result = [],
            node;

        if (letter) {
            queue = [].concat(queue);
            while (node = queue.shift()) {
                queue.push(...node.children);
                if (node.value === letter){
                    result.push(node);
                }
            }
        }

        return result;
    }

    function handlePath(nodeList, path, acc) {
        let letter = path.shift();
        let nodes = bfsForLetter(nodeList, letter);

        results.push(...nodes);
        nodes.forEach(child => {
            let clone = acc.slice(0);
            clone.push(child)
            accList.push(clone);
            accList = accList.filter(acc => acc.length === originalLenght);
            handlePath(child.children, path.slice(0), clone);
        });
    }

    handlePath(root.children, path, []);

    return accList.filter(acc => acc.length === originalLenght);
};

export const dfsFromNode = (root) => {
  let acc = [];
  let path = [];

  const handleNode = (node) => {
    path.push(node);
    node.value === null && acc.push(path.slice(0));
    node.children.forEach(handleNode);
    path.pop();
  }

  handleNode (root);
  return acc.map(path => path.slice(1));
}

export const getNodesBetween = (cNode, pNode) => {
  let parent = cNode.parent;
  let acc = [];
  while (parent && parent !== pNode) {
    acc.push(parent);
    parent = parent.parent;
  }
  return acc;
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
