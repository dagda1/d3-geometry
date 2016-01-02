import React, {Component} from 'react';

import Triangulator from './triangulator';


export default class Triangles extends Component {
  componentDidMount() {
    const triangulator = new Triangulator();

    const el = this.refs.triangleContainer;

    triangulator.render(el);
  }

  render() {
    return (
        <div ref="triangleContainer" className="triangle-container"></div>
    );
  }
};
