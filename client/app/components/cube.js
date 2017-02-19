import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as X from './index';

require("../styles/cube.scss");

export default () => {
  return (
    <X.Grid>
      <X.Row>
        <X.Col sm={12}>
          <div className="cube-parent">
            <ul className="cube">
              <li className="face"/>
              <li className="face"/>
              <li className="face"/>
              <li className="face"/>
              <li className="face"/>
              <li className="face"/>
            </ul>
          </div>
        </X.Col>
      </X.Row>
    </X.Grid>
  )
}
