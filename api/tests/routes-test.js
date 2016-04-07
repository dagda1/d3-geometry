'use strict';

const should = require('should');
const app = require('../server');
const request = require('supertest').agent(app.listen());

const co = require('co');

describe("Managers", function() {
  it("it should get managers", function(done) {
    request.get("/api/managers")
    .accept('json')
    .expect(200)
      .end(function(err, res) {
        if(err) {
          return done(err);
        }

        should.exist(res.body);

        res.body.length.should.equal(2);

        done();
      });
  });
});
