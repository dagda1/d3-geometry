import React, { Component } from 'react';
import ReactDOM from 'react-dom';

require("../styles/hexagon.scss");

export default class Hexagon extends Component {
  render(el, props) {
    return (
      <div className="row">
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
      </div>
    );
  }
};
