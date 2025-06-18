const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: process.env.AUTH0_URI + ".well-known/jwks.json",
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      console.error("❌ Error getting signing key:", err);
      return callback(err);
    }

    const signingKey = key?.getPublicKey?.() || key?.publicKey;
    if (!signingKey) {
      return callback(new Error("No signing key found"));
    }

    callback(null, signingKey);
  });
}

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ["RS256"],
      issuer: process.env.AUTH0_URI,
      audience: process.env.AUTH0_API,
    },
    (err, decoded) => {
      if (err) {
        console.error("❌ JWT verification failed:", err);
        return res.status(403).json({ error: "Invalid or expired token." });
      }

      req.user = decoded;
      next();
    }
  );
};
