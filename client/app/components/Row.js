import React, { PropTypes } from 'react';
import classNames from 'classNames';

const Row = ({ classes, children }) => {
  classes.unshift('row');

  return (
    <div classNames={classNames(...classes)}>
      {children}
    </div>
  )
};

Row.propTypes = {
  classes: PropTypes.arrayOf(PropTypes.any),
  children: PropTypes.node.isRequired
};

Row.defaultProps = {
  classes: []
};

export default Row;
