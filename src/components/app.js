import React, {Component} from 'react';
import {connect} from 'react-redux';

import Trie from './trie';

class Application extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Trie/>
        );
    }
}

export default connect(
    state => state
)(Application);
