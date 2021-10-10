const fs = require('fs');

const logoWhite = fs.readFileSync(`${__dirname}/../client/media/Tigr_Logo_white.png`);
const logoOrange = fs.readFileSync(`${__dirname}/../client/media/Tigr_Logo_orange.png`);
const tigrLogin = fs.readFileSync(`${__dirname}/../client/media/Tigr_Login.png`);

const getLogoWhite = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(logoWhite);
  response.end();
};

const getLogoOrange = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.write(logoOrange);
    response.end();
  };

const getTigrLogin = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.write(tigrLogin);
    response.end();
};

module.exports = {
    getLogoWhite,
    getLogoOrange,
    getTigrLogin,
}