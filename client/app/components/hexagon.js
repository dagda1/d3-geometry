import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as X from './index';

require("../styles/hexagon.scss");

export default () => {
  return (
    <X.Grid>
      <X.Row>
        <X.Col sm={12}>
          <div className="row">
            <div className="hexagon-container">
              <div>
                <div className="hexagon-wrapper front">
                  <div className="hexagon"></div>
                </div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="hexagon-wrapper back">
                  <div className="hexagon"></div>
                </div>
              </div>
            </div>
          </div>
        </X.Col>
      </X.Row>
    </X.Grid>
  );
}
