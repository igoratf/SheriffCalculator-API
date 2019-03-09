const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const app = express();

app.use(bodyParser.json());
// app.use(cors());

app.get('/', (req, res) => {
   return res.send('Working just fine');
})



app.listen(process.env.PORT || 3000, () => {
   console.log(`I can hear you at port ${process.env.PORT}`);
});