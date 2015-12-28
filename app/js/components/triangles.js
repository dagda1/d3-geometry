import React, {Component} from 'react';

import Triangulator from './triangulator';


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
