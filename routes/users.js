var
express = require('express'),
passport = require('passport'),
User = require('../models/User.js'),
userRouter = express.Router(),
date = new Date

userRouter.route('/login')
.get(function(req, res){
  res.render('login', {flash: req.flash('loginMessage')})
})
.post(passport.authenticate('local-login',{
  successRedirect: '/main',
  failureRedirect: '/login'
}))

userRouter.route('/signup')
.get(function(req, res){
  res.render('signup', {flash: req.flash('signupMessage')})
})
.post(passport.authenticate('local-signup',{
  successRedirect: '/main',
  failureRedirect: '/signup'
}))

// Load users profile page
userRouter.get('/profile', isLoggedIn, function(req, res){
  console.log("Inside of profile");
  console.log(req.query);
  res.render('profile', {user: req.user, strategy: req.query.strategy})
})

// find a single user
userRouter.get('/user/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('update', {user: user})
  })
})

// Edit a user's profile
userRouter.patch('/user/:id', function (req, res){
  console.log(req.body);
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, user){
    if(err) console.log(err)
    res.redirect('/profile')
  })
})

// Delete a User
userRouter.get('/user/:id/delete', function(req, res){
  req.logout()
  User.findByIdAndRemove(req.params.id, function(err, item){
    if (err) throw err;
    res.redirect("/")
  })
})

// Logout
userRouter.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

// Route for the main page of the app
userRouter.get('/main', isLoggedIn, function(req, res){
  res.render('main_page.ejs', {user: req.user, date: date})
})

// Post food to a user's account
userRouter.route('/user/:id/food')
.post(function(req, res){
  User.findById(req.params.id, function(err, user){
    if (err) {
      console.log("inside of post food");
      return console.log(err)
    };
    console.log(req.body.meal);
    user.food.push(req.body)
    user.save(function(err){
      if (err) return console.log(err);
      res.json({sucess: true, user: user})
    })
  })
})
.get(function(req, res){
  User.findById(req.params.id, function(err, user) {
    if (err) return console.log(err);
    // console.log(user.food);
    res.json(user)
  })
})

// Delete food from a user
userRouter.route('/user/:id/food/:foodId')
.delete(function(req, res){
  User.findById(req.params.id, function(err, user){
    if (err) return console.log(err);
    if (user.food.id(req.params.foodId)) {
      var item = user.food.id(req.params.foodId);
      item.remove()
      user.save(function(err){
        if (err) return console.log(err);
      })
      res.json({message: 'deleted item successfully', user: user})
    }
  })
})

// Google authorization
userRouter.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))
userRouter.get('/auth/google/callback',
passport.authenticate('google', {
  successRedirect: '/main?strategy=google',
  failureRedirect: '/fail'
}));

// Function to check if a user is logged in, and if false, redirects to the main page
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  res.redirect('/')
}

module.exports = userRouter