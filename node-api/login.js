const crypto = require("crypto");
const database = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.result = (request,response)=>{
  let formdata = "";

  // get full url
  const fullUrl = request.headers.referer+request.url.slice(1);

  request.on("data",(chunks)=>{
    formdata += chunks.toString();
  });

  request.on("end",()=>{
    const user = JSON.parse(formdata);
    const query = {
      email: user.username
    }

    const findRes = database.find(query,"users");
    findRes.then((successRes)=>{
      const userInfo = successRes;
      const realPassword = userInfo.data[0].password;

      // match encrypted password
      bcrypt.compare(user.password,realPassword)
      .then((isMatched)=>{
        if(isMatched)
        {
          // login success generate secrets and create token
          const secret = crypto.randomBytes(16).toString('hex');

          const insertRes =  database.insertOne({
            secret: secret,
            created_at: new Date(),
            isVerified: false
          },"jwt_secrets");

          insertRes.then((successRes)=>{
            const secret_id = successRes.data.insertedId;

            const token = jwt.sign({
              iss: fullUrl,
              data: userInfo.data[0]
            },secret,{expiresIn: 86400});

            const message = JSON.stringify({
              isLoged: true,
              message: "User authenticated !",
              token : token,
              secretId: secret_id
            });

            sendResponse(response,200,message);
          })
          .catch((errorRes)=>{
            console.log(errorRes);
          });


        }
        else{
          // login failed
          const message = JSON.stringify({
            isLoged: false,
            message: "Authentication failed !"
          });
          sendResponse(response,401,message);
        }
      });
    })
    .catch((errorRes)=>{
      const message = JSON.stringify({
        isLoged: false,
        message: "User not found !"
      });
      sendResponse(response,404,message);
    });

  });

  const sendResponse = (response,status_code,message)=>{
      response.writeHead(status_code,{
        'Content-Type': 'application/json'
      });
      response.write(message);
      return response.end();
  }

}
