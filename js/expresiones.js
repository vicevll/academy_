/* Lector de expresiones matemáticas escritas por el estudiante.
 *
 *   Expresiones.leer('3x^2 + sen(2x)', ['x'])   → árbol (lanza Error con mensaje en español)
 *   Expresiones.evaluar(arbol, { x: 1.5 })      → número
 *   Expresiones.aLatex(arbol | texto)           → LaTeX para la vista previa
 *   Expresiones.equivalentes(a, b, opciones)    → true si son la misma función
 *   Expresiones.valor('pi/4')                   → número (expresión sin variables)
 *
 * Acepta: + − * / ^, paréntesis, multiplicación implícita (2x, x(x+1), 3 sen x),
 * sen/sin, cos, tan, sec, csc, cot, arcsen, arccos, arctan, ln, log (base 10), exp,
 * sqrt/raiz, abs, las constantes pi y e, y la coma o el punto como separador decimal.
 */
(function () {
  'use strict';

  var sec = function (x) { return 1 / Math.cos(x); };
  var csc = function (x) { return 1 / Math.sin(x); };
  var cot = function (x) { return 1 / Math.tan(x); };

  var FUNCIONES = {
    sin: Math.sin, sen: Math.sin, cos: Math.cos, tan: Math.tan, tg: Math.tan,
    sec: sec, csc: csc, cosec: csc, cot: cot, cotg: cot,
    arcsin: Math.asin, arcsen: Math.asin, asin: Math.asin,
    arccos: Math.acos, acos: Math.acos,
    arctan: Math.atan, arctg: Math.atan, atan: Math.atan,
    ln: Math.log, log: Math.log10, exp: Math.exp,
    sqrt: Math.sqrt, raiz: Math.sqrt, abs: Math.abs
  };

  var TEX_FUNCION = {
    sin: '\\sin', sen: '\\sin', cos: '\\cos', tan: '\\tan', tg: '\\tan',
    sec: '\\sec', csc: '\\csc', cosec: '\\csc', cot: '\\cot', cotg: '\\cot',
    arcsin: '\\arcsin', arcsen: '\\arcsin', asin: '\\arcsin',
    arccos: '\\arccos', acos: '\\arccos',
    arctan: '\\arctan', arctg: '\\arctan', atan: '\\arctan',
    ln: '\\ln', log: '\\log'
  };

  var CONSTANTES = { pi: Math.PI, e: Math.E };

  function fallo(mensaje) { var e = new Error(mensaje); e.esLectura = true; return e; }

  function normalizar(texto) {
    return String(texto)
      .replace(/[−–—]/g, '-')
      .replace(/[·×⋅∙]/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/\*\*/g, '^')
      .replace(/[\[{]/g, '(')
      .replace(/[\]}]/g, ')');
  }

  // ---------------------------------------------------------------------------
  // Tokens
  // ---------------------------------------------------------------------------
  function tokenizar(texto, variables) {
    var s = normalizar(texto);
    var nombres = Object.keys(FUNCIONES).concat(Object.keys(CONSTANTES), variables)
      .sort(function (a, b) { return b.length - a.length; });
    var tokens = [], i = 0;

    while (i < s.length) {
      var c = s[i];
      if (/\s/.test(c)) { i++; continue; }

      if (/[0-9.,]/.test(c)) {
        var m = s.slice(i).match(/^(\d+([.,]\d*)?|[.,]\d+)/);
        if (!m) throw fallo('Hay un número mal escrito.');
        tokens.push({ tipo: 'num', valor: parseFloat(m[0].replace(',', '.')) });
        i += m[0].length;
        continue;
      }

      if (/[a-zA-Z]/.test(c)) {
        var palabra = s.slice(i).match(/^[a-zA-Z]+/)[0];
        var minus = palabra.toLowerCase(), j = 0;
        while (j < minus.length) {
          var resto = minus.slice(j), hallado = null;
          for (var k = 0; k < nombres.length; k++) {
            if (resto.indexOf(nombres[k]) === 0) { hallado = nombres[k]; break; }
          }
          if (!hallado) throw fallo('No reconozco «' + palabra.slice(j) + '».');
          if (FUNCIONES[hallado]) tokens.push({ tipo: 'fun', nombre: hallado });
          else if (CONSTANTES[hallado] != null && variables.indexOf(hallado) === -1) tokens.push({ tipo: 'const', nombre: hallado });
          else tokens.push({ tipo: 'var', nombre: hallado });
          j += hallado.length;
        }
        i += palabra.length;
        continue;
      }

      if ('+-*/^()'.indexOf(c) !== -1) { tokens.push({ tipo: 'op', valor: c }); i++; continue; }

      throw fallo('El símbolo «' + c + '» no es válido.');
    }
    return tokens;
  }

  // ---------------------------------------------------------------------------
  // Análisis (descenso recursivo)
  // ---------------------------------------------------------------------------
  function Analizador(tokens) { this.t = tokens; this.i = 0; }

  Analizador.prototype.ver = function () { return this.t[this.i]; };
  Analizador.prototype.tomar = function () { return this.t[this.i++]; };
  Analizador.prototype.esOp = function (v) { var t = this.ver(); return !!t && t.tipo === 'op' && t.valor === v; };
  Analizador.prototype.empiezaFactor = function () {
    var t = this.ver();
    if (!t) return false;
    return t.tipo === 'num' || t.tipo === 'var' || t.tipo === 'const' || t.tipo === 'fun' || (t.tipo === 'op' && t.valor === '(');
  };

  Analizador.prototype.expresion = function () {
    var n = this.termino();
    while (this.esOp('+') || this.esOp('-')) {
      var op = this.tomar().valor;
      n = { t: op, a: n, b: this.termino() };
    }
    return n;
  };

  Analizador.prototype.termino = function () {
    var n = this.unario();
    for (;;) {
      if (this.esOp('*') || this.esOp('/')) {
        var op = this.tomar().valor;
        n = { t: op, a: n, b: this.unario() };
      } else if (this.empiezaFactor()) {
        n = { t: '*', a: n, b: this.potencia(), implicita: true };
      } else {
        return n;
      }
    }
  };

  Analizador.prototype.unario = function () {
    if (this.esOp('-')) { this.tomar(); return { t: 'neg', a: this.unario() }; }
    if (this.esOp('+')) { this.tomar(); return this.unario(); }
    return this.potencia();
  };

  Analizador.prototype.potencia = function () {
    var base = this.primario();
    if (this.esOp('^')) {
      this.tomar();
      if (!this.ver()) throw fallo('Falta el exponente después de «^».');
      return { t: '^', a: base, b: this.unario() };
    }
    return base;
  };

  Analizador.prototype.primario = function () {
    var t = this.tomar();
    if (!t) throw fallo('La expresión está incompleta.');
    if (t.tipo === 'num') return { t: 'num', v: t.valor };
    if (t.tipo === 'var') return { t: 'var', n: t.nombre };
    if (t.tipo === 'const') return { t: 'const', n: t.nombre };
    if (t.tipo === 'op' && t.valor === '(') {
      if (this.esOp(')')) throw fallo('Hay un paréntesis vacío.');
      var dentro = this.expresion();
      if (!this.esOp(')')) throw fallo('Falta cerrar un paréntesis.');
      this.tomar();
      return dentro;
    }
    if (t.tipo === 'fun') {
      var potencia = null;
      if (this.esOp('^')) { // sen^2(x)
        this.tomar();
        potencia = this.esOp('-') ? (this.tomar(), { t: 'neg', a: this.primario() }) : this.primario();
      }
      var arg;
      if (this.esOp('(')) {
        arg = this.primario();
      } else {
        if (!this.ver()) throw fallo('Falta el argumento de «' + t.nombre + '».');
        arg = this.potencia();
        // «sen 2x» se lee como sen(2x)
        var sig = this.ver();
        if (arg.t === 'num' && sig && (sig.tipo === 'var' || sig.tipo === 'const')) arg = { t: '*', a: arg, b: this.potencia(), implicita: true };
      }
      var nodo = { t: 'fun', n: t.nombre, a: arg };
      return potencia ? { t: '^', a: nodo, b: potencia } : nodo;
    }
    if (t.tipo === 'op' && t.valor === ')') throw fallo('Sobra un paréntesis «)».');
    throw fallo('Hay un «' + t.valor + '» fuera de lugar.');
  };

  function leer(texto, variables) {
    variables = variables || ['x'];
    if (!String(texto).trim()) throw fallo('Escribe una expresión.');
    var tokens = tokenizar(texto, variables);
    var a = new Analizador(tokens);
    var arbol = a.expresion();
    if (a.i < tokens.length) {
      var t = tokens[a.i];
      throw fallo(t.tipo === 'op' && t.valor === ')' ? 'Sobra un paréntesis «)».' : 'Hay algo de más al final.');
    }
    return arbol;
  }

  // ---------------------------------------------------------------------------
  // Evaluación
  // ---------------------------------------------------------------------------
  function evaluar(n, valores) {
    switch (n.t) {
      case 'num': return n.v;
      case 'const': return CONSTANTES[n.n];
      case 'var':
        if (!valores || valores[n.n] == null) return NaN;
        return valores[n.n];
      case 'neg': return -evaluar(n.a, valores);
      case '+': return evaluar(n.a, valores) + evaluar(n.b, valores);
      case '-': return evaluar(n.a, valores) - evaluar(n.b, valores);
      case '*': return evaluar(n.a, valores) * evaluar(n.b, valores);
      case '/': return evaluar(n.a, valores) / evaluar(n.b, valores);
      case '^': return Math.pow(evaluar(n.a, valores), evaluar(n.b, valores));
      case 'fun': return FUNCIONES[n.n](evaluar(n.a, valores));
    }
    return NaN;
  }

  // ---------------------------------------------------------------------------
  // LaTeX (vista previa)
  // ---------------------------------------------------------------------------
  function precedencia(n) {
    if (n.t === '+' || n.t === '-') return 1;
    if (n.t === '*' || n.t === '/') return 2;
    if (n.t === 'neg') return 3;
    if (n.t === '^') return 4;
    return 5;
  }

  function empiezaConNumero(n) {
    if (n.t === 'num') return true;
    if (n.t === '*' || n.t === '^') return empiezaConNumero(n.a);
    return false;
  }

  function parentesis(tex) { return '\\left(' + tex + '\\right)'; }

  function tex(n) {
    var a, b;
    switch (n.t) {
      case 'num': return String(n.v).replace('.', '{,}');
      case 'var': return n.n;
      case 'const': return n.n === 'pi' ? '\\pi' : 'e';
      case '+': return tex(n.a) + '+' + tex(n.b);
      case '-':
        b = tex(n.b);
        return tex(n.a) + '-' + (precedencia(n.b) <= 1 || n.b.t === 'neg' ? parentesis(b) : b);
      case 'neg':
        a = tex(n.a);
        return '-' + (precedencia(n.a) <= 1 || n.a.t === 'neg' ? parentesis(a) : a);
      case '*':
        a = precedencia(n.a) < 2 ? parentesis(tex(n.a)) : tex(n.a);
        b = (precedencia(n.b) < 2 || n.b.t === 'neg') ? parentesis(tex(n.b)) : tex(n.b);
        if (n.b.t === '/' || n.a.t === '/') return a + '\\cdot ' + b;
        return a + (empiezaConNumero(n.b) ? '\\cdot ' : '\\,') + b;
      case '/': return '\\dfrac{' + tex(n.a) + '}{' + tex(n.b) + '}';
      case '^':
        a = tex(n.a);
        if (precedencia(n.a) < 5 || n.a.t === 'fun' || (n.a.t === 'num' && n.a.v < 0)) a = parentesis(a);
        return a + '^{' + tex(n.b) + '}';
      case 'fun':
        if (n.n === 'sqrt' || n.n === 'raiz') return '\\sqrt{' + tex(n.a) + '}';
        if (n.n === 'abs') return '\\left|' + tex(n.a) + '\\right|';
        if (n.n === 'exp') return 'e^{' + tex(n.a) + '}';
        return TEX_FUNCION[n.n] + parentesis(tex(n.a));
    }
    return '';
  }

  function aLatex(arbolOTexto, variables) {
    var arbol = typeof arbolOTexto === 'string' ? leer(arbolOTexto, variables) : arbolOTexto;
    return tex(arbol);
  }

  // ---------------------------------------------------------------------------
  // Comparación
  // ---------------------------------------------------------------------------
  function cerca(a, b) {
    return Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));
  }

  /* Quita un «+ C» final (constante de integración). */
  function sinConstante(texto) {
    return String(texto).replace(/[+]\s*[cCkK]\s*$/, '').replace(/^\s*[cCkK]\s*[+]/, '');
  }

  /**
   * ¿Son la misma función de las variables dadas?
   * opciones: { variables: ['x'], dominio: [a, b], constante: false }
   * Con constante: true se aceptan funciones que difieren en una constante (antiderivadas).
   */
  function equivalentes(entrada, correcta, opciones) {
    opciones = opciones || {};
    var variables = opciones.variables || ['x'];
    var dominio = opciones.dominio || [-2, 2];
    var v = variables[0];
    if (opciones.constante) entrada = sinConstante(entrada);

    var A = leer(entrada, variables);
    var B = typeof correcta === 'string' ? leer(correcta, variables) : correcta;

    var validos = 0, diferencia = null, puntos = 14;
    for (var k = 0; k < puntos; k++) {
      var x = dominio[0] + (dominio[1] - dominio[0]) * (k + 0.5) / puntos + 0.0137 * Math.sin(k + 1);
      var valores = {}; valores[v] = x;
      var esperado = evaluar(B, valores);
      if (!isFinite(esperado)) continue;
      var obtenido = evaluar(A, valores);
      if (!isFinite(obtenido)) return false;
      validos += 1;
      if (opciones.constante) {
        var d = obtenido - esperado;
        if (diferencia === null) diferencia = d;
        else if (!cerca(d, diferencia)) return false;
      } else if (!cerca(obtenido, esperado)) {
        return false;
      }
    }
    return validos >= 4;
  }

  /* Valor numérico de una expresión sin variables («1/4», «pi/2», «e-1», «ln 2»). */
  function valor(texto) {
    var arbol = leer(texto, []);
    var r = evaluar(arbol, {});
    if (!isFinite(r)) throw fallo('Esa expresión no da un número.');
    return r;
  }

  window.Expresiones = {
    leer: leer,
    evaluar: evaluar,
    aLatex: aLatex,
    equivalentes: equivalentes,
    valor: valor,
    sinConstante: sinConstante
  };
})();
