const path = require('path');

const rootdir = require('./util/path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));


app.listen(4000);