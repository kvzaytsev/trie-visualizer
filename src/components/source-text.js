import React, {Component} from 'react';
import {connect} from 'react-redux';

import SourceTextDialog from './source-text-dialog';
import ACTION_TYPES from '../action-types';

class SourceText extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false
        };
    }

    setSourceText() {
        this.props.onTextSet(this.textInput.value);
    }

    openDialog() {
        this.setState({dialogOpen:true});
    }

    onCloseDialog() {
        this.setState({dialogOpen:false});
    }

    render() {
        return (
            <div className="trie-source-text">
                <input
                    type="text"
                    className="trie-source-text__input"
                    ref={input => this.textInput = input}
                    onChange={this.setSourceText.bind(this)}
                    value={this.props._text}
                />
                <button
                    className="trie-source-text__btn"
                    onClick={this.openDialog.bind(this)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        viewBox="0 0 100 100"
                    >
                        <circle r="10" cx="20" cy="50" fill="#4390bc" />
                        <circle r="10" cx="50" cy="50" fill="#4390bc" />
                        <circle r="10" cx="78" cy="50" fill="#4390bc" />
                    </svg>
                </button>
                {
                    this.state.dialogOpen && (
                        <SourceTextDialog
                            onClose={this.onCloseDialog.bind(this)}
                            textValue={this.props._text}
                        />
                    )
                }
            </div>
        )
    }
}

export default connect(
    state => ({
        _text: state.text
    }),
    dispatch => ({
        onTextSet: (text) => {
            dispatch({
                type: ACTION_TYPES.TEXT_CHANGED,
                payload: text
            });
        }
    })
)(SourceText);