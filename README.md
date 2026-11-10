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
  - Capítulo 1 · ¿Qué son?
    - Tasa de cambio
    - Interpretación geométrica
    - Definición formal
    - Guía de ejercicios (18)
- **Integrales** — próximamente

## Estructura

```
index.html
css/styles.css
js/
  progreso.js              estado del estudiante (hoy en localStorage)
  curso.js                 secciones y registro de capítulos
  medallas.js              definición de medallas y cuándo se ganan
  graficos.js              gráficos interactivos en SVG
  ejercicio.js             componente de ejercicio (alternativas / numérico, pistas, solución)
  app.js                   rutas y vistas
  contenido/
    derivadas-cap1.js      lecciones y guía del capítulo 1
vendor/katex/              KaTeX (CSS, JS y fuentes)
```

## Agregar un capítulo

1. Copia `js/contenido/derivadas-cap1.js` como `js/contenido/<seccion>-capN.js` y cambia el contenido.
   Las fórmulas van en LaTeX: `\( ... \)` en línea y `\[ ... \]` en bloque.
2. Regístralo al final del archivo con `Curso.registrarCapitulo('derivadas' | 'integrales', { ... })`.
3. Agrega el `<script>` en `index.html`, antes de `js/ejercicio.js`.
4. Si quieres medallas para el capítulo, súmalas en `js/medallas.js`.

## Progreso y login

El progreso se guarda en `localStorage` bajo la clave `calculo.progreso.v1`, como un solo objeto JSON.
Desde la página de Medallas se puede descargar y cargar una copia.

Para pasar a Supabase, basta reemplazar el objeto `Almacen` de `js/progreso.js` por uno que lea y escriba
ese mismo JSON en una tabla (por ejemplo `progreso(user_id uuid primary key, datos jsonb)`). El resto del
sitio solo usa la API de `Progreso`.
