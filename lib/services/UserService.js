const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ username, password }, showUserContent = false) {
    try {
      const existingUsername = await User.getByUsername(username);

      if (existingUsername) throw new Error('Please select another username');

      const passwordHash = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUNDS)
      );

      const user = await User.insert({
        username,
        passwordHash,
        showUserContent,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async signIn({ username, password = '' }) {
    try {
      const user = await User.getByUsername(username);

      if (!user) throw new Error('Invalid credentials');
      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('Invalid credentials');

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      return token;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
