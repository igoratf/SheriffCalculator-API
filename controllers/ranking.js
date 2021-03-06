const getPlayerRanking = (db) => (req, res) => {
   db('score')
   .join('player', 'score.player_id', '=', 'player.id')
   .select('player.name', 'score.score')
   .orderBy('score.score', 'desc')
   .limit(100)
   .then((data) => res.status(200).json(data))
   .catch(err => res.status(400).json('unable to get ranking'));
}

module.exports = {
   getPlayerRanking
}