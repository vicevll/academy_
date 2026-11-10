/* Estructura del curso.
 *
 * Cada capítulo vive en su propio archivo dentro de js/contenido/ y se registra con
 * Curso.registrarCapitulo('derivadas', { ... }). Para agregar un capítulo nuevo:
 *   1. crea js/contenido/<seccion>-capN.js copiando la forma del capítulo 1,
 *   2. agrégalo con un <script> en index.html (antes de js/ejercicio.js).
 */
(function () {
  'use strict';

  var secciones = [
    {
      id: 'derivadas',
      titulo: 'Derivadas',
      simbolo: "f'(x)",
      descripcion: 'Cómo medir el cambio en un instante: de la idea de velocidad a la pendiente de una curva.',
      capitulos: []
    },
    {
      id: 'integrales',
      titulo: 'Integrales',
      simbolo: '\\int',
      descripcion: 'Cómo acumular cambios: áreas, sumas infinitas y el camino de vuelta desde la derivada.',
      capitulos: []
    }
  ];

  var Curso = {
    secciones: secciones,

    registrarCapitulo: function (idSeccion, capitulo) {
      var s = Curso.seccion(idSeccion);
      if (!s) throw new Error('Sección desconocida: ' + idSeccion);
      s.capitulos.push(capitulo);
      s.capitulos.sort(function (a, b) { return a.numero - b.numero; });
    },

    seccion: function (id) {
      return secciones.filter(function (s) { return s.id === id; })[0] || null;
    },

    capitulo: function (idSeccion, idCap) {
      var s = Curso.seccion(idSeccion);
      if (!s) return null;
      return s.capitulos.filter(function (c) { return c.id === idCap; })[0] || null;
    },

    leccion: function (idSeccion, idCap, idLeccion) {
      var c = Curso.capitulo(idSeccion, idCap);
      if (!c) return null;
      return c.lecciones.filter(function (l) { return l.id === idLeccion; })[0] || null;
    },

    rutaLeccion: function (s, c, l) { return s.id + '/' + c.id + '/' + l.id; },

    /* Progreso de un capítulo, de 0 a 1: lecciones completas + ejercicios de la guía resueltos. */
    avanceCapitulo: function (s, c) {
      var P = window.Progreso;
      var hechas = c.lecciones.filter(function (l) {
        return P.leccionCompleta(Curso.rutaLeccion(s, c, l));
      }).length;
      var ejercicios = c.guia ? c.guia.ejercicios : [];
      var resueltos = ejercicios.filter(function (e) { return P.ejercicio(e.id).resuelto; }).length;
      var total = c.lecciones.length + ejercicios.length;
      return {
        lecciones: hechas,
        totalLecciones: c.lecciones.length,
        ejercicios: resueltos,
        totalEjercicios: ejercicios.length,
        fraccion: total ? (hechas + resueltos) / total : 0
      };
    },

    avanceSeccion: function (s) {
      if (!s.capitulos.length) return 0;
      var suma = s.capitulos.reduce(function (acc, c) {
        return acc + Curso.avanceCapitulo(s, c).fraccion;
      }, 0);
      return suma / s.capitulos.length;
    }
  };

  window.Curso = Curso;
})();
