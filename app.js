const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const User = require('./models/users');

const app = express();

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});


app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});