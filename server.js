const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const player = require('./controllers/player');
const score = require('./controllers/score');
const ranking = require('./controllers/ranking');
const contraband = require('./controllers/contraband');

const db = knex({
   client: 'pg',
   connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true
   }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
   return res.send('Working just fine');
});

app.get('/ranking', ranking.getPlayerRanking(db));
app.get('/contraband', contraband.getContrabands(db));

app.post('/score', score.calculateScore(db));

app.post('/player', player.addPlayer(db));
app.delete('/player', player.deletePlayer(db));


app.listen(process.env.PORT || 3001, () => {
   console.log(`I can hear you at port ${process.env.PORT}`);
});