
const getContrabands = (db) => (req, res) => {
   return db('contraband')
   .select('name', 'value', 'quantity')
   .then((data) => res.status(200).json(data))
   .catch(err => console.log(err));
}


module.exports = {
   getContrabands
}