const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const splitName = (name) => {
  const trimmed = (name || '').trim();
  if (!trimmed) return { first_name: '', last_name: '' };
  const parts = trimmed.split(' ').filter(Boolean);
  const first_name = parts.shift() || '';
  const last_name = parts.join(' ') || '';
  return { first_name, last_name };
};

const registerUser = async (req, res) => {
  const { first_name, last_name, name, email, password, confirm_password, accept_terms, tmc } = req.body;
  const agreed = accept_terms || tmc;
  const userName = first_name || last_name ? { first_name, last_name } : splitName(name);

  if (!userName.first_name || !userName.last_name || !email || !password || !confirm_password) {
    return res.status(400).json({ message: 'First name, last name, email, password and confirm password are required.' });
  }

  if (!agreed) {
    return res.status(400).json({ message: 'You must accept the terms and conditions.' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      first_name: userName.first_name,
      last_name: userName.last_name,
      email: normalizedEmail,
      password: hashedPassword
    });

    const token = generateToken(newUser);
    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    return res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error logging in:', error.message);
    return res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const googleCallback = (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  if (!req.user) {
    return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
  }

  const token = generateToken(req.user);
  const user = {
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    role: req.user.role
  };

  return res.redirect(
    `${frontendUrl}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
  );
};

module.exports = {
  registerUser,
  loginUser,
  googleCallback
};