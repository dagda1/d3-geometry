import React, { PropTypes } from 'react';

const Container = ({ children }) =>
  <div className="container-fluid">
    {children}
  </div>

Container.propTypes = {
  children: PropTypes.node.isRequired
}

export default Container;