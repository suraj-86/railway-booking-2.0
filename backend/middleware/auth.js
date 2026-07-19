import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // 1. Look for the "Authorization" header in the incoming request
  const authHeader = req.header('Authorization');

  // 2. If there is no header, or it doesn't start with "Bearer ", deny access
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Access Denied. No token provided or invalid format." });
  }

  try {
    // 3. Extract just the token part (ignoring the "Bearer " word)
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using your exact secret key from the .env file
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the decoded VIP data (the userId) to the request
    req.user = verified;
    
    // 6. The most important part: tell Express to move on to the actual route!
    next();
    
  } catch (error) {
    // If the token is fake, expired, or tampered with, deny access
    res.status(400).json({ error: "Invalid token." });
  }
};

export default verifyToken;