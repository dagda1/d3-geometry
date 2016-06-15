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
      <div className="row">
        <div className="row">
          <div ref="equationOfALine" className="equation-of-a-line col-lg-6 col-md-6 col-xs-8"/>
        </div>
      </div>
    );
  }
};
