import React, {Component} from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Triangulator from '../Triangles/Trianglulator';
import RadioButtonGroup from '../radio-button-group/radio-button-group';
import { setTriangleMode } from '../../actions/triangle-actions';
import { connect } from 'react-redux';

@connect((state) => {
  return {
    mode: state.triangles.mode
  }
}, {
  setTriangleMode
})
export default class Triangles extends Component {
  constructor() {
    super(...arguments);

    this.triangulator = new Triangulator();
  }

  componentDidMount() {
    const el = this.triangleContainer;

    this.triangulator.render(el, {
      currentEffect: this.props.mode
    });
  }

  componentDidUpdate() {
    this.triangulator.changeEffect(this.props.mode);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <RadioButtonGroup
                values={['Perpendicular Bisectors', 'Medians', 'Altitudes']}
                selected={this.props.mode}
                onChange={this.props.setTriangleMode}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div ref={el => this.triangleContainer = el} className="triangle-container"></div>
          </Col>
        </Row>
      </Grid>
    );
  }
};
