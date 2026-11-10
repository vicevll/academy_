/* Medallas (logros).
 *
 * Cada medalla tiene una función `gana(estado)` que mira el progreso guardado y
 * devuelve true cuando corresponde otorgarla. `emblema` es LaTeX: se dibuja con KaTeX.
 */
(function () {
  'use strict';

  function leccionHecha(ruta) {
    return function (e) { return !!e.lecciones[ruta]; };
  }

  function ejerciciosDeGuia(idSeccion, idCap) {
    var c = window.Curso.capitulo(idSeccion, idCap);
    return c && c.guia ? c.guia.ejercicios : [];
  }

  function cuenta(e, filtro) {
    return Object.keys(e.ejercicios).filter(function (id) { return filtro(e.ejercicios[id]); }).length;
  }

  var lista = [
    // --- Generales ---
    {
      id: 'primer-paso', grupo: 'Generales', nombre: 'Primer paso', emblema: '1',
      descripcion: 'Completa tu primera lección.',
      gana: function (e) { return Object.keys(e.lecciones).length >= 1; }
    },
    {
      id: 'primera-respuesta', grupo: 'Generales', nombre: 'Primera respuesta', emblema: '\\checkmark',
      descripcion: 'Responde bien tu primer ejercicio.',
      gana: function (e) { return cuenta(e, function (x) { return x.resuelto; }) >= 1; }
    },
    {
      id: 'racha-5', grupo: 'Generales', nombre: 'En racha', emblema: '\\times 5',
      descripcion: 'Responde bien 5 ejercicios seguidos, sin fallar entre medio.',
      gana: function (e) { return e.mejorRacha >= 5; }
    },
    {
      id: 'sin-red', grupo: 'Generales', nombre: 'Sin red', emblema: '\\varnothing',
      descripcion: 'Resuelve 5 ejercicios al primer intento y sin pedir pistas.',
      gana: function (e) { return cuenta(e, function (x) { return x.limpio; }) >= 5; }
    },
    {
      id: 'casi-cero', grupo: 'Generales', nombre: 'Casi cero', emblema: 'h \\to 0',
      descripcion: 'En un gráfico interactivo, achica h hasta 0,01 o menos.',
      gana: function (e) { return !!e.eventos.casiCero; }
    },
    {
      id: 'constancia', grupo: 'Generales', nombre: 'Constancia', emblema: '3\\,\\text{d}',
      descripcion: 'Estudia en 3 días distintos.',
      gana: function (e) { return e.dias.length >= 3; }
    },

    // --- Derivadas · Capítulo 1 ---
    {
      id: 'd1-velocimetro', grupo: 'Derivadas · Capítulo 1', nombre: 'Velocímetro', emblema: '\\Delta',
      descripcion: 'Completa la lección «Tasa de cambio».',
      gana: leccionHecha('derivadas/que-son/tasa-de-cambio')
    },
    {
      id: 'd1-tangente', grupo: 'Derivadas · Capítulo 1', nombre: 'Tangente', emblema: 'm',
      descripcion: 'Completa la lección «Interpretación geométrica».',
      gana: leccionHecha('derivadas/que-son/interpretacion-geometrica')
    },
    {
      id: 'd1-rigor', grupo: 'Derivadas · Capítulo 1', nombre: 'Con rigor', emblema: '\\lim',
      descripcion: 'Completa la lección «Definición formal».',
      gana: leccionHecha('derivadas/que-son/definicion-formal')
    },
    {
      id: 'd1-guia', grupo: 'Derivadas · Capítulo 1', nombre: 'Guía completa', emblema: '\\Sigma',
      descripcion: 'Resuelve todos los ejercicios de la guía del capítulo.',
      gana: function (e) {
        var ej = ejerciciosDeGuia('derivadas', 'que-son');
        return ej.length > 0 && ej.every(function (x) { return e.ejercicios[x.id] && e.ejercicios[x.id].resuelto; });
      }
    },
    {
      id: 'd1-perfecto', grupo: 'Derivadas · Capítulo 1', nombre: 'Perfeccionista', emblema: '\\bigstar',
      descripcion: 'Resuelve toda la guía al primer intento y sin pistas.',
      gana: function (e) {
        var ej = ejerciciosDeGuia('derivadas', 'que-son');
        return ej.length > 0 && ej.every(function (x) { return e.ejercicios[x.id] && e.ejercicios[x.id].limpio; });
      }
    },
    {
      id: 'd1-capitulo', grupo: 'Derivadas · Capítulo 1', nombre: '¿Qué son?', emblema: "f'",
      descripcion: 'Domina el capítulo: las tres lecciones y la guía completa.',
      gana: function (e) {
        var c = window.Curso.capitulo('derivadas', 'que-son');
        if (!c) return false;
        var lecciones = c.lecciones.every(function (l) { return !!e.lecciones['derivadas/que-son/' + l.id]; });
        var guia = c.guia.ejercicios.every(function (x) { return e.ejercicios[x.id] && e.ejercicios[x.id].resuelto; });
        return lecciones && guia;
      }
    }
  ];

  var Medallas = {
    lista: lista,

    porId: function (id) {
      return lista.filter(function (m) { return m.id === id; })[0] || null;
    },

    grupos: function () {
      var orden = [];
      var mapa = {};
      lista.forEach(function (m) {
        if (!mapa[m.grupo]) { mapa[m.grupo] = []; orden.push(m.grupo); }
        mapa[m.grupo].push(m);
      });
      return orden.map(function (g) { return { nombre: g, medallas: mapa[g] }; });
    },

    ganadas: function () {
      var P = window.Progreso;
      return lista.filter(function (m) { return P.tieneMedalla(m.id); });
    },

    /* Revisa todas las medallas y devuelve las que se acaban de ganar. */
    revisar: function () {
      var P = window.Progreso;
      var e = P.estado();
      var nuevas = [];
      lista.forEach(function (m) {
        if (P.tieneMedalla(m.id)) return;
        var ok = false;
        try { ok = m.gana(e); } catch (err) { ok = false; }
        if (ok && P.otorgarMedalla(m.id)) nuevas.push(m);
      });
      return nuevas;
    }
  };

  window.Medallas = Medallas;
})();
