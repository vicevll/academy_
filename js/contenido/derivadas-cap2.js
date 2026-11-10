/* Derivadas · Capítulo 2: Las reglas básicas
 *
 * Fórmulas en LaTeX con \( ... \) en línea y \[ ... \] en bloque.
 */
(function () {
  'use strict';
  var R = String.raw;

  // ===========================================================================
  // Lección 1 · Álgebra de derivadas
  // ===========================================================================
  var algebra = {
    id: 'algebra-de-derivadas',
    titulo: 'Álgebra de derivadas',
    resumen: 'Regla de la potencia, múltiplos constantes, suma y resta.',
    minutos: 12,
    html: R`
<p class="entrada">La definición con límites funciona siempre, pero es lenta. En esta lección vamos a convertir lo que ya calculaste en un puñado de reglas que permiten derivar casi cualquier polinomio en segundos.</p>

<h2>Lo que ya sabemos</h2>
<p>En el capítulo anterior calculaste varias derivadas con la definición:</p>
<table class="tabla">
  <thead><tr><th>\(f(x)\)</th><th>\(f'(x)\)</th></tr></thead>
  <tbody>
    <tr><td>\(x^2\)</td><td>\(2x\)</td></tr>
    <tr><td>\(x^3\)</td><td>\(3x^2\)</td></tr>
    <tr><td>\(\dfrac{1}{x}\)</td><td>\(-\dfrac{1}{x^2}\)</td></tr>
    <tr><td>\(\sqrt{x}\)</td><td>\(\dfrac{1}{2\sqrt{x}}\)</td></tr>
  </tbody>
</table>
<p>Parecen resultados sueltos, pero siguen un mismo patrón. Para verlo hay que escribir todo como potencias de \(x\).</p>

<h2>La derivada de una constante</h2>
<p>Partamos por lo más simple. Si \(f(x)=c\) es constante, su gráfica es una recta horizontal y su pendiente es cero en todas partes. Con la definición: \(\dfrac{c-c}{h}=0\) para todo \(h\).</p>
\[ \frac{d}{dx}\,c=0. \]

<h2>La regla de la potencia</h2>
<div class="caja caja--definicion">
  <p class="caja-titulo">Regla de la potencia</p>
  \[ \frac{d}{dx}\,x^n=n\,x^{n-1}. \]
  <p>El exponente baja multiplicando y la potencia disminuye en uno. Vale para cualquier exponente real \(n\).</p>
</div>
<p>Comprueba que la tabla de arriba cumple la regla:</p>
<table class="tabla">
  <thead><tr><th>Función</th><th>Como potencia</th><th>Regla</th><th>Resultado</th></tr></thead>
  <tbody>
    <tr><td>\(x^2\)</td><td>\(x^2\)</td><td>\(2x^{1}\)</td><td>\(2x\)</td></tr>
    <tr><td>\(x^3\)</td><td>\(x^3\)</td><td>\(3x^{2}\)</td><td>\(3x^2\)</td></tr>
    <tr><td>\(\dfrac{1}{x}\)</td><td>\(x^{-1}\)</td><td>\(-1\cdot x^{-2}\)</td><td>\(-\dfrac{1}{x^2}\)</td></tr>
    <tr><td>\(\sqrt{x}\)</td><td>\(x^{1/2}\)</td><td>\(\tfrac{1}{2}\,x^{-1/2}\)</td><td>\(\dfrac{1}{2\sqrt{x}}\)</td></tr>
  </tbody>
</table>

<p>¿Por qué funciona? Para \(n\) natural, al desarrollar \((x+h)^n\) aparece</p>
\[ (x+h)^n=x^n+n\,x^{n-1}h+\bigl(\text{términos con }h^2,\ h^3,\ \dots\bigr). \]
<p>Al restar \(x^n\) y dividir por \(h\), queda \(n\,x^{n-1}\) más términos que todavía tienen al menos una \(h\). Cuando \(h\to 0\), esos términos desaparecen y sobrevive solo \(n\,x^{n-1}\). Para exponentes negativos o fraccionarios la regla también vale; lo comprobaste en dos casos en el capítulo 1.</p>

<p>Observa la regla en acción: la pendiente de \(x^3\), punto a punto, dibuja la parábola \(3x^2\).</p>
<div data-grafico="potencia"></div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplos</p>
  \[ \begin{aligned}
  \frac{d}{dx}\,x^{7} &= 7x^{6} \\[10pt]
  \frac{d}{dx}\,\frac{1}{x^{3}} &= \frac{d}{dx}\,x^{-3}=-3x^{-4}=-\frac{3}{x^{4}} \\[10pt]
  \frac{d}{dx}\,\sqrt[3]{x} &= \frac{d}{dx}\,x^{1/3}=\frac{1}{3}\,x^{-2/3}=\frac{1}{3\sqrt[3]{x^{2}}} \\[10pt]
  \frac{d}{dx}\,x &= 1\cdot x^{0}=1
  \end{aligned} \]
</div>
<p><strong>Consejo:</strong> antes de derivar, reescribe raíces y fracciones como potencias. Después de derivar, si quieres, vuelve a la forma con raíces.</p>

<h2>Múltiplos constantes</h2>
<p>Una constante que multiplica a la función se queda donde está:</p>
\[ \frac{d}{dx}\bigl[c\,f(x)\bigr]=c\,f'(x). \]
<p>La razón es que la constante sale del cociente incremental y del límite. Geométricamente, multiplicar la gráfica por \(c\) estira todas las pendientes por \(c\).</p>
\[ \frac{d}{dx}\,7x^{3}=7\cdot 3x^{2}=21x^{2}. \]

<h2>Suma y resta</h2>
<p>La derivada de una suma es la suma de las derivadas, y lo mismo con la resta:</p>
\[ \frac{d}{dx}\bigl[f(x)\pm g(x)\bigr]=f'(x)\pm g'(x). \]
<p>Con estas tres reglas ya se puede derivar cualquier polinomio, término por término:</p>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo · Un polinomio</p>
  \[ \frac{d}{dx}\bigl(4x^{3}-5x^{2}+2x-9\bigr)=12x^{2}-10x+2. \]
  <p>El \(-9\) es constante, así que su derivada es cero.</p>
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo · Reescribir primero</p>
  <p>Derivar \(f(x)=3\sqrt{x}-\dfrac{2}{x}+\dfrac{x^{4}}{2}\). Primero como potencias:</p>
  \[ f(x)=3x^{1/2}-2x^{-1}+\tfrac{1}{2}\,x^{4}. \]
  <p>Ahora término por término:</p>
  \[ f'(x)=\tfrac{3}{2}\,x^{-1/2}+2x^{-2}+2x^{3}=\frac{3}{2\sqrt{x}}+\frac{2}{x^{2}}+2x^{3}. \]
</div>

<h2>Una advertencia</h2>
<p>No existe una regla tan cómoda para productos. La derivada de un producto <em>no</em> es el producto de las derivadas:</p>
\[ \frac{d}{dx}\,(x\cdot x)=\frac{d}{dx}\,x^{2}=2x, \qquad\text{pero}\qquad \frac{d}{dx}x\cdot\frac{d}{dx}x=1\cdot 1=1. \]
<p>La regla correcta para productos y cocientes es el tema de la próxima lección.</p>

<h2>Aplicación: velocidad</h2>
<p>Si un objeto se mueve según \(s(t)=t^{3}-6t^{2}\) metros, su velocidad es</p>
\[ v(t)=s'(t)=3t^{2}-12t. \]
<p>En \(t=1\) la velocidad es \(v(1)=3-12=-9\) m/s: el objeto retrocede a 9 m/s. Lo que en el capítulo 1 tomaba un límite completo, ahora toma una línea.</p>

<h2>En resumen</h2>
<ul>
  <li>\((c)'=0\).</li>
  <li>\((x^{n})'=n\,x^{n-1}\) para cualquier exponente real.</li>
  <li>\((c\,f)'=c\,f'\) y \((f\pm g)'=f'\pm g'\).</li>
  <li>Reescribe raíces y fracciones como potencias antes de derivar.</li>
</ul>
`,
    graficos: {
      potencia: {
        tipo: 'tangente',
        descripcion: 'Arriba, la cúbica y = x³ con su tangente; abajo, la pendiente para cada x',
        f: function (x) { return x * x * x; },
        df: function (x) { return 3 * x * x; },
        aInicial: -1.5, aMin: -2, aMax: 2, paso: 0.05,
        rastro: true,
        vista: { xmin: -2.4, xmax: 2.4, ymin: -6, ymax: 6, pasoX: 1, pasoY: 1, rotuloCadaY: 2 },
        vistaDerivada: { ymin: -1.5, ymax: 13, pasoY: 1, rotuloCadaY: 4 },
        nota: 'Arriba: f(x) = x³. Abajo: su pendiente en cada punto visitado, que va trazando 3x².'
      }
    },
    comprobacion: [
      {
        id: 'd2-l1-c1', tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=x^{7}\).`,
        prefijo: R`\(f'(x)=\)`,
        respuesta: '7x^6',
        pistas: [R`Regla de la potencia: baja el exponente y réstale uno.`],
        solucion: R`Con \(n=7\): \[ \frac{d}{dx}\,x^{7}=7x^{6}. \]`
      },
      {
        id: 'd2-l1-c2', tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=5x^{3}-4x+1\).`,
        prefijo: R`\(f'(x)=\)`,
        respuesta: '15x^2 - 4',
        pistas: [R`Deriva término por término.`, R`\((5x^3)'=15x^2\), \((4x)'=4\) y la constante \(1\) se va.`],
        solucion: R`\[ f'(x)=5\cdot 3x^{2}-4\cdot 1+0=15x^{2}-4. \]`
      },
      {
        id: 'd2-l1-c3', tipo: 'numero',
        enunciado: R`Si \(f(x)=\dfrac{1}{x^{2}}\), ¿cuánto vale \(f'(1)\)?`,
        prefijo: R`\(f'(1)=\)`,
        respuesta: -2,
        pistas: [R`Escribe \(f(x)=x^{-2}\).`, R`\(f'(x)=-2x^{-3}\).`],
        solucion: R`\[ f(x)=x^{-2}\ \Rightarrow\ f'(x)=-2x^{-3}=-\frac{2}{x^{3}}\ \Rightarrow\ f'(1)=-2. \]`
      }
    ]
  };

  // ===========================================================================
  // Lección 2 · Producto y cociente
  // ===========================================================================
  var productoCociente = {
    id: 'producto-y-cociente',
    titulo: 'Regla del producto y del cociente',
    resumen: 'Cómo derivar funciones que se multiplican o se dividen.',
    minutos: 14,
    html: R`
<p class="entrada">Las reglas de la lección anterior tratan sumas y constantes. Ahora vienen las operaciones que no se comportan de forma tan obvia: multiplicar y dividir funciones.</p>

<h2>Cuatro derivadas que vas a usar seguido</h2>
<p>Para tener ejemplos más interesantes que polinomios, conviene conocer estas derivadas. Todas se obtienen con la definición; por ahora úsalas como herramientas.</p>
<table class="tabla">
  <thead><tr><th>\(f(x)\)</th><th>\(f'(x)\)</th><th>Comentario</th></tr></thead>
  <tbody>
    <tr><td>\(e^{x}\)</td><td>\(e^{x}\)</td><td>la única función (salvo múltiplos) que es su propia derivada</td></tr>
    <tr><td>\(\ln x\)</td><td>\(\dfrac{1}{x}\)</td><td>para \(x&gt;0\)</td></tr>
    <tr><td>\(\sin x\)</td><td>\(\cos x\)</td><td>con \(x\) en radianes</td></tr>
    <tr><td>\(\cos x\)</td><td>\(-\sin x\)</td><td>ojo con el signo</td></tr>
  </tbody>
</table>

<h2>La regla del producto</h2>
<div class="caja caja--definicion">
  <p class="caja-titulo">Regla del producto</p>
  \[ \bigl(f\,g\bigr)'=f'\,g+f\,g'. \]
  <p>«Derivada del primero por el segundo, más el primero por la derivada del segundo.»</p>
</div>

<h2>¿De dónde sale?</h2>
<p>Piensa en \(f(x)\cdot g(x)\) como el área de un rectángulo de base \(f\) y altura \(g\). Si \(x\) aumenta un poco, la base crece en \(\Delta f\) y la altura en \(\Delta g\):</p>
<figure class="diagrama">
  <svg viewBox="0 0 340 230" role="img" aria-label="Rectángulo de lados f y g, con franjas que muestran cómo crece el área">
    <rect x="50" y="62" width="180" height="120" fill="#eff4ff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="230" y="62" width="50" height="120" fill="#ecfdf3" stroke="#15803d" stroke-width="1.5"/>
    <rect x="50" y="22" width="180" height="40" fill="#fdf6e7" stroke="#b7791f" stroke-width="1.5"/>
    <rect x="230" y="22" width="50" height="40" fill="#fdf2f2" stroke="#b91c1c" stroke-width="1.5"/>
    <g font-family="KaTeX_Math, Times New Roman, serif" font-style="italic" font-size="17" text-anchor="middle" fill="#111">
      <text x="140" y="128">f · g</text>
      <text x="255" y="128" fill="#15803d">g Δf</text>
      <text x="140" y="47" fill="#b7791f">f Δg</text>
      <text x="255" y="47" fill="#b91c1c" font-size="13">ΔfΔg</text>
      <text x="140" y="204">f</text>
      <text x="255" y="204">Δf</text>
      <text x="32" y="128">g</text>
      <text x="30" y="47">Δg</text>
    </g>
  </svg>
</figure>
<p>El área aumenta en tres trozos:</p>
\[ \Delta(fg)=g\,\Delta f+f\,\Delta g+\Delta f\,\Delta g. \]
<p>Al dividir por \(\Delta x\) y hacer \(\Delta x\to 0\), los dos primeros trozos dan \(g\,f'\) y \(f\,g'\). El tercero, la esquinita, se vuelve despreciable: es \(\tfrac{\Delta f}{\Delta x}\cdot\Delta g\), y \(\Delta g\to 0\). Eso es la regla.</p>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 1 · Comprobando la regla</p>
  <p>Derivar \(h(x)=(x^{2}+1)(x^{3}-x)\). Con \(f=x^{2}+1\) y \(g=x^{3}-x\):</p>
  \[ \begin{aligned}
  h'(x) &= 2x\,(x^{3}-x)+(x^{2}+1)(3x^{2}-1) \\[10pt]
  &= 2x^{4}-2x^{2}+3x^{4}+2x^{2}-1=5x^{4}-1.
  \end{aligned} \]
  <p>Para verificar, desarrolla primero: \(h(x)=x^{5}-x\), cuya derivada es \(5x^{4}-1\). Coincide.</p>
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 2 · Cuando no se puede desarrollar</p>
  \[ \frac{d}{dx}\bigl(x^{2}\sin x\bigr)=2x\sin x+x^{2}\cos x \]
  \[ \frac{d}{dx}\bigl(x\,e^{x}\bigr)=1\cdot e^{x}+x\,e^{x}=(1+x)\,e^{x} \]
</div>

<h2>La regla del cociente</h2>
<div class="caja caja--definicion">
  <p class="caja-titulo">Regla del cociente</p>
  \[ \left(\frac{f}{g}\right)'=\frac{f'\,g-f\,g'}{g^{2}}\qquad (g\neq 0). \]
  <p>«Derivada de arriba por abajo, menos arriba por derivada de abajo, todo sobre abajo al cuadrado.»</p>
</div>
<p>El orden importa: por el signo menos, invertir los términos del numerador cambia el resultado.</p>
<p>Sale de la regla del producto. Si \(q=\dfrac{f}{g}\), entonces \(f=q\,g\). Derivando: \(f'=q'\,g+q\,g'\). Despejando \(q'\):</p>
\[ q'=\frac{f'-q\,g'}{g}=\frac{f'-\frac{f}{g}\,g'}{g}=\frac{f'\,g-f\,g'}{g^{2}}. \]

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 3</p>
  \[ \frac{d}{dx}\,\frac{x^{2}}{x+1}=\frac{2x\,(x+1)-x^{2}\cdot 1}{(x+1)^{2}}=\frac{x^{2}+2x}{(x+1)^{2}}. \]
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 4 · La derivada de la tangente</p>
  \[ \frac{d}{dx}\tan x=\frac{d}{dx}\,\frac{\sin x}{\cos x}=\frac{\cos x\cos x-\sin x\,(-\sin x)}{\cos^{2}x}=\frac{\cos^{2}x+\sin^{2}x}{\cos^{2}x}=\frac{1}{\cos^{2}x}. \]
</div>

<h2>No siempre hace falta</h2>
<p>Si el denominador es una constante o una potencia simple, es más rápido reescribir:</p>
\[ \frac{x^{3}}{5}=\tfrac{1}{5}\,x^{3}\ \Rightarrow\ \tfrac{3}{5}\,x^{2}, \qquad \frac{3}{x^{2}}=3x^{-2}\ \Rightarrow\ -6x^{-3}. \]
<p>La regla del cociente da lo mismo, pero con más trabajo y más oportunidades de equivocarse.</p>

<h2>En resumen</h2>
<ul>
  <li>\((fg)'=f'g+fg'\). La derivada de un producto no es el producto de las derivadas.</li>
  <li>\(\left(\dfrac{f}{g}\right)'=\dfrac{f'g-fg'}{g^{2}}\). Cuida el orden en el numerador.</li>
  <li>\((e^{x})'=e^{x}\), \((\ln x)'=\dfrac{1}{x}\), \((\sin x)'=\cos x\), \((\cos x)'=-\sin x\).</li>
  <li>Si puedes simplificar o reescribir antes, hazlo.</li>
</ul>
`,
    comprobacion: [
      {
        id: 'd2-l2-c1', tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=x^{2}\,(x+3)\).`,
        prefijo: R`\(f'(x)=\)`,
        respuesta: '3x^2 + 6x',
        pistas: [R`Producto: \(f'=(x^{2})'(x+3)+x^{2}(x+3)'\).`, R`O bien desarrolla primero: \(x^{3}+3x^{2}\).`],
        solucion: R`\[ f'(x)=2x\,(x+3)+x^{2}\cdot 1=3x^{2}+6x. \] Desarrollando antes, \(f(x)=x^{3}+3x^{2}\) y se llega a lo mismo.`
      },
      {
        id: 'd2-l2-c2', tipo: 'opciones',
        enunciado: R`¿Cuál es la regla del cociente?`,
        opciones: [
          R`\(\left(\dfrac{f}{g}\right)'=\dfrac{f'g-fg'}{g^{2}}\)`,
          R`\(\left(\dfrac{f}{g}\right)'=\dfrac{fg'-f'g}{g^{2}}\)`,
          R`\(\left(\dfrac{f}{g}\right)'=\dfrac{f'}{g'}\)`,
          R`\(\left(\dfrac{f}{g}\right)'=\dfrac{f'g+fg'}{g^{2}}\)`
        ],
        correcta: 0,
        pistas: [R`El numerador empieza con la derivada de <em>arriba</em>.`],
        solucion: R`\[ \left(\frac{f}{g}\right)'=\frac{f'g-fg'}{g^{2}}. \] La segunda alternativa tiene el numerador al revés, y por el signo menos da el resultado con el signo cambiado.`
      },
      {
        id: 'd2-l2-c3', tipo: 'numero',
        enunciado: R`Si \(f(x)=\dfrac{x}{x+1}\), ¿cuánto vale \(f'(1)\)?`,
        prefijo: R`\(f'(1)=\)`,
        respuesta: 0.25, respuestaTex: R`\tfrac{1}{4}`,
        pistas: [R`\(f'(x)=\dfrac{1\cdot(x+1)-x\cdot 1}{(x+1)^{2}}\).`, R`El numerador se simplifica a \(1\).`],
        solucion: R`\[ f'(x)=\frac{(x+1)-x}{(x+1)^{2}}=\frac{1}{(x+1)^{2}}\ \Rightarrow\ f'(1)=\frac{1}{4}. \]`
      }
    ]
  };

  // ===========================================================================
  // Lección 3 · Regla de la cadena
  // ===========================================================================
  var cadena = {
    id: 'regla-de-la-cadena',
    titulo: 'Regla de la cadena',
    resumen: 'La regla indispensable para derivar funciones compuestas.',
    minutos: 15,
    html: R`
<p class="entrada">¿Cómo se deriva \((3x+1)^{5}\)? Se podría desarrollar la potencia, pero sería largo. ¿Y \(\sin(x^{2})\) o \(e^{-x^{2}}\)? Ahí no hay nada que desarrollar. Hace falta una regla para funciones metidas dentro de otras.</p>

<h2>Funciones compuestas</h2>
<p>Una función compuesta es una función aplicada al resultado de otra: \(f(g(x))\). A \(g\) se le llama función <strong>interior</strong> y a \(f\), función <strong>exterior</strong>.</p>
<table class="tabla">
  <thead><tr><th>Función</th><th>Interior \(u=g(x)\)</th><th>Exterior \(f(u)\)</th></tr></thead>
  <tbody>
    <tr><td>\((3x+1)^{5}\)</td><td>\(3x+1\)</td><td>\(u^{5}\)</td></tr>
    <tr><td>\(\sin(x^{2})\)</td><td>\(x^{2}\)</td><td>\(\sin u\)</td></tr>
    <tr><td>\(e^{-x^{2}}\)</td><td>\(-x^{2}\)</td><td>\(e^{u}\)</td></tr>
    <tr><td>\(\sqrt{1+x^{2}}\)</td><td>\(1+x^{2}\)</td><td>\(\sqrt{u}\)</td></tr>
  </tbody>
</table>

<h2>Las tasas se multiplican</h2>
<p>Imagina tres engranajes. Si \(u\) gira 3 veces más rápido que \(x\), y \(y\) gira 2 veces más rápido que \(u\), entonces \(y\) gira \(2\cdot 3=6\) veces más rápido que \(x\). Las tasas de cambio de una cadena se multiplican:</p>
<div class="cadena" aria-label="x cambia u, que cambia y">
  <div class="cadena-nodo">\(x\)</div>
  <div class="cadena-paso"><span>\(\times\,\dfrac{du}{dx}\)</span><span class="cadena-flecha" aria-hidden="true"></span></div>
  <div class="cadena-nodo">\(u=g(x)\)</div>
  <div class="cadena-paso"><span>\(\times\,\dfrac{dy}{du}\)</span><span class="cadena-flecha" aria-hidden="true"></span></div>
  <div class="cadena-nodo">\(y=f(u)\)</div>
</div>

<div class="caja caja--definicion">
  <p class="caja-titulo">Regla de la cadena</p>
  \[ \frac{d}{dx}\,f\bigl(g(x)\bigr)=f'\bigl(g(x)\bigr)\cdot g'(x). \]
  <p>En notación de Leibniz, con \(u=g(x)\):</p>
  \[ \frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}. \]
</div>
<p>Aquí la notación de Leibniz brilla: parece que los \(du\) se cancelan. No es una fracción de verdad, pero ese parecido ayuda a recordar la regla.</p>

<h2>Receta</h2>
<ol>
  <li><strong>Identifica</strong> la función interior \(u=g(x)\).</li>
  <li><strong>Deriva la exterior</strong> dejando el interior tal cual, sin tocarlo.</li>
  <li><strong>Multiplica</strong> por la derivada del interior.</li>
</ol>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 1 · \((3x+1)^{5}\)</p>
  \[ \frac{d}{dx}(3x+1)^{5}=\underbrace{5\,(3x+1)^{4}}_{\text{exterior}}\cdot\underbrace{3}_{\text{interior}}=15\,(3x+1)^{4}. \]
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 2 · \(\sin(x^{2})\)</p>
  \[ \frac{d}{dx}\sin(x^{2})=\cos(x^{2})\cdot 2x. \]
  <p>El coseno conserva su argumento \(x^{2}\): la derivada del interior va <em>afuera</em>, multiplicando.</p>
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 3 · \(\sqrt{1+x^{2}}\)</p>
  \[ \frac{d}{dx}\,(1+x^{2})^{1/2}=\tfrac{1}{2}\,(1+x^{2})^{-1/2}\cdot 2x=\frac{x}{\sqrt{1+x^{2}}}. \]
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 4 · \(e^{-x^{2}}\)</p>
  \[ \frac{d}{dx}\,e^{-x^{2}}=e^{-x^{2}}\cdot(-2x)=-2x\,e^{-x^{2}}. \]
</div>

<h2>Varias capas</h2>
<p>Si hay más de una función metida, se aplica la regla una vez por capa, de afuera hacia adentro. Por ejemplo, \(\sin^{3}(2x)=\bigl(\sin(2x)\bigr)^{3}\) tiene tres capas: el cubo, el seno y el \(2x\).</p>
\[ \frac{d}{dx}\bigl(\sin(2x)\bigr)^{3}=3\sin^{2}(2x)\cdot\cos(2x)\cdot 2=6\sin^{2}(2x)\cos(2x). \]

<h2>Combinada con otras reglas</h2>
<p>La regla de la cadena aparece dentro de cualquier otra:</p>
\[ \frac{d}{dx}\bigl(x^{2}e^{3x}\bigr)=2x\,e^{3x}+x^{2}\cdot 3e^{3x}=x\,e^{3x}\,(2+3x). \]

<h2>Errores frecuentes</h2>
<ul>
  <li><strong>Olvidar la derivada del interior.</strong> \((3x+1)^{5}\) no se deriva como \(5(3x+1)^{4}\): falta multiplicar por 3.</li>
  <li><strong>Derivar el interior dentro de la función.</strong> La derivada de \(\sin(x^{2})\) no es \(\cos(2x)\): el coseno conserva \(x^{2}\).</li>
  <li><strong>Confundir capas.</strong> \(\sin^{2}x=(\sin x)^{2}\) es distinto de \(\sin(x^{2})\).</li>
</ul>

<h2>¿Por qué funciona?</h2>
<p>Si \(x\) cambia en \(\Delta x\), entonces \(u\) cambia en \(\Delta u\) e \(y\) en \(\Delta y\). Mientras \(\Delta u\neq 0\),</p>
\[ \frac{\Delta y}{\Delta x}=\frac{\Delta y}{\Delta u}\cdot\frac{\Delta u}{\Delta x}. \]
<p>Al hacer \(\Delta x\to 0\), también \(\Delta u\to 0\), y cada cociente tiende a su derivada. Una demostración completa cuida el caso en que \(\Delta u\) se anula, pero la idea es esta.</p>
<p>Guarda esta regla bien a mano: leída al revés, es la técnica de <strong>sustitución</strong> para calcular integrales.</p>

<h2>En resumen</h2>
<ul>
  <li>\(\bigl(f(g(x))\bigr)'=f'(g(x))\cdot g'(x)\): derivada de afuera evaluada en el interior, por la derivada del interior.</li>
  <li>En Leibniz: \(\dfrac{dy}{dx}=\dfrac{dy}{du}\cdot\dfrac{du}{dx}\).</li>
  <li>Con varias capas, una multiplicación por capa.</li>
</ul>
`,
    comprobacion: [
      {
        id: 'd2-l3-c1', tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=(2x+1)^{3}\).`,
        prefijo: R`\(f'(x)=\)`,
        respuesta: '6(2x+1)^2',
        pistas: [R`Interior: \(u=2x+1\), con \(u'=2\).`, R`Exterior: \(u^{3}\), con derivada \(3u^{2}\).`],
        solucion: R`\[ f'(x)=3\,(2x+1)^{2}\cdot 2=6\,(2x+1)^{2}. \]`
      },
      {
        id: 'd2-l3-c2', tipo: 'opciones',
        enunciado: R`¿Cuál es la derivada de \(\sin(5x)\)?`,
        opciones: [R`\(5\cos(5x)\)`, R`\(\cos(5x)\)`, R`\(5\cos x\)`, R`\(-5\cos(5x)\)`],
        correcta: 0,
        pistas: [R`La derivada del seno es el coseno, con el mismo argumento.`, R`Falta multiplicar por la derivada del interior \(5x\).`],
        solucion: R`\[ \frac{d}{dx}\sin(5x)=\cos(5x)\cdot 5=5\cos(5x). \]`
      },
      {
        id: 'd2-l3-c3', tipo: 'numero',
        enunciado: R`Si \(f(x)=\sqrt{x^{2}+9}\), ¿cuánto vale \(f'(4)\)?`,
        prefijo: R`\(f'(4)=\)`,
        respuesta: 0.8, respuestaTex: R`\tfrac{4}{5}`,
        pistas: [R`\(f(x)=(x^{2}+9)^{1/2}\).`, R`\(f'(x)=\dfrac{x}{\sqrt{x^{2}+9}}\).`],
        solucion: R`\[ f'(x)=\tfrac{1}{2}\,(x^{2}+9)^{-1/2}\cdot 2x=\frac{x}{\sqrt{x^{2}+9}}\ \Rightarrow\ f'(4)=\frac{4}{\sqrt{25}}=\frac{4}{5}. \]`
      }
    ]
  };

  // ===========================================================================
  // Guía de ejercicios
  // ===========================================================================
  var POT = 'Potencia, constante y suma';
  var PROD = 'Producto y cociente';
  var CAD = 'Regla de la cadena';

  var guia = {
    titulo: 'Guía de ejercicios',
    resumen: '18 ejercicios: escribe derivadas, elige alternativas y calcula pendientes.',
    ejercicios: [
      // --- Potencia, constante y suma ---
      {
        id: 'd2-g01', tema: POT, tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=x^{9}\).`,
        prefijo: R`\(f'(x)=\)`, respuesta: '9x^8',
        pistas: [R`\((x^{n})'=n\,x^{n-1}\).`],
        solucion: R`\[ f'(x)=9x^{8}. \]`
      },
      {
        id: 'd2-g02', tema: POT, tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=6x^{4}-3x^{2}+7x-2\).`,
        prefijo: R`\(f'(x)=\)`, respuesta: '24x^3 - 6x + 7',
        pistas: [R`Término por término: las constantes que multiplican se conservan.`, R`La derivada de \(-2\) es \(0\).`],
        solucion: R`\[ f'(x)=24x^{3}-6x+7. \]`
      },
      {
        id: 'd2-g03', tema: POT, tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=4\sqrt{x}\).`,
        prefijo: R`\(f'(x)=\)`, respuesta: '2/sqrt(x)', dominio: [0.5, 4],
        pistas: [R`\(4\sqrt{x}=4x^{1/2}\).`, R`\(\left(x^{1/2}\right)'=\tfrac{1}{2}\,x^{-1/2}\).`],
        solucion: R`\[ f'(x)=4\cdot\tfrac{1}{2}\,x^{-1/2}=\frac{2}{\sqrt{x}}. \]`
      },
      {
        id: 'd2-g04', tema: POT, tipo: 'opciones',
        enunciado: R`¿Cuál es la derivada de \(\dfrac{3}{x^{2}}\)?`,
        opciones: [R`\(-\dfrac{6}{x^{3}}\)`, R`\(\dfrac{3}{2x}\)`, R`\(-\dfrac{6}{x}\)`, R`\(\dfrac{6}{x^{3}}\)`],
        correcta: 0,
        pistas: [R`Reescribe como \(3x^{-2}\).`],
        solucion: R`\[ \frac{d}{dx}\,3x^{-2}=3\cdot(-2)\,x^{-3}=-\frac{6}{x^{3}}. \] Un error común es «derivar el denominador» y obtener \(\tfrac{3}{2x}\).`
      },
      {
        id: 'd2-g05', tema: POT, tipo: 'numero',
        enunciado: R`¿Cuál es la pendiente de la recta tangente a \(f(x)=x^{3}-2x\) en \(x=2\)?`,
        respuesta: 10,
        pistas: [R`La pendiente de la tangente es \(f'(2)\).`, R`\(f'(x)=3x^{2}-2\).`],
        solucion: R`\[ f'(x)=3x^{2}-2\ \Rightarrow\ f'(2)=12-2=10. \]`
      },
      {
        id: 'd2-g06', tema: POT, tipo: 'numero',
        enunciado: R`La posición de un objeto es \(s(t)=t^{3}-6t^{2}+9t\) metros, con \(t\) en segundos. ¿Cuál es su velocidad en \(t=2\)?`,
        respuesta: -3, unidad: 'm/s',
        pistas: [R`La velocidad es \(s'(t)\).`, R`\(s'(t)=3t^{2}-12t+9\).`],
        solucion: R`\[ v(t)=s'(t)=3t^{2}-12t+9\ \Rightarrow\ v(2)=12-24+9=-3\ \text{m/s}. \] El signo negativo indica que en ese instante el objeto retrocede.`
      },

      // --- Producto y cociente ---
      {
        id: 'd2-g07', tema: PROD, tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=(x^{2}+1)(2x-3)\).`,
        prefijo: R`\(f'(x)=\)`, respuesta: '6x^2 - 6x + 2',
        pistas: [R`Producto: \(f'=(x^{2}+1)'(2x-3)+(x^{2}+1)(2x-3)'\).`, R`Queda \(2x(2x-3)+2(x^{2}+1)\); simplifica.`],
        solucion: R`\[ f'(x)=2x\,(2x-3)+(x^{2}+1)\cdot 2=4x^{2}-6x+2x^{2}+2=6x^{2}-6x+2. \]`
      },
      {
        id: 'd2-g08', tema: PROD, tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=x^{3}e^{x}\).`,
        prefijo: R`\(f'(x)=\)`, respuesta: '3x^2 e^x + x^3 e^x', dominio: [-2, 2],
        pistas: [R`\((e^{x})'=e^{x}\).`, R`Producto: \(3x^{2}\cdot e^{x}+x^{3}\cdot e^{x}\).`],
        solucion: R`\[ f'(x)=3x^{2}e^{x}+x^{3}e^{x}=x^{2}e^{x}\,(3+x). \]`
      },
      {
        id: 'd2-g09', tema: PROD, tipo: 'opciones',
        enunciado: R`¿Cuál es la derivada de \(x\sin x\)?`,
        opciones: [R`\(\sin x+x\cos x\)`, R`\(\cos x\)`, R`\(x\cos x\)`, R`\(\sin x-x\cos x\)`],
        correcta: 0,
        pistas: [R`Usa la regla del producto con \(f=x\) y \(g=\sin x\).`],
        solucion: R`\[ (x\sin x)'=1\cdot\sin x+x\cos x. \] La alternativa \(\cos x\) es el producto de las derivadas, que no es la regla.`
      },
      {
        id: 'd2-g10', tema: PROD, tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=\dfrac{x}{x^{2}+1}\).`,
        prefijo: R`\(f'(x)=\)`, respuesta: '(1 - x^2)/(x^2+1)^2',
        pistas: [R`Cociente: \(\dfrac{1\cdot(x^{2}+1)-x\cdot 2x}{(x^{2}+1)^{2}}\).`],
        solucion: R`\[ f'(x)=\frac{(x^{2}+1)-x\cdot 2x}{(x^{2}+1)^{2}}=\frac{1-x^{2}}{(x^{2}+1)^{2}}. \]`
      },
      {
        id: 'd2-g11', tema: PROD, tipo: 'numero',
        enunciado: R`Si \(f(x)=\dfrac{2x+1}{x-1}\), ¿cuánto vale \(f'(2)\)?`,
        prefijo: R`\(f'(2)=\)`, respuesta: -3,
        pistas: [R`\(f'(x)=\dfrac{2(x-1)-(2x+1)\cdot 1}{(x-1)^{2}}\).`, R`El numerador se simplifica a \(-3\).`],
        solucion: R`\[ f'(x)=\frac{2x-2-2x-1}{(x-1)^{2}}=\frac{-3}{(x-1)^{2}}\ \Rightarrow\ f'(2)=\frac{-3}{1}=-3. \]`
      },
      {
        id: 'd2-g12', tema: PROD, tipo: 'opciones',
        enunciado: R`Un estudiante deriva \(\dfrac{x^{2}}{x+1}\) así: \(\dfrac{(x^{2})'}{(x+1)'}=\dfrac{2x}{1}=2x\). ¿Qué hizo mal?`,
        opciones: [
          R`Nada: el resultado es correcto.`,
          R`Dividió las derivadas, pero la derivada de un cociente no es el cociente de las derivadas.`,
          R`Se equivocó al derivar \(x^{2}\).`,
          R`Debió restar las derivadas en vez de dividirlas.`
        ],
        correcta: 1,
        pistas: [R`Compara con la regla del cociente.`],
        solucion: R`Hay que usar la regla del cociente: \[ \frac{2x\,(x+1)-x^{2}}{(x+1)^{2}}=\frac{x^{2}+2x}{(x+1)^{2}}, \] que no es \(2x\). Igual que con el producto, las derivadas no «se dividen».`
      },

      // --- Cadena ---
      {
        id: 'd2-g13', tema: CAD, tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=(5x-2)^{4}\).`,
        prefijo: R`\(f'(x)=\)`, respuesta: '20(5x-2)^3',
        pistas: [R`Exterior \(u^{4}\), interior \(u=5x-2\).`, R`\(4u^{3}\cdot 5\).`],
        solucion: R`\[ f'(x)=4\,(5x-2)^{3}\cdot 5=20\,(5x-2)^{3}. \]`
      },
      {
        id: 'd2-g14', tema: CAD, tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=e^{3x}\).`,
        prefijo: R`\(f'(x)=\)`, respuesta: '3e^(3x)',
        pistas: [R`La derivada de \(e^{u}\) es \(e^{u}\cdot u'\).`],
        solucion: R`\[ f'(x)=e^{3x}\cdot 3=3e^{3x}. \]`
      },
      {
        id: 'd2-g15', tema: CAD, tipo: 'opciones',
        enunciado: R`¿Cuál es la derivada de \(\cos(x^{3})\)?`,
        opciones: [R`\(-3x^{2}\sin(x^{3})\)`, R`\(-\sin(3x^{2})\)`, R`\(3x^{2}\sin(x^{3})\)`, R`\(-\sin(x^{3})\)`],
        correcta: 0,
        pistas: [R`\((\cos u)'=-\sin u\cdot u'\).`, R`El seno conserva el argumento \(x^{3}\).`],
        solucion: R`\[ \frac{d}{dx}\cos(x^{3})=-\sin(x^{3})\cdot 3x^{2}=-3x^{2}\sin(x^{3}). \]`
      },
      {
        id: 'd2-g16', tema: CAD, tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=\sqrt{4x+1}\).`,
        prefijo: R`\(f'(x)=\)`, respuesta: '2/sqrt(4x+1)', dominio: [0, 3],
        pistas: [R`\(f(x)=(4x+1)^{1/2}\).`, R`\(\tfrac{1}{2}(4x+1)^{-1/2}\cdot 4\).`],
        solucion: R`\[ f'(x)=\tfrac{1}{2}\,(4x+1)^{-1/2}\cdot 4=\frac{2}{\sqrt{4x+1}}. \]`
      },
      {
        id: 'd2-g17', tema: CAD, tipo: 'numero',
        enunciado: R`Si \(f(x)=(x^{2}-3)^{5}\), ¿cuánto vale \(f'(2)\)?`,
        prefijo: R`\(f'(2)=\)`, respuesta: 20,
        pistas: [R`\(f'(x)=5\,(x^{2}-3)^{4}\cdot 2x\).`, R`En \(x=2\): \(x^{2}-3=1\).`],
        solucion: R`\[ f'(x)=10x\,(x^{2}-3)^{4}\ \Rightarrow\ f'(2)=20\cdot 1^{4}=20. \]`
      },
      {
        id: 'd2-g18', tema: CAD, tipo: 'expresion',
        enunciado: R`Deriva \(f(x)=\ln(x^{2}+1)\).`,
        prefijo: R`\(f'(x)=\)`, respuesta: '2x/(x^2+1)',
        pistas: [R`\((\ln u)'=\dfrac{1}{u}\cdot u'\).`],
        solucion: R`\[ f'(x)=\frac{1}{x^{2}+1}\cdot 2x=\frac{2x}{x^{2}+1}. \]`
      }
    ]
  };

  window.Curso.registrarCapitulo('derivadas', {
    id: 'reglas-basicas',
    numero: 2,
    titulo: 'Las reglas básicas',
    resumen: 'Derivar sin recurrir al límite cada vez, usando fórmulas sistemáticas.',
    lecciones: [algebra, productoCociente, cadena],
    guia: guia
  });
})();
