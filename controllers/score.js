const calculateScore = (db) => (req, res) => {

   const { players_id } = req.body;

   console.log(req.body);
   console.log(players_id);

   db.select('quantity', 'value', 'name')
   .from('resource')
   .whereIn('player_id', players_id)
   .union(function() {
      this.select('quantity', 'value', 'name')
      .from('contraband')
      .whereIn('player_id', players_id)
      .then((res) => {
         console.log('teste', res);
      })
   })
   .then((res) => {
      console.log(res);
      let resources = res;
      console.log(resources.reduce((score, resource) => {
         return score + (resource.quantity * resource.value);
      }, 0));
   })
}


module.exports = {
   calculateScore
}