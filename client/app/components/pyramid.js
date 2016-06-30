import React, { Component } from 'react';
import ReactDOM from 'react-dom';

require("../styles/pyramid.scss");

export default class Pyramid extends Component {
  render(el, props) {
    return (
      <div className="row">
        <div className="row">
          <div className="pyramid-parent">
            <div className="triangle"></div>
          </div>
        </div>
      </div>
    );
  }
};
