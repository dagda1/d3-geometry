import React, {Component} from 'react';
import * as X from './index';
import Triangulator from './triangulator';


export default class Triangles extends Component {
  componentDidMount() {
    const triangulator = new Triangulator();

    const el = this.triangleContainer;

    triangulator.render(el);
  }

  render() {
    return (
      <X.Grid>
        <X.Row>
          <X.Col lg={6} md={6} xs={8}>
            <div ref={el => this.triangleContainer = el} className="triangle-container"></div>
          </X.Col>
        </X.Row>
      </X.Grid>
    );
  }
};
