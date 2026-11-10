/* Gráficos interactivos en SVG, sin dependencias.
 *
 *   Graficos.montar(elemento, config)
 *
 * Tipos disponibles (config.tipo):
 *   'secante'  → dos puntos sobre una curva y el cociente incremental al achicar h
 *   'tangente' → recta tangente que se desliza; opcionalmente va trazando f'(x)
 *   'figura'   → gráfico estático para ilustrar un ejercicio
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var contador = 0;

  var COLOR = {
    tinta: '#111111',
    eje: '#9a9a9a',
    grilla: '#ededed',
    curva: '#111111',
    acento: '#2563eb',
    sube: '#15803d',
    baja: '#b91c1c',
    plano: '#6b7280',
    tenue: '#9ca3af'
  };

  function svg(tag, attrs, padre) {
    var n = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (padre) padre.appendChild(n);
    return n;
  }

  function html(tag, clase, padre, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.innerHTML = texto;
    if (padre) padre.appendChild(n);
    return n;
  }

  /* Número con coma decimal y signo menos tipográfico. */
  function num(n, decimales) {
    if (decimales == null) decimales = 3;
    if (!isFinite(n)) return '—';
    var f = Math.pow(10, decimales);
    var r = Math.round(n * f) / f;
    if (Object.is(r, -0)) r = 0;
    var s = String(Math.abs(r));
    if (s.indexOf('e') !== -1) s = Math.abs(r).toFixed(decimales).replace(/0+$/, '').replace(/\.$/, '');
    return (r < 0 ? '−' : '') + s.replace('.', ',');
  }

  function derivadaNumerica(f) {
    return function (x) { var d = 1e-5; return (f(x + d) - f(x - d)) / (2 * d); };
  }

  // ---------------------------------------------------------------------------
  // Lienzo: ejes, grilla y utilidades de dibujo en coordenadas del problema
  // ---------------------------------------------------------------------------
  function Lienzo(cfg) {
    this.xmin = cfg.xmin; this.xmax = cfg.xmax; this.ymin = cfg.ymin; this.ymax = cfg.ymax;
    this.ancho = cfg.ancho || 520;
    this.alto = cfg.alto || 340;
    this.m = { izq: 16, der: 16, arr: 16, aba: 16 };
    var id = 'recorte-' + (++contador);

    this.svg = svg('svg', {
      viewBox: '0 0 ' + this.ancho + ' ' + this.alto,
      'class': 'lienzo',
      role: 'img',
      'aria-label': cfg.descripcion || 'Gráfico'
    });
    var defs = svg('defs', null, this.svg);
    this.defs = defs;
    var recorte = svg('clipPath', { id: id }, defs);
    svg('rect', {
      x: this.m.izq, y: this.m.arr,
      width: this.ancho - this.m.izq - this.m.der,
      height: this.alto - this.m.arr - this.m.aba
    }, recorte);

    this.fondo = svg('g', null, this.svg);
    this.fija = svg('g', { 'clip-path': 'url(#' + id + ')' }, this.svg);
    this.capa = svg('g', { 'clip-path': 'url(#' + id + ')' }, this.svg);
    this.rotulos = svg('g', null, this.svg);

    this._ejes(cfg);
  }

  Lienzo.prototype.sx = function (x) {
    return this.m.izq + (x - this.xmin) / (this.xmax - this.xmin) * (this.ancho - this.m.izq - this.m.der);
  };
  Lienzo.prototype.sy = function (y) {
    return this.alto - this.m.aba - (y - this.ymin) / (this.ymax - this.ymin) * (this.alto - this.m.arr - this.m.aba);
  };

  Lienzo.prototype._ejes = function (cfg) {
    var pasoX = cfg.pasoX || 1, pasoY = cfg.pasoY || 1;
    var x0 = Math.min(Math.max(0, this.xmin), this.xmax);
    var y0 = Math.min(Math.max(0, this.ymin), this.ymax);
    var i, x, y;

    for (i = Math.ceil(this.xmin / pasoX); i * pasoX <= this.xmax + 1e-9; i++) {
      x = i * pasoX;
      svg('line', { x1: this.sx(x), y1: this.sy(this.ymin), x2: this.sx(x), y2: this.sy(this.ymax), stroke: COLOR.grilla, 'stroke-width': 1 }, this.fondo);
    }
    for (i = Math.ceil(this.ymin / pasoY); i * pasoY <= this.ymax + 1e-9; i++) {
      y = i * pasoY;
      svg('line', { x1: this.sx(this.xmin), y1: this.sy(y), x2: this.sx(this.xmax), y2: this.sy(y), stroke: COLOR.grilla, 'stroke-width': 1 }, this.fondo);
    }

    svg('line', { x1: this.sx(this.xmin), y1: this.sy(y0), x2: this.sx(this.xmax), y2: this.sy(y0), stroke: COLOR.eje, 'stroke-width': 1.2 }, this.fondo);
    svg('line', { x1: this.sx(x0), y1: this.sy(this.ymin), x2: this.sx(x0), y2: this.sy(this.ymax), stroke: COLOR.eje, 'stroke-width': 1.2 }, this.fondo);

    var cadaX = cfg.rotuloCadaX || pasoX, cadaY = cfg.rotuloCadaY || pasoY, t;
    for (i = Math.ceil(this.xmin / cadaX); i * cadaX <= this.xmax + 1e-9; i++) {
      x = i * cadaX;
      if (Math.abs(x) < 1e-9 || x <= this.xmin || x >= this.xmax) continue;
      t = svg('text', { x: this.sx(x), y: this.sy(y0) + 13, 'text-anchor': 'middle', 'class': 'lienzo-marca' }, this.fondo);
      t.textContent = num(x, 2);
    }
    for (i = Math.ceil(this.ymin / cadaY); i * cadaY <= this.ymax + 1e-9; i++) {
      y = i * cadaY;
      if (Math.abs(y) < 1e-9 || y <= this.ymin || y >= this.ymax) continue;
      t = svg('text', { x: this.sx(x0) - 5, y: this.sy(y) + 3.5, 'text-anchor': 'end', 'class': 'lienzo-marca' }, this.fondo);
      t.textContent = num(y, 2);
    }

    if (cfg.ejeX) {
      t = svg('text', { x: this.sx(this.xmax) - 4, y: this.sy(y0) - 6, 'text-anchor': 'end', 'class': 'lienzo-eje' }, this.fondo);
      t.textContent = cfg.ejeX;
    }
    if (cfg.ejeY) {
      t = svg('text', { x: this.sx(x0) + 7, y: this.sy(this.ymax) + 10, 'class': 'lienzo-eje' }, this.fondo);
      t.textContent = cfg.ejeY;
    }
  };

  Lienzo.prototype.limpiar = function () {
    while (this.capa.firstChild) this.capa.removeChild(this.capa.firstChild);
    while (this.rotulos.firstChild) this.rotulos.removeChild(this.rotulos.firstChild);
  };

  Lienzo.prototype.curva = function (f, attrs, desde, hasta, capa) {
    var a = desde == null ? this.xmin : Math.max(desde, this.xmin);
    var b = hasta == null ? this.xmax : Math.min(hasta, this.xmax);
    var n = 240, d = '', abierto = false, margen = (this.ymax - this.ymin) * 3;
    for (var i = 0; i <= n; i++) {
      var x = a + (b - a) * i / n;
      var y = f(x);
      if (!isFinite(y) || y > this.ymax + margen || y < this.ymin - margen) { abierto = false; continue; }
      d += (abierto ? 'L' : 'M') + this.sx(x).toFixed(2) + ' ' + this.sy(y).toFixed(2);
      abierto = true;
    }
    var base = { d: d, fill: 'none', stroke: COLOR.curva, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
    return svg('path', Object.assign(base, attrs || {}), capa || this.capa);
  };

  /* Recta infinita que pasa por (x0, y0) con pendiente m. */
  Lienzo.prototype.recta = function (x0, y0, m, attrs) {
    var xa = this.xmin - 1, xb = this.xmax + 1;
    var base = {
      x1: this.sx(xa), y1: this.sy(y0 + m * (xa - x0)),
      x2: this.sx(xb), y2: this.sy(y0 + m * (xb - x0)),
      stroke: COLOR.acento, 'stroke-width': 1.8
    };
    return svg('line', Object.assign(base, attrs || {}), this.capa);
  };

  Lienzo.prototype.segmento = function (x1, y1, x2, y2, attrs) {
    var base = { x1: this.sx(x1), y1: this.sy(y1), x2: this.sx(x2), y2: this.sy(y2), stroke: COLOR.tenue, 'stroke-width': 1.2 };
    return svg('line', Object.assign(base, attrs || {}), this.capa);
  };

  Lienzo.prototype.punto = function (x, y, attrs) {
    var base = { cx: this.sx(x), cy: this.sy(y), r: 4.5, fill: COLOR.tinta, stroke: '#fff', 'stroke-width': 1.5 };
    return svg('circle', Object.assign(base, attrs || {}), this.capa);
  };

  /* Texto anclado a un punto del problema, con desplazamiento en píxeles. Se mantiene dentro del lienzo. */
  Lienzo.prototype.texto = function (x, y, contenido, opc) {
    opc = opc || {};
    var px = this.sx(x) + (opc.dx || 0), py = this.sy(y) + (opc.dy || 0);
    px = Math.min(Math.max(px, this.m.izq + 4), this.ancho - this.m.der - 4);
    py = Math.min(Math.max(py, this.m.arr + 10), this.alto - this.m.aba - 4);
    var t = svg('text', {
      x: px, y: py,
      'text-anchor': opc.ancla || 'start',
      'class': 'lienzo-rotulo' + (opc.clase ? ' ' + opc.clase : ''),
      fill: opc.color || COLOR.tinta
    }, this.rotulos);
    t.textContent = contenido;
    return t;
  };

  /* Rectángulo entre el eje x y la altura y, de x0 a x1. */
  Lienzo.prototype.rectangulo = function (x0, x1, y, attrs) {
    var X0 = this.sx(x0), X1 = this.sx(x1), Y0 = this.sy(0), Y = this.sy(y);
    var base = { x: Math.min(X0, X1), y: Math.min(Y0, Y), width: Math.abs(X1 - X0), height: Math.abs(Y - Y0) };
    return svg('rect', Object.assign(base, attrs || {}), this.capa);
  };

  /* Región entre la curva y el eje x, de a a b: un color arriba del eje y otro abajo. */
  Lienzo.prototype.area = function (f, a, b, colorArriba, colorAbajo, capa) {
    if (b < a) { var t = a; a = b; b = t; }
    if (b - a < 1e-9) return;
    if (!this._recortes) {
      var arriba = 'arriba-' + (++contador), abajo = 'abajo-' + (++contador);
      var y0 = this.sy(0);
      svg('rect', { x: 0, y: -10, width: this.ancho, height: Math.max(0, y0 + 10) }, svg('clipPath', { id: arriba }, this.defs));
      svg('rect', { x: 0, y: y0, width: this.ancho, height: Math.max(0, this.alto - y0 + 10) }, svg('clipPath', { id: abajo }, this.defs));
      this._recortes = { arriba: arriba, abajo: abajo };
    }
    var n = 160, d = 'M' + this.sx(a).toFixed(2) + ' ' + this.sy(0).toFixed(2);
    for (var i = 0; i <= n; i++) {
      var x = a + (b - a) * i / n;
      d += 'L' + this.sx(x).toFixed(2) + ' ' + this.sy(f(x)).toFixed(2);
    }
    d += 'L' + this.sx(b).toFixed(2) + ' ' + this.sy(0).toFixed(2) + 'Z';
    var destino = capa || this.capa;
    svg('path', { d: d, fill: colorArriba, 'clip-path': 'url(#' + this._recortes.arriba + ')' }, destino);
    svg('path', { d: d, fill: colorAbajo, 'clip-path': 'url(#' + this._recortes.abajo + ')' }, destino);
  };

  // ---------------------------------------------------------------------------
  // Deslizador con etiqueta
  // ---------------------------------------------------------------------------
  function deslizador(padre, opc) {
    var fila = html('label', 'control', padre);
    var rotulo = html('span', 'control-rotulo', fila);
    var entrada = html('input', 'control-barra', fila);
    entrada.type = 'range';
    entrada.min = opc.min; entrada.max = opc.max; entrada.step = opc.paso; entrada.value = opc.valor;
    entrada.setAttribute('aria-label', opc.nombre);
    entrada.addEventListener('input', function () { opc.alMover(parseFloat(entrada.value)); });
    return { entrada: entrada, rotulo: rotulo };
  }

  // ---------------------------------------------------------------------------
  // Widget: secante → tangente (cociente incremental)
  // ---------------------------------------------------------------------------
  function montarSecante(raiz, cfg) {
    var f = cfg.f;
    var N = Object.assign({ x: 'x', f: 'f', cociente: 'Pendiente de la secante', unidad: '', unidadX: '', unidadF: '' }, cfg.nombres || {});
    var hMin = cfg.hMin || 0.001, hMax = cfg.hMax || 2;
    var a = cfg.a, h = cfg.hInicial || 1;
    var conTangente = !!cfg.tangente;
    var df = cfg.df || derivadaNumerica(f);

    raiz.classList.add('grafico');
    var cuerpo = html('div', 'grafico-cuerpo', raiz);
    var lienzo = new Lienzo(Object.assign({ ejeX: N.x, ejeY: N.f + '(' + N.x + ')', descripcion: cfg.descripcion }, cfg.vista));
    cuerpo.appendChild(lienzo.svg);
    lienzo.curva(f, null, null, null, lienzo.fija);

    var datos = html('div', 'grafico-datos', cuerpo);
    var controles = html('div', 'grafico-controles', raiz);

    // h en escala logarítmica: a la izquierda casi cero, a la derecha hMax.
    var aBarra = function (valor) { return Math.round(1000 * Math.log(valor / hMin) / Math.log(hMax / hMin)); };
    var deBarra = function (v) { return Number((hMin * Math.pow(hMax / hMin, v / 1000)).toPrecision(2)); };

    var barraH = deslizador(controles, {
      nombre: 'Tamaño del intervalo h', min: 0, max: 1000, paso: 1, valor: aBarra(h),
      alMover: function (v) { h = deBarra(v); dibujar(); }
    });
    var barraA = null;
    if (cfg.aDeslizable) {
      barraA = deslizador(controles, {
        nombre: 'Punto a', min: cfg.aDeslizable.min, max: cfg.aDeslizable.max, paso: cfg.aDeslizable.paso || 0.1, valor: a,
        alMover: function (v) { a = v; dibujar(); }
      });
    }
    if (cfg.nota) html('p', 'grafico-nota', raiz, cfg.nota);

    function u(texto) { return texto ? ' ' + texto : ''; }

    function dibujar() {
      var fa = f(a), fb = f(a + h);
      var dy = fb - fa, m = dy / h;
      lienzo.limpiar();

      if (conTangente) {
        lienzo.recta(a, fa, df(a), { stroke: COLOR.tenue, 'stroke-dasharray': '5 4', 'stroke-width': 1.4 });
      }
      // triángulo de incrementos
      lienzo.segmento(a, fa, a + h, fa, { 'stroke-dasharray': '3 3' });
      lienzo.segmento(a + h, fa, a + h, fb, { 'stroke-dasharray': '3 3' });
      lienzo.recta(a, fa, m);
      lienzo.punto(a, fa);
      lienzo.punto(a + h, fb, { fill: COLOR.acento });

      var separacion = lienzo.sx(a + h) - lienzo.sx(a);
      var altura = Math.abs(lienzo.sy(fb) - lienzo.sy(fa));
      if (separacion > 34) lienzo.texto(a + h / 2, fa, 'Δ' + N.x, { dy: 15, ancla: 'middle', color: COLOR.plano });
      if (altura > 26 && separacion > 12) lienzo.texto(a + h, (fa + fb) / 2, 'Δ' + N.f, { dx: 7, dy: 4, color: COLOR.plano });
      lienzo.texto(a, fa, 'P', { dx: -9, dy: -9, ancla: 'end' });
      if (separacion > 16) lienzo.texto(a + h, fb, 'Q', { dx: -9, dy: -9, ancla: 'end', color: COLOR.acento });

      var b = a + h;
      datos.innerHTML =
        '<dl class="lectura">' +
          '<div><dt>Intervalo</dt><dd>de <i>' + N.x + '</i> = ' + num(a, 2) + ' a <i>' + N.x + '</i> = ' + num(b, 4) + '</dd></div>' +
          '<div><dt>Δ<i>' + N.x + '</i> = <i>h</i></dt><dd>' + num(h, 4) + u(N.unidadX) + '</dd></div>' +
          '<div><dt>Δ<i>' + N.f + '</i></dt><dd>' + num(dy, 6) + u(N.unidadF) + '</dd></div>' +
          '<div class="lectura-principal"><dt>' + N.cociente + '</dt><dd>' + num(m, 4) + u(N.unidad) + '</dd></div>' +
          (conTangente ? '<div class="lectura-tenue"><dt>Pendiente de la tangente</dt><dd>' + num(df(a), 4) + '</dd></div>' : '') +
        '</dl>';

      barraH.rotulo.innerHTML = '<i>h</i> = ' + num(h, 4);
      if (barraA) barraA.rotulo.innerHTML = '<i>a</i> = ' + num(a, 2);

      if (h <= 0.01 && window.Progreso) window.Progreso.evento('casiCero');
    }

    dibujar();
  }

  // ---------------------------------------------------------------------------
  // Widget: tangente deslizante (y rastro de la derivada)
  // ---------------------------------------------------------------------------
  function montarTangente(raiz, cfg) {
    var f = cfg.f, df = cfg.df || derivadaNumerica(f);
    var a = cfg.aInicial;
    var visto = { min: a, max: a };

    raiz.classList.add('grafico');
    if (cfg.titulo) html('p', 'grafico-titulo', raiz, cfg.titulo);
    var cuerpo = html('div', 'grafico-cuerpo grafico-cuerpo--columna', raiz);
    var lienzo = new Lienzo(Object.assign({ ejeX: 'x', ejeY: 'f(x)', alto: cfg.rastro ? 260 : 340, descripcion: cfg.descripcion }, cfg.vista));
    cuerpo.appendChild(lienzo.svg);
    lienzo.curva(f, null, null, null, lienzo.fija);

    var abajo = null;
    if (cfg.rastro) {
      abajo = new Lienzo(Object.assign({}, cfg.vista, cfg.vistaDerivada, {
        ejeX: 'x', ejeY: 'f′(x)', alto: 220, descripcion: 'Valor de la pendiente para cada x'
      }));
      cuerpo.appendChild(abajo.svg);
    }

    var estado = html('p', 'grafico-estado', raiz);
    var controles = html('div', 'grafico-controles', raiz);
    var barra = deslizador(controles, {
      nombre: 'Punto x', min: cfg.aMin, max: cfg.aMax, paso: cfg.paso || 0.05, valor: a,
      alMover: function (v) {
        a = v;
        visto.min = Math.min(visto.min, a);
        visto.max = Math.max(visto.max, a);
        dibujar();
      }
    });
    if (cfg.nota) html('p', 'grafico-nota', raiz, cfg.nota);

    function dibujar() {
      var y = f(a), m = df(a);
      var plano = Math.abs(m) < 0.05;
      var color = plano ? COLOR.plano : (m > 0 ? COLOR.sube : COLOR.baja);
      var frase = plano ? 'tangente horizontal' : (m > 0 ? 'la función crece' : 'la función decrece');

      lienzo.limpiar();
      lienzo.recta(a, y, m, { stroke: color, 'stroke-width': 2 });
      lienzo.punto(a, y, { fill: color });

      if (abajo) {
        abajo.limpiar();
        if (visto.max > visto.min) abajo.curva(df, { stroke: COLOR.acento, 'stroke-width': 2.2 }, visto.min, visto.max);
        abajo.segmento(a, 0, a, m, { 'stroke-dasharray': '3 3' });
        abajo.punto(a, m, { fill: color });
      }

      estado.innerHTML =
        '<span>En <i>x</i> = ' + num(a, 2) + '</span>' +
        '<span class="estado-valor" style="color:' + color + '">pendiente = ' + num(m, 2) + '</span>' +
        '<span style="color:' + color + '">' + frase + '</span>';
      barra.rotulo.innerHTML = '<i>x</i> = ' + num(a, 2);
    }

    dibujar();
  }

  // ---------------------------------------------------------------------------
  // Figura estática
  // ---------------------------------------------------------------------------
  function montarFigura(raiz, cfg) {
    raiz.classList.add('figura');
    var lienzo = new Lienzo(Object.assign({ ejeX: 'x', ejeY: 'y', ancho: 420, alto: 280, descripcion: cfg.descripcion }, cfg.vista));
    raiz.appendChild(lienzo.svg);
    if (cfg.f) lienzo.curva(cfg.f, null, null, null, lienzo.fija);
    (cfg.rectas || []).forEach(function (r) {
      lienzo.recta(r.x0, r.y0, r.m, { stroke: r.color || COLOR.acento, 'stroke-dasharray': r.punteada ? '5 4' : 'none' });
    });
    (cfg.puntos || []).forEach(function (p) {
      var y = p.y != null ? p.y : cfg.f(p.x);
      lienzo.punto(p.x, y, { fill: p.color || COLOR.acento });
      if (p.etiqueta) lienzo.texto(p.x, y, p.etiqueta, { dx: p.dx != null ? p.dx : 8, dy: p.dy != null ? p.dy : -9, clase: 'lienzo-rotulo--fuerte' });
    });
  }

  // ---------------------------------------------------------------------------
  // Botones segmentados
  // ---------------------------------------------------------------------------
  function segmentos(padre, nombre, opciones, actual, alElegir) {
    var grupo = html('div', 'segmentos', padre);
    grupo.setAttribute('role', 'group');
    grupo.setAttribute('aria-label', nombre);
    var botones = opciones.map(function (o) {
      var b = html('button', 'segmento', grupo, o[1]);
      b.type = 'button';
      b.addEventListener('click', function () {
        botones.forEach(function (x) { x.classList.remove('segmento--activo'); x.setAttribute('aria-pressed', 'false'); });
        b.classList.add('segmento--activo');
        b.setAttribute('aria-pressed', 'true');
        alElegir(o[0]);
      });
      if (o[0] === actual) { b.classList.add('segmento--activo'); b.setAttribute('aria-pressed', 'true'); }
      else b.setAttribute('aria-pressed', 'false');
      return b;
    });
  }

  // ---------------------------------------------------------------------------
  // Widget: sumas de Riemann
  // ---------------------------------------------------------------------------
  function montarRiemann(raiz, cfg) {
    var f = cfg.f, a = cfg.a, b = cfg.b;
    var valoresN = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 75, 100];
    var idx = valoresN.indexOf(cfg.nInicial || 4);
    if (idx < 0) idx = 3;
    var metodo = cfg.metodo || 'izquierda';

    raiz.classList.add('grafico');
    var cuerpo = html('div', 'grafico-cuerpo', raiz);
    var lienzo = new Lienzo(Object.assign({ ejeX: 'x', ejeY: 'f(x)', descripcion: cfg.descripcion }, cfg.vista));
    cuerpo.appendChild(lienzo.svg);
    var datos = html('div', 'grafico-datos', cuerpo);
    var controles = html('div', 'grafico-controles', raiz);
    segmentos(controles, 'Punto de cada rectángulo',
      [['izquierda', 'Izquierda'], ['medio', 'Punto medio'], ['derecha', 'Derecha']], metodo,
      function (m) { metodo = m; dibujar(); });
    var barra = deslizador(controles, {
      nombre: 'Número de rectángulos', min: 0, max: valoresN.length - 1, paso: 1, valor: idx,
      alMover: function (v) { idx = v; dibujar(); }
    });
    if (cfg.nota) html('p', 'grafico-nota', raiz, cfg.nota);

    function dibujar() {
      var n = valoresN[idx], dx = (b - a) / n, suma = 0;
      lienzo.limpiar();
      for (var i = 0; i < n; i++) {
        var x0 = a + i * dx, x1 = x0 + dx;
        var xs = metodo === 'izquierda' ? x0 : (metodo === 'derecha' ? x1 : (x0 + x1) / 2);
        var y = f(xs);
        suma += y * dx;
        var positivo = y >= 0;
        lienzo.rectangulo(x0, x1, y, {
          fill: positivo ? 'rgba(37, 99, 235, 0.15)' : 'rgba(185, 28, 28, 0.13)',
          stroke: positivo ? COLOR.acento : COLOR.baja,
          'stroke-width': n > 40 ? 0.5 : 1.1
        });
        if (n <= 20) lienzo.punto(xs, y, { r: 3, fill: positivo ? COLOR.acento : COLOR.baja, 'stroke-width': 1 });
      }
      lienzo.curva(f);

      var exacta = cfg.exacta;
      datos.innerHTML =
        '<dl class="lectura">' +
          '<div><dt>Rectángulos</dt><dd><i>n</i> = ' + n + '</dd></div>' +
          '<div><dt>Ancho de cada uno</dt><dd>Δ<i>x</i> = ' + num(dx, 4) + '</dd></div>' +
          '<div class="lectura-principal"><dt>Suma de Riemann</dt><dd>' + num(suma, 4) + '</dd></div>' +
          (exacta != null
            ? '<div class="lectura-tenue"><dt>Área exacta</dt><dd>' + (cfg.exactaTexto || num(exacta, 4)) + '</dd></div>' +
              '<div class="lectura-tenue"><dt>Diferencia</dt><dd>' + num(suma - exacta, 4) + '</dd></div>'
            : '') +
        '</dl>';
      barra.rotulo.innerHTML = '<i>n</i> = ' + n;
      if (n >= 100 && window.Progreso) window.Progreso.evento('rectangulos');
    }

    dibujar();
  }

  // ---------------------------------------------------------------------------
  // Widget: función de acumulación A(x) = ∫_a^x f(t) dt
  // ---------------------------------------------------------------------------
  function montarAcumulacion(raiz, cfg) {
    var f = cfg.f, a = cfg.a, x = cfg.xInicial;
    var xmin = cfg.vista.xmin, xmax = cfg.vista.xmax, N = 1200, paso = (xmax - xmin) / N;
    var acum = [0];
    for (var i = 0; i < N; i++) {
      var x0 = xmin + i * paso;
      acum.push(acum[i] + (f(x0) + 4 * f(x0 + paso / 2) + f(x0 + paso)) / 6 * paso);
    }
    function interpolar(t) {
      var p = (t - xmin) / paso, k = Math.max(0, Math.min(N - 1, Math.floor(p)));
      return acum[k] + (acum[k + 1] - acum[k]) * (p - k);
    }
    var base = interpolar(a);
    var A = function (t) { return interpolar(t) - base; };

    raiz.classList.add('grafico');
    var cuerpo = html('div', 'grafico-cuerpo grafico-cuerpo--columna', raiz);
    var arriba = new Lienzo(Object.assign({}, cfg.vista, { ejeX: 't', ejeY: 'f(t)', alto: 250, descripcion: 'Gráfica de f con el área acumulada sombreada' }));
    cuerpo.appendChild(arriba.svg);
    arriba.curva(f, null, null, null, arriba.fija);
    var abajo = new Lienzo(Object.assign({}, cfg.vista, cfg.vistaAcumulada, { ejeX: 'x', ejeY: 'A(x)', alto: 230, descripcion: 'Gráfica de la función de acumulación A' }));
    cuerpo.appendChild(abajo.svg);
    abajo.curva(A, { stroke: '#cfcfcf', 'stroke-width': 1.6, 'stroke-dasharray': '4 4' }, null, null, abajo.fija);

    var estado = html('p', 'grafico-estado', raiz);
    var controles = html('div', 'grafico-controles', raiz);
    var barra = deslizador(controles, {
      nombre: 'Extremo superior x', min: cfg.xMin, max: cfg.xMax, paso: cfg.paso || 0.05, valor: x,
      alMover: function (v) { x = v; dibujar(); }
    });
    if (cfg.nota) html('p', 'grafico-nota', raiz, cfg.nota);

    function dibujar() {
      var fx = f(x), Ax = A(x);
      arriba.limpiar();
      arriba.area(f, a, x, 'rgba(37, 99, 235, 0.22)', 'rgba(185, 28, 28, 0.2)');
      arriba.segmento(x, 0, x, fx, { stroke: COLOR.tinta, 'stroke-width': 1.4 });
      arriba.punto(x, fx);
      arriba.texto(a, 0, 'a', { dx: 0, dy: 15, ancla: 'middle', color: COLOR.plano });

      abajo.limpiar();
      abajo.curva(A, { stroke: COLOR.acento, 'stroke-width': 2.4 }, Math.min(a, x), Math.max(a, x));
      var color = Math.abs(fx) < 0.05 ? COLOR.plano : (fx > 0 ? COLOR.sube : COLOR.baja);
      abajo.segmento(x - 0.8, Ax - 0.8 * fx, x + 0.8, Ax + 0.8 * fx, { stroke: color, 'stroke-width': 2 });
      abajo.punto(x, Ax, { fill: COLOR.acento });

      estado.innerHTML =
        '<span>En <i>x</i> = ' + num(x, 2) + '</span>' +
        '<span class="estado-valor" style="color:' + COLOR.acento + '">área acumulada <i>A</i>(<i>x</i>) = ' + num(Ax, 3) + '</span>' +
        '<span class="estado-valor" style="color:' + color + '">pendiente de <i>A</i> = <i>f</i>(<i>x</i>) = ' + num(fx, 3) + '</span>';
      barra.rotulo.innerHTML = '<i>x</i> = ' + num(x, 2);
    }

    dibujar();
  }

  // ---------------------------------------------------------------------------
  // Widget: familia de antiderivadas F(x) + C
  // ---------------------------------------------------------------------------
  function montarFamilia(raiz, cfg) {
    var F = cfg.F, f = cfg.f, x = cfg.xInicial, C = 0;
    var constantes = cfg.constantes || [-3, -2, -1, 0, 1, 2, 3];

    raiz.classList.add('grafico');
    var cuerpo = html('div', 'grafico-cuerpo grafico-cuerpo--columna', raiz);
    var lienzo = new Lienzo(Object.assign({ ejeX: 'x', ejeY: 'y', descripcion: cfg.descripcion }, cfg.vista));
    cuerpo.appendChild(lienzo.svg);
    constantes.forEach(function (c) {
      lienzo.curva(function (t) { return F(t) + c; }, { stroke: '#d4d4d4', 'stroke-width': 1.4 }, null, null, lienzo.fija);
    });

    var estado = html('p', 'grafico-estado', raiz);
    var controles = html('div', 'grafico-controles', raiz);
    var barraX = deslizador(controles, {
      nombre: 'Punto x', min: cfg.xMin, max: cfg.xMax, paso: 0.05, valor: x,
      alMover: function (v) { x = v; dibujar(); }
    });
    var barraC = deslizador(controles, {
      nombre: 'Constante C', min: constantes[0], max: constantes[constantes.length - 1], paso: 0.25, valor: C,
      alMover: function (v) { C = v; dibujar(); }
    });
    if (cfg.nota) html('p', 'grafico-nota', raiz, cfg.nota);

    function dibujar() {
      var m = f(x), largo = 0.55;
      lienzo.limpiar();
      constantes.forEach(function (c) {
        var y = F(x) + c;
        lienzo.segmento(x - largo, y - largo * m, x + largo, y + largo * m, { stroke: '#9ca3af', 'stroke-width': 1.3 });
        lienzo.punto(x, y, { r: 3, fill: '#9ca3af', 'stroke-width': 1 });
      });
      var G = function (t) { return F(t) + C; };
      lienzo.curva(G, { stroke: COLOR.tinta, 'stroke-width': 2.4 });
      lienzo.segmento(x - 1.1, G(x) - 1.1 * m, x + 1.1, G(x) + 1.1 * m, { stroke: COLOR.acento, 'stroke-width': 2.2 });
      lienzo.punto(x, G(x), { fill: COLOR.acento });

      estado.innerHTML =
        '<span>En <i>x</i> = ' + num(x, 2) + ', todas las curvas tienen la misma pendiente:</span>' +
        '<span class="estado-valor" style="color:' + COLOR.acento + '"><i>f</i>(<i>x</i>) = ' + num(m, 2) + '</span>';
      barraX.rotulo.innerHTML = '<i>x</i> = ' + num(x, 2);
      barraC.rotulo.innerHTML = '<i>C</i> = ' + num(C, 2);
    }

    dibujar();
  }

  var tipos = {
    secante: montarSecante, tangente: montarTangente, figura: montarFigura,
    riemann: montarRiemann, acumulacion: montarAcumulacion, familia: montarFamilia
  };

  window.Graficos = {
    montar: function (elemento, cfg) {
      var montar = tipos[cfg.tipo];
      if (!montar) throw new Error('Tipo de gráfico desconocido: ' + cfg.tipo);
      elemento.innerHTML = '';
      montar(elemento, cfg);
    },
    num: num
  };
})();
