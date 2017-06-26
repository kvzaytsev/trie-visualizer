import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Observable} from 'rxjs';

import { SEARCH } from '../../action-types';
import Styles from './search.css';

class Search extends Component {
    constructor(props) {
        super(props);

        this.__input$ = null;
        this.__lensUse = Search.getUseString('lens');
        this.__crossUse = Search.getUseString('cross');
        this.onCrossClick = this.onCrossClick.bind(this);

        this.state = {
            empty: true
        }
    }

    componentDidMount() {
        this.__input$ = Observable.fromEvent(this.searchInput, 'input');
        this.__input$
            .debounceTime(100)
            .subscribe(() => {
                this.setState({
                    empty: this.searchInput.value === ""
                });
                this.props.onTextSet(this.searchInput.value);
            });
    }

    onCrossClick() {
        this.searchInput.value = "";
        this.searchInput.dispatchEvent(new Event('input'));
    }

    render() {
        let icon = this.state.empty
            ? <svg height="24" width="24" className={Styles.icon}
                        dangerouslySetInnerHTML={{__html:  this.__lensUse}}></svg>
            : <svg height="24" width="24" className={`${Styles.icon} ${Styles.cross}`}
                   dangerouslySetInnerHTML={{__html: this.__crossUse}} onClick={this.onCrossClick}></svg>

        return (
            <div className={Styles.container}>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{display:'none'}}>
                    <defs>
                        <symbol id="lens" viewBox="0 0 100 100">
                            <circle r="30" cx="60" cy="40" stroke="inherit" fill="white" strokeWidth="14"/>
                            <line x1="5" y1="95" x2="35" y2="65" stroke="inherit" strokeWidth="14" strokeLinecap="round"/>
                        </symbol>
                        <symbol id="cross" viewBox="0 0 100 100">
                            <line x1="15" y1="15" x2="85" y2="85" stroke="inherit" strokeWidth="14" strokeLinecap="round"></line>
                            <line x1="85" y1="15" x2="15" y2="85" stroke="inherit" strokeWidth="14" strokeLinecap="round"></line>
                        </symbol>
                    </defs>
                </svg>

                <input className={Styles.input} type="text" placeholder="Fuzzy search" ref={input => this.searchInput = input}/>

                {icon}

            </div>
        );
    }

    static getUseString(id) {
        return `<use stroke="#4390bc" xlink:href="#${id}"></use>`;
    }
}

export default connect(
    state => state,
    dispatch => ({
        onTextSet: (text) => {
            dispatch({
                type: SEARCH,
                payload: text
            });
        }
    })
)(Search);
