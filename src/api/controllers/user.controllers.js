const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.user;
const { validateUserCreate } = require('../validators/user.validator');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRATION = '2h';
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

const excludePasswordHash = () => ({
  attributes: { exclude: ['password_hash'] }
});

const sendError = (res, status, message) => {
  res.status(status).send({ message });
};

const sendSuccess = (res, data, status = HTTP_STATUS.OK) => {
  res.status(status).send(data);
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePasswords = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const generateToken = (userId, userRole) => {
  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );
};

const sanitizeUserData = (user) => {
  const { password_hash, ...sanitizedData } = user.dataValues || user;
  return sanitizedData;
};

const validateEmail = (email) => {
  if (!EMAIL_REGEX.test(email)) {
    throw new Error('Invalid email format');
  }
};

const validatePassword = (password) => {
  if (!PASSWORD_REGEX.test(password)) {
    throw new Error('Weak password');
  }
};

exports.get = async (req, res) => {
  try {
    const users = await User.findAll(excludePasswordHash());
    sendSuccess(res, users);
  } catch (err) {
    sendError(res, HTTP_STATUS.BAD_REQUEST, err.message);
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByPk(id, excludePasswordHash());
    
    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, `User with id=${id} not found.`);
    }
    
    sendSuccess(res, user);
  } catch (err) {
    sendError(res, HTTP_STATUS.BAD_REQUEST, err.message);
  }
};

exports.post = async (req, res) => {
  const validationError = validateUserCreate(req.body);
  
  if (validationError) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, validationError);
  }
  
  try {
    const hashedPassword = await hashPassword(req.body.password);
    
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password_hash: hashedPassword,
      role: req.body.role || 'user'
    };
    
    const newUser = await User.create(userData);
    const sanitizedUser = sanitizeUserData(newUser);
    
    sendSuccess(res, sanitizedUser, HTTP_STATUS.CREATED);
  } catch (err) {
    sendError(res, HTTP_STATUS.SERVER_ERROR, err.message || 'Error creating user.');
  }
};

exports.put = async (req, res) => {
  const { id } = req.params;
  
  if (!Object.keys(req.body).length) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'No fields provided');
  }
  
  try {
    const updateData = await prepareUpdateData(req.body);
    const [rowsUpdated] = await User.update(updateData, { where: { id } });
    
    if (rowsUpdated === 1) {
      sendSuccess(res, { message: 'User updated successfully.' });
    } else {
      sendError(res, HTTP_STATUS.NOT_FOUND, 'User not found or no changes.');
    }
  } catch (err) {
    sendError(res, HTTP_STATUS.SERVER_ERROR, err.message);
  }
};

const prepareUpdateData = async (body) => {
  const updateData = { ...body };
  
  if (body.email) {
    validateEmail(body.email);
  }
  
  if (body.password) {
    validatePassword(body.password);
    updateData.password_hash = await hashPassword(body.password);
    delete updateData.password;
  }
  
  return updateData;
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  
  try {
    const rowsDeleted = await User.destroy({ where: { id } });
    
    if (rowsDeleted === 1) {
      sendSuccess(res, { message: "User was deleted successfully!" });
    } else {
      sendError(res, HTTP_STATUS.NOT_FOUND, `Cannot delete user with id=${id}. User not found.`);
    }
  } catch (err) {
    sendError(res, HTTP_STATUS.SERVER_ERROR, `Could not delete user with id=${id}: ${err.message}`);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Email and password required');
  }
  
  try {
    const user = await findUserByEmail(email);
    await verifyPassword(password, user.password_hash);
    
    const token = generateToken(user.id, user.role);
    const userResponse = sanitizeUserData(user);
    
    res
      .set('Authorization', `Bearer ${token}`)
      .send(userResponse);
  } catch (err) {
    const status = err.message === 'Invalid credentials' 
      ? HTTP_STATUS.UNAUTHORIZED 
      : HTTP_STATUS.SERVER_ERROR;
    sendError(res, status, err.message);
  }
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  const isValid = await comparePasswords(plainPassword, hashedPassword);
  
  if (!isValid) {
    throw new Error('Invalid credentials');
  }
};