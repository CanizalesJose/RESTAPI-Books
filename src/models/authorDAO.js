var authorModel = require('./authorModel');
var db = require('../connection/db');

class authorDAO{
    // Este método recibe un objeto authorModel
    // Usa su ID para buscarlo en la base de datos
    // Regresa el objeto con los datos encontrados
    // Regresa null si no lo encuentra
    getAuthor(author){
        // Revisar si el parámetro es del tipo authorModel
        if (!author instanceof authorModel)
            return null;
        // Revisar si incluye Id
        if (author.getId() == null)
            return null;

    }
}

module.exports = authorDAO;