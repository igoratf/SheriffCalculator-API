const contrabandlist = require('../objects/contrabandList');

const getContrabands = () => (req, res) => {
   return res.status(200).json(contrabandlist);
}


module.exports = {
   getContrabands
}