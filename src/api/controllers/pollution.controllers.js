const db = require("../models");
const Pollution = db.pollution;
const User = db.user;
const Op = db.Sequelize.Op;

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

const DEFAULT_IMAGE_MIME = 'image/jpeg';
const BASE64_DATA_URL_REGEX = /^data:(.+);base64,(.+)$/;

const sendError = (res, status, message) => {
  res.status(status).send({ message });
};

const sendSuccess = (res, data, status = HTTP_STATUS.OK) => {
  res.status(status).send(data);
};

const convertPhotoToBase64 = (photoData, photoMime) => {
  if (!photoData) return null;
  
  const mime = photoMime || DEFAULT_IMAGE_MIME;
  const base64 = Buffer.from(photoData).toString('base64');
  return `data:${mime};base64,${base64}`;
};

const parseBase64Image = (base64String) => {
  try {
    let base64Data = base64String;
    let mime = DEFAULT_IMAGE_MIME;
    
    const matches = base64String.match(BASE64_DATA_URL_REGEX);
    if (matches) {
      mime = matches[1];
      base64Data = matches[2];
    }
    
    return {
      data: Buffer.from(base64Data, 'base64'),
      mime
    };
  } catch (error) {
    console.error('Failed to process base64 image:', error);
    return null;
  }
};

const sanitizePollutionData = (pollution) => {
  const obj = pollution.toJSON ? pollution.toJSON() : pollution;
  
  if (obj.photo_data) {
    obj.photo_base64 = convertPhotoToBase64(obj.photo_data, obj.photo_mime);
  }
  
  delete obj.photo_data;
  delete obj.photo_mime;
  
  return obj;
};

const sanitizePollutionList = (pollutions) => {
  return pollutions.map(sanitizePollutionData);
};

const buildSearchQuery = (searchTerm, type) => {
  const where = {};
  
  if (searchTerm && searchTerm.trim() !== '') {
    where[Op.or] = [
      { titre: { [Op.like]: `%${searchTerm}%` } },
      { description: { [Op.like]: `%${searchTerm}%` } }
    ];
  }
  
  if (type && type.trim() !== '') {
    where.type_pollution = type;
  }
  
  return where;
};

const getUserIncludeOptions = () => ({
  model: User,
  as: 'user',
  attributes: ['id', 'username', 'email']
});

const preparePollutionData = (body, userId = null) => {
  const pollution = {
    titre: body.titre,
    lieu: body.lieu,
    date_observation: body.date_observation,
    type_pollution: body.type_pollution,
    description: body.description,
    latitude: body.latitude,
    longitude: body.longitude,
    photo_data: null,
    photo_mime: null
  };
  
  if (userId) {
    pollution.userId = userId;
  }
  
  if (body.photo_base64) {
    const imageData = parseBase64Image(body.photo_base64);
    if (imageData) {
      pollution.photo_data = imageData.data;
      pollution.photo_mime = imageData.mime;
    }
  }
  
  return pollution;
};

const prepareUpdateData = (body) => {
  const updateData = { ...body };
  
  if (body.photo_base64) {
    const imageData = parseBase64Image(body.photo_base64);
    if (imageData) {
      updateData.photo_data = imageData.data;
      updateData.photo_mime = imageData.mime;
    }
    delete updateData.photo_base64;
  }
  
  return updateData;
};

const validateTitle = (title) => {
  if (!title) {
    throw new Error("Titre ne peut pas être vide!");
  }
};

exports.get = async (req, res) => {
  const { q, type } = req.query;
  
  try {
    const where = buildSearchQuery(q, type);
    const pollutions = await Pollution.findAll({ where });
    const sanitizedData = sanitizePollutionList(pollutions);
    
    sendSuccess(res, sanitizedData);
  } catch (err) {
    sendError(res, HTTP_STATUS.BAD_REQUEST, err.message);
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const pollution = await Pollution.findByPk(id, {
      include: [getUserIncludeOptions()]
    });
    
    if (!pollution) {
      return sendError(
        res,
        HTTP_STATUS.NOT_FOUND,
        `Pollution with id=${id} not found.`
      );
    }
    
    const sanitizedData = sanitizePollutionData(pollution);
    sendSuccess(res, sanitizedData);
  } catch (err) {
    sendError(res, HTTP_STATUS.BAD_REQUEST, err.message);
  }
};

exports.post = async (req, res) => {
  try {
    validateTitle(req.body.titre);
    
    const userId = req.user?.id || null;
    const pollutionData = preparePollutionData(req.body, userId);
    
    const newPollution = await Pollution.create(pollutionData);
    sendSuccess(res, newPollution, HTTP_STATUS.CREATED);
  } catch (err) {
    const status = err.message.includes("vide")
      ? HTTP_STATUS.BAD_REQUEST
      : HTTP_STATUS.SERVER_ERROR;
    sendError(res, status, err.message || "Erreur lors de la création de la pollution.");
  }
};

exports.put = async (req, res) => {
  const { id } = req.params;
  
  try {
    validateTitle(req.body.titre);
    
    const updateData = prepareUpdateData(req.body);
    const [rowsUpdated] = await Pollution.update(updateData, { where: { id } });
    
    if (rowsUpdated === 1) {
      sendSuccess(res, { message: "Pollution à été mise à jour." });
    } else {
      sendError(
        res,
        HTTP_STATUS.NOT_FOUND,
        `Impossible de mettre à jour la pollution avec l'id=${id}. La pollution n'a pas été trouvée ou req.body est vide!`
      );
    }
  } catch (err) {
    const status = err.message.includes("vide")
      ? HTTP_STATUS.BAD_REQUEST
      : HTTP_STATUS.SERVER_ERROR;
    sendError(
      res,
      status,
      `Erreur de mise à jour de la pollution avec l'id=${id}: ${err.message}`
    );
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  
  try {
    const rowsDeleted = await Pollution.destroy({ where: { id } });
    
    if (rowsDeleted === 1) {
      sendSuccess(res, { message: "La pollution à été supprimée!" });
    } else {
      sendError(
        res,
        HTTP_STATUS.NOT_FOUND,
        `Impossible de supprimer la pollution avec l'id=${id}. Peut-être la pollution n'a-t-elle pas été trouvée?`
      );
    }
  } catch (err) {
    sendError(
      res,
      HTTP_STATUS.SERVER_ERROR,
      `Échec de supprimer la pollution avec l'id=${id}: ${err.message}`
    );
  }
};