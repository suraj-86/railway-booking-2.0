import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Access Denied. No token provided or invalid format." });
  }

  try {
    const token = authHeader.split(' ')[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;
    
    next();
    
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

const requireAdmin = (prisma) => async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Access Denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ error: "Failed to verify admin status." });
  }
};

export default verifyToken;
export { requireAdmin };
