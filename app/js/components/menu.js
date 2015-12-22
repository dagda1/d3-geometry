import React, {Component} from 'react';
import { pushPath } from 'redux-simple-router';
import { Link } from 'react-router';

export default class Menu extends Component {
  render() {
    console.log(this.props);
    return (
        <nav role="navigation" className="navbar navbar-default">
          <div className="navbar-header">
            <button type="button" data-target="#navbarCollapse" data-toggle="collapse" className="navbar-toggle">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a href="#" className="navbar-brand">D3.js and React.js</a>
          </div>
          <div id="navbarCollapse" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li className={this.props.location === '/' ? 'active' : ''}>
                <Link to="/">Home</Link>
              </li>
              <li className={['/triangles'].indexOf(this.props.location) > -1 ? 'dropdown active' : 'dropdown'}>
                <a tabIndex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">Geometry<span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                  <li className="dropdown-submenu">
                    <Link to="/triangles">Triangles</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
    );
  }
};
