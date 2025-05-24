const authService = require('./auth.service');

exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body.email, req.body.password);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  // for API logout, you may just respond success; client clears localStorage
  res.status(200).json({ message: 'Logout success' });
};
