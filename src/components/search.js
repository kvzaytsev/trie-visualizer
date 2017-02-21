import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Observable} from 'rxjs';

import ACTION_TYPES from '../action-types';

class Search extends Component {
    constructor(props) {
        super(props);
        this.__input$ = null;
    }

    componentDidMount() {
        this.__input$ = Observable.fromEvent(this.searchInput, 'input');
        this.__input$
            .debounceTime(100)
            .subscribe(() => {
                this.props.onTextSet(this.searchInput.value);
            });
    }

    doSearch() {
        this.props.onTextSet(this.searchInput.value);
    }

    render() {
        return (
            <div className="trie-search">
                <input
                    className="trie-search__input"
                    type="text"
                    placeholder="Fuzzy search"
                    ref={input => this.searchInput = input}
                />

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    height="24"
                    width="24"
                    viewBox="0 0 100 100"
                    className="trie-search__icon"
                    stroke="#4390bc"
                >
                    <circle r="30" cx="60" cy="40" stroke="inherit" fill="white" strokeWidth="14"/>
                    <line x1="5" y1="95" x2="35" y2="65" stroke="inherit" strokeWidth="14" strokeLinecap="round"/>
                </svg>
            </div>
        );
    }
}

export default connect(
    state => state,
    dispatch => ({
        onTextSet: (text) => {
            dispatch({
                type: ACTION_TYPES.SEARCH,
                payload: text
            });
        }
    })
)(Search);
