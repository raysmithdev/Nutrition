const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const should = chai.should();

chai.use(chaiHttp);


describe('Nutrition Nut', function() {

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
        res.should.be.json;
        res.body.should.be.a('array');

        // because we create three items on app load
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['id', 'name', 'ingredients'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should add an item on POST', function() {
    const newRecipe = {
        name: 'affogato', ingredients: ['coffee beans', 'vanilla ice cream', 'milk']};
    return chai.request(app)
      .post('/')
      .send(newRecipe)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'ingredients');
        // confused here (lines 49-51)
        res.body.name.should.equal(newRecipe.name);
        res.body.ingredients.should.be.a('array');
        res.body.ingredients.should.include.members(newRecipe.ingredients);
      });
  });
  
  it('should update items on PUT', function() {
    const updateData = {
      name: 'foo',
      ingredients: ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']
    };

    return chai.request(app)
      .get('/')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/nutrition/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'ingredients');
        res.body.name.should.equal(updateData.name);
        res.body.id.should.equal(updateData.id);
        res.body.ingredients.should.include.members(updateData.ingredients);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/')
      .then(function(res) {
        return chai.request(app)
          .delete(`/nutrition/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});