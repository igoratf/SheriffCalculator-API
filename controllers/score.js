const calculateScore = (db) => (req, res) => {

   const { players_id } = req.body;

   console.log(req.body);
   console.log(players_id);

   db.select('quantity', 'value', 'name', 'player_id')
   .from('resource')
   .whereIn('player_id', players_id)
   .union(function() {
      this.select('quantity', 'value', 'name', 'player_id')
      .from('contraband')
      .whereIn('player_id', players_id)
      .then((res) => {
         // console.log('teste', res);
      })
   })
   .then((res) => {
      let test = res.sort((a,b) => a.player_id > b.player_id ? 1 : -1)
      console.log(test)
      let resources = res;
      console.log(resources.reduce((score, resource) => {
         return score + (resource.quantity * resource.value);
      }, 0));
   })
}


module.exports = {
   calculateScore
}