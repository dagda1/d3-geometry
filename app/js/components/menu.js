import React, {Component} from 'react';

export default class Menu extends Component {
  render() {
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
              <li className="active">
                <a href="#">Home</a>
              </li>
              <li className="dropdown">
                <a tabIndex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">Geometry<span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                  <li className="dropdown-submenu">
                    <a tabIndex="0">Triangles</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
    );
  }
};
