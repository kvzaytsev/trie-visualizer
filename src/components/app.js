import React, {Component} from 'react';
import {connect} from 'react-redux';

import Trie from './trie/trie.js';
import Search from './search';
import SourceText from './source-text';

class Application extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app-root">
                <div className="app-header">
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
