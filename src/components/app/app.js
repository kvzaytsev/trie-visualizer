import React, {Component} from 'react';
import {connect} from 'react-redux';

import Trie from '../trie/trie.js';
import Search from '../search/search';
import SourceText from '../source-text/source-text';

import Styles from './app.css';

class Application extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={Styles.root}>
                <div className={Styles.header}>
                    <SourceText />
                    <Search />
                </div>
                <Trie/>
            </div>
        );
    }
}

export default connect(
    state => state
)(Application);
