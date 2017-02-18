import React, {Component} from 'react';

import Nav from './Nav';

export default class App extends Component {
  render() {
    return (
      <div>
        <Nav location={this.props.location.pathname}/>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
};
