export const bfsForNodes = (root, letter) => {
    let queue = [].concat(root.children),
        result = [],
        node;

    while (node = queue.shift()) {
        queue.push(...node.children);
        if (node.value === letter) {
            result.push(node);
        }
    }

    return result;
};

export const dfsForPath = (root, path) => {
    let originalLength = path.length;
    let results = [];
    let accList = [];

    function bfsForLetter(queue, letter) {
        let result = [],
            node;

        if (letter) {
            queue = [].concat(queue);
            while (node = queue.shift()) {
                queue.push(...node.children);
                if (node.value === letter) {
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
            clone.push(child);
            accList.push(clone);
            accList = accList.filter(acc => acc.length === originalLength);
            handlePath(child.children, path.slice(0), clone);
        });
    }

    handlePath(root.children, path, []);

    return accList.filter(acc => acc.length === originalLength);
};

export const dfsFromNode = (root) => {
    let acc = [];
    let path = [];

    const handleNode = (node) => {
        path.push(node);
        node.value === null && acc.push(path.slice(0));
        node.children.forEach(handleNode);
        path.pop();
    };

    handleNode(root);
    return acc.map(path => path.slice(1));
};

export const getNodesBetween = (cNode, pNode) => {
    let parent = cNode.parent;
    let acc = [];
    while (parent && parent !== pNode) {
        acc.push(parent);
        parent = parent.parent;
    }
    return acc;
};

export const getPathForNode = (node) => {
    let acc = [],
        parent;

    while (parent = node.parent) {
        acc.unshift(parent);
        node = parent;
    }

    return acc.filter(letter => letter);
};
