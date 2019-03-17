const { resourceKingEnum, resourceQueenEnum }  = require('../enum/resource_enum');


const calculateScore = (db) => (req, res) => {

   const { players_id } = req.body;

   console.log(req.body);
   console.log(players_id);

   db.select('quantity', 'value', 'name', 'player_id')
      .from('resource')
      .whereIn('player_id', players_id)
      .union(function () {
         this.select('quantity', 'value', 'name', 'player_id')
            .from('contraband')
            .whereIn('player_id', players_id)
            .orderBy('player_id')
            .then((res) => {
               // console.log('teste', res);
            })
      })
      .then((res) => {
         console.log(res);
         let response = res;
         let score = {};
         let copy = response.map(resource => {
            if (score[resource.player_id]) {
               score[resource.player_id] += resource.quantity * resource.value;
            } else {
               score[resource.player_id] = resource.quantity * resource.value;
            }
         })

         console.log(score);
         // console.log(res.reduce((score, resource) => {
         //    return score + (resource.quantity * resource.value);
         // }, 0));
         
         let bonusScore = {'kings': [], 'queens': []}

         let kingsAndQueens = calculateKingAndQueen(db, players_id, ['apple', 'bread', 'cheese', 'chicken']);


      })
}

const calculateKingAndQueen = (db, players_id, resources) => {
   

   let extraScore = {'kings': [], 'queens': []}

   let result = [];
   if (players_id.length && resources.length) {

      resources.map(resource => {
         let kings = [];
         let queens = [];

         db.select('name', 'player_id', 'quantity')
         .from('resource')
         .where('name', resource)
         .orderBy('quantity', 'desc')
         .then(res => {
            result = res;
            // console.log(res);
         })
         .catch(err => console.log(err))
         .then(() => {
            // console.log('result', result);
            result.map(res => {
               if (!kings.length || (kings.length && res.quantity == kings[0].quantity)) {
                  kings.push({ resource: res.name, quantity: res.quantity, player_id: res.player_id, extraScore: resourceKingEnum[resource]})
               } else if (!queens.length || (queens.length && res.quantity == queens[0].quantity)) {
                  queens.push({ resource: res.name, quantity: res.quantity, player_id: res.player_id, extraScore: resourceQueenEnum[resource]})
               }
            })

            console.log('kings', kings);
            console.log('queens', queens);
            
            extraScore['kings'] = extraScore['kings'].concat(kings);
            extraScore['queens'] = extraScore['queens'].concat(queens);

            console.log('extra', extraScore);

            return extraScore;
            
         })
      })
     

   }

}


module.exports = {
   calculateScore
}