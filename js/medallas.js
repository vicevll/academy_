/* Medallas (logros).
 *
 * Cada medalla tiene:
 *   nivel   'bronce' | 'plata' | 'oro'  → metal del borde y forma (círculo, hexágono, sello)
 *   tinte   color del centro y de la cinta (uno por grupo)
 *   emblema LaTeX que va al centro (se dibuja con KaTeX)
 *   gana(estado)    → true cuando corresponde otorgarla
 *   avance(estado)  → [valor, meta] opcional, para mostrar cuánto falta
 */
(function () {
  'use strict';

  var NIVELES = { bronce: 'Bronce', plata: 'Plata', oro: 'Oro' };

  var CINTAS = {
    ambar: ['#fbbf24', '#d97706'],
    violeta: ['#a78bfa', '#7c3aed'],
    azul: ['#60a5fa', '#2563eb'],
    indigo: ['#818cf8', '#4f46e5'],
    verde: ['#34d399', '#059669'],
    rosa: ['#fb7185', '#e11d48']
  };

  // ---------------------------------------------------------------------------
  // Ayudantes para leer el progreso
  // ---------------------------------------------------------------------------
  function capitulo(sec, cap) { return window.Curso.capitulo(sec, cap); }

  function rutasLecciones(sec, cap) {
    var c = capitulo(sec, cap);
    return c ? c.lecciones.map(function (l) { return sec + '/' + cap + '/' + l.id; }) : [];
  }

  function idsGuia(sec, cap) {
    var c = capitulo(sec, cap);
    return c && c.guia ? c.guia.ejercicios.map(function (x) { return x.id; }) : [];
  }

  function cuenta(e, ids, campo) {
    return ids.filter(function (id) { return e.ejercicios[id] && e.ejercicios[id][campo]; }).length;
  }

  function totalEjercicios(e, campo) {
    return Object.keys(e.ejercicios).filter(function (id) { return e.ejercicios[id][campo]; }).length;
  }

  function avanceCapitulo(e, sec, cap) {
    var rutas = rutasLecciones(sec, cap), ids = idsGuia(sec, cap);
    var hechas = rutas.filter(function (r) { return !!e.lecciones[r]; }).length;
    return [hechas + cuenta(e, ids, 'resuelto'), rutas.length + ids.length];
  }

  function dominaCapitulo(e, sec, cap) {
    var a = avanceCapitulo(e, sec, cap);
    return a[1] > 0 && a[0] === a[1];
  }

  function avanceSeccion(e, idSeccion) {
    var s = window.Curso.seccion(idSeccion);
    if (!s) return [0, 0];
    return s.capitulos.reduce(function (acc, c) {
      var a = avanceCapitulo(e, idSeccion, c.id);
      return [acc[0] + a[0], acc[1] + a[1]];
    }, [0, 0]);
  }

  function completo(a) { return a[1] > 0 && a[0] === a[1]; }

  /* Medallas estándar de un capítulo: una por lección, guía, perfección y dominio. */
  function medallasDeCapitulo(cfg) {
    var grupo = cfg.grupo, tinte = cfg.tinte, sec = cfg.seccion, cap = cfg.capitulo, pre = cfg.prefijo;
    var lista = cfg.lecciones.map(function (l) {
      var ruta = sec + '/' + cap + '/' + l.leccion;
      return {
        id: pre + '-' + l.id, grupo: grupo, tinte: tinte, nivel: 'bronce',
        nombre: l.nombre, emblema: l.emblema,
        descripcion: 'Completa la lección «' + l.titulo + '».',
        gana: function (e) { return !!e.lecciones[ruta]; }
      };
    });
    lista.push({
      id: pre + '-guia', grupo: grupo, tinte: tinte, nivel: 'plata',
      nombre: 'Guía completa', emblema: '\\Sigma',
      descripcion: 'Resuelve todos los ejercicios de la guía del capítulo.',
      avance: function (e) { var ids = idsGuia(sec, cap); return [cuenta(e, ids, 'resuelto'), ids.length]; },
      gana: function (e) { return completo(this.avance(e)); }
    });
    lista.push({
      id: pre + '-perfecto', grupo: grupo, tinte: tinte, nivel: 'oro',
      nombre: 'Perfeccionista', emblema: '\\bigstar',
      descripcion: 'Resuelve toda la guía al primer intento y sin pistas.',
      avance: function (e) { var ids = idsGuia(sec, cap); return [cuenta(e, ids, 'limpio'), ids.length]; },
      gana: function (e) { return completo(this.avance(e)); }
    });
    lista.push({
      id: pre + '-capitulo', grupo: grupo, tinte: tinte, nivel: 'plata',
      nombre: cfg.dominio.nombre, emblema: cfg.dominio.emblema,
      descripcion: 'Domina el capítulo: todas las lecciones y la guía completa.',
      avance: function (e) { return avanceCapitulo(e, sec, cap); },
      gana: function (e) { return dominaCapitulo(e, sec, cap); }
    });
    return lista;
  }

  // ---------------------------------------------------------------------------
  // Lista de medallas
  // ---------------------------------------------------------------------------
  var G = 'Generales';
  var GL = 'Grandes logros';

  var lista = [
    {
      id: 'primer-paso', grupo: G, tinte: 'ambar', nivel: 'bronce', nombre: 'Primer paso', emblema: '1',
      descripcion: 'Completa tu primera lección.',
      gana: function (e) { return Object.keys(e.lecciones).length >= 1; }
    },
    {
      id: 'primera-respuesta', grupo: G, tinte: 'ambar', nivel: 'bronce', nombre: 'Primera respuesta', emblema: '\\checkmark',
      descripcion: 'Responde bien tu primer ejercicio.',
      gana: function (e) { return totalEjercicios(e, 'resuelto') >= 1; }
    },
    {
      id: 'racha-5', grupo: G, tinte: 'ambar', nivel: 'bronce', nombre: 'En racha', emblema: '\\times 5',
      descripcion: 'Responde bien 5 ejercicios seguidos, sin fallar entre medio.',
      avance: function (e) { return [Math.min(e.mejorRacha, 5), 5]; },
      gana: function (e) { return e.mejorRacha >= 5; }
    },
    {
      id: 'racha-10', grupo: G, tinte: 'ambar', nivel: 'plata', nombre: 'Imparable', emblema: '\\times 10',
      descripcion: 'Responde bien 10 ejercicios seguidos.',
      avance: function (e) { return [Math.min(e.mejorRacha, 10), 10]; },
      gana: function (e) { return e.mejorRacha >= 10; }
    },
    {
      id: 'racha-25', grupo: G, tinte: 'ambar', nivel: 'oro', nombre: 'Racha legendaria', emblema: '\\times 25',
      descripcion: 'Responde bien 25 ejercicios seguidos.',
      avance: function (e) { return [Math.min(e.mejorRacha, 25), 25]; },
      gana: function (e) { return e.mejorRacha >= 25; }
    },
    {
      id: 'sin-red', grupo: G, tinte: 'ambar', nivel: 'plata', nombre: 'Sin red', emblema: '\\varnothing',
      descripcion: 'Resuelve 5 ejercicios al primer intento y sin pedir pistas.',
      avance: function (e) { return [Math.min(totalEjercicios(e, 'limpio'), 5), 5]; },
      gana: function (e) { return totalEjercicios(e, 'limpio') >= 5; }
    },
    {
      id: 'ejercicios-50', grupo: G, tinte: 'ambar', nivel: 'plata', nombre: 'Cincuenta', emblema: '50',
      descripcion: 'Resuelve 50 ejercicios.',
      avance: function (e) { return [Math.min(totalEjercicios(e, 'resuelto'), 50), 50]; },
      gana: function (e) { return totalEjercicios(e, 'resuelto') >= 50; }
    },
    {
      id: 'ejercicios-100', grupo: G, tinte: 'ambar', nivel: 'oro', nombre: 'Centenario', emblema: '100',
      descripcion: 'Resuelve 100 ejercicios.',
      avance: function (e) { return [Math.min(totalEjercicios(e, 'resuelto'), 100), 100]; },
      gana: function (e) { return totalEjercicios(e, 'resuelto') >= 100; }
    },
    {
      id: 'casi-cero', grupo: G, tinte: 'ambar', nivel: 'bronce', nombre: 'Casi cero', emblema: 'h \\to 0',
      descripcion: 'En un gráfico interactivo, achica h hasta 0,01 o menos.',
      gana: function (e) { return !!e.eventos.casiCero; }
    },
    {
      id: 'rectangulos', grupo: G, tinte: 'ambar', nivel: 'bronce', nombre: 'Infinitos rectángulos', emblema: 'n \\to \\infty',
      descripcion: 'Usa 100 rectángulos en una suma de Riemann.',
      gana: function (e) { return !!e.eventos.rectangulos; }
    },
    {
      id: 'papel', grupo: G, tinte: 'ambar', nivel: 'bronce', nombre: 'Papel y lápiz', emblema: '\\text{PDF}',
      descripcion: 'Descarga o imprime una guía de ejercicios.',
      gana: function (e) { return !!e.eventos.papel; }
    },
    {
      id: 'constancia', grupo: G, tinte: 'ambar', nivel: 'bronce', nombre: 'Constancia', emblema: '3\\,\\text{d}',
      descripcion: 'Estudia en 3 días distintos.',
      avance: function (e) { return [Math.min(e.dias.length, 3), 3]; },
      gana: function (e) { return e.dias.length >= 3; }
    },
    {
      id: 'constancia-7', grupo: G, tinte: 'ambar', nivel: 'plata', nombre: 'Hábito', emblema: '7\\,\\text{d}',
      descripcion: 'Estudia en 7 días distintos.',
      avance: function (e) { return [Math.min(e.dias.length, 7), 7]; },
      gana: function (e) { return e.dias.length >= 7; }
    }
  ];

  lista = lista.concat(
    medallasDeCapitulo({
      prefijo: 'd1', seccion: 'derivadas', capitulo: 'que-son', grupo: 'Derivadas · Capítulo 1', tinte: 'azul',
      lecciones: [
        { id: 'velocimetro', leccion: 'tasa-de-cambio', titulo: 'Tasa de cambio', nombre: 'Velocímetro', emblema: '\\Delta' },
        { id: 'tangente', leccion: 'interpretacion-geometrica', titulo: 'Interpretación geométrica', nombre: 'Tangente', emblema: 'm' },
        { id: 'rigor', leccion: 'definicion-formal', titulo: 'Definición formal', nombre: 'Con rigor', emblema: '\\lim' }
      ],
      dominio: { nombre: '¿Qué son?', emblema: "f'" }
    }),
    medallasDeCapitulo({
      prefijo: 'd2', seccion: 'derivadas', capitulo: 'reglas-basicas', grupo: 'Derivadas · Capítulo 2', tinte: 'indigo',
      lecciones: [
        { id: 'potencia', leccion: 'algebra-de-derivadas', titulo: 'Álgebra de derivadas', nombre: 'Potencia', emblema: 'x^n' },
        { id: 'producto', leccion: 'producto-y-cociente', titulo: 'Regla del producto y del cociente', nombre: 'Producto', emblema: 'fg' },
        { id: 'cadena', leccion: 'regla-de-la-cadena', titulo: 'Regla de la cadena', nombre: 'Eslabones', emblema: 'f\\!\\circ\\! g' }
      ],
      dominio: { nombre: 'Las reglas', emblema: '\\tfrac{d}{dx}' }
    }),
    medallasDeCapitulo({
      prefijo: 'i1', seccion: 'integrales', capitulo: 'que-es-integrar', grupo: 'Integrales · Capítulo 1', tinte: 'verde',
      lecciones: [
        { id: 'antiderivada', leccion: 'antiderivada', titulo: 'La antiderivada', nombre: 'Marcha atrás', emblema: '+C' },
        { id: 'riemann', leccion: 'sumas-de-riemann', titulo: 'Sumas de Riemann', nombre: 'Rectángulos', emblema: '\\textstyle\\sum' },
        { id: 'tfc', leccion: 'teorema-fundamental', titulo: 'El Teorema Fundamental del Cálculo', nombre: 'El puente', emblema: 'F(b)' }
      ],
      dominio: { nombre: '¿Qué es integrar?', emblema: '\\textstyle\\int' }
    }),
    medallasDeCapitulo({
      prefijo: 'i2', seccion: 'integrales', capitulo: 'tecnicas', grupo: 'Integrales · Capítulo 2', tinte: 'rosa',
      lecciones: [
        { id: 'sustitucion', leccion: 'sustitucion', titulo: 'Sustitución o cambio de variable', nombre: 'Cambio de variable', emblema: 'u' },
        { id: 'partes', leccion: 'por-partes', titulo: 'Integración por partes', nombre: 'La vaca', emblema: 'uv' }
      ],
      dominio: { nombre: 'Técnicas', emblema: 'dv' }
    }),
    [
      {
        id: 'derivadas-completas', grupo: GL, tinte: 'violeta', nivel: 'oro', nombre: 'Maestro de las derivadas', emblema: "f'(x)",
        descripcion: 'Domina todos los capítulos de Derivadas.',
        avance: function (e) { return avanceSeccion(e, 'derivadas'); },
        gana: function (e) { return completo(this.avance(e)); }
      },
      {
        id: 'integrales-completas', grupo: GL, tinte: 'violeta', nivel: 'oro', nombre: 'Maestro de las integrales', emblema: '\\textstyle\\int\\! dx',
        descripcion: 'Domina todos los capítulos de Integrales.',
        avance: function (e) { return avanceSeccion(e, 'integrales'); },
        gana: function (e) { return completo(this.avance(e)); }
      },
      {
        id: 'calculo-completo', grupo: GL, tinte: 'violeta', nivel: 'oro', nombre: 'Cálculo completo', emblema: '\\infty',
        descripcion: 'Domina todo el curso: derivadas e integrales.',
        avance: function (e) {
          var a = avanceSeccion(e, 'derivadas'), b = avanceSeccion(e, 'integrales');
          return [a[0] + b[0], a[1] + b[1]];
        },
        gana: function (e) { return completo(this.avance(e)); }
      }
    ]
  );

  // ---------------------------------------------------------------------------
  // Dibujo de la insignia (SVG)
  // ---------------------------------------------------------------------------
  function puntos(lados, radio, cx, cy, giro) {
    var p = [];
    for (var i = 0; i < lados; i++) {
      var a = giro + i * 2 * Math.PI / lados;
      p.push((cx + radio * Math.cos(a)).toFixed(2) + ',' + (cy + radio * Math.sin(a)).toFixed(2));
    }
    return p.join(' ');
  }

  function sello(picos, rExt, rInt, cx, cy) {
    var p = [];
    for (var i = 0; i < picos * 2; i++) {
      var r = i % 2 === 0 ? rExt : rInt, a = -Math.PI / 2 + i * Math.PI / picos;
      p.push((cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2));
    }
    return p.join(' ');
  }

  var CX = 50, CY = 76;
  var FORMAS = {
    bronce: function (metal, tinte) {
      return '<circle cx="' + CX + '" cy="' + CY + '" r="36" fill="' + metal + '"/>' +
        '<circle cx="' + CX + '" cy="' + CY + '" r="36" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="1"/>' +
        '<circle cx="' + CX + '" cy="' + CY + '" r="29" fill="' + tinte + '"/>';
    },
    plata: function (metal, tinte) {
      return '<polygon points="' + puntos(6, 39, CX, CY, -Math.PI / 2) + '" fill="' + metal + '" stroke="rgba(0,0,0,.12)" stroke-width="1" stroke-linejoin="round"/>' +
        '<polygon points="' + puntos(6, 31, CX, CY, -Math.PI / 2) + '" fill="' + tinte + '" stroke-linejoin="round"/>';
    },
    oro: function (metal, tinte) {
      return '<polygon points="' + sello(16, 40, 35, CX, CY) + '" fill="' + metal + '" stroke="rgba(0,0,0,.12)" stroke-width="1" stroke-linejoin="round"/>' +
        '<circle cx="' + CX + '" cy="' + CY + '" r="29" fill="' + tinte + '"/>';
    }
  };

  var CANDADO = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.6" fill="currentColor"/><path d="M5.2 7V5.4a2.8 2.8 0 0 1 5.6 0V7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

  function insignia(m, opciones) {
    opciones = opciones || {};
    var ganada = opciones.ganada != null ? opciones.ganada : window.Progreso.tieneMedalla(m.id);
    var tam = opciones.tam || 88;
    var cinta = CINTAS[m.tinte] || CINTAS.ambar;
    var metal = 'url(#m-' + m.nivel + ')', tinte = 'url(#t-' + m.tinte + ')';
    var largo = m.emblema.replace(/\\[a-z]+|[{}\\!,]/gi, 'x').length;
    var escala = largo > 5 ? 0.62 : (largo > 3 ? 0.78 : 1);

    var dibujo =
      '<svg viewBox="0 0 100 120" aria-hidden="true" focusable="false">' +
        '<path d="M27 0h19l12 47H39z" fill="' + cinta[0] + '"/>' +
        '<path d="M73 0H54L42 47h19z" fill="' + cinta[1] + '"/>' +
        '<path d="M36 0h3l12 47h-3z" fill="rgba(255,255,255,.35)"/>' +
        '<g class="insignia-cuerpo">' +
          FORMAS[m.nivel](metal, tinte) +
          '<circle cx="' + CX + '" cy="' + CY + '" r="23.5" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.1" stroke-dasharray="1.6 2.4"/>' +
          '<path d="M31 66a22 22 0 0 1 27-14" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.6" stroke-linecap="round"/>' +
        '</g>' +
      '</svg>';

    return '<span class="insignia insignia--' + m.nivel + (ganada ? ' insignia--ganada' : ' insignia--bloqueada') + '" style="--t:' + tam + 'px;--e:' + escala + '">' +
      dibujo +
      '<span class="insignia-emblema">' + window.Mates.html(m.emblema) + '</span>' +
      (ganada ? '' : '<span class="insignia-candado">' + CANDADO + '</span>') +
      '</span>';
  }

  // ---------------------------------------------------------------------------
  // API
  // ---------------------------------------------------------------------------
  var Medallas = {
    lista: lista,
    niveles: NIVELES,
    insignia: insignia,

    porId: function (id) {
      return lista.filter(function (m) { return m.id === id; })[0] || null;
    },

    grupos: function () {
      var orden = [], mapa = {};
      lista.forEach(function (m) {
        if (!mapa[m.grupo]) { mapa[m.grupo] = []; orden.push(m.grupo); }
        mapa[m.grupo].push(m);
      });
      return orden.map(function (g) { return { nombre: g, tinte: mapa[g][0].tinte, medallas: mapa[g] }; });
    },

    ganadas: function () {
      var P = window.Progreso;
      return lista.filter(function (m) { return P.tieneMedalla(m.id); });
    },

    avance: function (m) {
      if (!m.avance) return null;
      try { return m.avance(window.Progreso.estado()); } catch (e) { return null; }
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
