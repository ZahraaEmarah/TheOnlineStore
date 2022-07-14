const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { MongoClient, ObjectID } = require('mongodb');

const PORT = process.env.PORT || 3000;
const app = express();
const productsRouter = require('./src/routers/productsRouter');
const adminRouter = require('./src/routers/adminRouter');
const authRouter = require('./src/routers/authRouter');

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'globomantics' }));

require('./src/config/passport.js')(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/products', productsRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    const url =
    'mongodb+srv://admin:admin@myonlinestore.6pt7m8a.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'TheOnlineStore';

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug('Connected to the mongo DB');

      const db = client.db(dbName);

      const categories = await db.collection('categories').find().toArray();

      res.render('home', { categories });
    } catch (error) {
      console.log(error.stack);
    }
    if(client)
    {client.close();}
  })();
});

app.listen(PORT, () => {
  debug(`listening on port ${chalk.green(PORT)}`);
});
