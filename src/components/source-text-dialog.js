import React, {Component} from 'react';
import {connect} from 'react-redux';

import ACTION_TYPES from '../action-types';

import {parseText} from '../tree-utils';

class SourceTextDialog extends Component {
    constructor(props) {
        super(props);
    }

    onCloseBtnClick() {
        this.props.onClose();
    }

    onOkBtnClick() {
        this.props.onTextSet(this.textArea.value);
        this.props.onClose();
    }

    render() {
        return (
            <div>
                <div className="mask"/>
                <div className="source-text-dialog">
                    <button
                        className="source-text-dialog-close"
                        type="button"
                        onClick={this.onCloseBtnClick.bind(this)}
                    >
                        Close
                    </button>
                    <div className="source-text-dialog__content">
                        <label htmlFor="source-text">Source Text</label>
                        <textarea
                            id="source-text"
                            ref={input => this.textArea = input}
                            className="source-text-dialog__textarea"
                        >
                            {this.props.textValue}
                        </textarea>
                    </div>
                    <div className="source-text-dialog__bottom">
                        <button
                            className="dialog-btn"
                            onClick={this.onCloseBtnClick.bind(this)}
                        >
                            Cancel
                        </button>
                        <button
                            className="dialog-btn"
                            onClick={this.onOkBtnClick.bind(this)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({

    }),
    dispatch => ({
        onTextSet: (text) => {
            dispatch({
                type: ACTION_TYPES.TEXT_CHANGED,
                payload: text
            });
        }
    })
)(SourceTextDialog);