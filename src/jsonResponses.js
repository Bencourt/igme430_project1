// Note this object is purely in memory
// ... not anymore :)
const fs = require('fs');

const usersText = fs.readFileSync(`${__dirname}/users.txt`);
const users = JSON.parse(usersText);

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'username and password are both required',
  };

  if (!body.username || !body.password) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (users[body.username]) {
    responseCode = 200;

    if (body.password === users[body.username].password) {
      responseJSON.message = 'successfully logged in';
      responseJSON.username = body.username;
      return respondJSON(request, response, responseCode, responseJSON);
    }
  } else {
    if (body.username.includes('~./&?')) {
      responseJSON.message = 'Username contains an invalid string';
      responseJSON.id = 'invalidParam';
      return respondJSON(request, response, 400, responseJSON);
    }

    users[body.username] = {};
    users[body.username].username = body.username;
    users[body.username].password = body.password;
    users[body.username].following = {};
    users[body.username].posts = {};

    responseJSON.message = 'Created successfully';
    responseJSON.username = body.username;

    fs.writeFileSync(`${__dirname}/users.txt`, JSON.stringify(users));

    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you were looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  addUser,
  notFound,
  notFoundMeta,
};
