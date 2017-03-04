import React, {Component} from 'react';
import { pushPath } from 'redux-simple-router';
import { Link } from 'react-router';
import NavLink from './NavLink';
import NavDropdownLink from './NavDropdownLink';
import * as X from './index';

const Nav = (props) => {
  return (
    <X.Grid>
      <X.Row>
        <nav role="navigation" className="nav-custom navbar navbar-inverse navbar-static-top">
          <div className="navbar-header">
            <button type="button" data-target="#navbarCollapse" data-toggle="collapse" className="navbar-toggle">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="/" className="navbar-brand">
              <strong>Paul Cowan Hackery</strong>
            </Link>
          </div>
          <div id="navbarCollapse" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <NavLink to="/">Home</NavLink>
              <NavDropdownLink>
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
              </NavDropdownLink>
              <NavDropdownLink>
                <a tabIndex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">Calculus<span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                  <li className="dropdown-submenu">
                    <Link to="/functions">Functions</Link>
                  </li>
                </ul>
              </NavDropdownLink>
              <NavDropdownLink>
                <a tabIndex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">3d<span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                  <li className="dropdown-submenu">
                    <Link to="/cube">Cube</Link>
                    <Link to="/pyramid">Pyramid</Link>
                    <Link to="/hexagon">Hexagon</Link>
                  </li>
                </ul>
              </NavDropdownLink>
            </ul>
          </div>
        </nav>
      </X.Row>
    </X.Grid>
  );
}

export default Nav;