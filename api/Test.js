module.exports = (req, res) => {
    try {
      const puppeteer = require('puppeteer');
      res.status(200).send('Puppeteer importado correctamente.');
    } catch (error) {
      res.status(500).send('Error al importar Puppeteer: ' + error.message);
    }
  };