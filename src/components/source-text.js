import React, {Component} from 'react';
import {connect} from 'react-redux';

import ACTION_TYPES from '../action-types';
import {textMock} from  '../mocks';

import {parseText} from '../tree-utils';

class SourceText extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.textInput.value = textMock;
    }

    setSourceText() {
        this.props.onTextSet(parseText(this.textInput.value));
    }

    render() {
        return (
            <div className="trie-source-text">
                <input
                    type="text"
                    className="trie-source-text__input"
                    ref={input => this.textInput = input}
                    onChange={this.setSourceText.bind(this)}
                />
            </div>
        )
    }
}

export default connect(
    state => state,
    dispatch => ({
        onTextSet: (text) => {
            dispatch({
                type: ACTION_TYPES.CREATE_TRIE,
                payload: text
            });
        }
    })
)(SourceText);