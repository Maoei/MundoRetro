// models/clienteModel.js
const connection = require('../db');

function getUserById(clientId, callback) {
  const selectQuery = `SELECT id,nome, email, cpfcnpj, DATE_FORMAT(dtnascimento, '%Y-%m-%d') as dtnascimento, usr, senha, genero, telefone  FROM clientes WHERE id = ?`;

  connection.query(selectQuery, [clientId], (error, results) => {
    if (error) {
      return callback(error, null);
    }

    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback({ message: 'Client not found' }, null);
    }
  });
}

module.exports = {
  getUserById,
};
