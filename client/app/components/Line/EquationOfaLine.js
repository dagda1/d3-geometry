import React, {Component} from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import DraggableLine from './DraggableLine';

export default class LineEquation extends Component {
  componentDidMount() {
    const draggableLine = new DraggableLine();

    draggableLine.render(this.equationOfALine);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col lg={7} md={7} xs={8} className="equation-of-a-line">
            <div  ref={el => this.equationOfALine = el}/>
          </Col>
        </Row>
      </Grid>
    );
  }
};
