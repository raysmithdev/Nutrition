var
  express = require('express'),
  apiRouter = express.Router(),
  request = require('request')


// post route to the Nutritionix API to retrieve nutionion info based upon what the user searches for
apiRouter.post('/api', function(req, res) {
  var body = {
    appId:"af369652",
    appKey:"42996dc2c5319ecc938c62dc43a590a8",
    query: req.body.query,
    results: 5,
    fields:["item_name","brand_name","nf_serving_size_qty", "nf_serving_size_unit", "nf_calories", "nf_protein", "nf_total_fat", "nf_total_carbohydrate", "images_front_full_url"],
    sort:{
      field:"_score",
      order:"desc"
    },
    filters:{
      item_type:2
    }
  }
  request({
    method: 'POST',
    json: true,
    url: "https://api.nutritionix.com/v1_1/search/",
    body: body
  }, function(err, response, body){
    if (err) return console.log(err);
    res.json(body)
  })
})

module.exports = apiRouter