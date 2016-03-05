import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import DraggableLine from './draggable-line';

export default class LineEquation extends Component {
  componentDidMount() {
    const draggableLine = new DraggableLine();

    const el = this.refs.equationOfALine;

    draggableLine.render(el);
  }

  render() {
    return (
      <div ref="equationOfALine" className="equation-of-a-line"></div>
    );
  }
};
