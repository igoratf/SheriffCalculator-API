
const getContrabands = (db) => (req, res) => {
   return db('contraband')
   .select('name', 'value', 'quantity')
   .then((data) => res.status(200).json(data))
   .catch(err => res.status(400).json('unable to retrieve contrabands'));
}


module.exports = {
   getContrabands
}