const jwt = require("jsonwebtoken");
const jwtConfig = require("../config").jwt;

const generateTokens = (user) => {
  const accessToken = jwt.sign({ userId: user.id }, jwtConfig.accessSecretKey, {
    expiresIn: "45m",
  });
  const refreshToken = jwt.sign(
    { userId: user.id },
    jwtConfig.refreshSecretKey,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
