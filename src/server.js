const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const postHandler = require('./postResponses.js');
//const { parse } = require('path');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const URLStruct = {
    'GET':
    {
        '/' : htmlHandler.getIndex,
        '/style.css' : htmlHandler.getCSS,
        '/homepage' : htmlHandler.getHomepage,
        '/getUsers' : jsonHandler.getUsers,
        '/updateUser' : jsonHandler.updateUser,
        '/getPosts' : postHandler.getPosts,
        notFound : jsonHandler.notFound
    },
    'HEAD' :
    {
        '/getUsers' : jsonHandler.getUsersMeta,
        notFound : jsonHandler.notFoundMeta
    }
}


const handlePost = (request, response, parsedUrl) =>
{
    if(parsedUrl.pathname === '/addUser')
    {
        const body = [];

        request.on('error', (err) => {
            console.dir(err);
            response.statusCode = 400;
            response.end();
        });

        request.on('data', (chunk) => {
            body.push(chunk);
        });

        request.on('end', () => {
            const bodyString = Buffer.concat(body).toString();
            const bodyParams = query.parse(bodyString);

            jsonHandler.addUser(request, response, bodyParams);
        });
    }
    if(parsedUrl.pathname === '/addPost')
    {
        const body = [];

        request.on('error', (err) => {
            console.dir(err);
            response.statusCode = 400;
            response.end();
        });

        request.on('data', (chunk) => {
            body.push(chunk);
        });

        request.on('end', () => {
            const bodyString = Buffer.concat(body).toString();
            const bodyParams = query.parse(bodyString);

            postHandler.addPost(request, response, bodyParams);
        });
    }
};

const handleGetHead = (request, response, parsedUrl) =>
{
  if(URLStruct[request.method][parsedUrl.pathname])
  {
      URLStruct[request.method][parsedUrl.pathname](request, response, parsedUrl);
  }
  else
  {
      URLStruct[request.method].notFound(request, response);
  }
}


const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  console.dir(parsedUrl.pathname);
  console.dir(request.method);
if(request.method === 'GET' || request.method === 'HEAD')
{
    handleGetHead(request, response, parsedUrl);
}
else if(request.method === 'POST')
{
    handlePost(request, response, parsedUrl);
}
else{
    URLStruct[request.method].notFound(request, response);
}
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);