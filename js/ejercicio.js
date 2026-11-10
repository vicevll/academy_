/* Componente de ejercicio: opción múltiple o respuesta numérica,
 * con pistas progresivas y solución paso a paso.
 *
 *   Ejercicio.montar(elemento, ejercicio, { alResolver: function () {} })
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
    html: function (tex) {
      try { return window.katex.renderToString(tex, { throwOnError: false }); }
      catch (e) { return tex; }
    }
  };

  /* Acepta 3 · -0,5 · −0.5 · 1/4 · -1/4 */
  function leerNumero(texto) {
    var t = String(texto).trim().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/,/g, '.');
    if (!t) return NaN;
    var simple = /^[+-]?(\d+\.?\d*|\.\d+)$/;
    var partes = t.split('/');
    if (partes.length === 2 && simple.test(partes[0]) && simple.test(partes[1])) {
      var den = parseFloat(partes[1]);
      return den === 0 ? NaN : parseFloat(partes[0]) / den;
    }
    return simple.test(t) ? parseFloat(t) : NaN;
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
    var entrada = null;

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
      var linea = crear('label', 'campo', formulario);
      if (ej.prefijo) crear('span', 'campo-prefijo', linea, ej.prefijo);
      entrada = crear('input', 'campo-entrada', linea);
      entrada.type = 'text';
      entrada.setAttribute('inputmode', 'text');
      entrada.setAttribute('autocomplete', 'off');
      entrada.setAttribute('aria-label', 'Tu respuesta');
      entrada.placeholder = 'Tu respuesta';
      if (ej.unidad) crear('span', 'campo-unidad', linea, ej.unidad);
      entrada.addEventListener('input', function () { mensaje('', ''); entrada.classList.remove('campo-entrada--mal'); });
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
      crear('div', 'solucion-cuerpo', d, ej.solucion);
      Mates.pintar(d);
    }

    function bloquear() {
      raiz.classList.add('ejercicio--resuelto');
      botonComprobar.hidden = true;
      botonPista.hidden = true;
      if (entrada) {
        entrada.readOnly = true;
        entrada.classList.add('campo-entrada--bien');
        if (!entrada.value) entrada.value = window.Graficos.num(ej.respuesta, 6);
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
      } else {
        var valor = leerNumero(entrada.value);
        if (isNaN(valor)) { mensaje('Escribe un número, por ejemplo 3, −0,5 o 1/4.', 'aviso'); return; }
        var tol = ej.tolerancia != null ? ej.tolerancia : 1e-6;
        correcto = Math.abs(valor - ej.respuesta) <= tol;
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
  window.Ejercicio = { montar: montar, leerNumero: leerNumero };
})();
