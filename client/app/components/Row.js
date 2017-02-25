import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Row = ({ className, children }) => {
  return (
    <div className={classNames('row', className)}>
      {children}
    </div>
  )
};

Row.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Row.defaultProps = {
  classes: []
};

export default Row;
