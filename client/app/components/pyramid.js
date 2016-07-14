import React, { Component } from 'react';
import ReactDOM from 'react-dom';

require("../styles/pyramid.scss");

export default class Pyramid extends Component {
  render(el, props) {
    return (
      <div className="row">
        <div className="row">
          <div className="pyramid-container col-lg-1 col-md-4 col-xs-4 col-md-offset-5 col-xs-offset-5">
            <div id="pyramid">
              <div className="base"></div>
              <div className="front"></div>
              <div className="back"></div>
              <div className="right"></div>
              <div className="left"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
