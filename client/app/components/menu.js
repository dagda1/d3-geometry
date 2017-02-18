import React, {Component} from 'react';
import { pushPath } from 'redux-simple-router';
import { Link } from 'react-router';

export default class Menu extends Component {
  render() {
    return (
      <nav role="navigation" className="nav-custom navbar navbar-inverse navbar-static-top">
        <div className="navbar-header">
          <button type="button" data-target="#navbarCollapse" data-toggle="collapse" className="navbar-toggle">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a href="#" className="navbar-brand"><strong>Paul Cowan Hackery</strong></a>
        </div>
        <div id="navbarCollapse" className="collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <li className={this.props.location === '/' ? 'active' : ''}>
              <Link to="/">Home</Link>
            </li>
            <li className={['/sine', '/sine2', '/Triangles', '/equation-of-a-line'].indexOf(this.props.location) > -1 ? 'dropdown active' : 'dropdown'}>
              <a tabIndex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">Geometry<span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li className="dropdown-submenu">
                  <Link to="/sine">Sine Wave</Link>
                  <Link to="/sine2">Yet Another Sine</Link>
                  <Link to="/equation-of-a-line">Equation of a Line</Link>
                  <Link to="/triangles">Triangles</Link>
                </li>
              </ul>
            </li>
            <li className={['/functions'].indexOf(this.props.location) > -1 ? 'dropdown active' : 'dropdown'}>
              <a tabIndex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">Calculus<span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li className="dropdown-submenu">
                  <Link to="/functions">Functions</Link>
                </li>
              </ul>
            </li>
            <li className={['/cube', '/pyramid', '/hexagon'].indexOf(this.props.location) > -1 ? 'dropdown active' : 'dropdown'}>
              <a tabIndex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">3d<span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li className="dropdown-submenu">
                  <Link to="/cube">Cube</Link>
                  <Link to="/pyramid">Pyramid</Link>
                  <Link to="/hexagon">Hexagon</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
};
