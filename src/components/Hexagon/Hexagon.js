import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import './_Hexagon.scss';

export default () => {
  return (
    <Grid>
      <Row>
        <Col sm={12}>
          <div className="row">
            <div className="hexagon-container">
              <div>
                <div className="hexagon-wrapper front">
                  <div className="hexagon"></div>
                </div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="hexagon-wrapper back">
                  <div className="hexagon"></div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Grid>
  );
}
