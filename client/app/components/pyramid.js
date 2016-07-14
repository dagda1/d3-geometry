import React, { Component } from 'react';
import ReactDOM from 'react-dom';

require("../styles/pyramid.scss");

export default class Pyramid extends Component {
  render(el, props) {
    return (
      <div className="row">
        <div className="row">
          <div className="pyramid-container text-center">
            <div id="pyramid">
              <div className="base"></div>
              <div className="front"></div>
              <div className="left"></div>
              <div className="right"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
