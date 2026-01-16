const { v4: uuidv4 } = require ("uuid");


const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;

exports.get = (req, res) => 
{

  Pollution.findAll()
  .then(
    data => {
      res.send(data);
    }
  )
  .catch(
    err => {
      res.status(400)
      .send(
        {
          message: err.message
        }
      );
    }
  );

}; 





exports.getById = (req, res) => 
{
  const id = req.params.id;
  
  Pollution.findByPk(id)
  .then(
    data => {
      if (!data) {
        return res.status(404)
        .send(
          {
            message: `Pollution with id=${id} not found.`
          }
        );
      }
      res.send(data);
    }
  )
  .catch(
    err => {
      res.status(400)
      .send(
        {
          message: err.message
        }
      );
    }
  );
};








exports.post = (req, res) => {
  // Validate request
  if (!req.body.titre) {
    res.status(400).send({
      message: "Titre ne peu pas être vide!"
    });
    return;
  }

  // Create a Pollution object
  const pollution = {
    titre: req.body.titre,
    lieu: req.body.lieu,
    date_observation: req.body.date_observation,
    type_pollution: req.body.type_pollution,
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    photo_url: req.body.photo_url
  };

  // Save Pollution in the database
  Pollution.create(pollution)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la creation de la pollution."
      });
    });
};




exports.put = (req, res) => {
  const id = req.params.id;

  // Validate request
  if (!req.body.titre) {
    res.status(400).send({
      message: "Titre ne peu pas être vide!"
    });
    return;
  }

  // Update Pollution in the database
  Pollution.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Pollutioon à étée mise à jour."
        });
      } else {
        res.send({
          message: `Impossible de mettre à jour la pollution avec l'id=${id}. La pollution n'as pas étée trouvée ou req.body est vide!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Erreur de mise à jour de la pollution avec l'id=${id}: ${err.message}`
      });
    });
};






exports.delete = (req, res) => {
  const id = req.params.id;

  Pollution.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "La pollution à étée supprimée!"
        });
      } else {
        res.send({
          message: `Impossible de supprimer la pollution avec l'id=${id}. Peut-être la pollution n'as-t-elle pas étée trouvée?`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Echec de supprimer la pollution avec l'id=${id}: ${err.message}`
      });
    });
};


