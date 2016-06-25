import React, { Component } from 'react';
import ReactDOM from 'react-dom';

require("../styles/cube.scss");

export default class Cube extends Component {
  render(el, props) {
    return (
      <div className="row">
        <div className="row">
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
        </div>
      </div>
    );
  }
};
