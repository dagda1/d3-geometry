import React, { PropTypes } from 'react';
import RadioButton from './radio-button';

require('./radio-button-group.scss');

const RadioButtonGroup = ({ values, selected, onChange }) => {
  return (
    <div className="input-group">
    	<div className="btn-group">
        {values.map((value, index) => {
           return <RadioButton value={value} key={index} selected={selected === value} onChange={onChange}/>
         })}
    	</div>
    </div>
  );
}

RadioButtonGroup.propTypes = {
  values: PropTypes.array.isRequired,
  selected: PropTypes.any,
  onClick: PropTypes.func
}

export default RadioButtonGroup;
