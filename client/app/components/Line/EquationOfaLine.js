import React, {Component} from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import DraggableLine from './DraggableLine';
import './_EquationOfALine.scss';

export default class LineEquation extends Component {
  componentDidMount() {
    const draggableLine = new DraggableLine();

    draggableLine.render(this.equationOfALine);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div className="equation-of-a-line" ref={el => this.equationOfALine = el}/>
          </Col>
        </Row>
      </Grid>
    );
  }
};
