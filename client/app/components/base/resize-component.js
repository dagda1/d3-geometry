import React, { Component } from 'react';
import { debounce } from 'lodash';
import { select } from 'd3-selection';

export var ResizeComponent = ComposedComponent  => class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      registerReize: this.registerReize
    };
  }

  registerReize() {
    this.createDocument();

    this.resizeFunc = debounce(this.resize.bind(this), 200);

    window.addEventListener("resize", this.resizeFunc);
  }

  unregisterResize() {
    window.removeEventListener("resize", this.resizeFunc);

    select('.svg-container').remove();
  }

  render() {
    return <ComposedComponent {...this.props}/>;
  }
};
