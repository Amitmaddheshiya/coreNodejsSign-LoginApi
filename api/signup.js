const database = require("./db");
const bcrypt = require("bcryptjs");

exports.result = (request,response)=>{
  let formdata = "";

  request.on("data",(chunks)=>{
    formdata += chunks.toString();
  });

  // get data when chunks is completed
  request.on("end",()=>{
    const userInfo = JSON.parse(formdata);
    const query = {
      email: userInfo.email
    };

    // check user exists or not
    const findRes = database.find(query,"users");
    findRes
    .then((successRes)=>{
      sendResponse(
        response,
        successRes.status_code,
        successRes
      );
    })
    .catch((errorRes)=>{
      // encrypt password and then try to proceed the signup
      bcrypt.hash(userInfo.password.toString(),10)
      .then((encrypted_password)=>{
        userInfo['password'] = encrypted_password;
        userInfo['created_at'] = new Date();
        userInfo['updated_at'] = new Date();
        userInfo['emailVerified'] = false;
        userInfo['mobileVerified'] = false;
        createUser(userInfo);
      });
    });
  });

  const createUser = (userInfo)=>{
    const insertRes = database.insertOne(userInfo,"users");
    insertRes
    .then((successRes)=>{
      sendResponse(
        response,
        successRes.status_code,
        successRes
        );
    })
    .catch((errorRes)=>{
      sendResponse(
        response,
        errorRes.status_code,
        errorRes
        );
    });
  }

  // send response
  const sendResponse = (response,status_code,responseMessage)=>{
    response.writeHead(status_code,{
      'Content-Type' : 'application/json'
    });
    response.write(JSON.stringify(responseMessage));
    return response.end();
  }
}
