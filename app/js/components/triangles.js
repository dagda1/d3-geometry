import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Menu from './menu';
import Triangulator from './triangulator.js';


export default class Triangles extends Component {
  componentDidMount() {
    this.triangulator = new Triangulator();

    // FIXME: use refs?
    const el = ReactDOM.findDOMNode(this);

    this.triangulator.render(el);
  }

  render() {
    return (
        <div className="triangle-container"></div>
    );
  }
};
