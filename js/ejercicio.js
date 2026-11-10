/* Componente de ejercicio, con pistas progresivas y solución paso a paso.
 *
 *   Ejercicio.montar(elemento, ejercicio, { alResolver: function () {} })
 *
 * Tipos (ejercicio.tipo):
 *   'opciones'  → alternativas; `correcta` es el índice.
 *   'numero'    → un valor; acepta 3, -0,5, 1/4, pi/2, e-1, ln(2)…
 *   'expresion' → una función de x (por ejemplo una derivada o una antiderivada).
 *                 `respuesta` es la expresión correcta como texto; con `constante: true`
 *                 se acepta cualquier antiderivada (difieren en una constante).
 */
(function () {
  'use strict';

  var Mates = {
    /* Dibuja con KaTeX todas las fórmulas \( ... \) y \[ ... \] dentro de un elemento. */
    pintar: function (elemento) {
      if (!window.renderMathInElement) return;
      window.renderMathInElement(elemento, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    },
    /* Devuelve el HTML de una fórmula suelta. */
    html: function (tex, enBloque) {
      try { return window.katex.renderToString(tex, { throwOnError: false, displayMode: !!enBloque }); }
      catch (e) { return tex; }
    }
  };

  var Ex = window.Expresiones;

  function leerNumero(texto) {
    try { return Ex.valor(texto); } catch (e) { return NaN; }
  }

  /* Tolerancia por defecto: exacta si la respuesta tiene hasta 3 decimales; si no, se acepta redondear a 3. */
  function tolerancia(ej) {
    if (ej.tolerancia != null) return ej.tolerancia;
    var r = ej.respuesta;
    if (Math.abs(r * 1000 - Math.round(r * 1000)) < 1e-9) return 1e-9;
    return 5e-4 * Math.max(1, Math.abs(r));
  }

  /* Texto LaTeX de la respuesta correcta, para soluciones y PDF. */
  function respuestaTex(ej) {
    if (ej.respuestaTex) return ej.respuestaTex;
    if (ej.tipo === 'expresion') {
      var t = Ex.aLatex(ej.respuesta, ej.variables || ['x']);
      return t + (ej.constante ? '+C' : '');
    }
    if (ej.tipo === 'numero') return window.Graficos.num(ej.respuesta, 4).replace('−', '-').replace(',', '{,}');
    return '';
  }

  function crear(tag, clase, padre, contenido) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (contenido != null) n.innerHTML = contenido;
    if (padre) padre.appendChild(n);
    return n;
  }

  var LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

  function montar(raiz, ej, opc) {
    opc = opc || {};
    var P = window.Progreso;
    var ficha = P.ejercicio(ej.id);
    var resuelto = ficha.resuelto;
    var pistasVistas = 0;
    var elegida = -1;
    var variables = ej.variables || ['x'];

    raiz.innerHTML = '';
    raiz.className = 'ejercicio';

    crear('div', 'ej-enunciado', raiz, ej.enunciado);
    if (ej.figura) {
      var fig = crear('div', 'ej-figura', raiz);
      window.Graficos.montar(fig, ej.figura);
    }

    var formulario = crear('form', 'ej-respuesta', raiz);
    formulario.setAttribute('novalidate', '');
    var botonesOpcion = [];
    var entrada = null, vista = null;

    if (ej.tipo === 'opciones') {
      var grupo = crear('div', 'opciones', formulario);
      grupo.setAttribute('role', 'radiogroup');
      grupo.setAttribute('aria-label', 'Alternativas');
      ej.opciones.forEach(function (texto, i) {
        var b = crear('button', 'opcion', grupo);
        b.type = 'button';
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-checked', 'false');
        crear('span', 'opcion-letra', b, LETRAS[i]);
        crear('span', 'opcion-texto', b, texto);
        b.addEventListener('click', function () {
          if (resuelto || b.disabled) return;
          elegida = i;
          botonesOpcion.forEach(function (o, j) {
            o.classList.toggle('opcion--elegida', j === i);
            o.setAttribute('aria-checked', j === i ? 'true' : 'false');
          });
          mensaje('', '');
        });
        botonesOpcion.push(b);
      });
    } else {
      var linea = crear('label', 'campo' + (ej.tipo === 'expresion' ? ' campo--expresion' : ''), formulario);
      if (ej.prefijo) crear('span', 'campo-prefijo', linea, ej.prefijo);
      entrada = crear('input', 'campo-entrada', linea);
      entrada.type = 'text';
      entrada.setAttribute('autocomplete', 'off');
      entrada.setAttribute('autocapitalize', 'off');
      entrada.setAttribute('spellcheck', 'false');
      entrada.setAttribute('aria-label', 'Tu respuesta');
      entrada.placeholder = ej.ayuda || (ej.tipo === 'expresion' ? 'por ejemplo 3x^2 + 2x' : 'Tu respuesta');
      if (ej.sufijo) crear('span', 'campo-unidad', linea, ej.sufijo);
      else if (ej.tipo === 'expresion' && ej.constante) crear('span', 'campo-unidad', linea, '\\(+\\,C\\)');
      if (ej.unidad) crear('span', 'campo-unidad', linea, ej.unidad);

      if (ej.tipo === 'expresion') {
        vista = crear('div', 'campo-vista', formulario);
        crear('p', 'campo-ayuda', formulario,
          'Usa <code>^</code> para potencias, <code>*</code> o un espacio para multiplicar, y paréntesis: ' +
          '<code>sqrt(x)</code>, <code>sen(2x)</code>, <code>e^(3x)</code>, <code>ln(x)</code>.' +
          (ej.constante ? ' La constante <code>+ C</code> es opcional.' : ''));
      }

      entrada.addEventListener('input', function () {
        mensaje('', '');
        entrada.classList.remove('campo-entrada--mal');
        actualizarVista();
      });
    }

    function actualizarVista() {
      if (!vista) return;
      var t = entrada.value;
      if (ej.constante) t = Ex.sinConstante(t);
      if (!t.trim()) { vista.innerHTML = ''; return; }
      try {
        var tex = Ex.aLatex(t, variables) + (ej.constante && /[cCkK]\s*$/.test(entrada.value.trim()) ? '+C' : '');
        vista.innerHTML = '<span class="campo-vista-rotulo">Se lee:</span> ' + Mates.html(tex);
        vista.classList.remove('campo-vista--error');
      } catch (e) {
        vista.textContent = e.esLectura ? e.message : 'No pude leer la expresión.';
        vista.classList.add('campo-vista--error');
      }
    }

    var cajaMensaje = crear('p', 'ej-mensaje', raiz);
    cajaMensaje.setAttribute('role', 'status');
    var cajaPistas = crear('div', 'ej-pistas', raiz);
    var acciones = crear('div', 'ej-acciones', raiz);
    var botonComprobar = crear('button', 'boton boton--primario', acciones, 'Comprobar');
    botonComprobar.type = 'button';
    var botonPista = crear('button', 'boton boton--texto', acciones, '');
    botonPista.type = 'button';
    var cajaSolucion = crear('div', 'ej-solucion', raiz);

    function mensaje(texto, tipo) {
      cajaMensaje.textContent = texto;
      cajaMensaje.className = 'ej-mensaje' + (tipo ? ' ej-mensaje--' + tipo : '');
    }

    function rotuloPista() {
      var total = (ej.pistas || []).length;
      if (pistasVistas < total) {
        botonPista.textContent = pistasVistas === 0 ? 'Pedir una pista' : 'Otra pista (' + (pistasVistas + 1) + ' de ' + total + ')';
        botonPista.hidden = false;
      } else if (!cajaSolucion.firstChild) {
        botonPista.textContent = 'Ver la solución';
        botonPista.hidden = false;
      } else {
        botonPista.hidden = true;
      }
    }

    function mostrarSolucion(abierta) {
      if (cajaSolucion.firstChild) return;
      var d = crear('details', 'solucion', cajaSolucion);
      if (abierta) d.open = true;
      crear('summary', null, d, 'Solución paso a paso');
      var cuerpo = crear('div', 'solucion-cuerpo', d, ej.solucion);
      if (ej.tipo === 'expresion') {
        crear('p', 'solucion-respuesta', cuerpo, 'Respuesta: \\(' + (ej.prefijoTex || '') + respuestaTex(ej) + '\\)');
      }
      Mates.pintar(d);
    }

    function bloquear() {
      raiz.classList.add('ejercicio--resuelto');
      botonComprobar.hidden = true;
      botonPista.hidden = true;
      if (entrada) {
        entrada.readOnly = true;
        entrada.classList.add('campo-entrada--bien');
        if (!entrada.value) {
          entrada.value = ej.tipo === 'numero' ? window.Graficos.num(ej.respuesta, 6) : (ej.respuestaTexto || ej.respuesta);
          actualizarVista();
        }
      }
      botonesOpcion.forEach(function (b, i) {
        b.disabled = true;
        b.classList.remove('opcion--elegida', 'opcion--mal');
        if (i === ej.correcta) { b.classList.add('opcion--bien'); b.setAttribute('aria-checked', 'true'); }
      });
    }

    function comprobar() {
      if (resuelto) return;
      var correcto;
      if (ej.tipo === 'opciones') {
        if (elegida < 0) { mensaje('Elige una alternativa.', 'aviso'); return; }
        correcto = elegida === ej.correcta;
      } else if (ej.tipo === 'numero') {
        var valor = leerNumero(entrada.value);
        if (isNaN(valor)) { mensaje('Escribe un número o una expresión, por ejemplo 3, −0,5, 1/4, pi/2 o e−1.', 'aviso'); return; }
        correcto = Math.abs(valor - ej.respuesta) <= tolerancia(ej);
      } else {
        try {
          correcto = Ex.equivalentes(entrada.value, ej.respuesta, {
            variables: variables, dominio: ej.dominio, constante: ej.constante
          });
        } catch (e) {
          mensaje(e.esLectura ? e.message : 'No pude leer la expresión.', 'aviso');
          return;
        }
      }

      var f = P.registrarIntento(ej.id, correcto);

      if (correcto) {
        resuelto = true;
        bloquear();
        mensaje(f.limpio ? '¡Correcto a la primera!' : '¡Correcto!', 'bien');
        mostrarSolucion(true);
        if (opc.alResolver) opc.alResolver(f);
      } else {
        if (ej.tipo === 'opciones') {
          botonesOpcion[elegida].classList.remove('opcion--elegida');
          botonesOpcion[elegida].classList.add('opcion--mal');
          botonesOpcion[elegida].disabled = true;
          botonesOpcion[elegida].setAttribute('aria-checked', 'false');
          elegida = -1;
        } else {
          entrada.classList.add('campo-entrada--mal');
          entrada.select();
        }
        mensaje('Todavía no. Revisa tu desarrollo e inténtalo de nuevo, o pide una pista.', 'mal');
      }
    }

    botonComprobar.addEventListener('click', comprobar);
    formulario.addEventListener('submit', function (e) { e.preventDefault(); comprobar(); });

    botonPista.addEventListener('click', function () {
      var pistas = ej.pistas || [];
      if (pistasVistas < pistas.length) {
        var p = crear('div', 'pista', cajaPistas);
        crear('span', 'pista-rotulo', p, 'Pista ' + (pistasVistas + 1));
        crear('div', 'pista-texto', p, pistas[pistasVistas]);
        Mates.pintar(p);
        pistasVistas += 1;
        P.registrarPista(ej.id);
      } else {
        P.registrarSolucionVista(ej.id);
        mostrarSolucion(true);
      }
      rotuloPista();
    });

    if (resuelto) {
      bloquear();
      mensaje('Resuelto', 'bien');
      mostrarSolucion(false);
    } else {
      rotuloPista();
    }

    Mates.pintar(raiz);
  }

  window.Mates = Mates;
  window.Ejercicio = { montar: montar, leerNumero: leerNumero, respuestaTex: respuestaTex, letras: LETRAS };
})();
