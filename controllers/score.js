const { resourceKingEnum, resourceQueenEnum } = require('../enum/resource_enum');


const calculateScore = (db) => (req, res) => {

   const { players_id } = req.body;

   console.log('received', players_id);

   var kingsAndQueens = {
   }

   var gameScore = {};
   var scoreMap = [];

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
         // console.log(res);
         let response = res;
         return response.map(resource => {
            if (gameScore[resource.player_id]) {
               gameScore[resource.player_id] += resource.quantity * resource.value;
            } else {
               gameScore[resource.player_id] = resource.quantity * resource.value;
            }
         })
      })
      .then(() => calculateKingAndQueen(db, players_id, ['apple', 'bread', 'cheese', 'chicken']))
      .then(res => {
         let kings = res.kings;
         let queens = res.queens;

         console.log('kings', kings);
         console.log('queens', queens);

         console.log('before iterating', gameScore);
         kings.map(king => {
            let id = king.player_id
            gameScore[id] += king.extraScore;
            if (kingsAndQueens[id]) {
               kingsAndQueens[id].kings.push(king.resource);
            } else {
               kingsAndQueens[id] = {
                  kings: [king.resource],
                  queens: []
               }
            }
         })

         queens.map(queen => {
            let id = queen.player_id;
            gameScore[id] += queen.extraScore;
            if (kingsAndQueens[id]) {
               kingsAndQueens[id].queens.push(queen.resource);
            } else {
               kingsAndQueens[id] = {
                  kings: [],
                  queens: [queen.resource]
               }
            }
         })

         console.log(gameScore);

      })
      .then(() => {
         
         Object.entries(gameScore).map(score => {
            let id = score[0];
            let playerScore = score[1];
            scoreMap.push({
               player_id: id,
               score: playerScore,
            })
            gameScore[id] = { score: playerScore, kingOrQueen: kingsAndQueens[id]};
         })
         console.log(gameScore);
         db('score')
            .insert(scoreMap)
            .then((inserts) => console.log(inserts));
      })

      .then(() => res.status(200).json(gameScore))
      .catch(err => console.log(err));
}
const calculateKingAndQueen = async (db, players_id, resources) => {


   let extraScore = { 'kings': [], 'queens': [] }

   let result = [];

   const requests = resources.map(async resource => {
      let kings = [];
      let queens = [];

      await db.select('name', 'player_id', 'quantity')
         .from('resource')
         .whereIn('player_id', players_id)
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
                  kings.push({ resource: res.name, quantity: res.quantity, player_id: res.player_id, extraScore: resourceKingEnum[resource] })
               } else if (!queens.length || (queens.length && res.quantity == queens[0].quantity)) {
                  queens.push({ resource: res.name, quantity: res.quantity, player_id: res.player_id, extraScore: resourceQueenEnum[resource] })
               }
            })

            extraScore['kings'] = extraScore['kings'].concat(kings);
            extraScore['queens'] = extraScore['queens'].concat(queens);
         })
   })

   return Promise.all(requests).then(() => extraScore);

}


module.exports = {
   calculateScore
}