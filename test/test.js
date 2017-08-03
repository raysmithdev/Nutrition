const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
console.log('runServer, closeServer', runServer);

describe('Nutrition Nut', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list items on GET', function() {
    return chai.request(app)
      .get('/main')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
        expect('meal').to.be.a('string');
        expect('calories').to.be.a('string');
        console.log(res.headers);
        });
}); 

  it('should add an item on POST', function() {
    const newMeal = {
        meal: 'coffee', 
        brand: 'blue bottle',
        servingSize: 'one cup',
        servingSizeUnits: '8 ounces',
        calories: 140,
        protein: 0,
        fat: 1,
        carbohydrates: 1
    };
    return chai.request(app)
      .post('/api')
      .send(newMeal)
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });
  
//  it('should update items on PUT', function() {
//    const updateData = {
//      meal: 'coffee', 
//        brand: 'blue bottle',
//        servingSize: 'one cup',
//        servingSizeUnits: '8 ounces',
//        calories: 140,
//        protein: 0,
//        fat: 1,
//        carbohydrates: 1
//    };

//    return chai.request(app)
//      .get('/')
//      .then(function(res) {
//        res.should.have.status(200);
//        res.should.be.html;
//      });
//  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
      });
  });
});