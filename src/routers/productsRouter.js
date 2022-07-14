const express = require('express');
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectID } = require('mongodb');

const productsRouter = express.Router();

productsRouter.route('/').get((req, res) => {
    const url =
    'mongodb+srv://admin:admin@myonlinestore.6pt7m8a.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'TheOnlineStore';

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug('Connected to the mongo DB');

      const db = client.db(dbName);

      const products = await db.collection('products').find().toArray();

      res.render('products', { products });
    } catch (error) {
      console.log(error.stack);
    }
    if(client)
    {client.close();}
  })();
});

productsRouter.route('/:id').get((req, res) => {
  const id = req.params.id;
  const url =
    'mongodb+srv://admin:admin@myonlinestore.6pt7m8a.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'TheOnlineStore';

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug('Connected to the mongo DB');

      const db = client.db(dbName);

      const product = await db
        .collection('products')
        .findOne({ _id: new ObjectID(id) });

      res.render('product', {
        product,
      });
    } catch (error) {
      console.log(error.stack);
    }
    if(client)
    {client.close();}
  })();
});

productsRouter.route('/category/:category').get((req, res) => {
    const category = req.params.category;
    const url =
    'mongodb+srv://admin:admin@myonlinestore.6pt7m8a.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'TheOnlineStore';

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      console.log('Connected to the mongo DB from cat');

      const db = client.db(dbName);

      const products = await db
        .collection('products')
        .find({ category: category }).toArray();

      res.render('products', { products, category });
    } catch (error) {
      console.log(error.stack);
    }
    if(client)
    {client.close();}
  })();
});

module.exports = productsRouter;
