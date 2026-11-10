/* Integrales · Capítulo 1: ¿Qué es integrar?
 *
 * Fórmulas en LaTeX con \( ... \) en línea y \[ ... \] en bloque.
 */
(function () {
  'use strict';
  var R = String.raw;

  // ===========================================================================
  // Lección 1 · La antiderivada
  // ===========================================================================
  var antiderivada = {
    id: 'antiderivada',
    titulo: 'La antiderivada',
    resumen: 'El proceso inverso de la derivada: encontrar una función a partir de su tasa de cambio.',
    minutos: 12,
    html: R`
<p class="entrada">Derivar responde a la pregunta «sé dónde estoy en cada instante, ¿qué tan rápido voy?». Integrar responde a la pregunta inversa: «sé qué tan rápido voy en cada instante, ¿dónde estoy?».</p>

<h2>Deshacer una derivada</h2>
<p>Un auto parte en reposo y su velocímetro marca \(v(t)=2t\) m/s. ¿Qué posición \(s(t)\) tiene esa velocidad? Buscamos una función cuya derivada sea \(2t\). Ya conocemos una: \(s(t)=t^{2}\), porque \((t^{2})'=2t\).</p>

<div class="caja caja--definicion">
  <p class="caja-titulo">Definición</p>
  <p>Una función \(F\) es una <strong>antiderivada</strong> (o primitiva) de \(f\) si</p>
  \[ F'(x)=f(x). \]
</div>
<p>Así, \(x^{2}\) es una antiderivada de \(2x\); \(\sin x\) es una antiderivada de \(\cos x\); \(e^{x}\) es una antiderivada de sí misma.</p>

<h2>La constante C</h2>
<p>\(x^{2}\) no es la única antiderivada de \(2x\). También lo son \(x^{2}+5\), \(x^{2}-3\) y \(x^{2}+\pi\): al derivar, la constante desaparece. Hay infinitas antiderivadas, y todas tienen la forma</p>
\[ F(x)+C, \]
<p>donde \(C\) es una constante cualquiera. Geométricamente son la misma curva desplazada hacia arriba o hacia abajo. Como son paralelas, en cada \(x\) tienen exactamente la misma pendiente.</p>
<div data-grafico="familia"></div>
<p>Y no hay otras: si dos funciones tienen la misma derivada en un intervalo, su diferencia tiene derivada cero, así que es constante.</p>

<h2>Notación</h2>
<p>La familia completa de antiderivadas se llama <strong>integral indefinida</strong> y se escribe</p>
\[ \int f(x)\,dx=F(x)+C. \]
<p>El símbolo \(\int\) es una S alargada (de «suma»; la lección siguiente explica por qué). La función \(f(x)\) es el <strong>integrando</strong>, y el \(dx\) indica que la variable es \(x\).</p>
\[ \int 2x\,dx=x^{2}+C. \]

<h2>Reglas básicas: la tabla de derivadas al revés</h2>
<p>Cada derivada que conoces, leída al revés, da una integral:</p>
<table class="tabla">
  <thead><tr><th>Derivada conocida</th><th>Integral</th></tr></thead>
  <tbody>
    <tr><td>\(\left(\dfrac{x^{n+1}}{n+1}\right)'=x^{n}\)</td><td>\(\displaystyle\int x^{n}\,dx=\frac{x^{n+1}}{n+1}+C\quad(n\neq -1)\)</td></tr>
    <tr><td>\((\ln|x|)'=\dfrac{1}{x}\)</td><td>\(\displaystyle\int \frac{1}{x}\,dx=\ln|x|+C\)</td></tr>
    <tr><td>\((e^{x})'=e^{x}\)</td><td>\(\displaystyle\int e^{x}\,dx=e^{x}+C\)</td></tr>
    <tr><td>\((\sin x)'=\cos x\)</td><td>\(\displaystyle\int \cos x\,dx=\sin x+C\)</td></tr>
    <tr><td>\((-\cos x)'=\sin x\)</td><td>\(\displaystyle\int \sin x\,dx=-\cos x+C\)</td></tr>
    <tr><td>\((kx)'=k\)</td><td>\(\displaystyle\int k\,dx=kx+C\)</td></tr>
  </tbody>
</table>
<p>La regla de la potencia se invierte así: <strong>sube el exponente en uno y divide por el nuevo exponente</strong>. Falla solo con \(n=-1\), porque habría que dividir por cero; ese caso lo cubre el logaritmo.</p>
<p>Igual que con derivadas, las constantes salen y las sumas se separan:</p>
\[ \int\bigl(a\,f(x)+b\,g(x)\bigr)\,dx=a\int f(x)\,dx+b\int g(x)\,dx. \]

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 1</p>
  \[ \int\bigl(6x^{2}-4x+3\bigr)\,dx=6\cdot\frac{x^{3}}{3}-4\cdot\frac{x^{2}}{2}+3x+C=2x^{3}-2x^{2}+3x+C. \]
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 2 · Reescribir primero</p>
  \[ \int\left(\sqrt{x}+\frac{1}{x^{2}}\right)dx=\int\bigl(x^{1/2}+x^{-2}\bigr)\,dx=\frac{x^{3/2}}{3/2}+\frac{x^{-1}}{-1}+C=\tfrac{2}{3}\,x^{3/2}-\frac{1}{x}+C. \]
</div>

<h2>Siempre se puede comprobar</h2>
<p>Integrar es más difícil que derivar, pero comprobar es fácil: <strong>deriva tu respuesta</strong> y debes obtener el integrando. En el ejemplo 2: \(\left(\tfrac{2}{3}x^{3/2}-x^{-1}\right)'=x^{1/2}+x^{-2}\). Correcto.</p>

<h2>Fijar la constante</h2>
<p>Si además se conoce un valor de la función, la constante queda determinada.</p>
<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 3</p>
  <p>Encontrar \(F\) si \(F'(x)=2x+1\) y \(F(0)=3\).</p>
  \[ F(x)=x^{2}+x+C,\qquad F(0)=C=3\ \Rightarrow\ F(x)=x^{2}+x+3. \]
</div>
<p>Volviendo al auto del inicio: si \(v(t)=2t\) y parte desde \(s(0)=10\) metros, su posición es \(s(t)=t^{2}+10\).</p>

<h2>Lo que todavía no sabemos</h2>
<p>No hay una «regla del producto» directa para integrar: \(\int x\,e^{x}\,dx\) no es \(\int x\,dx\cdot\int e^{x}\,dx\). Para esos casos existen técnicas especiales, que vienen en el capítulo 2.</p>

<h2>En resumen</h2>
<ul>
  <li>\(F\) es antiderivada de \(f\) si \(F'=f\).</li>
  <li>Todas las antiderivadas son \(F(x)+C\): curvas paralelas.</li>
  <li>\(\displaystyle\int x^{n}\,dx=\frac{x^{n+1}}{n+1}+C\) si \(n\neq-1\), y \(\displaystyle\int\frac{dx}{x}=\ln|x|+C\).</li>
  <li>Para comprobar una integral, deriva el resultado.</li>
</ul>
`,
    graficos: {
      familia: {
        tipo: 'familia',
        descripcion: 'Varias curvas F(x) + C, desplazadas verticalmente, con sus tangentes paralelas en un mismo x',
        F: function (x) { return x * x * x / 3 - x; },
        f: function (x) { return x * x - 1; },
        constantes: [-2, -1, 0, 1, 2],
        xInicial: 1.5, xMin: -2.2, xMax: 2.2,
        vista: { xmin: -2.6, xmax: 2.6, ymin: -4.2, ymax: 4.2, pasoX: 1, pasoY: 1, rotuloCadaY: 2 },
        nota: 'Curvas F(x) + C con F(x) = x³/3 − x, todas antiderivadas de f(x) = x² − 1. Mueve C para elegir una; mueve x para ver que las tangentes son paralelas.'
      }
    },
    comprobacion: [
      {
        id: 'i1-l1-c1', tipo: 'opciones',
        enunciado: R`¿Cuál de estas funciones es una antiderivada de \(3x^{2}\)?`,
        opciones: [R`\(x^{3}+7\)`, R`\(6x\)`, R`\(\dfrac{x^{3}}{3}\)`, R`\(3x^{3}\)`],
        correcta: 0,
        pistas: [R`Deriva cada alternativa y busca la que da \(3x^{2}\).`],
        solucion: R`\((x^{3}+7)'=3x^{2}\). La constante 7 no molesta: desaparece al derivar. \(6x\) es la <em>derivada</em> de \(3x^{2}\), no su antiderivada.`
      },
      {
        id: 'i1-l1-c2', tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int\bigl(4x^{3}+2x\bigr)\,dx=\)`,
        respuesta: 'x^4 + x^2',
        pistas: [R`Sube cada exponente en uno y divide por el nuevo exponente.`, R`\(\int 4x^{3}\,dx=x^{4}\) y \(\int 2x\,dx=x^{2}\).`],
        solucion: R`\[ \int\bigl(4x^{3}+2x\bigr)\,dx=4\cdot\frac{x^{4}}{4}+2\cdot\frac{x^{2}}{2}+C=x^{4}+x^{2}+C. \]`
      },
      {
        id: 'i1-l1-c3', tipo: 'numero',
        enunciado: R`Se sabe que \(F'(x)=2x\) y que \(F(1)=5\). ¿Cuánto vale \(F(3)\)?`,
        prefijo: R`\(F(3)=\)`, respuesta: 13,
        pistas: [R`\(F(x)=x^{2}+C\).`, R`Usa \(F(1)=5\) para encontrar \(C\).`],
        solucion: R`\[ F(x)=x^{2}+C,\quad F(1)=1+C=5\ \Rightarrow\ C=4. \] Entonces \(F(3)=9+4=13\).`
      }
    ]
  };

  // ===========================================================================
  // Lección 2 · Sumas de Riemann
  // ===========================================================================
  var riemann = {
    id: 'sumas-de-riemann',
    titulo: 'Sumas de Riemann',
    resumen: 'Aproximar el área bajo una curva con rectángulos cada vez más angostos.',
    minutos: 14,
    html: R`
<p class="entrada">La integral tiene una segunda cara, que a primera vista no tiene nada que ver con derivadas: calcular el área bajo una curva.</p>

<h2>Distancia y área</h2>
<p>Si un auto va a 60 km/h durante 2 horas, recorre \(60\cdot 2=120\) km. En un gráfico de velocidad contra tiempo, ese producto es el área de un rectángulo de altura 60 y base 2. Cuando la velocidad es constante, <strong>la distancia es el área bajo la gráfica de la velocidad</strong>.</p>
<p>¿Y si la velocidad cambia? La idea es cortar el tiempo en tramos tan cortos que, en cada uno, la velocidad sea casi constante. En cada tramo se calcula un rectángulo y después se suman.</p>

<h2>El procedimiento</h2>
<p>Para aproximar el área bajo \(f\) entre \(x=a\) y \(x=b\):</p>
<ol>
  <li>Divide \([a,b]\) en \(n\) intervalos del mismo ancho \(\Delta x=\dfrac{b-a}{n}\).</li>
  <li>En cada intervalo elige un punto \(x_i^{*}\): el extremo izquierdo, el derecho o el punto medio.</li>
  <li>Construye un rectángulo de base \(\Delta x\) y altura \(f(x_i^{*})\).</li>
  <li>Suma las áreas.</li>
</ol>
<p>El resultado se llama <strong>suma de Riemann</strong>:</p>
\[ S_n=\sum_{i=1}^{n} f(x_i^{*})\,\Delta x=f(x_1^{*})\,\Delta x+f(x_2^{*})\,\Delta x+\dots+f(x_n^{*})\,\Delta x. \]
<p>La letra griega \(\Sigma\) (sigma mayúscula) significa «sumar todos los términos de \(i=1\) hasta \(i=n\)».</p>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo · \(f(x)=x^{2}\) en \([0,2]\) con 4 rectángulos</p>
  <p>\(\Delta x=\tfrac{2-0}{4}=0{,}5\). Los extremos izquierdos son \(0;\ 0{,}5;\ 1;\ 1{,}5\):</p>
  \[ S_4=\bigl(0^{2}+0{,}5^{2}+1^{2}+1{,}5^{2}\bigr)\cdot 0{,}5=(0+0{,}25+1+2{,}25)\cdot 0{,}5=1{,}75. \]
  <p>Con los extremos derechos \(0{,}5;\ 1;\ 1{,}5;\ 2\) se obtiene \(3{,}75\). El área real está entre ambos valores.</p>
</div>

<p>Prueba con más rectángulos y con distintos puntos de altura:</p>
<div data-grafico="parabola"></div>

<h2>Cada vez más angostos</h2>
<p>Con más rectángulos, el error se achica. Para \(x^{2}\) en \([0,2]\):</p>
<table class="tabla">
  <thead><tr><th>\(n\)</th><th>Extremos izquierdos</th><th>Extremos derechos</th></tr></thead>
  <tbody>
    <tr><td>4</td><td>1,75</td><td>3,75</td></tr>
    <tr><td>10</td><td>2,28</td><td>3,08</td></tr>
    <tr><td>100</td><td>2,6268</td><td>2,7068</td></tr>
    <tr><td>1000</td><td>2,662668</td><td>2,670668</td></tr>
  </tbody>
</table>
<p>Ambas columnas se acercan al mismo número: \(2{,}6666\ldots=\tfrac{8}{3}\). Ese límite es el área exacta.</p>

<h2>La integral definida</h2>
<div class="caja caja--definicion">
  <p class="caja-titulo">Definición</p>
  <p>La <strong>integral definida</strong> de \(f\) entre \(a\) y \(b\) es el límite de las sumas de Riemann:</p>
  \[ \int_a^b f(x)\,dx=\lim_{n\to\infty}\sum_{i=1}^{n} f(x_i^{*})\,\Delta x, \]
  <p>siempre que ese límite exista y no dependa de los puntos elegidos.</p>
</div>
<p>La notación cuenta la historia: la \(\Sigma\) se convirtió en una S alargada, \(\int\), y el ancho \(\Delta x\) se convirtió en \(dx\). Los números \(a\) y \(b\) son los <strong>límites de integración</strong>.</p>
<p>A diferencia de la integral indefinida (una familia de funciones), la integral definida es <strong>un número</strong>.</p>

<h2>Área con signo</h2>
<p>Donde \(f\) es negativa, los rectángulos tienen altura negativa y restan. Por eso la integral definida mide un <strong>área con signo</strong>: lo que está sobre el eje suma y lo que está bajo el eje resta.</p>
<div data-grafico="seno"></div>
<p>Para \(\sin x\) entre \(0\) y \(2\pi\), la parte positiva y la negativa son iguales y se cancelan: \(\displaystyle\int_0^{2\pi}\sin x\,dx=0\).</p>

<h2>Cuando la geometría alcanza</h2>
<p>Si la región es un triángulo, un rectángulo o un trozo de círculo, la integral sale con geometría. Por ejemplo, bajo \(f(x)=2x\) entre 0 y 3 hay un triángulo de base 3 y altura 6:</p>
\[ \int_0^3 2x\,dx=\frac{3\cdot 6}{2}=9. \]

<h2>Propiedades útiles</h2>
<ul>
  <li>\(\displaystyle\int_a^a f(x)\,dx=0\): sin ancho no hay área.</li>
  <li>\(\displaystyle\int_b^a f(x)\,dx=-\int_a^b f(x)\,dx\): invertir los límites cambia el signo.</li>
  <li>\(\displaystyle\int_a^b f(x)\,dx+\int_b^c f(x)\,dx=\int_a^c f(x)\,dx\): las áreas se pueden pegar.</li>
</ul>

<h2>En resumen</h2>
<ul>
  <li>Una suma de Riemann aproxima el área con \(n\) rectángulos de ancho \(\Delta x=\tfrac{b-a}{n}\).</li>
  <li>La integral definida \(\int_a^b f(x)\,dx\) es el límite de esas sumas cuando \(n\to\infty\).</li>
  <li>Es un número: el área con signo entre la curva y el eje.</li>
</ul>
<p>Calcular límites de sumas es tan lento como calcular derivadas con la definición. La próxima lección muestra un atajo sorprendente.</p>
`,
    graficos: {
      parabola: {
        tipo: 'riemann',
        descripcion: 'Parábola y = x² entre 0 y 2, con rectángulos de Riemann bajo la curva',
        f: function (x) { return x * x; },
        a: 0, b: 2, nInicial: 4, metodo: 'izquierda',
        exacta: 8 / 3, exactaTexto: '8/3 ≈ 2,6667',
        vista: { xmin: -0.3, xmax: 2.35, ymin: -0.5, ymax: 4.6, pasoX: 0.5, pasoY: 1 },
        nota: 'Curva: f(x) = x² en [0, 2]. Mueve el control hacia la derecha para usar más rectángulos.'
      },
      seno: {
        tipo: 'riemann',
        descripcion: 'Función seno entre 0 y 2π, con rectángulos positivos arriba y negativos abajo',
        f: Math.sin,
        a: 0, b: 2 * Math.PI, nInicial: 12, metodo: 'medio',
        exacta: 0,
        vista: { xmin: -0.3, xmax: 6.7, ymin: -1.4, ymax: 1.4, pasoX: 1, pasoY: 0.5, rotuloCadaY: 1 },
        nota: 'Curva: f(x) = sen x en [0, 2π]. Los rectángulos rojos tienen altura negativa y restan.'
      }
    },
    comprobacion: [
      {
        id: 'i1-l2-c1', tipo: 'numero',
        enunciado: R`Aproxima el área bajo \(f(x)=x\) en \([0,4]\) con 4 rectángulos, usando los extremos derechos.`,
        respuesta: 10,
        pistas: [R`\(\Delta x=1\) y los extremos derechos son \(1, 2, 3, 4\).`, R`Suma \(f(1)+f(2)+f(3)+f(4)\) y multiplica por \(\Delta x\).`],
        solucion: R`\[ S_4=(1+2+3+4)\cdot 1=10. \] El área exacta es un triángulo de área \(8\): los extremos derechos sobrestiman porque la función crece.`
      },
      {
        id: 'i1-l2-c2', tipo: 'opciones',
        enunciado: R`Si \(f\) es creciente en \([a,b]\), la suma de Riemann con extremos <strong>izquierdos</strong>…`,
        opciones: [R`subestima el área`, R`sobrestima el área`, R`es exactamente el área`, R`puede hacer cualquier cosa`],
        correcta: 0,
        pistas: [R`En una función creciente, ¿dónde es más baja: a la izquierda o a la derecha de cada intervalo?`],
        solucion: R`Si \(f\) crece, en cada intervalo el valor más bajo está en el extremo izquierdo. Los rectángulos quedan bajo la curva y la suma subestima el área.`
      },
      {
        id: 'i1-l2-c3', tipo: 'numero',
        enunciado: R`Usa geometría para calcular \(\displaystyle\int_0^2 (x+1)\,dx\).`,
        respuesta: 4,
        pistas: [R`La región es un trapecio con alturas \(f(0)=1\) y \(f(2)=3\).`, R`Área de un trapecio: \(\dfrac{(B+b)}{2}\cdot h\).`],
        solucion: R`La región bajo la recta es un trapecio de alturas 1 y 3 y ancho 2: \[ \frac{1+3}{2}\cdot 2=4. \]`
      }
    ]
  };

  // ===========================================================================
  // Lección 3 · Teorema Fundamental del Cálculo
  // ===========================================================================
  var tfc = {
    id: 'teorema-fundamental',
    titulo: 'El Teorema Fundamental del Cálculo',
    resumen: 'El puente maestro: derivar e integrar son operaciones inversas.',
    minutos: 15,
    html: R`
<p class="entrada">Hasta ahora la integral tiene dos caras que parecen independientes: deshacer derivadas (antiderivadas) y calcular áreas (sumas de Riemann). Este teorema muestra que son lo mismo, y convierte un límite de sumas en una resta.</p>

<h2>La función de acumulación</h2>
<p>Fija un punto de partida \(a\) y deja que el extremo derecho se mueva. El área acumulada desde \(a\) hasta \(x\) es una función de \(x\):</p>
\[ A(x)=\int_a^x f(t)\,dt. \]
<p>Se usa la letra \(t\) dentro de la integral para no confundirla con el extremo \(x\); es una variable muda, como el índice de una suma.</p>
<p>Mueve el extremo y observa cómo cambia el área acumulada (abajo):</p>
<div data-grafico="acumulacion"></div>
<p>Fíjate en la relación. Donde \(f\) es positiva, \(A\) crece; donde \(f\) es negativa, \(A\) decrece; donde \(f\) cruza el cero, \(A\) tiene una cima o un valle. La función \(f\) está haciendo el papel de la <em>derivada</em> de \(A\).</p>

<h2>Primera parte: la derivada del área es la función</h2>
<div class="caja caja--definicion">
  <p class="caja-titulo">Teorema Fundamental · Parte 1</p>
  <p>Si \(f\) es continua, la función \(A(x)=\displaystyle\int_a^x f(t)\,dt\) es derivable y</p>
  \[ A'(x)=f(x). \]
</div>
<p>La razón cabe en una línea. Si \(x\) avanza un poquito \(h\), el área crece en una franja angosta de ancho \(h\) y altura casi \(f(x)\):</p>
\[ A(x+h)-A(x)\approx f(x)\cdot h\quad\Longrightarrow\quad\frac{A(x+h)-A(x)}{h}\approx f(x). \]
<p>Cuando \(h\to 0\), la aproximación se vuelve exacta. En palabras: <strong>la rapidez con que crece el área es la altura de la curva</strong>. Y como consecuencia, toda función continua tiene una antiderivada: su función de acumulación.</p>

<h2>Segunda parte: áreas con antiderivadas</h2>
<div class="caja caja--definicion">
  <p class="caja-titulo">Teorema Fundamental · Parte 2</p>
  <p>Si \(f\) es continua en \([a,b]\) y \(F\) es <em>cualquier</em> antiderivada de \(f\), entonces</p>
  \[ \int_a^b f(x)\,dx=F(b)-F(a). \]
</div>
<p>La demostración usa la parte 1. Tanto \(A\) como \(F\) son antiderivadas de \(f\), así que difieren en una constante: \(A(x)=F(x)+C\). Como \(A(a)=0\) (no hay área entre \(a\) y \(a\)), se tiene \(C=-F(a)\). Evaluando en \(b\):</p>
\[ \int_a^b f(x)\,dx=A(b)=F(b)-F(a). \]
<p>Se suele escribir con corchetes: \(\bigl[F(x)\bigr]_a^b=F(b)-F(a)\).</p>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 1 · El área de la lección anterior</p>
  \[ \int_0^2 x^{2}\,dx=\left[\frac{x^{3}}{3}\right]_0^2=\frac{8}{3}-0=\frac{8}{3}. \]
  <p>Es exactamente el número al que se acercaban las sumas de Riemann con 1000 rectángulos. Sin límites, sin sumas: una resta.</p>
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 2</p>
  \[ \int_0^{\pi}\sin x\,dx=\bigl[-\cos x\bigr]_0^{\pi}=-\cos\pi-(-\cos 0)=1+1=2. \]
  <p>Un arco de la curva seno encierra un área de exactamente 2.</p>
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 3</p>
  \[ \int_1^{e}\frac{1}{x}\,dx=\bigl[\ln x\bigr]_1^{e}=\ln e-\ln 1=1-0=1. \]
</div>

<p>¿Y la constante \(C\)? Se cancela: \(\bigl(F(b)+C\bigr)-\bigl(F(a)+C\bigr)=F(b)-F(a)\). Por eso en las integrales definidas no se escribe.</p>

<h2>Integrar una tasa da el cambio total</h2>
<p>Si en la parte 2 tomamos \(f=F'\), el teorema dice</p>
\[ \int_a^b F'(x)\,dx=F(b)-F(a). \]
<p>Integrar la tasa de cambio de una cantidad entrega cuánto cambió esa cantidad en total. Integrar una velocidad da el desplazamiento; integrar un caudal da el volumen acumulado.</p>
<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 4 · Un estanque</p>
  <p>Entra agua a razón de \(r(t)=3t^{2}\) litros por minuto. Entre \(t=0\) y \(t=2\) entran</p>
  \[ \int_0^2 3t^{2}\,dt=\bigl[t^{3}\bigr]_0^2=8\ \text{litros}. \]
</div>

<h2>El puente</h2>
<p>Las dos partes juntas dicen que derivar e integrar se deshacen mutuamente:</p>
\[ \frac{d}{dx}\int_a^x f(t)\,dt=f(x)\qquad\text{y}\qquad\int_a^b F'(x)\,dx=F(b)-F(a). \]
<p>Antes de este teorema, el área bajo una parábola era un problema difícil. Después, es un ejercicio de una línea.</p>

<h2>En resumen</h2>
<ul>
  <li>\(A(x)=\displaystyle\int_a^x f(t)\,dt\) acumula área, y \(A'(x)=f(x)\).</li>
  <li>\(\displaystyle\int_a^b f(x)\,dx=F(b)-F(a)\) para cualquier antiderivada \(F\).</li>
  <li>Integrar una tasa de cambio entrega el cambio total.</li>
</ul>
`,
    graficos: {
      acumulacion: {
        tipo: 'acumulacion',
        f: function (t) { return 0.5 * (t - 1) * (t - 4); },
        a: 0, xInicial: 0.8, xMin: 0, xMax: 5.2, paso: 0.05,
        vista: { xmin: -0.4, xmax: 5.5, ymin: -1.8, ymax: 2.4, pasoX: 1, pasoY: 1 },
        vistaAcumulada: { ymin: -1.8, ymax: 1.4, pasoY: 0.5, rotuloCadaY: 1 },
        nota: 'Arriba: f(t) = ½(t − 1)(t − 4), con el área desde a = 0 hasta x (azul suma, rojo resta). Abajo: el área acumulada A(x) y su tangente, cuya pendiente es f(x).'
      }
    },
    comprobacion: [
      {
        id: 'i1-l3-c1', tipo: 'numero',
        enunciado: R`Calcula \(\displaystyle\int_1^3 2x\,dx\).`,
        respuesta: 8,
        pistas: [R`Una antiderivada de \(2x\) es \(x^{2}\).`, R`Calcula \(F(3)-F(1)\).`],
        solucion: R`\[ \int_1^3 2x\,dx=\bigl[x^{2}\bigr]_1^3=9-1=8. \]`
      },
      {
        id: 'i1-l3-c2', tipo: 'opciones',
        enunciado: R`¿Cuánto vale \(\dfrac{d}{dx}\displaystyle\int_0^x\cos(t^{2})\,dt\)?`,
        opciones: [R`\(\cos(x^{2})\)`, R`\(\sin(x^{2})\)`, R`\(2x\cos(x^{2})\)`, R`\(-2x\sin(x^{2})\)`],
        correcta: 0,
        pistas: [R`Es la derivada de una función de acumulación: usa la parte 1 del teorema.`],
        solucion: R`Por la parte 1, la derivada de \(\int_0^x f(t)\,dt\) es \(f(x)\). Con \(f(t)=\cos(t^{2})\), el resultado es \(\cos(x^{2})\). No hace falta (ni se puede, con funciones elementales) calcular la integral.`
      },
      {
        id: 'i1-l3-c3', tipo: 'numero',
        enunciado: R`Calcula \(\displaystyle\int_0^1\bigl(3x^{2}+1\bigr)\,dx\).`,
        respuesta: 2,
        pistas: [R`Una antiderivada es \(x^{3}+x\).`],
        solucion: R`\[ \int_0^1\bigl(3x^{2}+1\bigr)\,dx=\bigl[x^{3}+x\bigr]_0^1=2-0=2. \]`
      }
    ]
  };

  // ===========================================================================
  // Guía de ejercicios
  // ===========================================================================
  var ANT = 'Antiderivada';
  var RIE = 'Sumas de Riemann';
  var TFC = 'Teorema Fundamental';

  var guia = {
    titulo: 'Guía de ejercicios',
    resumen: '15 ejercicios: antiderivadas, sumas de Riemann e integrales definidas.',
    ejercicios: [
      // --- Antiderivada ---
      {
        id: 'i1-g01', tema: ANT, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int 5x^{4}\,dx=\)`, respuesta: 'x^5',
        pistas: [R`Sube el exponente en uno y divide por el nuevo exponente.`],
        solucion: R`\[ \int 5x^{4}\,dx=5\cdot\frac{x^{5}}{5}+C=x^{5}+C. \]`
      },
      {
        id: 'i1-g02', tema: ANT, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int\bigl(3x^{2}-4x+1\bigr)\,dx=\)`, respuesta: 'x^3 - 2x^2 + x',
        pistas: [R`Integra término por término.`, R`\(\int 1\,dx=x\).`],
        solucion: R`\[ \int\bigl(3x^{2}-4x+1\bigr)\,dx=x^{3}-2x^{2}+x+C. \]`
      },
      {
        id: 'i1-g03', tema: ANT, tipo: 'expresion', constante: true,
        enunciado: R`Calcula la integral.`,
        prefijo: R`\(\displaystyle\int\frac{1}{x^{2}}\,dx=\)`, respuesta: '-1/x', dominio: [0.5, 3],
        pistas: [R`Escribe \(\dfrac{1}{x^{2}}=x^{-2}\).`, R`\(\dfrac{x^{-1}}{-1}\).`],
        solucion: R`\[ \int x^{-2}\,dx=\frac{x^{-1}}{-1}+C=-\frac{1}{x}+C. \] Comprobación: \(\left(-x^{-1}\right)'=x^{-2}\).`
      },
      {
        id: 'i1-g04', tema: ANT, tipo: 'opciones',
        enunciado: R`¿Cuál es \(\displaystyle\int\cos x\,dx\)?`,
        opciones: [R`\(\sin x+C\)`, R`\(-\sin x+C\)`, R`\(-\cos x+C\)`, R`\(\cos x+C\)`],
        correcta: 0,
        pistas: [R`¿Qué función tiene derivada \(\cos x\)?`],
        solucion: R`Como \((\sin x)'=\cos x\), se tiene \(\int\cos x\,dx=\sin x+C\). El signo menos aparece con el seno: \(\int\sin x\,dx=-\cos x+C\).`
      },
      {
        id: 'i1-g05', tema: ANT, tipo: 'numero',
        enunciado: R`Se sabe que \(F'(x)=6x^{2}\) y que \(F(0)=2\). ¿Cuánto vale \(F(1)\)?`,
        prefijo: R`\(F(1)=\)`, respuesta: 4,
        pistas: [R`\(F(x)=2x^{3}+C\).`, R`\(F(0)=C=2\).`],
        solucion: R`\[ F(x)=2x^{3}+C,\quad F(0)=C=2\ \Rightarrow\ F(1)=2+2=4. \]`
      },

      // --- Riemann ---
      {
        id: 'i1-g06', tema: RIE, tipo: 'numero',
        enunciado: R`Aproxima \(\displaystyle\int_0^3 x^{2}\,dx\) con 3 rectángulos y extremos <strong>izquierdos</strong>.`,
        respuesta: 5,
        pistas: [R`\(\Delta x=1\); los extremos izquierdos son \(0, 1, 2\).`],
        solucion: R`\[ S_3=\bigl(0^{2}+1^{2}+2^{2}\bigr)\cdot 1=5. \] El valor exacto es \(9\): los extremos izquierdos subestiman porque \(x^{2}\) crece en \([0,3]\).`
      },
      {
        id: 'i1-g07', tema: RIE, tipo: 'numero',
        enunciado: R`Aproxima la misma integral, \(\displaystyle\int_0^3 x^{2}\,dx\), con 3 rectángulos y extremos <strong>derechos</strong>.`,
        respuesta: 14,
        pistas: [R`Los extremos derechos son \(1, 2, 3\).`],
        solucion: R`\[ S_3=\bigl(1^{2}+2^{2}+3^{2}\bigr)\cdot 1=14. \] Ahora sobrestima. El valor exacto, \(9\), queda entre 5 y 14.`
      },
      {
        id: 'i1-g08', tema: RIE, tipo: 'numero',
        enunciado: R`Aproxima \(\displaystyle\int_0^4 (2x+1)\,dx\) con 2 rectángulos y <strong>puntos medios</strong>.`,
        respuesta: 20,
        pistas: [R`\(\Delta x=2\); los intervalos son \([0,2]\) y \([2,4]\).`, R`Los puntos medios son \(1\) y \(3\).`],
        solucion: R`\[ S_2=\bigl(f(1)+f(3)\bigr)\cdot 2=(3+7)\cdot 2=20. \] Coincide con el valor exacto: para una recta, el punto medio no comete error, porque lo que sobra a un lado del rectángulo falta al otro.`
      },
      {
        id: 'i1-g09', tema: RIE, tipo: 'opciones',
        enunciado: R`Si \(f(x)&lt;0\) en todo \([a,b]\), con \(a&lt;b\), entonces \(\displaystyle\int_a^b f(x)\,dx\) es…`,
        opciones: [R`negativa`, R`positiva`, R`cero`, R`imposible de saber`],
        correcta: 0,
        pistas: [R`En cada suma de Riemann, todos los rectángulos tienen altura negativa.`],
        solucion: R`Todas las alturas \(f(x_i^{*})\) son negativas y todos los anchos \(\Delta x\) positivos, así que cada suma es negativa, y su límite también lo es. La integral mide área <em>con signo</em>.`
      },
      {
        id: 'i1-g10', tema: RIE, tipo: 'numero',
        enunciado: R`Usa geometría para calcular \(\displaystyle\int_0^2\sqrt{4-x^{2}}\,dx\). Puedes escribir <code>pi</code>.`,
        respuesta: Math.PI, respuestaTex: R`\pi`,
        figura: {
          tipo: 'figura',
          descripcion: 'Cuarto de circunferencia de radio 2 en el primer cuadrante',
          f: function (x) { return x >= 0 && x <= 2 ? Math.sqrt(Math.max(0, 4 - x * x)) : NaN; },
          vista: { xmin: -0.5, xmax: 2.6, ymin: -0.4, ymax: 2.4, pasoX: 1, pasoY: 1 }
        },
        pistas: [R`\(y=\sqrt{4-x^{2}}\) es la mitad superior de la circunferencia \(x^{2}+y^{2}=4\).`, R`Entre 0 y 2 es un cuarto de círculo de radio 2.`],
        solucion: R`La región es un cuarto de círculo de radio 2: \[ \frac{1}{4}\,\pi\cdot 2^{2}=\pi. \]`
      },

      // --- TFC ---
      {
        id: 'i1-g11', tema: TFC, tipo: 'numero',
        enunciado: R`Calcula \(\displaystyle\int_0^2 x^{3}\,dx\).`,
        respuesta: 4,
        pistas: [R`Una antiderivada de \(x^{3}\) es \(\dfrac{x^{4}}{4}\).`],
        solucion: R`\[ \int_0^2 x^{3}\,dx=\left[\frac{x^{4}}{4}\right]_0^2=\frac{16}{4}-0=4. \]`
      },
      {
        id: 'i1-g12', tema: TFC, tipo: 'numero',
        enunciado: R`Calcula \(\displaystyle\int_1^4\sqrt{x}\,dx\). Puedes responder con una fracción.`,
        respuesta: 14 / 3, respuestaTex: R`\tfrac{14}{3}`,
        pistas: [R`\(\sqrt{x}=x^{1/2}\), con antiderivada \(\tfrac{2}{3}x^{3/2}\).`, R`\(4^{3/2}=8\) y \(1^{3/2}=1\).`],
        solucion: R`\[ \int_1^4 x^{1/2}\,dx=\left[\tfrac{2}{3}\,x^{3/2}\right]_1^4=\tfrac{2}{3}(8-1)=\frac{14}{3}. \]`
      },
      {
        id: 'i1-g13', tema: TFC, tipo: 'numero',
        enunciado: R`Calcula \(\displaystyle\int_0^{\pi/2}\cos x\,dx\).`,
        respuesta: 1,
        pistas: [R`Una antiderivada de \(\cos x\) es \(\sin x\).`],
        solucion: R`\[ \int_0^{\pi/2}\cos x\,dx=\bigl[\sin x\bigr]_0^{\pi/2}=1-0=1. \]`
      },
      {
        id: 'i1-g14', tema: TFC, tipo: 'opciones',
        enunciado: R`¿Cuánto vale \(\dfrac{d}{dx}\displaystyle\int_2^x\bigl(t^{3}+1\bigr)\,dt\)?`,
        opciones: [R`\(x^{3}+1\)`, R`\(\dfrac{x^{4}}{4}+x\)`, R`\(3x^{2}\)`, R`\(x^{3}+1-9\)`],
        correcta: 0,
        pistas: [R`Parte 1 del teorema: la derivada de la acumulación es el integrando evaluado en \(x\).`],
        solucion: R`Por la parte 1, \[ \frac{d}{dx}\int_2^x\bigl(t^{3}+1\bigr)\,dt=x^{3}+1. \] El límite inferior \(2\) no influye: solo desplaza \(A\) en una constante.`
      },
      {
        id: 'i1-g15', tema: TFC, tipo: 'numero',
        enunciado: R`Un estanque recibe agua a razón de \(r(t)=4t+2\) litros por minuto. ¿Cuántos litros entran entre \(t=0\) y \(t=5\)?`,
        respuesta: 60, unidad: 'L',
        pistas: [R`El total es \(\displaystyle\int_0^5 r(t)\,dt\).`, R`Una antiderivada es \(2t^{2}+2t\).`],
        solucion: R`\[ \int_0^5(4t+2)\,dt=\bigl[2t^{2}+2t\bigr]_0^5=50+10=60\ \text{L}. \]`
      }
    ]
  };

  window.Curso.registrarCapitulo('integrales', {
    id: 'que-es-integrar',
    numero: 1,
    titulo: '¿Qué es integrar?',
    resumen: 'La intuición de qué significa integrar y cómo se conecta con lo que ya sabes de derivadas.',
    lecciones: [antiderivada, riemann, tfc],
    guia: guia
  });
})();
