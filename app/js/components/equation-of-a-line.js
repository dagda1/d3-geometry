import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import DraggableLine from './draggable-line';

export default class LineEquation extends Component {
  componentDidMount() {
    const draggableLine = new DraggableLine();

    const el = document.querySelector('.equation-of-a-line');

    draggableLine.render(el);
  }

  render() {
    return (
      <div className="equation-of-a-line"></div>
    );
  }
};
