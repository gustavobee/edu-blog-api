const authMiddleware = (req, res, next) => {
  const token = req.headers['access_token'];

  if (!token || token !== 'simulated_token') {
    return res.status(401).json({ 
      error: 'Unauthorized access. The access_token header is required or invalid.' 
    });
  }

  next();
};

module.exports = authMiddleware;