# Cálculo

Curso personal de derivadas e integrales, al estilo de Khan Academy: capítulos con lecciones, guías de ejercicios y medallas.

Sitio estático, sin dependencias de build. Las fórmulas se dibujan con [KaTeX](https://katex.org), incluido en `vendor/`, así que funciona sin conexión.

## Usarlo en local

Abre `index.html` con doble clic. No necesita servidor.

Si prefieres servirlo:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Contenido actual

- **Derivadas**
  - Capítulo 1 · ¿Qué son? — tasa de cambio, interpretación geométrica, definición formal. Guía de 18 ejercicios.
  - Capítulo 2 · Las reglas básicas — álgebra de derivadas, producto y cociente, regla de la cadena. Guía de 18 ejercicios.
- **Integrales**
  - Capítulo 1 · ¿Qué es integrar? — antiderivada, sumas de Riemann, Teorema Fundamental. Guía de 15 ejercicios.
  - Capítulo 2 · Técnicas de integración — sustitución, integración por partes. Guía de 15 ejercicios.

Cada guía se puede descargar en PDF (enunciados y, al final, soluciones) desde `pdf/`, o imprimir desde el navegador.
Hay 39 medallas en tres niveles (bronce, plata y oro).

## Estructura

```
index.html
css/styles.css
js/
  expresiones.js           lee y compara expresiones escritas (3x^2, sen(2x), e^x…)
  progreso.js              estado del estudiante (hoy en localStorage)
  curso.js                 secciones y registro de capítulos
  medallas.js              medallas: cuándo se ganan y su dibujo en SVG
  graficos.js              gráficos interactivos en SVG (secante, tangente, Riemann, acumulación…)
  ejercicio.js             componente de ejercicio (alternativas, número o expresión; pistas; solución)
  app.js                   rutas y vistas
  contenido/
    derivadas-cap1.js      un archivo por capítulo: lecciones y guía
    derivadas-cap2.js
    integrales-cap1.js
    integrales-cap2.js
pdf/                       guías en PDF (generadas)
herramientas/
  generar-pdfs.js          regenera los PDF de las guías
vendor/katex/              KaTeX (CSS, JS y fuentes)
```

## Agregar un capítulo

1. Copia `js/contenido/derivadas-cap1.js` como `js/contenido/<seccion>-capN.js` y cambia el contenido.
   Las fórmulas van en LaTeX: `\( ... \)` en línea y `\[ ... \]` en bloque.
2. Regístralo al final del archivo con `Curso.registrarCapitulo('derivadas' | 'integrales', { ... })`.
3. Agrega el `<script>` en `index.html`, junto a los otros capítulos (antes de `js/app.js`).
4. Agrega sus medallas en `js/medallas.js` con `medallasDeCapitulo({ ... })`.
5. Regenera los PDF (ver abajo).

## Tipos de ejercicio

- `opciones`: alternativas; `correcta` es el índice de la buena.
- `numero`: un valor. El estudiante puede escribir `3`, `-0,5`, `1/4`, `pi/2`, `e-1`…
- `expresion`: una función, por ejemplo una derivada. `respuesta` es la expresión correcta como texto
  (`'3x^2 - 4'`); se compara evaluando en varios puntos. Con `constante: true` acepta cualquier
  antiderivada (difieren en una constante, con o sin `+ C`). `dominio: [a, b]` fija dónde se evalúa.

## Regenerar los PDF

Con Node y Playwright instalados:

```bash
npm install playwright
npx playwright install chromium
node herramientas/generar-pdfs.js
```

## Progreso y login

El progreso se guarda en `localStorage` bajo la clave `calculo.progreso.v1`, como un solo objeto JSON.
Desde la página de Medallas se puede descargar y cargar una copia.

Para pasar a Supabase, basta reemplazar el objeto `Almacen` de `js/progreso.js` por uno que lea y escriba
ese mismo JSON en una tabla (por ejemplo `progreso(user_id uuid primary key, datos jsonb)`). El resto del
sitio solo usa la API de `Progreso`.
