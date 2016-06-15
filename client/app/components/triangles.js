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
        <div className="row">
          <div className="row">
            <div ref="triangleContainer" className="triangle-container col-lg-6 col-md-6 col-xs-8"></div>
          </div>
        </div>
    );
  }
};
