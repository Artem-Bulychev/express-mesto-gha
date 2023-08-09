const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const ErrorHand = require('./middlewares/ErrorHand');
const { errors } = require('celebrate');

const app = express();

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(routes);
app.use(errors());
app.use(ErrorHand);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})