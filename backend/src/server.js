require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();

const server = http.Server(app);
const io = socketio(server);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

io.on('connection', socket => {
  socket.on('connectRoom', box => {
    socket.join(box);
  });
});

app.use((req, res, next) => {
  req.io = io;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));
app.use(routes);
server.listen(3333);