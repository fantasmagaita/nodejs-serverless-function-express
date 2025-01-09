const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  try {
    const { url } = req.body; // Recibe la URL desde Make
    if (!url) {
      return res.status(400).send('URL is required');
    }

    const browser = await puppeteer.launch({ headless: true }); //headless: true para que no se abra el navegador visualmente
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' }); // Espera a que la página cargue completamente

    // Selector del checkbox (inspecciona el elemento en la página web para obtener el selector correcto)
    const checkboxSelector = '#mi-checkbox'; // Reemplaza con el selector real
    await page.waitForSelector(checkboxSelector);
    await page.click(checkboxSelector);

    // Esperar a que se inicie la descarga
    await page.waitForTimeout(5000) // Espera 5 segundos, esto puede variar según la página. Una mejor opción es esperar un evento especifico de la página.

    // Obtener el PDF (esto depende de cómo se genera el PDF en el sitio web. A veces se abre en una nueva pestaña, otras se descarga directamente)
    //Aqui hay varias opciones, dependiendo de como se genere el pdf, te doy dos ejemplos:

    // Opción 1: Si el PDF se descarga directamente
    // Escucha el evento 'response' para interceptar la respuesta de descarga
    page.on('response', async (response) => {
      if (response.headers()['content-type'] === 'application/pdf') {
        const buffer = await response.buffer();
        // Enviar el PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.send(buffer);
      }
    })

    // Opción 2: Si el PDF se abre en una nueva pestaña (menos confiable, pero a veces necesario)
    // const pdfUrl = page.url()
    // if (pdfUrl.endsWith('.pdf')) {
    //   await page.goto(pdfUrl, { waitUntil: 'networkidle2' });
    //   const pdfBuffer = await page.pdf();
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.send(pdfBuffer);
    // }

    await browser.close();

  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
};