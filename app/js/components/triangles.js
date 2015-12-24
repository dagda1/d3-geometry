import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Menu from './menu';
import Triangulator from './triangulator.js';


export default class Triangles extends Component {
  componentDidMount() {
    const triangulator = new Triangulator();

    // FIXME: use refs?
    const el = document.querySelector('.triangle-container');

    triangulator.render(el);
  }

  render() {
    return (
        <div className="triangle-container"></div>
    );
  }
};
