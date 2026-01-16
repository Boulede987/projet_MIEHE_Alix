const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.user;
const { validateUserCreate } = require('../validators/user.validator');
const jwt = require('jsonwebtoken');

// Get all users
exports.get = (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(400).send({ message: err.message });
    });
};

// Get user by ID
exports.getById = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: `User with id=${id} not found.` });
      }
      res.send(data);
    })
    .catch(err => {
      res.status(400).send({ message: err.message });
    });
};

// Create a new user
exports.post = async (req, res) => {
  const validationError = validateUserCreate(req.body);

  if (validationError) {
    return res.status(400).send({ message: validationError });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      username: req.body.username,
      email: req.body.email,
      password_hash: hashedPassword,
      role: req.body.role || 'user'
    };

    const data = await User.create(user);

    // Never return password hash
    delete data.dataValues.password_hash;

    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error creating user.' });
  }
};

exports.put = async (req, res) => {
  const id = req.params.id;

  if (!Object.keys(req.body).length) {
    return res.status(400).send({ message: 'No fields provided' });
  }

  try {
    const updateData = { ...req.body };

    if (req.body.email && !EMAIL_REGEX.test(req.body.email)) {
      return res.status(400).send({ message: 'Invalid email format' });
    }

    if (req.body.password) {
      if (!PASSWORD_REGEX.test(req.body.password)) {
        return res.status(400).send({ message: 'Weak password' });
      }
      updateData.password_hash = await bcrypt.hash(req.body.password, 10);
      delete updateData.password;
    }

    const num = await User.update(updateData, { where: { id } });

    if (num[0] === 1) {
      res.send({ message: 'User updated successfully.' });
    } else {
      res.status(404).send({ message: 'User not found or no changes.' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete user
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({ where: { id } })
    .then(num => {
      if (num === 1) {
        res.send({ message: "User was deleted successfully!" });
      } else {
        res.send({ message: `Cannot delete user with id=${id}. User not found.` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: `Could not delete user with id=${id}: ${err.message}` });
    });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

