import React, {Component} from 'react';
import {connect} from 'react-redux';

import ACTION_TYPES from '../../action-types';
import Styles from './source-text-dialog.css';

class SourceTextDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            left: "calc(50% - 250px)",
            top: "calc(50% - 200px)"
        };
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onOkBtnClick = this.onOkBtnClick.bind(this);
        this.onCloseBtnClick = this.onCloseBtnClick.bind(this);

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
                <div className={Styles.mask}/>
                <div
                    ref={(dialog => this.dialogContainer = dialog)}
                    className={Styles.container}

                    style={{
                        left: this.state.left,
                        top: this.state.top
                    }}
                >
                    <div
                        onMouseDown={this.onMouseDown}
                        onMouseUp={this.onMouseUp}
                        className={Styles.header}
                    >
                        <button
                            className={Styles.close}
                            type="button"
                            onClick={this.onCloseBtnClick}
                        >
                            Close
                        </button>
                    </div>
                    <div className={Styles.content}>
                        <label
                            htmlFor="source-text"
                            className={Styles.label}
                        >
                            Source Text
                        </label>
                        <textarea
                            id="source-text"
                            ref={input => this.textArea = input}
                            className={Styles.textarea}
                            defaultValue={this.props.textValue}
                        />
                    </div>
                    <div className={Styles.bottom}>
                        <button
                            className={Styles.button}
                            onClick={this.onCloseBtnClick}
                        >
                            Cancel
                        </button>
                        <button
                            className={Styles.button}
                            onClick={this.onOkBtnClick}
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