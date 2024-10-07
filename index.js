const http = require("http");
const fs = require("fs");
const signup = require("./api/signup");
const login = require("./api/login");
const verifyToken = require("./api/verifyToken");
const sendmail = require("./api/sendmail");

// Function to serve files
const serveFile = (path, response, statusCode, type) => {
  fs.readFile(path, (error, data) => {
    if (error) {
      response.writeHead(404, { 'Content-Type': "text/html" });
      response.write("File not found");
      response.end();
    } else {
      response.writeHead(statusCode, { 'Content-Type': type });
      response.end(data);
    }
  });
};

const route = (request, response) => {
  const { url, method } = request;

  // HTML page routing
  const htmlRoutes = {
    "/": "public/html/homepage.html",
    "/home": "public/html/homepage.html",
    "/homepage": "public/html/homepage.html",
    "/about": "public/html/about-us.html",
    "/about-us": "public/html/about-us.html",
    "/contact": "public/html/contact-us.html",
    "/contact-us": "public/html/contact-us.html"
  };

  if (htmlRoutes[url]) {
    return serveFile(htmlRoutes[url], response, 200, "text/html");
  }

  // CSS routing
  const cssRoutes = [
    "/public/css/homepage.css",
    "/public/css/contact-us.css",
    "/public/css/about-us.css",
    "/public/css/not-found.css",
    "/public/css/profile.css"
  ];
  
  if (cssRoutes.includes(url)) {
    return serveFile(url.slice(1), response, 200, "text/css");
  }

  // JS routing
  const jsRoutes = [
    "/public/js/homepage.js",
    "/public/js/about-us.js",
    "/public/js/contact-us.js",
    "/public/js/not-found.js",
    "/public/js/profile.js"
  ];

  if (jsRoutes.includes(url)) {
    return serveFile(url.slice(1), response, 200, "text/javascript");
  }

  // API routing
  const apiRoutes = {
    "/api/signup": signup.result,
    "/api/login": login.result,
    "/api/verifyToken": verifyToken.result,
    "/api/sendmail": sendmail.result
  };

  if (apiRoutes[url] && method === "POST") {
    return apiRoutes[url](request, response);
  }

  // Authenticated routes
  const regExp = {
    profile: /\/profile\?token=/,
    images: /\/assets\/images\//,
    videos: /\/assets\/videos\//
  };

  if (regExp.profile.test(url)) {
    return serveFile("public/html/profile.html", response, 200, "text/html");
  } else if (regExp.images.test(url)) {
    return serveFile(url.slice(1), response, 200, "image/jpeg");
  } else if (regExp.videos.test(url)) {
    return serveFile(url.slice(1), response, 200, "video/mp4");
  }

  // Not found page
  serveFile("public/html/not-found.html", response, 404, "text/html");
};

const server = http.createServer((request, response) => {
  route(request, response);
});

server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
