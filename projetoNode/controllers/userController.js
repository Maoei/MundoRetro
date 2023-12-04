// controllers/userController.js
const clienteModel = require('../models/userModel');

exports.getUser = (req, res) => {
  const clientId = req.params.id;

  clienteModel.getUserById(clientId, (error, result) => {
    if (error) {
      res.status(500).send('Error fetching client');
    } else if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).send('Client not found');
    }
  });
};
