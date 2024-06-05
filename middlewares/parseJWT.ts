const pool = require("../db_config/db");
const jwt = require("jsonwebtoken");
const { JwtPayload } = require("jsonwebtoken");

const parseJWT = async (req: any, res: any, next: any) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(401)
      .json({ err: "You don't have authorization to Create Post." });
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ err: "You are not authorized to access further." });
  }
  console.log(token);
  try {
    const decoded = jwt.decode(token) as typeof JwtPayload;
    console.log("after decoding token:");

    const auth0id = decoded.sub;
    const user = await pool.query("SELECT * FROM userinfo WHERE auth0id=$1", [
      auth0id,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ err: "User not found" });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    console.log("Error While Parsing JWT", error);

    return res.status(500).send(error);
  }
};

module.exports = parseJWT;

export {};
