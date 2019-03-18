const getPlayerRanking = (db) => (req, res) => {
   db('score')
   .join('player', 'score.player_id', '=', 'player.id')
   .select('player.name', 'score.score')
   .orderBy('score.score', 'desc')
   .then((data) => res.status(200).json(data))
   .catch(err => console.log(err));
}

module.exports = {
   getPlayerRanking
}