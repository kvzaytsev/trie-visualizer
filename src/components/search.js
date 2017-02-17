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
                    ref = {input => this.searchInput = input}
                    onInput = {this.doSearch.bind(this)}
                />
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
