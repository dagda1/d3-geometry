import React, {Component} from 'react';
import * as X from './index';

import DraggableLine from './draggable-line';

export default class LineEquation extends Component {
  componentDidMount() {
    const draggableLine = new DraggableLine();

    draggableLine.render(this.equationOfALine);
  }

  render() {
    return (
      <X.Grid>
        <X.Row>
          <X.Col sm={12} className="equation-of-a-line">
            <div  ref={el => this.equationOfALine = el}/>
          </X.Col>
        </X.Row>
      </X.Grid>
    );
  }
};
