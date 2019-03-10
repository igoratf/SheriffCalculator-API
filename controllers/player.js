const addPlayer = (db) => (req, res) => {
   const { name, apple, bread, cheese, chicken, contrabandScore, coin, contrabands } = req.body;

   db.transaction(trx => {
      trx.insert({
         name
      })
         .into('player')
         .returning('id')
         .then(playerId => {
            return trx('resource')
               .returning('player_id')
               .insert({
                  name: "apple",
                  quantity: apple,
                  player_id: playerId[0]
               })
         })
         .then(playerId => {
            return trx('resource')
               .returning('player_id')
               .insert({
                  name: "bread",
                  quantity: bread,
                  player_id: playerId[0]
               })
         })
         .then(playerId => {
            return trx('resource')
               .returning('player_id')
               .insert({
                  name: "cheese",
                  quantity: cheese,
                  player_id: playerId[0]
               })
         })
         .then(playerId => {
            return trx('resource')
               .returning('player_id')
               .insert({
                  name: "chicken",
                  quantity: chicken,
                  player_id: playerId[0]
               })
         })
         .then(playerId => {
            return trx('resource')
               .returning('player_id')
               .insert({
                  name: "coin",
                  quantity: coin,
                  player_id: playerId[0]
               })
         })
         // Posteriormente adicionar score ao próprio contrabando a partir de ENUM
         .then(playerId => {
            return trx('resource')
               .returning('player_id')
               .insert({
                  name: "contrabandScore",
                  quantity: contrabandScore,
                  player_id: playerId[0]
               })
         })
         .then(playerId => {
            let rows = Object.entries(contrabands).map((contraband) => {
               return {
                  name: contraband[0],
                  quantity: contraband[1],
                  player_id: playerId[0]
               }
            })

            return trx.batchInsert('contraband', rows)
               .returning('*')

         })
         .then(trx.commit)
         .catch(trx.rollback)
   })
      .then(() => res.status(200).json('player added'))
      .catch(err => res.status(400).json('unable to add player'))

};

module.exports = {
   addPlayer: addPlayer
}