import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

const NavLink = ({ to, classes = '', children }, context) => {
  const isActive = context.router.isActive(to, true);

  const linkClasses = classNames({
    active: isActive
  }) + ` ${classes}`.trim();

  return (
    <li className={linkClasses}>
      <Link to={to}>
        {children}
      </Link>
    </li>
  );
};

NavLink.propTypes = {
  to: PropTypes.string,
  classes: PropTypes.string,
  children: PropTypes.node
};

NavLink.contextTypes = {
  router: PropTypes.object
};

export default NavLink;
