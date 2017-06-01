import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { some } from 'lodash';

const NavDropdownLink = ({ children }, context) => {
  const findAllLinkComponents = (kids, acc) => {
    if(!React.isValidElement) {
      return;
    }

    React.Children.forEach(kids, (child) => {
      if(child.props && child.props.to) {
        acc.push(child.props.to);
      }
      if(child.props && child.props.children) {
        findAllLinkComponents(child.props.children, acc);
      }
    });
  };

  const links = [];

  findAllLinkComponents(children, links);

  const isActive = some(links, (link) => {
    return context.router.isActive(link, true);
  });

  const linkClasses = classNames({
    dropdown: true,
    active: isActive
  });

  return (
    <li className={linkClasses}>
      {children}
    </li>
  );
};

NavDropdownLink.propTypes = {
  children: PropTypes.node
};

NavDropdownLink.contextTypes = {
  router: PropTypes.object
};


export default NavDropdownLink;
