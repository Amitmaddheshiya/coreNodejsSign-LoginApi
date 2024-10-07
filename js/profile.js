window.onload = ()=>{
  verifyToken();
  logout();
  verifyNow();
}

const verifyToken = ()=>{
  const data = location.href.split("?")[1];
  const ajax = new XMLHttpRequest();
  ajax.open("POST","http://localhost:8080/api/verifyToken");
  ajax.send(data);

  // get response
  ajax.onload = ()=>{
    const response = JSON.parse(ajax.response);
    if(response.isVerified)
    {

      const user = getUserInfo();
      sessionStorage.setItem("username",user.email);

      if(user.emailVerified)
      {
        // email id already verified
        $(".loader").addClass("d-none");
        $(".profile-page").removeClass("d-none");

      }
      else{
        // email id not verified send verification link
        $(".loader").addClass("d-none");
        $(".profile-page").addClass("d-none");
        $(".email-notice").removeClass("d-none");

        const reciept = JSON.stringify({
          id: user._id,
          email: user.email,
          subject: "Nodewap email verification",
          message: "To complete your profile activation, we just need to verify your email address",
          token: localStorage.getItem("__token")
        });

        sendEmailVerificationLink(reciept);
      }
    }
    else{
      localStorage.removeItem("__token");
      localStorage.removeItem("__secret_id");
      window.location = "http://localhost:8080";
    }
  }
}

const getUserInfo = ()=>{
  const token = localStorage.getItem("__token");
  const user = JSON.parse(atob(token.split(".")[1]));
  return user.data;
}

const sendEmailVerificationLink = (receipt)=>{
  const ajax = new XMLHttpRequest();
  ajax.open("POST","http://localhost:8080/api/sendmail",true);
  ajax.send(receipt);

  // get response
  ajax.onload = ()=>{
    console.log(ajax.response);
  }
}

const logout = ()=>{
  const logout_btn = document.getElementById("logout-btn");
  logout_btn.onclick = ()=>{
    // remove token and secretId from localStorage
    localStorage.removeItem("__token");
    localStorage.removeItem("__secret_id");

    // redirect
    window.location = "http://localhost:8080";
  }
}
const verifyNow = ()=>{
  const verify_btn = document.getElementById("verify-now");
  verify_btn.onclick = ()=>{
    const email = sessionStorage.getItem("username");
    const email_server = email.split("@")[1];
    window.close();
    window.location = `https://${email_server}`;
  }
}
