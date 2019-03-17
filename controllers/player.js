const addPlayer = (db) => (req, res) => {
   const { name, apple, bread, cheese, chicken, contrabandScore, coin, contrabands } = req.body;

   if (!name || apple < 0 || bread < 0 || cheese < 0 || chicken < 0 || coin < 0) {
      return res.json(400).json('invalid player');
   }

   else {

      db.transaction(trx => {
         trx.insert({
            name
         })
            .into('player')
            .returning('id')
            .then(playerId => {
               return trx('resource')
                  .returning('player_id')
                  .insert([{
                     name: "apple",
                     quantity: apple,
                     player_id: playerId[0],
                     value: 2
                  },
                  {
                     name: "bread",
                     quantity: bread,
                     player_id: playerId[0],
                     value: 3
                  },
                  {
                     name: "cheese",
                     quantity: cheese,
                     player_id: playerId[0],
                     value: 3
                  },
                  {
                     name: "chicken",
                     quantity: chicken,
                     player_id: playerId[0],
                     value: 4
                  },
                  {
                     name: "coin",
                     quantity: coin,
                     player_id: playerId[0],
                     value: 1
                  },
                  {
                     // Adicionar score ao contrabando e remover esta coluna
                     name: "contrabandScore",
                     quantity: contrabandScore,
                     player_id: playerId[0]
                  }
                  ])
            })
            .then(playerId => {
               let rows = Object.values(contrabands).map((contraband) => {
                  return {
                     name: contraband.name,
                     quantity: contraband.quantity,
                     player_id: playerId[0]
                  }
               })

               if (rows.length) {
                  return trx.batchInsert('contraband', rows)
                     .returning('player_id')
               }

               return playerId;

            })
            .then(trx.commit)
            .catch(trx.rollback)
      })
         .then((inserts) => {
            console.log(inserts);
            return res.status(200).json({ id: inserts[0] })
         })
         .catch(err => res.status(400).json('unable to add player'))

   }

};

const deletePlayer = (db) => (req, res) => {
   const { id } = req.body;

   db('player')
      .where('id', id)
      .del()
      .then(() => res.status(200).json('player deleted'))
      .catch(err => res.status(400).json('unable to delete player'));

}

module.exports = {
   addPlayer: addPlayer,
   deletePlayer: deletePlayer
}