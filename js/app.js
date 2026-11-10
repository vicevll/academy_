/* Rutas y vistas.
 *
 *   #/                                   inicio
 *   #/medallas                           medallas y progreso
 *   #/<seccion>                          capítulos de una sección
 *   #/<seccion>/<capitulo>               índice del capítulo
 *   #/<seccion>/<capitulo>/<leccion>     lección
 *   #/<seccion>/<capitulo>/guia[/<n>]    guía de ejercicios (ejercicio n)
 */
(function () {
  'use strict';

  var Curso = window.Curso, Progreso = window.Progreso, Medallas = window.Medallas;
  var Mates = window.Mates, Ejercicio = window.Ejercicio, Graficos = window.Graficos;
  var app = document.getElementById('app');

  /* Función que refresca las partes de la vista actual que dependen del progreso. */
  var refrescarVista = null;

  // ---------------------------------------------------------------------------
  // Utilidades
  // ---------------------------------------------------------------------------
  function pct(fraccion) { return Math.round(fraccion * 100); }

  function barra(fraccion, etiqueta) {
    return '<div class="progreso" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct(fraccion) +
      '" aria-label="' + (etiqueta || 'Avance') + '"><div class="progreso-relleno" style="width:' + pct(fraccion) + '%"></div></div>';
  }

  function fechaCorta(iso) {
    try { return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch (e) { return ''; }
  }

  function medallaHTML(m, opciones) {
    var ganada = Progreso.tieneMedalla(m.id);
    var chica = opciones && opciones.chica;
    return '<div class="medalla' + (ganada ? ' medalla--ganada' : '') + (chica ? ' medalla--chica' : '') + '" title="' + m.nombre + (ganada ? '' : ' (bloqueada)') + '">' +
      '<div class="medalla-disco" aria-hidden="true">' + Mates.html(m.emblema) + '</div>' +
      (chica ? '<span class="oculto">' + m.nombre + (ganada ? '' : ' (bloqueada)') + '</span>' :
        '<div class="medalla-texto"><p class="medalla-nombre">' + m.nombre + '</p>' +
        '<p class="medalla-desc">' + m.descripcion + '</p>' +
        '<p class="medalla-estado">' + (ganada ? 'Ganada el ' + fechaCorta(Progreso.estado().medallas[m.id]) : 'Bloqueada') + '</p></div>') +
      '</div>';
  }

  /* Primera cosa pendiente del curso: una lección sin completar o la guía sin terminar. */
  function siguientePaso() {
    for (var i = 0; i < Curso.secciones.length; i++) {
      var s = Curso.secciones[i];
      for (var j = 0; j < s.capitulos.length; j++) {
        var c = s.capitulos[j];
        for (var k = 0; k < c.lecciones.length; k++) {
          var l = c.lecciones[k];
          if (!Progreso.leccionCompleta(Curso.rutaLeccion(s, c, l))) {
            return { href: '#/' + s.id + '/' + c.id + '/' + l.id, titulo: l.titulo, detalle: s.titulo + ' · Capítulo ' + c.numero + ' · Lección ' + (k + 1) };
          }
        }
        var av = Curso.avanceCapitulo(s, c);
        if (av.ejercicios < av.totalEjercicios) {
          return { href: '#/' + s.id + '/' + c.id + '/guia', titulo: 'Guía de ejercicios', detalle: s.titulo + ' · Capítulo ' + c.numero + ' · ' + av.ejercicios + ' de ' + av.totalEjercicios + ' resueltos' };
        }
      }
    }
    return null;
  }

  function hayProgreso() {
    var e = Progreso.estado();
    return Object.keys(e.lecciones).length > 0 || Object.keys(e.ejercicios).length > 0;
  }

  // ---------------------------------------------------------------------------
  // Inicio
  // ---------------------------------------------------------------------------
  function vistaInicio() {
    var paso = siguientePaso();
    var ganadas = Medallas.ganadas().length;

    var tarjetas = Curso.secciones.map(function (s) {
      var disponible = s.capitulos.length > 0;
      var av = Curso.avanceSeccion(s);
      return '<a class="tarjeta' + (disponible ? '' : ' tarjeta--pronto') + '" href="#/' + s.id + '">' +
        '<div class="tarjeta-simbolo" aria-hidden="true">' + Mates.html(s.simbolo) + '</div>' +
        '<h2>' + s.titulo + '</h2>' +
        '<p>' + s.descripcion + '</p>' +
        (disponible
          ? '<div class="tarjeta-pie">' + barra(av, 'Avance en ' + s.titulo) + '<span>' + pct(av) + '%</span></div>' +
            '<p class="tarjeta-meta">' + s.capitulos.length + (s.capitulos.length === 1 ? ' capítulo disponible' : ' capítulos disponibles') + '</p>'
          : '<p class="tarjeta-meta">Próximamente</p>') +
        '</a>';
    }).join('');

    app.innerHTML =
      '<div class="pagina">' +
        '<section class="portada">' +
          '<h1>Cálculo</h1>' +
          '<p class="portada-bajada">Derivadas e integrales, desde la idea hasta la práctica.</p>' +
          (paso
            ? '<a class="continuar" href="' + paso.href + '">' +
                '<span class="continuar-rotulo">' + (hayProgreso() ? 'Continuar' : 'Empezar') + '</span>' +
                '<span class="continuar-titulo">' + paso.titulo + '</span>' +
                '<span class="continuar-detalle">' + paso.detalle + '</span>' +
              '</a>'
            : '<p class="continuar continuar--listo"><span class="continuar-rotulo">Al día</span><span class="continuar-titulo">Completaste todo el contenido disponible.</span></p>') +
        '</section>' +
        '<section class="tarjetas" aria-label="Secciones">' + tarjetas + '</section>' +
        '<section class="bloque">' +
          '<div class="bloque-cabeza"><h2>Medallas</h2><a href="#/medallas">' + ganadas + ' de ' + Medallas.lista.length + ' · Ver todas</a></div>' +
          '<div class="medallas-fila">' + Medallas.lista.map(function (m) { return medallaHTML(m, { chica: true }); }).join('') + '</div>' +
        '</section>' +
      '</div>';
  }

  // ---------------------------------------------------------------------------
  // Sección (lista de capítulos)
  // ---------------------------------------------------------------------------
  function vistaSeccion(s) {
    var capitulos = s.capitulos.map(function (c) {
      var av = Curso.avanceCapitulo(s, c);
      return '<a class="capitulo" href="#/' + s.id + '/' + c.id + '">' +
        '<p class="sobretitulo">Capítulo ' + c.numero + '</p>' +
        '<h2>' + c.titulo + '</h2>' +
        '<p>' + c.resumen + '</p>' +
        '<ul class="capitulo-temas">' +
          c.lecciones.map(function (l) { return '<li>' + l.titulo + '</li>'; }).join('') +
          '<li>Guía de ejercicios</li>' +
        '</ul>' +
        '<div class="tarjeta-pie">' + barra(av.fraccion, 'Avance del capítulo') + '<span>' + pct(av.fraccion) + '%</span></div>' +
        '</a>';
    }).join('');

    app.innerHTML =
      '<div class="pagina">' +
        '<nav class="migas"><a href="#/">Inicio</a><span>/</span>' + s.titulo + '</nav>' +
        '<header class="cabecera">' +
          '<h1>' + s.titulo + '</h1>' +
          '<p class="cabecera-bajada">' + s.descripcion + '</p>' +
        '</header>' +
        (capitulos
          ? '<div class="capitulos">' + capitulos + '</div><p class="nota-pie">Los siguientes capítulos se irán sumando aquí.</p>'
          : '<div class="vacio"><div class="vacio-simbolo" aria-hidden="true">' + Mates.html(s.simbolo) + '</div><p><strong>Próximamente.</strong></p><p>Esta sección todavía no tiene capítulos.</p><p><a href="#/derivadas">Ir a Derivadas</a></p></div>') +
      '</div>';
  }

  // ---------------------------------------------------------------------------
  // Capítulo (índice)
  // ---------------------------------------------------------------------------
  function vistaCapitulo(s, c) {
    var av = Curso.avanceCapitulo(s, c);
    var filas = c.lecciones.map(function (l, i) {
      var hecha = Progreso.leccionCompleta(Curso.rutaLeccion(s, c, l));
      return '<li><a class="fila' + (hecha ? ' fila--hecha' : '') + '" href="#/' + s.id + '/' + c.id + '/' + l.id + '">' +
        '<span class="fila-marca" aria-hidden="true">' + (hecha ? '✓' : (i + 1)) + '</span>' +
        '<span class="fila-texto"><strong>' + l.titulo + '</strong><span>' + l.resumen + '</span></span>' +
        '<span class="fila-meta">' + (hecha ? 'Completada' : l.minutos + ' min') + '</span>' +
        '</a></li>';
    }).join('');

    var guiaLista = av.totalEjercicios > 0 && av.ejercicios === av.totalEjercicios;
    var filaGuia = c.guia
      ? '<li><a class="fila fila--guia' + (guiaLista ? ' fila--hecha' : '') + '" href="#/' + s.id + '/' + c.id + '/guia">' +
          '<span class="fila-marca" aria-hidden="true">' + (guiaLista ? '✓' : '✎') + '</span>' +
          '<span class="fila-texto"><strong>' + c.guia.titulo + '</strong><span>' + c.guia.resumen + '</span></span>' +
          '<span class="fila-meta">' + av.ejercicios + ' / ' + av.totalEjercicios + '</span>' +
        '</a></li>'
      : '';

    app.innerHTML =
      '<div class="pagina">' +
        '<nav class="migas"><a href="#/">Inicio</a><span>/</span><a href="#/' + s.id + '">' + s.titulo + '</a><span>/</span>Capítulo ' + c.numero + '</nav>' +
        '<header class="cabecera">' +
          '<p class="sobretitulo">' + s.titulo + ' · Capítulo ' + c.numero + '</p>' +
          '<h1>' + c.titulo + '</h1>' +
          '<p class="cabecera-bajada">' + c.resumen + '</p>' +
          '<div class="tarjeta-pie tarjeta-pie--ancho">' + barra(av.fraccion, 'Avance del capítulo') + '<span>' + pct(av.fraccion) + '%</span></div>' +
        '</header>' +
        '<ol class="filas">' + filas + filaGuia + '</ol>' +
      '</div>';
  }

  // ---------------------------------------------------------------------------
  // Barra lateral del capítulo (lecciones + guía)
  // ---------------------------------------------------------------------------
  function lateralHTML(s, c, activo) {
    var av = Curso.avanceCapitulo(s, c);
    var items = c.lecciones.map(function (l) {
      var hecha = Progreso.leccionCompleta(Curso.rutaLeccion(s, c, l));
      return '<li><a class="' + (activo === l.id ? 'activo ' : '') + (hecha ? 'hecho' : '') + '" href="#/' + s.id + '/' + c.id + '/' + l.id + '"' + (activo === l.id ? ' aria-current="page"' : '') + '>' +
        '<span class="punto" aria-hidden="true">' + (hecha ? '✓' : '') + '</span>' + l.titulo + '</a></li>';
    }).join('');
    var guiaLista = av.totalEjercicios > 0 && av.ejercicios === av.totalEjercicios;
    items += '<li><a class="' + (activo === 'guia' ? 'activo ' : '') + (guiaLista ? 'hecho' : '') + '" href="#/' + s.id + '/' + c.id + '/guia"' + (activo === 'guia' ? ' aria-current="page"' : '') + '>' +
      '<span class="punto" aria-hidden="true">' + (guiaLista ? '✓' : '') + '</span>Guía de ejercicios<small>' + av.ejercicios + '/' + av.totalEjercicios + '</small></a></li>';

    return '<a class="lateral-volver" href="#/' + s.id + '/' + c.id + '">← ' + s.titulo + ' · Capítulo ' + c.numero + '</a>' +
      '<p class="lateral-titulo">' + c.titulo + '</p>' +
      barra(av.fraccion, 'Avance del capítulo') +
      '<ol class="lateral-lista">' + items + '</ol>';
  }

  // ---------------------------------------------------------------------------
  // Lección
  // ---------------------------------------------------------------------------
  function vistaLeccion(s, c, l) {
    var indice = c.lecciones.indexOf(l);
    var ruta = Curso.rutaLeccion(s, c, l);
    var siguiente = c.lecciones[indice + 1];
    var hrefSiguiente = siguiente ? '#/' + s.id + '/' + c.id + '/' + siguiente.id : '#/' + s.id + '/' + c.id + '/guia';
    var tituloSiguiente = siguiente ? 'Siguiente lección: ' + siguiente.titulo : 'Ir a la guía de ejercicios';

    app.innerHTML =
      '<div class="estudio">' +
        '<aside class="lateral" id="lateral"></aside>' +
        '<article class="leccion">' +
          '<p class="sobretitulo">' + s.titulo + ' · Capítulo ' + c.numero + ' · Lección ' + (indice + 1) + ' de ' + c.lecciones.length + '</p>' +
          '<h1>' + l.titulo + '</h1>' +
          '<div class="prosa" id="prosa">' + l.html + '</div>' +
          '<section class="comprobacion" id="comprobacion">' +
            '<h2>Comprueba lo aprendido</h2>' +
            '<p class="comprobacion-bajada">Responde bien estas ' + l.comprobacion.length + ' preguntas para completar la lección.</p>' +
            '<div id="preguntas"></div>' +
          '</section>' +
          '<div id="cierre"></div>' +
        '</article>' +
      '</div>';

    var prosa = document.getElementById('prosa');
    Mates.pintar(prosa);
    Array.prototype.forEach.call(prosa.querySelectorAll('[data-grafico]'), function (hueco) {
      var cfg = l.graficos && l.graficos[hueco.getAttribute('data-grafico')];
      if (cfg) Graficos.montar(hueco, cfg);
    });

    var preguntas = document.getElementById('preguntas');
    l.comprobacion.forEach(function (ej, i) {
      var envoltura = document.createElement('div');
      envoltura.className = 'pregunta';
      envoltura.innerHTML = '<p class="pregunta-numero">Pregunta ' + (i + 1) + '</p><div></div>';
      preguntas.appendChild(envoltura);
      Ejercicio.montar(envoltura.lastChild, ej, { alResolver: revisarCierre });
    });

    function todasResueltas() {
      return l.comprobacion.every(function (ej) { return Progreso.ejercicio(ej.id).resuelto; });
    }

    function pintarCierre() {
      var cierre = document.getElementById('cierre');
      if (!cierre) return;
      if (Progreso.leccionCompleta(ruta)) {
        cierre.innerHTML =
          '<div class="cierre cierre--listo">' +
            '<p class="cierre-titulo"><span aria-hidden="true">✓</span> Lección completada</p>' +
            '<a class="boton boton--primario" href="' + hrefSiguiente + '">' + tituloSiguiente + ' →</a>' +
          '</div>';
      } else {
        cierre.innerHTML = '<div class="cierre"><a class="boton boton--texto" href="' + hrefSiguiente + '">' + tituloSiguiente + ' →</a></div>';
      }
    }

    function revisarCierre() {
      if (todasResueltas()) Progreso.completarLeccion(ruta);
      pintarCierre();
    }

    refrescarVista = function () {
      var lateral = document.getElementById('lateral');
      if (lateral) lateral.innerHTML = lateralHTML(s, c, l.id);
    };
    refrescarVista();
    revisarCierre();
  }

  // ---------------------------------------------------------------------------
  // Guía de ejercicios
  // ---------------------------------------------------------------------------
  function vistaGuia(s, c, numero) {
    var ejercicios = c.guia.ejercicios;
    var base = '#/' + s.id + '/' + c.id + '/guia';

    if (!numero) {
      // Sin número: ir al primer ejercicio pendiente (o al primero si ya están todos).
      var pendiente = 0;
      for (var i = 0; i < ejercicios.length; i++) {
        if (!Progreso.ejercicio(ejercicios[i].id).resuelto) { pendiente = i; break; }
      }
      numero = pendiente + 1;
    }
    numero = Math.min(Math.max(1, numero), ejercicios.length);
    var ej = ejercicios[numero - 1];

    app.innerHTML =
      '<div class="estudio">' +
        '<aside class="lateral" id="lateral"></aside>' +
        '<article class="leccion">' +
          '<p class="sobretitulo">' + s.titulo + ' · Capítulo ' + c.numero + '</p>' +
          '<h1>' + c.guia.titulo + '</h1>' +
          '<div id="guia-resumen"></div>' +
          '<nav class="pasos" id="pasos" aria-label="Ejercicios"></nav>' +
          '<section class="tarjeta-ejercicio">' +
            '<p class="pregunta-numero">Ejercicio ' + numero + ' de ' + ejercicios.length + ' <span class="etiqueta">' + ej.tema + '</span></p>' +
            '<div id="ejercicio"></div>' +
          '</section>' +
          '<div class="guia-nav">' +
            (numero > 1 ? '<a class="boton boton--texto" href="' + base + '/' + (numero - 1) + '">← Anterior</a>' : '<span></span>') +
            (numero < ejercicios.length ? '<a class="boton" id="guia-siguiente" href="' + base + '/' + (numero + 1) + '">Siguiente →</a>' : '<a class="boton" id="guia-siguiente" href="#/' + s.id + '/' + c.id + '">Volver al capítulo</a>') +
          '</div>' +
          '<p class="guia-reinicio"><button type="button" class="boton boton--texto boton--chico" id="guia-reiniciar">Reiniciar la guía</button></p>' +
        '</article>' +
      '</div>';

    function pintarEstado() {
      var resueltos = 0, limpios = 0;
      var pasos = ejercicios.map(function (e, i) {
        var f = Progreso.ejercicio(e.id);
        if (f.resuelto) resueltos += 1;
        if (f.limpio) limpios += 1;
        var clase = 'paso' + (f.resuelto ? ' paso--hecho' : (f.intentos > 0 ? ' paso--intentado' : '')) + (i === numero - 1 ? ' paso--actual' : '');
        var estado = f.resuelto ? 'resuelto' : (f.intentos > 0 ? 'intentado' : 'pendiente');
        return '<a class="' + clase + '" href="' + base + '/' + (i + 1) + '" aria-label="Ejercicio ' + (i + 1) + ', ' + estado + '"' + (i === numero - 1 ? ' aria-current="step"' : '') + '>' + (i + 1) + '</a>';
      }).join('');
      var cajaPasos = document.getElementById('pasos');
      if (cajaPasos) cajaPasos.innerHTML = pasos;

      var resumen = document.getElementById('guia-resumen');
      if (resumen) {
        resumen.innerHTML = resueltos === ejercicios.length
          ? '<div class="cierre cierre--listo"><p class="cierre-titulo"><span aria-hidden="true">✓</span> Guía completa</p><p>' + limpios + ' de ' + ejercicios.length + ' al primer intento y sin pistas.</p></div>'
          : '<p class="guia-avance">' + resueltos + ' de ' + ejercicios.length + ' resueltos</p>';
      }

      var sig = document.getElementById('guia-siguiente');
      if (sig) sig.classList.toggle('boton--primario', Progreso.ejercicio(ej.id).resuelto);

      var lateral = document.getElementById('lateral');
      if (lateral) lateral.innerHTML = lateralHTML(s, c, 'guia');
    }

    Ejercicio.montar(document.getElementById('ejercicio'), ej, {});

    document.getElementById('guia-reiniciar').addEventListener('click', function () {
      if (!window.confirm('Se borrarán tus respuestas de esta guía (las medallas ya ganadas se conservan). ¿Continuar?')) return;
      Progreso.reiniciarEjercicios(ejercicios.map(function (e) { return e.id; }));
      if (location.hash === base + '/1') enrutar(); else location.hash = base + '/1';
    });

    refrescarVista = pintarEstado;
    pintarEstado();
  }

  // ---------------------------------------------------------------------------
  // Medallas y progreso
  // ---------------------------------------------------------------------------
  function vistaMedallas() {
    var e = Progreso.estado();
    var ganadas = Medallas.ganadas().length;
    var resueltos = Object.keys(e.ejercicios).filter(function (id) { return e.ejercicios[id].resuelto; }).length;

    var grupos = Medallas.grupos().map(function (g) {
      return '<section class="bloque"><h2>' + g.nombre + '</h2><div class="medallas-grilla">' +
        g.medallas.map(function (m) { return medallaHTML(m); }).join('') + '</div></section>';
    }).join('');

    app.innerHTML =
      '<div class="pagina">' +
        '<nav class="migas"><a href="#/">Inicio</a><span>/</span>Medallas</nav>' +
        '<header class="cabecera">' +
          '<h1>Medallas</h1>' +
          '<p class="cabecera-bajada">' + ganadas + ' de ' + Medallas.lista.length + ' ganadas</p>' +
        '</header>' +
        '<dl class="cifras">' +
          '<div><dt>Lecciones completadas</dt><dd>' + Object.keys(e.lecciones).length + '</dd></div>' +
          '<div><dt>Ejercicios resueltos</dt><dd>' + resueltos + '</dd></div>' +
          '<div><dt>Mejor racha</dt><dd>' + e.mejorRacha + '</dd></div>' +
          '<div><dt>Días de estudio</dt><dd>' + e.dias.length + '</dd></div>' +
        '</dl>' +
        grupos +
        '<section class="bloque bloque--datos">' +
          '<h2>Tus datos</h2>' +
          '<p>El progreso se guarda solo en este navegador. Puedes descargar una copia para llevarla a otro equipo o navegador.</p>' +
          '<div class="botones">' +
            '<button type="button" class="boton" id="exportar">Descargar copia</button>' +
            '<label class="boton">Cargar copia<input type="file" id="importar" accept="application/json,.json" hidden></label>' +
            '<button type="button" class="boton boton--peligro" id="reiniciar">Borrar todo el progreso</button>' +
          '</div>' +
          '<p class="ej-mensaje" id="datos-mensaje" role="status"></p>' +
        '</section>' +
      '</div>';

    document.getElementById('exportar').addEventListener('click', function () {
      var blob = new Blob([Progreso.exportar()], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'calculo-progreso.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });

    document.getElementById('importar').addEventListener('change', function (ev) {
      var archivo = ev.target.files[0];
      if (!archivo) return;
      var lector = new FileReader();
      lector.onload = function () {
        try {
          Progreso.importar(String(lector.result));
          enrutar();
        } catch (err) {
          var m = document.getElementById('datos-mensaje');
          m.textContent = 'No se pudo leer ese archivo. Debe ser una copia descargada desde este sitio.';
          m.className = 'ej-mensaje ej-mensaje--mal';
        }
      };
      lector.readAsText(archivo);
    });

    document.getElementById('reiniciar').addEventListener('click', function () {
      if (!window.confirm('Se borrarán lecciones, ejercicios y medallas. Esta acción no se puede deshacer. ¿Continuar?')) return;
      Progreso.reiniciarTodo();
      enrutar();
    });
  }

  // ---------------------------------------------------------------------------
  // No encontrado
  // ---------------------------------------------------------------------------
  function vistaNoEncontrada() {
    app.innerHTML = '<div class="pagina"><div class="vacio"><p><strong>Esta página no existe.</strong></p><p><a href="#/">Volver al inicio</a></p></div></div>';
  }

  // ---------------------------------------------------------------------------
  // Avisos de medallas
  // ---------------------------------------------------------------------------
  function avisarMedalla(m) {
    var caja = document.getElementById('avisos');
    var aviso = document.createElement('a');
    aviso.className = 'aviso';
    aviso.href = '#/medallas';
    aviso.innerHTML =
      '<div class="medalla-disco" aria-hidden="true">' + Mates.html(m.emblema) + '</div>' +
      '<div><p class="aviso-rotulo">Nueva medalla</p><p class="aviso-nombre">' + m.nombre + '</p><p class="aviso-desc">' + m.descripcion + '</p></div>';
    caja.appendChild(aviso);
    setTimeout(function () {
      aviso.classList.add('aviso--fuera');
      setTimeout(function () { aviso.remove(); }, 400);
    }, 6000);
  }

  function actualizarNav(partes) {
    var cuenta = document.getElementById('nav-medallas');
    var n = Medallas.ganadas().length;
    cuenta.textContent = n + '/' + Medallas.lista.length;
    Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (a) {
      var activo = partes && partes[0] === a.getAttribute('data-nav');
      a.classList.toggle('activo', !!activo);
      if (activo) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  // ---------------------------------------------------------------------------
  // Enrutador
  // ---------------------------------------------------------------------------
  function partesDeRuta() {
    return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  }

  function enrutar() {
    var p = partesDeRuta();
    refrescarVista = null;

    if (p.length === 0) {
      vistaInicio();
    } else if (p[0] === 'medallas' && p.length === 1) {
      vistaMedallas();
    } else {
      var s = Curso.seccion(p[0]);
      var c = s && p[1] ? Curso.capitulo(s.id, p[1]) : null;
      if (!s) vistaNoEncontrada();
      else if (p.length === 1) vistaSeccion(s);
      else if (!c) vistaNoEncontrada();
      else if (p.length === 2) vistaCapitulo(s, c);
      else if (p[2] === 'guia' && c.guia && p.length <= 4) vistaGuia(s, c, p[3] ? parseInt(p[3], 10) || 0 : 0);
      else {
        var l = p.length === 3 ? Curso.leccion(s.id, c.id, p[2]) : null;
        if (l) vistaLeccion(s, c, l); else vistaNoEncontrada();
      }
    }

    actualizarNav(p);
    window.scrollTo(0, 0);
  }

  // Cada vez que cambia el progreso: revisar medallas y refrescar lo que dependa de él.
  Progreso.alCambiar(function () {
    Medallas.revisar().forEach(avisarMedalla);
    actualizarNav(partesDeRuta());
    if (refrescarVista) refrescarVista();
  });

  window.addEventListener('hashchange', enrutar);
  Medallas.revisar();
  enrutar();
})();
