const express = require('express');
const morgan = require('morgan');

const campsiteRouter = require('./routes/campsiteRouter');
const partnersRouter = require('./routes/partnersRouter');
const promotionsRouter = require('./routes/promotionsRouter');

const PORT = process.env.PORT || 3000;

const app = express();

//Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use('/campsites', campsiteRouter);
app.use('/partners', partnersRouter);
app.use('/promotions', promotionsRouter);

app.use(express.static(__dirname + '/public'));

app.use((req, res) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
