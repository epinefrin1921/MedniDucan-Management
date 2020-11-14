if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');


const storeRoutes = require('./routes/stores')
const userRoutes = require('./routes/users')
const orderRoutes = require('./routes/orders')
const productRoutes = require('./routes/products')




app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


mongoose.connect('mongodb://localhost:27017/medniDucan', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log("Connected to DB succesfully!");
}).catch(err => {
  console.log("Error occured when connecting to DB");
  console.log(err);
});

app.use('/stores', storeRoutes);
app.use('/products', productRoutes);
// app.use('/users', userRoutes);
app.use('/orders', orderRoutes);


app.get("/", function (req, res) {
  res.render('home.ejs');
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`)
})