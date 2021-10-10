// requirements
const fs = require('fs');
const query = require('querystring');

// gets the users from the users.txt file
let usersText = fs.readFileSync(`${__dirname}/users.txt`);
let users = JSON.parse(usersText);

// gets the posts from the postID.txt file
let postIDText = fs.readFileSync(`${__dirname}/postID.txt`);
let postID = JSON.parse(postIDText);

// function to reload the users
const reloadUsers = () => {
  usersText = fs.readFileSync(`${__dirname}/users.txt`);
  users = JSON.parse(usersText);
};

// function to reload the posts
const reloadPosts = () => {
  postIDText = fs.readFileSync(`${__dirname}/postID.txt`);
  postID = JSON.parse(postIDText);
};

// basic respondJSON
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// basic respondJSONMeta
/* const respondJSONMeta = (request, response, status) => {
    const headers =
    {
        'Content-type': 'application/json'
    }

    response.writeHead(status, headers);
    response.end();
}; */

// getPosts request
const getPosts = (request, response, parsedUrl) => {
  // reloads the posts file
  reloadPosts();
  // gets the query parameters from the url
  const params = query.parse(parsedUrl.query);
  // sets up the json response object
  const responseJSON = {
    message: 'missing query parameters',
  };
    // if the request parameters are missing, respond with code 400
  let status = 400;
  if (!params.numPosts) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, status, responseJSON);
  }

  // if the range of posts requested is too big, respond with code 416
  status = 416;
  responseJSON.message = 'the requested range of posts is beyond the length of the posts';
  if (postID.length < parseInt(params.numPosts, 10) + 5) {
    responseJSON.id = 'rangeNotSatisfiable';
    return respondJSON(request, response, status, responseJSON);
  }

  // if the parameters are satisfiable, respond with code 200 and find the posts in the text files
  status = 200;
  responseJSON.postsArray = {};
  // if(!users[params.username])
  // {
  for (let i = 0; i < 5; i++) {
    const postIdValue = postID[Object.keys(postID)[Object.keys(postID).length - (1 + i)]];
    const postUsername = postIdValue.split('~./&?')[0];
    console.log(postUsername);
    responseJSON.postsArray[i.toString()] = users[postUsername].posts[postIdValue];
    console.log(i);
    console.log(responseJSON.postsArray);
  }
  responseJSON.message = 'successfully retreived posts';
  return respondJSON(request, response, status, responseJSON);
  // }
  /*
    else{
        const following = users[params.username].following;
        for(let i = parseInt(params.numPosts); i < parseInt(params.numPosts) + 5; i++)
        {
            const postIdValue =  postID[i];
            const postUsername = postIdValue.split('~./&?');
            for(let j = 0; j < following.length; j++)
            {
                if(following[j] == postUsername[0])
                {
                    responseJSON.postsArray[i] = users[postID[i]].posts[postID[i]];
                    break;
                }
            };
        }
        */
  // responseJSON.message = 'successfully retreived posts';
  // return respondJSON(request, response, status, responseJSON);
  // }
};

// addPost request
const addPost = (request, response, body) => {
  const responseJSON = {
    message: 'text field is required',
  };

  if (!body.post || !body.username) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  reloadUsers();
  if (!users[body.username]) {
    responseJSON.message = 'user missing from database';
    responseJSON.id = 'internalServerError';
    return respondJSON(request, response, 500, responseJSON);
  }

  reloadPosts();

  // add the postID to the postID file
  const newID = `${body.username}~./&?${body.postedTime}`;

  postID[newID] = newID;

  users[body.username].posts[newID] = {
    username: body.username,
    text: body.post,
    postedTime: body.postedTime,
  };

  fs.writeFileSync(`${__dirname}/users.txt`, JSON.stringify(users));
  fs.writeFileSync(`${__dirname}/postID.txt`, JSON.stringify(postID));
  responseJSON.message = 'Successfully created post';
  return respondJSON(request, response, 201, responseJSON);
};

module.exports = {
  addPost,
  getPosts,
};
