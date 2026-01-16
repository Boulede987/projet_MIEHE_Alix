const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// At least 8 chars, 1 upper, 1 lower, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

exports.validateUserCreate = ({ username, email, password }) => {
  if (!username || !email || !password) {
    return 'Username, email and password are required';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'Invalid email format';
  }

  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must be at least 8 characters long and contain uppercase, lowercase and a number';
  }

  return null;
};

