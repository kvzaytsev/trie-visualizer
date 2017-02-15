import Rx, {Observable} from 'rxjs';
import {drawTree, highlightNode, clearHighlighted} from './graphics/graphics';
import {getNodesBetween, dfsForPath, getPathForNode, dfsFromNode, clearClassList} from './utils';
import {parseText} from './tree-utils';
import store from './store';
import {createTrie, search} from './action-creators';
import {textMock} from  './mocks';

const textArea = document.querySelector('.js-text');
const resultContainer = document.querySelector('.js-result');
const searchInput = document.querySelector('.js-input');
const svg = document.querySelector('.js-tree-svg');
const svgContentG = document.querySelector('.js-tree-content');

const searchInput$ = Observable.fromEvent(searchInput, 'input');
const textArea$ = Observable.fromEvent(textArea, 'input');

const start = text => store.dispatch(createTrie(parseText(text)));

store.subscribe((data) => {
    let state = store.getState();
    svgContentG.innerHTML = "";
    drawTree(state.trie, svgContentG, svg);
    doSearch(searchInput.value.toLowerCase());
});

const doSearch = mask => {
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
};

searchInput$.subscribe(() => store.dispatch(search(searchInput.value.toLowerCase())));
start(textMock);

// textArea$.subscribe(() => {
//     start(textMock);
//     search(searchInput.value.toLowerCase());
// });

