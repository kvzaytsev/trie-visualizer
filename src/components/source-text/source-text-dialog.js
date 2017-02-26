import React, {Component} from 'react';
import {connect} from 'react-redux';

import ACTION_TYPES from '../../action-types';

class SourceTextDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            left: "calc(50% - 250px)",
            top: "calc(50% - 200px)"
        };
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    onCloseBtnClick() {
        this.props.onClose();
    }

    onOkBtnClick() {
        this.props.onTextSet(this.textArea.value);
        this.props.onClose();
    }

    onMouseMove(e) {
        if (!this.state.dragging) return ;

        this.setState({
            left: e.pageX - this.state.rel.left,
            top: e.pageY - this.state.rel.top
        });

        e.stopPropagation();
        e.preventDefault();
    }

    onMouseDown (e) {
        this.setState({
            dragging: true,
            rel: {
                left: e.pageX - this.dialogContainer.offsetLeft,
                top: e.pageY - this.dialogContainer.offsetTop
            }
        });
    }

    onMouseUp (e) {
        this.setState({
            dragging: false
        });

        e.stopPropagation();
        e.preventDefault();
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.onMouseMove);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
    }

    render() {
        return (
            <div>
                <div className="mask"/>
                <div
                    ref={(dialog => this.dialogContainer = dialog)}
                    className="source-text-dialog"

                    style={{
                        left: this.state.left,
                        top: this.state.top
                    }}
                >
                    <div
                        onMouseDown={this.onMouseDown.bind(this)}
                        onMouseUp={this.onMouseUp.bind(this)}
                        className="source-text-dialog__header"
                    >
                        <button
                            className="source-text-dialog-close"
                            type="button"
                            onClick={this.onCloseBtnClick.bind(this)}
                        >
                            Close
                        </button>
                    </div>
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

    static checkEvent(e) {
        return (
            e.button === 0 &&
            e.target.classList.contains("source-text-dialog__content")
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