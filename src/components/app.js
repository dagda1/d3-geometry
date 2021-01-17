import React, {Component} from 'react';

import Nav from './Nav/Nav';

export default class App extends Component {
  render() {
    return (
   <div>
     <div className="nav-container">
       <Nav location={this.props.location.pathname}/>
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
};
