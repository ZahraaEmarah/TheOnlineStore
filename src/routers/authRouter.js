const express = require('express');
const debug = require('debug')('app:authRouter');
const { MongoClient, ObjectID } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

authRouter.route('/signUp').post((req, res) => {
  const { username, password } = req.body;
  const url =
    'mongodb+srv://admin:admin@myonlinestore.6pt7m8a.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'TheOnlineStore';

  (async function addUser() {
    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);
      const user = { username, password };
      const results = await db.collection('users').insertOne(user);
      console.log(results);
      req.login(results['insertedId'], () => {
        res.redirect('/auth/profile');
      });
    } catch (error) {
      console.log(error);
    }
    client.close();
  })();
});

authRouter
  .route('/signIn')
  .get((req, res) => {
    res.render('signin');
  })
  .post(
    passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    })
  );
authRouter.route('/profile').get((req, res) => {
  console.log(req)
  res.json(req.user);
});

module.exports = authRouter;
