import React, {Component} from 'react';
import {connect} from 'react-redux';

import Trie from './trie/trie.js';
import Search from './search';

class Application extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app-root">
                <Trie/>
                <Search />
            </div>
        );
    }
}

export default connect(
    state => state
)(Application);
