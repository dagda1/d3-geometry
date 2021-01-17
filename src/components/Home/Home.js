import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

export default class Home extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h1>Home</h1>
          </Col>
        </Row>
      </Grid>
    );
  }
}
