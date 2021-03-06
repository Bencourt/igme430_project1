const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/login.html`);
const homepage = fs.readFileSync(`${__dirname}/../client/homePage.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getHomepage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(homepage);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

module.exports = {
  getIndex,
  getHomepage,
  getCSS,
};
