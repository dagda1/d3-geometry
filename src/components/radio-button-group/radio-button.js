import React, { PropTypes } from 'react';
import classNames from 'classnames';

const RadioButton = ({ value, selected, onChange }) => {
  const activeClasses = classNames({
    active: selected,
    notActive: !selected
  });

  const classes = `btn btn-primary btn-sm ${activeClasses}`;

  return (
    <a className={classes} onClick={onChange.bind(null, value)}>{value}</a>
  );
};

RadioButton.propTypes = {
  value: PropTypes.string,
  selected: PropTypes.bool
}

export default RadioButton;