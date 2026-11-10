/* Genera los PDF de todas las guías de ejercicios en la carpeta pdf/.
 *
 * Uso (necesita Node y Playwright con Chromium):
 *   npm install playwright
 *   npx playwright install chromium
 *   node herramientas/generar-pdfs.js
 *
 * Abre cada guía en su versión para imprimir (#/imprimir/<seccion>/<capitulo>)
 * y la guarda como pdf/<seccion>-<capitulo>.pdf.
 */
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const pagina = pathToFileURL(path.join(raiz, 'index.html')).href;
const salida = path.join(raiz, 'pdf');

(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const navegador = await chromium.launch();
  const page = await navegador.newPage();
  await page.addInitScript(() => { window.__sinCelebraciones = true; });

  await page.goto(pagina);
  const guias = await page.evaluate(() =>
    window.Curso.secciones.flatMap((s) =>
      s.capitulos.filter((c) => c.guia).map((c) => ({ seccion: s.id, capitulo: c.id, titulo: s.titulo + ' · ' + c.titulo }))
    )
  );

  for (const g of guias) {
    await page.goto(pagina + '#/imprimir/' + g.seccion + '/' + g.capitulo);
    await page.waitForSelector('.impreso-soluciones');
    await page.evaluate(() => document.fonts.ready);
    const archivo = path.join(salida, g.seccion + '-' + g.capitulo + '.pdf');
    await page.pdf({
      path: archivo,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate:
        '<div style="width:100%;font-size:8px;color:#9a9a9a;padding:0 15mm;display:flex;justify-content:space-between;font-family:sans-serif">' +
        '<span>Cálculo · ' + g.titulo.replace(/</g, '&lt;') + '</span>' +
        '<span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>'
    });
    console.log('✓', path.relative(raiz, archivo));
  }

  await navegador.close();
})();
