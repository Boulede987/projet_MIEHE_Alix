const { v4: uuidv4 } = require ("uuid");

const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;


exports.get = (req, res) => 
{

  const { q, type } = req.query;

  const where = {};

  if (q && q.trim() !== '') {
    where[Op.or] = [
      { titre: { [Op.like]: `%${q}%` } },
      { description: { [Op.like]: `%${q}%` } }
    ];
  }

  if (type && type.trim() !== '') {
    where.type_pollution = type;
  }

  Pollution.findAll({ where })
  .then(
    data => {
      // convert binary photo_data to base64 data URL for client
      const mapped = data.map(d => {
        const obj = d.toJSON();
        if (obj.photo_data) {
          const mime = obj.photo_mime || 'image/jpeg';
          obj.photo_base64 = `data:${mime};base64,${Buffer.from(obj.photo_data).toString('base64')}`;
        }
        delete obj.photo_data;
        delete obj.photo_mime;
        return obj;
      });
      res.send(mapped);
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
  
  Pollution.findByPk(id, { include: [{ model: db.user, as: 'user', attributes: ['id','username','email'] }] })
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
      const obj = data.toJSON();
      if (obj.photo_data) {
        const mime = obj.photo_mime || 'image/jpeg';
        obj.photo_base64 = `data:${mime};base64,${Buffer.from(obj.photo_data).toString('base64')}`;
      }
      delete obj.photo_data;
      delete obj.photo_mime;
      res.send(obj);
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
    photo_data: null,
    photo_mime: null
  };

  // attach user id if authenticated
  if (req.user && req.user.id) {
    pollution.userId = req.user.id;
  }

  // If client sent a base64 image in `photo_base64`, store binary and mime in DB
  if (req.body.photo_base64) {
    try {
      const raw = req.body.photo_base64;
      let base64Data = raw;
      let mime = 'image/jpeg';
      const matches = raw.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        mime = matches[1];
        base64Data = matches[2];
      }
      pollution.photo_data = Buffer.from(base64Data, 'base64');
      pollution.photo_mime = mime;
    } catch (e) {
      console.error('Failed to process base64 image:', e);
    }
  }

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

  // If client sent a new base64 image for update, store binary and mime in the update body
  const updateBody = { ...req.body };
  if (req.body.photo_base64) {
    try {
      const raw = req.body.photo_base64;
      let base64Data = raw;
      let mime = 'image/jpeg';
      const matches = raw.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        mime = matches[1];
        base64Data = matches[2];
      }
      updateBody.photo_data = Buffer.from(base64Data, 'base64');
      updateBody.photo_mime = mime;
    } catch (e) {
      console.error('Failed to process base64 image on update:', e);
    }
  }

  // Update Pollution in the database
  Pollution.update(updateBody, {
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


