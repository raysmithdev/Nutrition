const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../public/javascripts/server');

const should = chai.should();

chai.use(chaiHttp);

describe('Hello Nutrition', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  it('should list items on GET', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        });
      });
  });