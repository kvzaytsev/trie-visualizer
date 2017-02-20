import React, {Component} from 'react';
import {connect} from 'react-redux';

import ACTION_TYPES from '../action-types';

class Search extends Component {
    constructor(props) {
        super(props);
    }

    doSearch() {
        this.props.onTextSet(this.searchInput.value);
    }

    render() {
        return (
            <div className="trie-search">
                <input
                    className = "trie-search__input"
                    type = "text"
                    placeholder="Fuzzy search"
                    ref = {input => this.searchInput = input}
                    onInput = {this.doSearch.bind(this)}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    height="24"
                    width="24"
                    viewBox="0 0 100 100"
                    className="trie-search__icon"
                >
                    <circle r="30" cx="60" cy="40" stroke="#4390bc" fill="white" strokeWidth="10"/>
                    <line x1="5" y1="95" x2="35" y2="65" stroke="#4390bc" strokeWidth="10"/>
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
