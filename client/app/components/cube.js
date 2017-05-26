import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';

require("../styles/cube.scss");

export default () => {
  return (
    <Grid>
      <Row>
        <Col sm={12}>
          <div className="cube-parent">
            <ul className="cube">
              <li className="face"/>
              <li className="face"/>
              <li className="face"/>
              <li className="face"/>
              <li className="face"/>
              <li className="face"/>
            </ul>
          </div>
        </Col>
      </Row>
    </Grid>
  )
}
