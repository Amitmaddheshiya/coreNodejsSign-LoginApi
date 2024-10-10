const query = require("querystring");
const jwt = require("jsonwebtoken");
const database = require("./db");

exports.result = (request,response)=>{
  let formdata = "";

  request.on("data",(chunks)=>{
    formdata += chunks.toString();
  });

  request.on("end",()=>{
    const post = query.parse(formdata);
    if(post.token && post.token != "")
    {
      const secret_id = post.secretId;
      const findRes = database.findById(secret_id,"jwt_secrets");
      findRes.then((successRes)=>{
        const secret = successRes.data[0].secret;

        // verify the token
        jwt.verify(post.token,secret,(error,success)=>{
          if(success)
          {
            if(post.verify)
            {
              const id = post.verify;
              const formdata = {
                $set: {
                  emailVerified: true
                }
              };
              database.updateById(id,formdata,"users");
            }
            const message = JSON.stringify({
                isVerified: true,
                message: "Token verified !"
            });
            sendResponse(response,200,message);
          }
          else{
            const message = JSON.stringify({
                isVerified: false,
                message: "Token not verified !"
            });
            sendResponse(response,401,message);
          }
        });

      }).catch((errorRes)=>{
        console.log(errorRes);
      });
    }
    else{
      const message = JSON.stringify({
          isVerified: false,
          message: "Unauthenticated user !"
      });
      sendResponse(response,401,message);
    }
  });

  const sendResponse = (response,status_code,message)=>{
    response.writeHead(status_code,{
      'Content-Type':'application/json'
    });
    response.write(message);
    return response.end();
  }
}
