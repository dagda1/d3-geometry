import React, {Component} from 'react';

import Menu from './menu';

export default class App extends Component {
  render() {
    return (
      <div>
        <Menu location={this.props.location.pathname}/>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
};
