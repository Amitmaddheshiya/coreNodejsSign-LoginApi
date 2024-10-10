const crypto = require("crypto");
const database = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.result = async (request, response) => {
  let formdata = "";

  // get full url
  const fullUrl = request.headers.referer + request.url.slice(1);

  request.on("data", (chunks) => {
    formdata += chunks.toString();
  });

  request.on("end", async () => {
    try {
      const user = JSON.parse(formdata);
      const query = {
        email: user.username,
      };

      const successRes = await database.find(query, "users");
      const userInfo = successRes;
      const realPassword = userInfo.data[0].password;

      // match encrypted password
      const isMatched = await bcrypt.compare(user.password, realPassword);
      if (isMatched) {
        // login success generate secrets and create token
        const secret = crypto.randomBytes(16).toString("hex");

        const insertRes = await database.insertOne(
          {
            secret: secret,
            created_at: new Date(),
            isVerified: false,
          },
          "jwt_secrets"
        );

        const secret_id = insertRes.data.insertedId;

        const token = jwt.sign(
          {
            iss: fullUrl,
            data: userInfo.data[0],
          },
          secret,
          { expiresIn: 86400 }
        );

        const message = JSON.stringify({
          isLoged: true,
          message: "User authenticated!",
          token: token,
          secretId: secret_id,
        });

        sendResponse(response, 200, message);
      } else {
        // login failed
        const message = JSON.stringify({
          isLoged: false,
          message: "Authentication failed!",
        });
        sendResponse(response, 401, message);
      }
    } catch (error) {
      // Handle errors (user not found or JSON parsing error)
      const message = JSON.stringify({
        isLoged: false,
        message: error.message || "User not found!",
      });
      sendResponse(response, 404, message);
    }
  });
};

const sendResponse = (response, status_code, message) => {
  response.writeHead(status_code, {
    "Content-Type": "application/json",
  });
  response.write(message);
  return response.end();
};
