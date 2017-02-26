import React from 'react';
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';

import store from './store';
import App from './components/app/app'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('.root')
);

/*const doSearch = mask => {
    clearClassList(svgContentG);
    clearHighlighted();
    resultContainer.innerHTML = "";

    if (mask !== "") {
        let path = mask.split("");
        svgContentG.classList.add('grey-out');

        dfsForPath(store.getState().trie.root, path).forEach(nodeList => {
            let tail = nodeList[0];
            let head = nodeList[nodeList.length - 1];
            let betweenList = [];

            let beforeTail = getPathForNode(tail);
            beforeTail.forEach(node => highlightNode(node, 'path'));

            let wordStart = `<span class="word-regular">${beforeTail.map(n => n.value).join('')}</span>`;
            wordStart += `<span class="word-target">${tail.value}</span>`;
            nodeList.reduce((above, below) => {
                let betweens = getNodesBetween(below, above);
                betweenList.push(...betweens);
                wordStart += `<span class="word-regular">${betweens.reverse().map(n => n.value).join('')}</span>`;
                wordStart += `<span class="word-target">${below.value}</span>`;
                return below;
            });

            betweenList.forEach(node => highlightNode(node, 'path'));

            nodeList.forEach(node => highlightNode(node, 'mask'));
            dfsFromNode(head).forEach(path => {
                path.forEach(node => highlightNode(node, 'rest'));
                let wordDiv = document.createElement('div');
                wordDiv.innerHTML = wordStart + `<span class="word-regular">${path.map(n => n.value).join('')}</span>`;
                resultContainer.appendChild(wordDiv);
            });
        });
    }
};*/
