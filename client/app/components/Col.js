import React, {Component, PropTypes} from 'react';
import elementType from 'react-prop-types/lib/elementType';
import { chain, isEmpty } from 'lodash';
import classNames from 'classnames';

const Col = ({ componentClass: Component, className, children, ...props }) => {
  console.log(props);
  const classes = chain(Object.keys(props))
    .pickBy(key => /^(xs|sm|md|lg)/.test(key))
    .map(key => `col-${key.replace( /([A-Z])/g, "-$1").toLowerCase()}-${props[key]}`)
    .value();

  return (
    <Component className={classNames(className, classes)}>
      {children}
    </Component>
  );
}

Col.defaultProps = {
  componentClass: 'div'
}

Col.propTypes = {
  className: PropTypes.string,
  componentClass: elementType,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xsHidden: PropTypes.bool,
  smHidden: PropTypes.bool,
  mdHidden: PropTypes.bool,
  lgHidden: PropTypes.bool,
  xsOffset: PropTypes.number,
  smOffset: PropTypes.number,
  mdOffset: PropTypes.number,
  lgOffset: PropTypes.number,
  xsPush: PropTypes.number,
  smPush: PropTypes.number,
  mdPush: PropTypes.number,
  lgPush: PropTypes.number,
  xsPull: PropTypes.number,
  smPull: PropTypes.number,
  mdPull: PropTypes.number,
  lgPull: PropTypes.number
}

export default Col;
