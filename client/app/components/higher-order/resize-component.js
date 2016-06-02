import React, { Component } from 'react';

export var ResizeComponent = ComposedComponent  => class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      registerReize: this.registerReize
    };
  }

  registerReize() {
    this.createDocument();

    this.resizeFunc = _.debounce(this.resize.bind(this), 200);

    window.addEventListener("resize", this.resizeFunc);
  }

  unregisterResize() {
    window.removeEventListener("resize", this.resizeFunc);

    d3.select('.svg-container').remove();
  }

  render() {
    return <ComposedComponent {...this.props}/>;
  }
};
