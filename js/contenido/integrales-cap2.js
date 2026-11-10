/* Integrales · Capítulo 2: Técnicas de integración
 *
 * Fórmulas en LaTeX con \( ... \) en línea y \[ ... \] en bloque.
 */
(function () {
  'use strict';
  var R = String.raw;

  // ===========================================================================
  // Lección 1 · Sustitución
  // ===========================================================================
  var sustitucion = {
    id: 'sustitucion',
    titulo: 'Sustitución o cambio de variable',
    resumen: 'El reverso de la regla de la cadena.',
    minutos: 15,
    html: R`
<p class="entrada">Derivar es mecánico: hay una regla para cada operación. Integrar no lo es. Para \(\int 2x\,(x^{2}+1)^{5}\,dx\) no hay fórmula directa, y desarrollar la potencia sería eterno. Pero si miras con atención, esa integral es una regla de la cadena disfrazada.</p>

<h2>La regla de la cadena, al revés</h2>
<p>Recuerda: si \(F\) es antiderivada de \(f\), la regla de la cadena dice</p>
\[ \frac{d}{dx}\,F\bigl(g(x)\bigr)=f\bigl(g(x)\bigr)\cdot g'(x). \]
<p>Leída como integral:</p>
\[ \int f\bigl(g(x)\bigr)\,g'(x)\,dx=F\bigl(g(x)\bigr)+C. \]
<p>La pista visual es esta: <strong>en el integrando aparece una función y también (salvo una constante) su derivada</strong>.</p>

<h2>El método</h2>
<div class="caja caja--definicion">
  <p class="caja-titulo">Sustitución</p>
  <ol>
    <li><strong>Elige</strong> \(u=g(x)\), normalmente lo que está «adentro».</li>
    <li><strong>Calcula</strong> \(du=g'(x)\,dx\).</li>
    <li><strong>Reescribe</strong> toda la integral en términos de \(u\). No debe quedar ninguna \(x\).</li>
    <li><strong>Integra</strong> en \(u\).</li>
    <li><strong>Vuelve</strong> a \(x\) reemplazando \(u=g(x)\).</li>
  </ol>
</div>
<p>El paso 2 se lee como si \(\dfrac{du}{dx}=g'(x)\) fuera una fracción y se «despejara» \(du\). Es un abuso de notación, pero funciona porque es la regla de la cadena.</p>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 1 · \(\displaystyle\int 2x\,(x^{2}+1)^{5}\,dx\)</p>
  <p>Adentro de la potencia está \(x^{2}+1\), y su derivada \(2x\) está multiplicando. Tomamos \(u=x^{2}+1\), así que \(du=2x\,dx\):</p>
  \[ \int(x^{2}+1)^{5}\,\underbrace{2x\,dx}_{du}=\int u^{5}\,du=\frac{u^{6}}{6}+C=\frac{(x^{2}+1)^{6}}{6}+C. \]
  <p>Comprobación: \(\dfrac{d}{dx}\dfrac{(x^{2}+1)^{6}}{6}=(x^{2}+1)^{5}\cdot 2x\). Correcto.</p>
</div>

<h2>Ajustar constantes</h2>
<p>Muchas veces la derivada del interior aparece con otra constante. Eso se arregla despejando.</p>
<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 2 · \(\displaystyle\int x\cos(x^{2})\,dx\)</p>
  <p>Con \(u=x^{2}\) se tiene \(du=2x\,dx\), es decir, \(x\,dx=\tfrac{1}{2}\,du\):</p>
  \[ \int\cos(x^{2})\,x\,dx=\int\cos u\cdot\tfrac{1}{2}\,du=\tfrac{1}{2}\sin u+C=\tfrac{1}{2}\sin(x^{2})+C. \]
</div>
<p>Solo se pueden ajustar <em>constantes</em>. Si falta una \(x\), no se puede «inventar»: \(\int\cos(x^{2})\,dx\) no se resuelve así.</p>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 3 · Interior lineal</p>
  <p>Con \(u=3x\), \(du=3\,dx\):</p>
  \[ \int e^{3x}\,dx=\tfrac{1}{3}\int e^{u}\,du=\tfrac{1}{3}\,e^{3x}+C. \]
  <p>En general, si el interior es \(ax+b\): \(\displaystyle\int f(ax+b)\,dx=\frac{1}{a}\,F(ax+b)+C\). Por ejemplo, \(\int\cos(4x)\,dx=\tfrac{1}{4}\sin(4x)+C\).</p>
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 4 · Un logaritmo escondido</p>
  <p>Con \(u=x^{2}+1\), \(du=2x\,dx\):</p>
  \[ \int\frac{x}{x^{2}+1}\,dx=\tfrac{1}{2}\int\frac{du}{u}=\tfrac{1}{2}\ln|u|+C=\tfrac{1}{2}\ln(x^{2}+1)+C. \]
  <p>Como \(x^{2}+1&gt;0\), no hacen falta las barras del valor absoluto.</p>
</div>

<h2>Integrales definidas: cambiar los límites</h2>
<p>En una integral definida hay dos caminos: volver a \(x\) antes de evaluar, o transformar también los límites. El segundo es más limpio.</p>
<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 5 · \(\displaystyle\int_0^1 2x\,(x^{2}+1)^{3}\,dx\)</p>
  <p>Con \(u=x^{2}+1\): si \(x=0\) entonces \(u=1\), y si \(x=1\) entonces \(u=2\).</p>
  \[ \int_0^1 2x\,(x^{2}+1)^{3}\,dx=\int_1^2 u^{3}\,du=\left[\frac{u^{4}}{4}\right]_1^2=4-\frac{1}{4}=\frac{15}{4}. \]
</div>

<h2>¿Cómo elegir u?</h2>
<p>Busca lo que está «adentro» de algo: dentro de un paréntesis elevado, dentro de una raíz, en el exponente de \(e\), en el argumento de un seno o un coseno, en un denominador. Después verifica que su derivada aparezca afuera, multiplicando. Si no aparece, prueba otra elección u otra técnica.</p>

<h2>No todo se puede</h2>
<p>Hay integrales de aspecto inocente, como \(\int e^{x^{2}}\,dx\) o \(\int\frac{\sin x}{x}\,dx\), cuyas antiderivadas no se pueden escribir con funciones elementales. No es falta de ingenio: está demostrado que no existen. Esas integrales se calculan con aproximaciones, como las sumas de Riemann.</p>

<h2>En resumen</h2>
<ul>
  <li>\(\int f(g(x))\,g'(x)\,dx=F(g(x))+C\): la regla de la cadena al revés.</li>
  <li>Elige \(u\), calcula \(du\), reescribe todo en \(u\), integra y vuelve a \(x\).</li>
  <li>Se pueden ajustar constantes, pero no variables.</li>
  <li>En integrales definidas, transforma también los límites.</li>
</ul>
`,
    comprobacion: [
      {
        id: 'i2-l1-c1', tipo: 'opciones',
        enunciado: R`Para calcular \(\displaystyle\int 3x^{2}\,(x^{3}+5)^{4}\,dx\), ¿qué sustitución conviene?`,
        opciones: [R`\(u=x^{3}+5\)`, R`\(u=3x^{2}\)`, R`\(u=(x^{3}+5)^{4}\)`, R`\(u=x\)`],
        correcta: 0,
        pistas: [R`¿Qué está «adentro» de la potencia? ¿Su derivada aparece afuera?`],
        solucion: R`Con \(u=x^{3}+5\) se tiene \(du=3x^{2}\,dx\), exactamente lo que está multiplicando: \[ \int u^{4}\,du=\frac{u^{5}}{5}+C=\frac{(x^{3}+5)^{5}}{5}+C. \]`
      },
      {
        id: 'i2-l1-c2', tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int\cos(4x)\,dx=\)`,
        respuesta: 'sin(4x)/4',
        pistas: [R`Con \(u=4x\), \(du=4\,dx\), es decir \(dx=\tfrac{1}{4}\,du\).`],
        solucion: R`\[ \int\cos(4x)\,dx=\tfrac{1}{4}\int\cos u\,du=\tfrac{1}{4}\sin(4x)+C. \]`
      },
      {
        id: 'i2-l1-c3', tipo: 'numero',
        enunciado: R`Calcula \(\displaystyle\int_0^1 2x\,e^{x^{2}}\,dx\). Puedes escribir <code>e</code>.`,
        respuesta: Math.E - 1, respuestaTex: R`e-1`,
        pistas: [R`Con \(u=x^{2}\): \(du=2x\,dx\).`, R`Los límites pasan a ser \(u=0\) y \(u=1\).`],
        solucion: R`\[ \int_0^1 e^{x^{2}}\,2x\,dx=\int_0^1 e^{u}\,du=\bigl[e^{u}\bigr]_0^1=e-1\approx 1{,}718. \]`
      }
    ]
  };

  // ===========================================================================
  // Lección 2 · Integración por partes
  // ===========================================================================
  var porPartes = {
    id: 'por-partes',
    titulo: 'Integración por partes',
    resumen: 'El reverso de la regla del producto.',
    minutos: 16,
    html: R`
<p class="entrada">La sustitución deshace la regla de la cadena. ¿Qué técnica deshace la regla del producto? Esta lección la construye y la deja lista para integrales como \(\int x\,e^{x}\,dx\) o \(\int\ln x\,dx\).</p>

<h2>De dónde sale</h2>
<p>Para dos funciones \(u(x)\) y \(v(x)\), la regla del producto dice</p>
\[ (uv)'=u'\,v+u\,v'. \]
<p>Despejando \(u\,v'\) e integrando ambos lados:</p>
\[ \int u\,v'\,dx=uv-\int v\,u'\,dx. \]
<p>Con la notación \(dv=v'\,dx\) y \(du=u'\,dx\) queda la forma clásica:</p>

<div class="caja caja--definicion">
  <p class="caja-titulo">Integración por partes</p>
  \[ \int u\,dv=u\,v-\int v\,du. \]
</div>

<div class="mnemo" aria-label="Regla mnemotécnica: un día vi una vaca sin cola vestida de uniforme">
  <p class="mnemo-titulo">Para recordarla</p>
  <div class="mnemo-fila">
    <div class="mnemo-pieza"><span class="mnemo-simbolo">\(\int\)</span><span class="mnemo-palabra">&nbsp;</span></div>
    <div class="mnemo-pieza"><span class="mnemo-simbolo">\(u\)</span><span class="mnemo-palabra">Un</span></div>
    <div class="mnemo-pieza"><span class="mnemo-simbolo">\(dv\)</span><span class="mnemo-palabra">día vi</span></div>
    <div class="mnemo-pieza"><span class="mnemo-simbolo">\(=\)</span><span class="mnemo-palabra">&nbsp;</span></div>
    <div class="mnemo-pieza"><span class="mnemo-simbolo">\(u\)</span><span class="mnemo-palabra">una</span></div>
    <div class="mnemo-pieza"><span class="mnemo-simbolo">\(v\)</span><span class="mnemo-palabra">vaca</span></div>
    <div class="mnemo-pieza"><span class="mnemo-simbolo">\(-\)</span><span class="mnemo-palabra">sin</span></div>
    <div class="mnemo-pieza"><span class="mnemo-simbolo">\(\int\)</span><span class="mnemo-palabra">cola</span></div>
    <div class="mnemo-pieza"><span class="mnemo-simbolo">\(v\)</span><span class="mnemo-palabra">vestida</span></div>
    <div class="mnemo-pieza"><span class="mnemo-simbolo">\(du\)</span><span class="mnemo-palabra">de uniforme</span></div>
  </div>
  <p class="mnemo-nota">«<strong>U</strong>n <strong>d</strong>ía <strong>v</strong>i <strong>u</strong>na <strong>v</strong>aca <strong>sin</strong> <strong>cola</strong> <strong>v</strong>estida <strong>d</strong>e <strong>u</strong>niforme.» La cola es la integral; «sin» es el signo menos.</p>
</div>

<h2>La idea</h2>
<p>Se reparte el integrando en dos partes: \(u\), que se va a <strong>derivar</strong>, y \(dv\), que se va a <strong>integrar</strong>. La fórmula cambia la integral original por \(\int v\,du\). La técnica sirve cuando esa nueva integral es más fácil que la original.</p>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 1 · \(\displaystyle\int x\,e^{x}\,dx\)</p>
  <p>Al derivar \(x\) se simplifica (queda 1), y \(e^{x}\) es fácil de integrar.</p>
  <table class="tabla tabla--compacta">
    <tbody>
      <tr><td>\(u=x\)</td><td>\(dv=e^{x}\,dx\)</td></tr>
      <tr><td>\(du=dx\)</td><td>\(v=e^{x}\)</td></tr>
    </tbody>
  </table>
  \[ \int x\,e^{x}\,dx=x\,e^{x}-\int e^{x}\,dx=x\,e^{x}-e^{x}+C=(x-1)\,e^{x}+C. \]
  <p>Comprobación: \(\bigl((x-1)e^{x}\bigr)'=e^{x}+(x-1)e^{x}=x\,e^{x}\). Correcto.</p>
</div>

<h2>¿Qué elegir como u?</h2>
<p>Una regla práctica es <strong>LIATE</strong>: elige como \(u\) la función que aparezca primero en esta lista.</p>
<table class="tabla">
  <thead><tr><th></th><th>Tipo</th><th>Ejemplos</th></tr></thead>
  <tbody>
    <tr><td><strong>L</strong></td><td>Logarítmicas</td><td>\(\ln x\)</td></tr>
    <tr><td><strong>I</strong></td><td>Inversas trigonométricas</td><td>\(\arctan x\), \(\arcsin x\)</td></tr>
    <tr><td><strong>A</strong></td><td>Algebraicas</td><td>\(x\), \(x^{2}\), \(3x+1\)</td></tr>
    <tr><td><strong>T</strong></td><td>Trigonométricas</td><td>\(\sin x\), \(\cos x\)</td></tr>
    <tr><td><strong>E</strong></td><td>Exponenciales</td><td>\(e^{x}\), \(e^{2x}\)</td></tr>
  </tbody>
</table>
<p>La idea detrás: las primeras de la lista se simplifican al derivar; las últimas son fáciles de integrar.</p>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 2 · \(\displaystyle\int x\cos x\,dx\)</p>
  <p>Algebraica antes que trigonométrica: \(u=x\), \(dv=\cos x\,dx\), así que \(du=dx\) y \(v=\sin x\).</p>
  \[ \int x\cos x\,dx=x\sin x-\int\sin x\,dx=x\sin x+\cos x+C. \]
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 3 · \(\displaystyle\int\ln x\,dx\)</p>
  <p>Parece que no hay producto, pero se puede tomar \(dv=dx\). Con \(u=\ln x\): \(du=\tfrac{1}{x}\,dx\) y \(v=x\).</p>
  \[ \int\ln x\,dx=x\ln x-\int x\cdot\frac{1}{x}\,dx=x\ln x-x+C. \]
</div>

<h2>Aplicarla más de una vez</h2>
<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 4 · \(\displaystyle\int x^{2}e^{x}\,dx\)</p>
  <p>Con \(u=x^{2}\), \(dv=e^{x}\,dx\): la potencia baja de grado, pero no desaparece.</p>
  \[ \int x^{2}e^{x}\,dx=x^{2}e^{x}-2\int x\,e^{x}\,dx. \]
  <p>La integral que queda es la del ejemplo 1:</p>
  \[ =x^{2}e^{x}-2(x-1)e^{x}+C=\bigl(x^{2}-2x+2\bigr)\,e^{x}+C. \]
</div>

<h2>Cuando la integral vuelve</h2>
<p>A veces, después de aplicar partes dos veces, reaparece la integral original. No es un callejón sin salida: se despeja como una ecuación.</p>
<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 5 · \(I=\displaystyle\int e^{x}\sin x\,dx\)</p>
  <p>Primera vez, con \(u=\sin x\) y \(dv=e^{x}\,dx\):</p>
  \[ I=e^{x}\sin x-\int e^{x}\cos x\,dx. \]
  <p>Segunda vez, con \(u=\cos x\) y \(dv=e^{x}\,dx\):</p>
  \[ \int e^{x}\cos x\,dx=e^{x}\cos x+\int e^{x}\sin x\,dx=e^{x}\cos x+I. \]
  <p>Juntando: \(I=e^{x}\sin x-e^{x}\cos x-I\). Despejando,</p>
  \[ I=\tfrac{1}{2}\,e^{x}\,(\sin x-\cos x)+C. \]
</div>

<h2>Integrales definidas</h2>
<p>La fórmula vale igual, evaluando el término \(uv\) en los límites:</p>
\[ \int_a^b u\,dv=\bigl[u\,v\bigr]_a^b-\int_a^b v\,du. \]
<p>Por ejemplo, con el resultado del ejemplo 1:</p>
\[ \int_0^1 x\,e^{x}\,dx=\bigl[(x-1)\,e^{x}\bigr]_0^1=0-(-1)=1. \]

<h2>Una mala elección</h2>
<p>Si en \(\int x\,e^{x}\,dx\) se elige al revés, \(u=e^{x}\) y \(dv=x\,dx\), resulta</p>
\[ \int x\,e^{x}\,dx=\frac{x^{2}}{2}\,e^{x}-\int\frac{x^{2}}{2}\,e^{x}\,dx, \]
<p>que es <em>peor</em>: la potencia subió. Cuando eso pasa, vuelve atrás e intercambia los papeles.</p>

<h2>En resumen</h2>
<ul>
  <li>\(\int u\,dv=uv-\int v\,du\): la regla del producto al revés.</li>
  <li>\(u\) se deriva y \(dv\) se integra. Elige \(u\) con LIATE.</li>
  <li>Puede hacer falta aplicarla varias veces, o despejar si la integral reaparece.</li>
  <li>Siempre puedes comprobar derivando el resultado.</li>
</ul>
`,
    comprobacion: [
      {
        id: 'i2-l2-c1', tipo: 'opciones',
        enunciado: R`Para \(\displaystyle\int x\sin x\,dx\), ¿qué conviene elegir como \(u\)?`,
        opciones: [R`\(u=x\)`, R`\(u=\sin x\)`, R`\(u=x\sin x\)`, R`\(u=\cos x\)`],
        correcta: 0,
        pistas: [R`LIATE: algebraicas antes que trigonométricas.`],
        solucion: R`Con \(u=x\) y \(dv=\sin x\,dx\): \(du=dx\) y \(v=-\cos x\). \[ \int x\sin x\,dx=-x\cos x+\int\cos x\,dx=-x\cos x+\sin x+C. \]`
      },
      {
        id: 'i2-l2-c2', tipo: 'opciones',
        enunciado: R`¿Cuál es la fórmula de integración por partes?`,
        opciones: [
          R`\(\displaystyle\int u\,dv=uv-\int v\,du\)`,
          R`\(\displaystyle\int u\,dv=uv+\int v\,du\)`,
          R`\(\displaystyle\int u\,dv=u'v-\int u\,v'\,dx\)`,
          R`\(\displaystyle\int u\,v\,dx=\int u\,dx\cdot\int v\,dx\)`
        ],
        correcta: 0,
        pistas: [R`Un día vi una vaca <em>sin</em> cola…`],
        solucion: R`\[ \int u\,dv=uv-\int v\,du. \] «Sin» es el signo menos. La última alternativa es el error de pensar que la integral de un producto es el producto de las integrales.`
      },
      {
        id: 'i2-l2-c3', tipo: 'numero',
        enunciado: R`Calcula \(\displaystyle\int_0^1 x\,e^{x}\,dx\).`,
        respuesta: 1,
        pistas: [R`Una antiderivada de \(x\,e^{x}\) es \((x-1)\,e^{x}\).`],
        solucion: R`\[ \int_0^1 x\,e^{x}\,dx=\bigl[(x-1)\,e^{x}\bigr]_0^1=(0)\,e-(-1)\,e^{0}=1. \]`
      }
    ]
  };

  // ===========================================================================
  // Guía de ejercicios
  // ===========================================================================
  var SUS = 'Sustitución';
  var PAR = 'Por partes';

  var guia = {
    titulo: 'Guía de ejercicios',
    resumen: '15 ejercicios de sustitución e integración por partes.',
    ejercicios: [
      // --- Sustitución ---
      {
        id: 'i2-g01', tema: SUS, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int 2x\,(x^{2}+3)^{4}\,dx=\)`, respuesta: '(x^2+3)^5/5',
        pistas: [R`\(u=x^{2}+3\), \(du=2x\,dx\).`, R`\(\int u^{4}\,du=\dfrac{u^{5}}{5}\).`],
        solucion: R`\[ \int u^{4}\,du=\frac{u^{5}}{5}+C=\frac{(x^{2}+3)^{5}}{5}+C. \]`
      },
      {
        id: 'i2-g02', tema: SUS, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int e^{5x}\,dx=\)`, respuesta: 'e^(5x)/5',
        pistas: [R`\(u=5x\), \(dx=\tfrac{1}{5}\,du\).`],
        solucion: R`\[ \int e^{5x}\,dx=\tfrac{1}{5}\int e^{u}\,du=\tfrac{1}{5}\,e^{5x}+C. \]`
      },
      {
        id: 'i2-g03', tema: SUS, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int\sin(3x)\,dx=\)`, respuesta: '-cos(3x)/3',
        pistas: [R`\(u=3x\), \(dx=\tfrac{1}{3}\,du\).`, R`\(\int\sin u\,du=-\cos u\).`],
        solucion: R`\[ \int\sin(3x)\,dx=\tfrac{1}{3}\int\sin u\,du=-\tfrac{1}{3}\cos(3x)+C. \]`
      },
      {
        id: 'i2-g04', tema: SUS, tipo: 'opciones',
        enunciado: R`¿Cuánto vale \(\displaystyle\int x^{2}\,(x^{3}+1)^{7}\,dx\)?`,
        opciones: [
          R`\(\dfrac{(x^{3}+1)^{8}}{24}+C\)`,
          R`\(\dfrac{(x^{3}+1)^{8}}{8}+C\)`,
          R`\(\dfrac{x^{3}\,(x^{3}+1)^{8}}{24}+C\)`,
          R`\(\dfrac{(x^{3}+1)^{8}}{3}+C\)`
        ],
        correcta: 0,
        pistas: [R`\(u=x^{3}+1\), \(du=3x^{2}\,dx\), así que \(x^{2}\,dx=\tfrac{1}{3}\,du\).`],
        solucion: R`\[ \int(x^{3}+1)^{7}\,x^{2}\,dx=\tfrac{1}{3}\int u^{7}\,du=\tfrac{1}{3}\cdot\frac{u^{8}}{8}+C=\frac{(x^{3}+1)^{8}}{24}+C. \]`
      },
      {
        id: 'i2-g05', tema: SUS, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int\frac{x}{\sqrt{x^{2}+1}}\,dx=\)`, respuesta: 'sqrt(x^2+1)',
        pistas: [R`\(u=x^{2}+1\), \(x\,dx=\tfrac{1}{2}\,du\).`, R`\(\tfrac{1}{2}\int u^{-1/2}\,du\).`],
        solucion: R`\[ \tfrac{1}{2}\int u^{-1/2}\,du=\tfrac{1}{2}\cdot 2u^{1/2}+C=\sqrt{x^{2}+1}+C. \]`
      },
      {
        id: 'i2-g06', tema: SUS, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int\cos x\;e^{\sin x}\,dx=\)`, respuesta: 'e^(sin(x))',
        pistas: [R`¿Qué está en el exponente? ¿Su derivada aparece afuera?`, R`\(u=\sin x\), \(du=\cos x\,dx\).`],
        solucion: R`\[ \int e^{\sin x}\cos x\,dx=\int e^{u}\,du=e^{\sin x}+C. \]`
      },
      {
        id: 'i2-g07', tema: SUS, tipo: 'numero',
        enunciado: R`Calcula \(\displaystyle\int_0^1 3x^{2}\,(x^{3}+1)^{2}\,dx\). Puedes responder con una fracción.`,
        respuesta: 7 / 3, respuestaTex: R`\tfrac{7}{3}`,
        pistas: [R`\(u=x^{3}+1\). Los límites pasan a \(u=1\) y \(u=2\).`, R`\(\int_1^2 u^{2}\,du\).`],
        solucion: R`\[ \int_1^2 u^{2}\,du=\left[\frac{u^{3}}{3}\right]_1^2=\frac{8}{3}-\frac{1}{3}=\frac{7}{3}. \]`
      },
      {
        id: 'i2-g08', tema: SUS, tipo: 'opciones',
        enunciado: R`¿Cuál de estas integrales <strong>no</strong> se puede resolver con una sustitución simple?`,
        opciones: [
          R`\(\displaystyle\int e^{x^{2}}\,dx\)`,
          R`\(\displaystyle\int x\,e^{x^{2}}\,dx\)`,
          R`\(\displaystyle\int 2x\cos(x^{2})\,dx\)`,
          R`\(\displaystyle\int(2x+1)^{9}\,dx\)`
        ],
        correcta: 0,
        pistas: [R`Para sustituir \(u=x^{2}\) hace falta un factor \(x\) afuera.`],
        solucion: R`En \(\int e^{x^{2}}\,dx\) no hay ningún factor \(x\) que acompañe a \(du=2x\,dx\), y las variables no se pueden ajustar. De hecho, esa integral no tiene antiderivada elemental. Las otras tres salen con \(u=x^{2}\), \(u=x^{2}\) y \(u=2x+1\).`
      },

      // --- Partes ---
      {
        id: 'i2-g09', tema: PAR, tipo: 'opciones',
        enunciado: R`Para \(\displaystyle\int x\,e^{2x}\,dx\) por partes, ¿qué elección conviene?`,
        opciones: [
          R`\(u=x,\ dv=e^{2x}\,dx\)`,
          R`\(u=e^{2x},\ dv=x\,dx\)`,
          R`\(u=x\,e^{2x},\ dv=dx\)`,
          R`\(u=2x,\ dv=e^{x}\,dx\)`
        ],
        correcta: 0,
        pistas: [R`LIATE: algebraica antes que exponencial.`],
        solucion: R`Con \(u=x\) al derivar queda \(du=dx\), y \(e^{2x}\) es fácil de integrar. La segunda elección hace subir la potencia de \(x\) y empeora la integral.`
      },
      {
        id: 'i2-g10', tema: PAR, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int x\,e^{2x}\,dx=\)`, respuesta: 'x e^(2x)/2 - e^(2x)/4',
        pistas: [R`\(u=x\), \(dv=e^{2x}\,dx\), entonces \(v=\tfrac{1}{2}e^{2x}\).`, R`\(\tfrac{x}{2}e^{2x}-\int\tfrac{1}{2}e^{2x}\,dx\).`],
        solucion: R`\[ \int x\,e^{2x}\,dx=\frac{x}{2}\,e^{2x}-\frac{1}{2}\int e^{2x}\,dx=\frac{x}{2}\,e^{2x}-\frac{1}{4}\,e^{2x}+C. \]`
      },
      {
        id: 'i2-g11', tema: PAR, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int x\sin x\,dx=\)`, respuesta: '-x cos(x) + sin(x)',
        pistas: [R`\(u=x\), \(dv=\sin x\,dx\), \(v=-\cos x\).`],
        solucion: R`\[ \int x\sin x\,dx=-x\cos x-\int(-\cos x)\,dx=-x\cos x+\sin x+C. \]`
      },
      {
        id: 'i2-g12', tema: PAR, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int x\ln x\,dx=\)`, respuesta: 'x^2 ln(x)/2 - x^2/4', dominio: [0.5, 3],
        pistas: [R`LIATE: el logaritmo va primero. \(u=\ln x\), \(dv=x\,dx\).`, R`\(du=\tfrac{1}{x}\,dx\), \(v=\tfrac{x^{2}}{2}\).`],
        solucion: R`\[ \int x\ln x\,dx=\frac{x^{2}}{2}\ln x-\int\frac{x^{2}}{2}\cdot\frac{1}{x}\,dx=\frac{x^{2}}{2}\ln x-\frac{x^{2}}{4}+C. \]`
      },
      {
        id: 'i2-g13', tema: PAR, tipo: 'numero',
        enunciado: R`Calcula \(\displaystyle\int_1^{e}\ln x\,dx\).`,
        respuesta: 1,
        pistas: [R`Una antiderivada de \(\ln x\) es \(x\ln x-x\).`, R`\(\ln e=1\) y \(\ln 1=0\).`],
        solucion: R`\[ \int_1^{e}\ln x\,dx=\bigl[x\ln x-x\bigr]_1^{e}=(e-e)-(0-1)=1. \]`
      },
      {
        id: 'i2-g14', tema: PAR, tipo: 'numero',
        enunciado: R`Calcula \(\displaystyle\int_0^{\pi}x\cos x\,dx\).`,
        respuesta: -2,
        pistas: [R`Una antiderivada es \(x\sin x+\cos x\).`, R`\(\sin\pi=0\), \(\cos\pi=-1\).`],
        solucion: R`\[ \int_0^{\pi}x\cos x\,dx=\bigl[x\sin x+\cos x\bigr]_0^{\pi}=(0-1)-(0+1)=-2. \]`
      },
      {
        id: 'i2-g15', tema: PAR, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral. Vas a necesitar aplicar partes dos veces.`,
        prefijo: R`\(\displaystyle\int x^{2}e^{x}\,dx=\)`, respuesta: '(x^2 - 2x + 2) e^x',
        pistas: [R`Primero \(u=x^{2}\), \(dv=e^{x}\,dx\): queda \(x^{2}e^{x}-2\int x\,e^{x}\,dx\).`, R`\(\int x\,e^{x}\,dx=(x-1)\,e^{x}\).`],
        solucion: R`\[ \int x^{2}e^{x}\,dx=x^{2}e^{x}-2\int x\,e^{x}\,dx=x^{2}e^{x}-2(x-1)e^{x}+C=\bigl(x^{2}-2x+2\bigr)e^{x}+C. \]`
      }
    ]
  };

  window.Curso.registrarCapitulo('integrales', {
    id: 'tecnicas',
    numero: 2,
    titulo: 'Técnicas de integración',
    resumen: 'No siempre hay una fórmula directa: hace falta ingenio. Sustitución e integración por partes.',
    lecciones: [sustitucion, porPartes],
    guia: guia
  });
})();
