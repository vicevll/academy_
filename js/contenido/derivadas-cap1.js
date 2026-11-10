/* Derivadas · Capítulo 1: ¿Qué son?
 *
 * Las fórmulas van en LaTeX con \( ... \) en línea y \[ ... \] en bloque.
 * String.raw evita tener que duplicar las barras invertidas.
 */
(function () {
  'use strict';
  var R = String.raw;

  // ===========================================================================
  // Lección 1 · Tasa de cambio
  // ===========================================================================
  var tasaDeCambio = {
    id: 'tasa-de-cambio',
    titulo: 'Tasa de cambio',
    resumen: 'La derivada como la velocidad con la que cambia algo en un instante exacto.',
    minutos: 10,
    html: R`
<p class="entrada">Antes de calcular nada, una pregunta: ¿qué significa que algo cambie <em>en un instante</em>?</p>

<h2>El problema del velocímetro</h2>
<p>Viajas por la Ruta 5 y recorres 180 km en 2 horas. Tu velocidad media es fácil de calcular:</p>
\[ \text{velocidad media}=\frac{\text{distancia recorrida}}{\text{tiempo transcurrido}}=\frac{180\ \text{km}}{2\ \text{h}}=90\ \text{km/h}. \]
<p>Pero no fuiste a 90 km/h todo el camino: aceleraste, frenaste en un peaje, adelantaste un camión. En cada momento el velocímetro marcaba un número distinto. ¿Qué mide exactamente ese número?</p>
<p>La pregunta es más rara de lo que parece. En un instante no transcurre tiempo y no se recorre distancia, así que la cuenta sería \(0/0\), que no tiene sentido. Y sin embargo el velocímetro marca algo. Resolver esa aparente contradicción es el punto de partida del cálculo diferencial.</p>

<h2>Tasa de cambio media</h2>
<p>Partamos por lo que sí sabemos calcular. Si una cantidad \(f\) depende de \(x\), su <strong>tasa de cambio media</strong> entre \(x=a\) y \(x=b\) es cuánto cambió \(f\) dividido por cuánto cambió \(x\):</p>
\[ \frac{\Delta f}{\Delta x}=\frac{f(b)-f(a)}{b-a}. \]
<p>La letra griega \(\Delta\) (delta) se lee «cambio en». La velocidad media es el caso particular en que \(f\) es una posición y \(x\) es el tiempo.</p>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo</p>
  <p>Una pelota rueda por una rampa y su posición, en metros, a los \(t\) segundos es \(s(t)=t^2\). Entre \(t=2\) y \(t=3\) su velocidad media es</p>
  \[ \frac{\Delta s}{\Delta t}=\frac{s(3)-s(2)}{3-2}=\frac{9-4}{1}=5\ \text{m/s}. \]
</div>

<h2>Achicar el intervalo</h2>
<p>Esos 5 m/s son un promedio sobre un segundo completo. Para acercarnos a lo que pasa <em>justo</em> en \(t=2\), medimos sobre intervalos cada vez más cortos: de \(t=2\) a \(t=2+h\), con \(h\) cada vez más chico.</p>

<table class="tabla">
  <thead><tr><th>\(h\)</th><th>Intervalo</th><th>Velocidad media</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>de 2 a 3</td><td>5 m/s</td></tr>
    <tr><td>0,5</td><td>de 2 a 2,5</td><td>4,5 m/s</td></tr>
    <tr><td>0,1</td><td>de 2 a 2,1</td><td>4,1 m/s</td></tr>
    <tr><td>0,01</td><td>de 2 a 2,01</td><td>4,01 m/s</td></tr>
    <tr><td>0,001</td><td>de 2 a 2,001</td><td>4,001 m/s</td></tr>
  </tbody>
</table>

<p>Pruébalo: mueve el control hacia la izquierda para achicar \(h\).</p>
<div data-grafico="velocidad"></div>

<p>Las velocidades medias no saltan al azar: se acercan cada vez más a 4 m/s. El álgebra muestra por qué. Para cualquier \(h\neq 0\),</p>
\[ \frac{s(2+h)-s(2)}{h}=\frac{(2+h)^2-4}{h}=\frac{4h+h^2}{h}=4+h. \]
<p>Mientras más chico es \(h\), más cerca está \(4+h\) de 4. Nunca reemplazamos \(h=0\), porque eso sería dividir por cero, pero sí podemos decir con total precisión a qué valor se acerca el cociente: a 4. Ese valor es la <strong>velocidad instantánea</strong> en \(t=2\), lo que marcaría el velocímetro de la pelota.</p>

<div class="caja caja--clave">
  <p class="caja-titulo">Idea clave</p>
  <p>La <strong>derivada</strong> de \(f\) en \(a\), que se escribe \(f'(a)\), es la tasa de cambio instantánea de \(f\) en ese punto: el valor al que se acercan las tasas de cambio medias cuando el intervalo se encoge alrededor de \(a\).</p>
</div>
<p>En el ejemplo de la pelota, \(s'(2)=4\) m/s.</p>

<h2>No es solo velocidad</h2>
<p>Cualquier cantidad que dependa de otra tiene una tasa de cambio. Las unidades de la derivada son siempre las de \(f\) divididas por las de \(x\).</p>

<table class="tabla">
  <thead><tr><th>Función</th><th>Su derivada mide</th><th>Unidades</th></tr></thead>
  <tbody>
    <tr><td>Posición \(s(t)\)</td><td>la velocidad</td><td>m/s</td></tr>
    <tr><td>Velocidad \(v(t)\)</td><td>la aceleración</td><td>m/s²</td></tr>
    <tr><td>Temperatura \(T(t)\) de un horno</td><td>qué tan rápido se calienta o se enfría</td><td>°C/min</td></tr>
    <tr><td>Agua \(V(t)\) en un estanque</td><td>el caudal que entra o sale</td><td>L/min</td></tr>
    <tr><td>Costo \(C(q)\) de producir \(q\) unidades</td><td>cuánto cuesta producir una unidad más</td><td>$/unidad</td></tr>
  </tbody>
</table>

<h2>Cómo leer una derivada</h2>
<p>Un dato como \(T'(3)=-2\) °C/min trae tres piezas de información:</p>
<ul>
  <li><strong>El signo</strong> indica el sentido. Positivo: la cantidad está aumentando. Negativo: está disminuyendo. Aquí la temperatura baja.</li>
  <li><strong>El tamaño</strong> indica la rapidez: 2 °C por cada minuto.</li>
  <li><strong>El punto</strong> indica cuándo: justo a los 3 minutos. Un momento después el ritmo puede ser otro.</li>
</ul>
<p>Por eso una derivada sirve para estimar cambios pequeños. Si \(T'(3)=-2\) °C/min, en los siguientes 6 segundos (0,1 min) la temperatura bajará aproximadamente \(2\cdot 0{,}1=0{,}2\) °C. Para intervalos largos la estimación deja de ser confiable, porque la tasa misma va cambiando.</p>

<h2>En resumen</h2>
<ul>
  <li>La tasa de cambio media es \(\Delta f/\Delta x\): cambio en \(f\) dividido por cambio en \(x\).</li>
  <li>La tasa de cambio instantánea es el valor al que tienden las tasas medias al achicar el intervalo. Eso es la derivada.</li>
  <li>Sus unidades son las de \(f\) por cada unidad de \(x\), y su signo dice si \(f\) crece o decrece.</li>
</ul>
`,
    graficos: {
      velocidad: {
        tipo: 'secante',
        descripcion: 'Posición s(t) = t² con dos instantes marcados y la recta que los une',
        f: function (t) { return t * t; },
        df: function (t) { return 2 * t; },
        a: 2, hInicial: 1, hMax: 2, hMin: 0.001,
        vista: { xmin: -0.6, xmax: 4.6, ymin: -2, ymax: 18, pasoX: 1, pasoY: 2, rotuloCadaY: 4 },
        nombres: { x: 't', f: 's', cociente: 'Velocidad media', unidad: 'm/s', unidadX: 's', unidadF: 'm' },
        nota: 'La pendiente de la recta azul es la velocidad media. Esa recta vuelve en la próxima lección.'
      }
    },
    comprobacion: [
      {
        id: 'd1-l1-c1', tipo: 'numero',
        enunciado: R`Un bus recorre 150 km en 2 horas. ¿Cuál fue su velocidad media?`,
        respuesta: 75, unidad: 'km/h',
        pistas: [R`Velocidad media = distancia recorrida ÷ tiempo transcurrido.`],
        solucion: R`\[ \frac{150\ \text{km}}{2\ \text{h}}=75\ \text{km/h}. \]`
      },
      {
        id: 'd1-l1-c2', tipo: 'numero',
        enunciado: R`Para cierto movimiento, la velocidad media entre \(t=1\) y \(t=1+h\) resulta ser \(6+3h\) m/s, para cualquier \(h\neq 0\). ¿Cuál es la velocidad instantánea en \(t=1\)?`,
        respuesta: 6, unidad: 'm/s',
        pistas: [R`La velocidad instantánea es el valor al que se acerca la velocidad media cuando \(h\) se achica.`, R`Si \(h\) es casi cero, ¿cuánto vale aproximadamente \(3h\)?`],
        solucion: R`Cuando \(h\) se acerca a 0, el término \(3h\) también se acerca a 0, así que \(6+3h\) se acerca a \(6\). La velocidad instantánea es \(6\) m/s.`
      },
      {
        id: 'd1-l1-c3', tipo: 'opciones',
        enunciado: R`La altura de un dron, en metros, a los \(t\) segundos es \(A(t)\). Si \(A'(2)=-3\), ¿qué significa?`,
        opciones: [
          R`A los 2 segundos el dron está 3 metros más abajo que al partir.`,
          R`A los 2 segundos el dron está bajando a razón de 3 m/s.`,
          R`Durante los primeros 2 segundos el dron bajó 3 metros.`,
          R`El dron baja 3 metros cada 2 segundos.`
        ],
        correcta: 1,
        pistas: [R`Las unidades de \(A'(t)\) son metros por segundo: es una rapidez, no una altura.`, R`El 2 indica el instante; el signo, el sentido del cambio.`],
        solucion: R`\(A'(2)\) es la tasa de cambio instantánea de la altura en \(t=2\), en m/s. El signo negativo indica que la altura disminuye: en ese instante el dron baja a 3 m/s. No dice nada sobre cuánto bajó en total.`
      }
    ]
  };

  // ===========================================================================
  // Lección 2 · Interpretación geométrica
  // ===========================================================================
  var interpretacionGeometrica = {
    id: 'interpretacion-geometrica',
    titulo: 'Interpretación geométrica',
    resumen: 'La pendiente de la recta tangente a una curva en un punto dado.',
    minutos: 10,
    html: R`
<p class="entrada">En la lección anterior la derivada era un número al que se acercaban ciertas velocidades. Ahora vamos a <em>verla</em>: en un gráfico, la derivada es una pendiente.</p>

<h2>Pendiente: lo que ya sabes</h2>
<p>La pendiente de una recta mide cuánto sube por cada unidad que avanza:</p>
\[ m=\frac{\Delta y}{\Delta x}=\frac{y_2-y_1}{x_2-x_1}. \]
<p>Una recta tiene la misma pendiente en todas partes. Una curva no: la parábola \(y=x^2\) es casi plana cerca de \(x=0\) y muy empinada en \(x=3\). Para hablar de «la pendiente de una curva en un punto» hace falta una idea nueva.</p>

<h2>La recta secante</h2>
<p>Toma dos puntos sobre la gráfica de \(f\): \(P=(a,\,f(a))\) y \(Q=(a+h,\,f(a+h))\). La recta que pasa por ambos se llama <strong>recta secante</strong>, y su pendiente es</p>
\[ m_{\text{sec}}=\frac{f(a+h)-f(a)}{h}. \]
<p>Es exactamente la tasa de cambio media de la lección anterior. La velocidad media entre dos instantes y la pendiente de la secante entre dos puntos son la misma cuenta, vista de dos maneras.</p>

<h2>De la secante a la tangente</h2>
<p>Deja \(P\) fijo y acerca \(Q\) hacia él achicando \(h\). Observa qué pasa con la recta azul.</p>
<div data-grafico="secante"></div>
<p>A medida que \(Q\) se acerca a \(P\), la secante gira y se estabiliza en una posición límite: la recta punteada. Esa es la <strong>recta tangente</strong> a la curva en \(P\), y su pendiente es el valor al que tienden las pendientes de las secantes.</p>

<div class="caja caja--clave">
  <p class="caja-titulo">Idea clave</p>
  <p>La derivada \(f'(a)\) es la pendiente de la recta tangente a la gráfica de \(f\) en el punto \((a,\,f(a))\).</p>
</div>

<h2>¿Qué es exactamente una tangente?</h2>
<p>Es la recta que pasa por el punto llevando la misma dirección que la curva ahí. Una buena forma de imaginarla: si haces zoom sobre una curva suave alrededor de un punto, se ve cada vez más recta. La recta con la que termina confundiéndose es la tangente.</p>
<p>Ojo con la definición escolar de «recta que toca a la curva en un solo punto». Funciona para circunferencias, pero no en general: una tangente puede volver a cortar la curva en otro lugar sin dejar de ser tangente. Lo que importa es lo que ocurre cerca del punto.</p>

<h2>Leer la derivada en un gráfico</h2>
<p>Desliza el punto sobre la curva y fíjate en la inclinación de la tangente.</p>
<div data-grafico="tangente"></div>
<ul>
  <li>Donde la gráfica <strong>sube</strong> de izquierda a derecha, la tangente tiene pendiente positiva: \(f'(x)&gt;0\).</li>
  <li>Donde <strong>baja</strong>, la pendiente es negativa: \(f'(x)&lt;0\).</li>
  <li>En las <strong>cimas y los valles</strong> la tangente queda horizontal: \(f'(x)=0\).</li>
  <li>Mientras más <strong>empinada</strong> es la curva, mayor es \(|f'(x)|\).</li>
</ul>

<h2>La ecuación de la recta tangente</h2>
<p>Una recta queda determinada por un punto y una pendiente. La tangente pasa por \((a,\,f(a))\) con pendiente \(f'(a)\), así que su ecuación es</p>
\[ y=f(a)+f'(a)\,(x-a). \]

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo</p>
  <p>Para \(f(x)=x^2\) en \(a=1\), el punto es \((1,\,1)\) y, como muestra el primer gráfico, la pendiente de la tangente es \(f'(1)=2\). Entonces</p>
  \[ y=1+2\,(x-1)=2x-1. \]
  <p>Cerca de \(x=1\) esa recta se parece mucho a la parábola: en \(x=1{,}1\) la recta da \(1{,}2\) y la parábola \(1{,}21\).</p>
</div>

<h2>En resumen</h2>
<ul>
  <li>La pendiente de la secante entre \(P\) y \(Q\) es la tasa de cambio media.</li>
  <li>Al acercar \(Q\) a \(P\), la secante tiende a la tangente, y su pendiente tiende a \(f'(a)\).</li>
  <li>El signo de \(f'\) dice si la gráfica sube o baja; \(f'=0\) marca tangentes horizontales.</li>
  <li>La tangente en \(a\) es \(y=f(a)+f'(a)(x-a)\).</li>
</ul>
`,
    graficos: {
      secante: {
        tipo: 'secante',
        descripcion: 'Parábola y = x² con una recta secante por P y Q, y la tangente en P punteada',
        f: function (x) { return x * x; },
        df: function (x) { return 2 * x; },
        a: 1, hInicial: 1.5, hMax: 1.5, hMin: 0.001,
        aDeslizable: { min: -1.5, max: 1.5, paso: 0.1 },
        tangente: true,
        vista: { xmin: -2.6, xmax: 3.6, ymin: -1.5, ymax: 10, pasoX: 1, pasoY: 1, rotuloCadaY: 2 },
        nombres: { x: 'x', f: 'f', cociente: 'Pendiente de la secante' },
        nota: 'Curva: f(x) = x². Con el segundo control puedes mover P a otro punto y repetir el experimento.'
      },
      tangente: {
        tipo: 'tangente',
        descripcion: 'Curva f(x) = x³ − 3x con su recta tangente en un punto móvil',
        f: function (x) { return x * x * x - 3 * x; },
        df: function (x) { return 3 * x * x - 3; },
        aInicial: -1.6, aMin: -2.2, aMax: 2.2, paso: 0.05,
        vista: { xmin: -2.7, xmax: 2.7, ymin: -4.6, ymax: 4.6, pasoX: 1, pasoY: 1, rotuloCadaY: 2 },
        nota: 'Curva: f(x) = x³ − 3x. El color indica el signo de la pendiente.'
      }
    },
    comprobacion: [
      {
        id: 'd1-l2-c1', tipo: 'numero',
        enunciado: R`¿Cuál es la pendiente de la recta secante a \(f(x)=x^2\) que pasa por los puntos con \(x=1\) y \(x=2\)?`,
        respuesta: 3,
        pistas: [R`Los puntos son \((1,\,f(1))\) y \((2,\,f(2))\).`, R`Pendiente \(=\dfrac{f(2)-f(1)}{2-1}\).`],
        solucion: R`\[ m_{\text{sec}}=\frac{f(2)-f(1)}{2-1}=\frac{4-1}{1}=3. \]`
      },
      {
        id: 'd1-l2-c2', tipo: 'opciones',
        enunciado: R`En un punto donde la gráfica de \(f\) baja de izquierda a derecha, la derivada \(f'(x)\) es…`,
        opciones: [R`positiva`, R`cero`, R`negativa`, R`imposible de saber sin la fórmula`],
        correcta: 2,
        pistas: [R`Piensa en la recta tangente en ese punto: ¿sube o baja?`],
        solucion: R`Si la gráfica baja, la tangente también baja, y una recta que baja tiene pendiente negativa. Por lo tanto \(f'(x)&lt;0\). No hace falta conocer la fórmula: basta el gráfico.`
      },
      {
        id: 'd1-l2-c3', tipo: 'numero',
        enunciado: R`La recta tangente a la gráfica de \(f\) en \(x=2\) es \(y=5x-3\). ¿Cuánto vale \(f'(2)\)?`,
        respuesta: 5, prefijo: R`\(f'(2)=\)`,
        pistas: [R`\(f'(2)\) es la pendiente de la recta tangente en \(x=2\).`, R`En una recta \(y=mx+n\), la pendiente es \(m\).`],
        solucion: R`La derivada en un punto es la pendiente de la tangente en ese punto. La recta \(y=5x-3\) tiene pendiente \(5\), así que \(f'(2)=5\).`
      }
    ]
  };

  // ===========================================================================
  // Lección 3 · Definición formal
  // ===========================================================================
  var definicionFormal = {
    id: 'definicion-formal',
    titulo: 'Definición formal',
    resumen: 'El cálculo de la derivada a través del límite del cociente incremental.',
    minutos: 15,
    html: R`
<p class="entrada">Ya tienes la idea desde dos ángulos: la tasa de cambio instantánea y la pendiente de la tangente. Los dos caminos llevaron a la misma cuenta. Ahora le ponemos nombre y la escribimos con precisión.</p>

<h2>El cociente incremental</h2>
<p>La expresión que apareció en las dos lecciones anteriores se llama <strong>cociente incremental</strong>:</p>
\[ \frac{f(a+h)-f(a)}{h}. \]
<p>El numerador es el incremento de \(f\) y el denominador es el incremento de \(x\). Según el contexto, es una velocidad media o la pendiente de una secante.</p>

<h2>La definición</h2>
<div class="caja caja--definicion">
  <p class="caja-titulo">Definición</p>
  <p>La <strong>derivada de \(f\) en \(a\)</strong> es</p>
  \[ f'(a)=\lim_{h\to 0}\frac{f(a+h)-f(a)}{h}, \]
  <p>siempre que ese límite exista. En ese caso se dice que \(f\) es <strong>derivable</strong> en \(a\).</p>
</div>
<p>Se lee: «el límite, cuando \(h\) tiende a cero, del cociente incremental».</p>

<h2>¿Por qué hace falta un límite?</h2>
<p>Porque no se puede simplemente poner \(h=0\). Quedaría</p>
\[ \frac{f(a)-f(a)}{0}=\frac{0}{0}, \]
<p>una expresión sin valor. El límite esquiva el problema cambiando la pregunta: no «¿cuánto vale el cociente en \(h=0\)?», sino «¿a qué valor se acerca cuando \(h\) se acerca a 0, sin llegar a serlo?». En la práctica eso significa simplificar el cociente hasta que la \(h\) del denominador se cancele, y recién entonces hacer tender \(h\) a cero.</p>

<h2>Receta en cuatro pasos</h2>
<ol>
  <li><strong>Evalúa</strong> \(f(a+h)\).</li>
  <li><strong>Resta</strong> \(f(a)\).</li>
  <li><strong>Divide</strong> por \(h\) y simplifica hasta cancelar la \(h\) del denominador.</li>
  <li><strong>Toma el límite</strong> cuando \(h\to 0\).</li>
</ol>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 1 · Derivada en un punto</p>
  <p>Calcular \(f'(3)\) para \(f(x)=x^2\).</p>
  \[ \begin{aligned}
  f(3+h) &= (3+h)^2=9+6h+h^2 \\[10pt]
  f(3+h)-f(3) &= 6h+h^2 \\[10pt]
  \frac{f(3+h)-f(3)}{h} &= \frac{h\,(6+h)}{h}=6+h \\[10pt]
  f'(3) &= \lim_{h\to 0}\,(6+h)=6
  \end{aligned} \]
  <p>La tangente a la parábola en \(x=3\) tiene pendiente 6.</p>
</div>

<h2>La derivada como función</h2>
<p>Nada obliga a fijar el punto de antemano. Si repetimos el cálculo dejando \(x\) como una letra, obtenemos una fórmula que entrega la pendiente en <em>cualquier</em> punto. Esa fórmula es una función nueva, la <strong>función derivada</strong>:</p>
\[ f'(x)=\lim_{h\to 0}\frac{f(x+h)-f(x)}{h}. \]

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 2 · \(f(x)=x^2\)</p>
  \[ \frac{(x+h)^2-x^2}{h}=\frac{2xh+h^2}{h}=2x+h\ \xrightarrow{\ h\to 0\ }\ 2x \]
  <p>Entonces \(f'(x)=2x\). Una sola fórmula entrega todas las pendientes: \(f'(3)=6\), \(f'(1)=2\), \(f'(0)=0\), \(f'(-1)=-2\).</p>
</div>

<p>Compruébalo en el gráfico. Mueve el punto sobre la parábola y mira cómo las pendientes, dibujadas abajo, se van ordenando sobre la recta \(y=2x\).</p>
<div data-grafico="rastro"></div>

<h2>Dos ejemplos con más álgebra</h2>
<p>El cuarto paso casi siempre es inmediato. El trabajo está en el tercero: encontrar la manera de cancelar la \(h\).</p>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 3 · \(f(x)=\dfrac{1}{x}\)</p>
  <p>Se restan las fracciones usando un denominador común:</p>
  \[ \frac{1}{x+h}-\frac{1}{x}=\frac{x-(x+h)}{x\,(x+h)}=\frac{-h}{x\,(x+h)}. \]
  <p>Al dividir por \(h\), se cancela:</p>
  \[ \frac{1}{h}\cdot\frac{-h}{x\,(x+h)}=\frac{-1}{x\,(x+h)}\ \xrightarrow{\ h\to 0\ }\ -\frac{1}{x^2}. \]
  <p>Entonces \(f'(x)=-\dfrac{1}{x^2}\) para \(x\neq 0\).</p>
</div>

<div class="caja caja--ejemplo">
  <p class="caja-titulo">Ejemplo 4 · \(f(x)=\sqrt{x}\)</p>
  <p>Aquí el truco es multiplicar arriba y abajo por el conjugado:</p>
  \[ \begin{aligned}
  &\frac{\sqrt{x+h}-\sqrt{x}}{h}\cdot\frac{\sqrt{x+h}+\sqrt{x}}{\sqrt{x+h}+\sqrt{x}} \\[10pt]
  &=\frac{(x+h)-x}{h\,\bigl(\sqrt{x+h}+\sqrt{x}\bigr)}=\frac{1}{\sqrt{x+h}+\sqrt{x}}
  \end{aligned} \]
  <p>Cuando \(h\to 0\), el denominador tiende a \(2\sqrt{x}\). Entonces \(f'(x)=\dfrac{1}{2\sqrt{x}}\) para \(x&gt;0\).</p>
</div>

<h2>Otra forma de escribir lo mismo</h2>
<p>Si llamamos \(x=a+h\), entonces \(h=x-a\), y decir \(h\to 0\) equivale a decir \(x\to a\):</p>
\[ f'(a)=\lim_{x\to a}\frac{f(x)-f(a)}{x-a}. \]
<p>Es la misma definición. A veces una forma resulta más cómoda que la otra.</p>

<h2>Notación</h2>
<p>Hay dos notaciones en uso y conviene reconocer ambas. Para \(y=f(x)\):</p>
<table class="tabla">
  <thead><tr><th>Notación</th><th>Se escribe</th><th>Se lee</th></tr></thead>
  <tbody>
    <tr><td>Lagrange</td><td>\(f'(x)\), \(y'\)</td><td>«f prima de x»</td></tr>
    <tr><td>Leibniz</td><td>\(\dfrac{dy}{dx}\), \(\dfrac{df}{dx}\), \(\dfrac{d}{dx}f(x)\)</td><td>«derivada de y con respecto a x»</td></tr>
  </tbody>
</table>
<p>La de Leibniz recuerda de dónde viene todo: \(\dfrac{dy}{dx}\) es lo que queda de \(\dfrac{\Delta y}{\Delta x}\) al tomar el límite. No es una fracción común, aunque muchas veces se comporta como una. Para indicar el punto se escribe \(f'(3)\) o \(\left.\dfrac{dy}{dx}\right|_{x=3}\).</p>

<h2>¿Existe siempre?</h2>
<p>No. La derivada es un límite, y los límites pueden no existir. El ejemplo clásico es \(f(x)=|x|\) en \(a=0\):</p>
\[ \frac{f(0+h)-f(0)}{h}=\frac{|h|}{h}=\begin{cases}\phantom{-}1 & \text{si } h&gt;0\\ -1 & \text{si } h&lt;0\end{cases} \]
<div data-grafico="valorAbsoluto"></div>
<p>Por la derecha el cociente vale siempre 1 y por la izquierda siempre −1. No se acerca a un único valor, así que el límite no existe: \(|x|\) no es derivable en 0. Geométricamente, la gráfica tiene una punta ahí y no hay una única recta tangente.</p>
<p>En general, una función no es derivable donde su gráfica tiene una punta, un salto o una tangente vertical.</p>

<h2>En resumen</h2>
<ul>
  <li>\(f'(a)=\displaystyle\lim_{h\to 0}\frac{f(a+h)-f(a)}{h}\), si el límite existe.</li>
  <li>Para calcularla: evaluar, restar, dividir y simplificar, tomar el límite.</li>
  <li>Dejando \(x\) libre se obtiene la función derivada \(f'(x)\).</li>
  <li>Calculamos: \((x^2)'=2x\), \(\left(\dfrac{1}{x}\right)'=-\dfrac{1}{x^2}\), \((\sqrt{x})'=\dfrac{1}{2\sqrt{x}}\).</li>
  <li>Donde hay puntas, saltos o tangentes verticales, la derivada no existe.</li>
</ul>
`,
    graficos: {
      rastro: {
        tipo: 'tangente',
        descripcion: 'Arriba, la parábola con su tangente; abajo, el valor de la pendiente para cada x',
        f: function (x) { return x * x; },
        df: function (x) { return 2 * x; },
        aInicial: 1, aMin: -2.8, aMax: 2.8, paso: 0.05,
        rastro: true,
        vista: { xmin: -3.2, xmax: 3.2, ymin: -1, ymax: 9, pasoX: 1, pasoY: 1, rotuloCadaY: 2 },
        vistaDerivada: { ymin: -6.5, ymax: 6.5, pasoY: 1, rotuloCadaY: 2 },
        nota: 'Arriba: f(x) = x² con su tangente. Abajo: la pendiente de esa tangente para cada x que has visitado.'
      },
      valorAbsoluto: {
        tipo: 'figura',
        descripcion: 'Gráfica de f(x) = |x|, con una punta en el origen',
        f: function (x) { return Math.abs(x); },
        vista: { xmin: -3.2, xmax: 3.2, ymin: -0.8, ymax: 3.4, pasoX: 1, pasoY: 1 },
        puntos: [{ x: 0, etiqueta: 'punta', dx: 10, dy: 18 }]
      }
    },
    comprobacion: [
      {
        id: 'd1-l3-c1', tipo: 'opciones',
        enunciado: R`¿Cuál de estas expresiones es la definición de \(f'(a)\)?`,
        opciones: [
          R`\(\dfrac{f(a+h)-f(a)}{h}\)`,
          R`\(\displaystyle\lim_{h\to 0}\bigl[f(a+h)-f(a)\bigr]\)`,
          R`\(\displaystyle\lim_{h\to 0}\frac{f(a+h)}{h}\)`,
          R`\(\displaystyle\lim_{h\to 0}\frac{f(a+h)-f(a)}{h}\)`
        ],
        correcta: 3,
        pistas: [R`La derivada es el <em>límite</em> del cociente incremental.`],
        solucion: R`La derivada es el límite, cuando \(h\to 0\), del cociente incremental completo: \[ f'(a)=\lim_{h\to 0}\frac{f(a+h)-f(a)}{h}. \] Sin el límite es solo la pendiente de una secante; sin dividir por \(h\), o sin restar \(f(a)\), ya no es un cociente de incrementos.`
      },
      {
        id: 'd1-l3-c2', tipo: 'opciones',
        enunciado: R`Para \(f(x)=x^2\) y \(h\neq 0\), ¿a qué se reduce \(\dfrac{f(1+h)-f(1)}{h}\)?`,
        opciones: [R`\(2+h\)`, R`\(2h+h^2\)`, R`\(1+h\)`, R`\(2\)`],
        correcta: 0,
        pistas: [R`Desarrolla \((1+h)^2=1+2h+h^2\).`, R`Después de restar \(f(1)=1\), factoriza \(h\) en el numerador.`],
        solucion: R`\[ \frac{(1+h)^2-1}{h}=\frac{2h+h^2}{h}=2+h. \] Todavía no se toma el límite, así que la \(h\) sigue ahí. Recién al hacer \(h\to 0\) se obtiene \(f'(1)=2\).`
      },
      {
        id: 'd1-l3-c3', tipo: 'numero',
        enunciado: R`Usa la definición para derivar \(f(x)=3x+1\). El resultado es una constante: ¿cuál?`,
        respuesta: 3, prefijo: R`\(f'(x)=\)`,
        pistas: [R`\(f(x+h)=3(x+h)+1=3x+3h+1\).`, R`Resta \(f(x)\) y divide por \(h\).`],
        solucion: R`\[ \frac{f(x+h)-f(x)}{h}=\frac{(3x+3h+1)-(3x+1)}{h}=\frac{3h}{h}=3. \] El cociente vale 3 para cualquier \(h\), así que el límite es 3. Tiene sentido: la gráfica es una recta de pendiente 3, y esa es su pendiente en todos los puntos.`
      }
    ]
  };

  // ===========================================================================
  // Guía de ejercicios
  // ===========================================================================
  var TASA = 'Tasa de cambio';
  var GEOM = 'Interpretación geométrica';
  var DEF = 'Definición formal';

  var guia = {
    titulo: 'Guía de ejercicios',
    resumen: '18 ejercicios con pistas y solución paso a paso.',
    ejercicios: [
      // --- Tasa de cambio ---
      {
        id: 'd1-g01', tema: TASA, tipo: 'numero',
        enunciado: R`La posición de una ciclista, en metros, es \(s(t)=t^2+1\), con \(t\) en segundos. ¿Cuál es su velocidad media entre \(t=1\) y \(t=3\)?`,
        respuesta: 4, unidad: 'm/s',
        pistas: [R`La velocidad media es \(\dfrac{\Delta s}{\Delta t}=\dfrac{s(3)-s(1)}{3-1}\).`, R`\(s(3)=10\) y \(s(1)=2\).`],
        solucion: R`\[ \frac{s(3)-s(1)}{3-1}=\frac{10-2}{2}=4\ \text{m/s}. \]`
      },
      {
        id: 'd1-g02', tema: TASA, tipo: 'numero',
        enunciado: R`Un café recién servido está a 80 °C. Cinco minutos después está a 65 °C. ¿Cuál fue la tasa de cambio media de su temperatura en ese lapso? Cuida el signo.`,
        respuesta: -3, unidad: '°C/min',
        pistas: [R`Tasa media = (temperatura final − temperatura inicial) ÷ tiempo transcurrido.`, R`La temperatura bajó, así que el cambio es negativo.`],
        solucion: R`\[ \frac{\Delta T}{\Delta t}=\frac{65-80}{5-0}=\frac{-15}{5}=-3\ \text{°C/min}. \] El signo negativo indica que la temperatura disminuye.`
      },
      {
        id: 'd1-g03', tema: TASA, tipo: 'opciones',
        enunciado: R`Para \(f(x)=x^2\), ¿cuál es la tasa de cambio media entre \(x=3\) y \(x=3+h\), ya simplificada? Supón \(h\neq 0\).`,
        opciones: [R`\(6\)`, R`\(6+h\)`, R`\(6h+h^2\)`, R`\(9+h\)`],
        correcta: 1,
        pistas: [R`Calcula \(\dfrac{f(3+h)-f(3)}{h}\).`, R`\((3+h)^2=9+6h+h^2\).`],
        solucion: R`\[ \frac{(3+h)^2-9}{h}=\frac{6h+h^2}{h}=6+h. \] La opción \(6\) es la tasa <em>instantánea</em>: lo que se obtiene después de hacer \(h\to 0\).`
      },
      {
        id: 'd1-g04', tema: TASA, tipo: 'numero',
        enunciado: R`Se midió la velocidad media de un carrito en intervalos cada vez más cortos que parten en \(t=5\):
<table class="tabla tabla--compacta">
  <thead><tr><th>Intervalo</th><th>Velocidad media</th></tr></thead>
  <tbody>
    <tr><td>de 5 a 5,1</td><td>3,1 m/s</td></tr>
    <tr><td>de 5 a 5,01</td><td>3,01 m/s</td></tr>
    <tr><td>de 5 a 5,001</td><td>3,001 m/s</td></tr>
  </tbody>
</table>
¿Cuál es, según estos datos, la velocidad instantánea en \(t=5\)?`,
        respuesta: 3, unidad: 'm/s',
        pistas: [R`La velocidad instantánea es el valor al que se acercan las velocidades medias cuando el intervalo se achica.`],
        solucion: R`Los valores \(3{,}1\); \(3{,}01\); \(3{,}001\) se acercan cada vez más a \(3\). La velocidad instantánea en \(t=5\) es \(3\) m/s.`
      },
      {
        id: 'd1-g05', tema: TASA, tipo: 'opciones',
        enunciado: R`\(N(t)\) es el número de bacterias en un cultivo a las \(t\) horas. ¿En qué unidades se mide \(N'(t)\)?`,
        opciones: [R`bacterias`, R`horas`, R`bacterias por hora`, R`horas por bacteria`],
        correcta: 2,
        pistas: [R`Las unidades de una derivada son las de la función divididas por las de la variable.`],
        solucion: R`\(N'(t)\) viene de un cociente \(\Delta N/\Delta t\): bacterias divididas por horas. Se mide en bacterias por hora, y dice qué tan rápido crece el cultivo.`
      },
      {
        id: 'd1-g06', tema: TASA, tipo: 'numero',
        enunciado: R`Un estanque se está llenando. \(V(t)\) es el volumen de agua, en litros, a los \(t\) minutos, y se sabe que \(V'(10)=5\). Aproximadamente, ¿cuántos litros entran entre \(t=10\) y \(t=10{,}2\)?`,
        respuesta: 1, unidad: 'L',
        pistas: [R`\(V'(10)=5\) significa que en ese momento entran unos 5 litros por minuto.`, R`Para un intervalo corto: cambio ≈ tasa × duración.`],
        solucion: R`Para intervalos cortos, \(\Delta V\approx V'(10)\cdot\Delta t\): \[ \Delta V\approx 5\ \tfrac{\text{L}}{\text{min}}\cdot 0{,}2\ \text{min}=1\ \text{L}. \]`
      },

      // --- Interpretación geométrica ---
      {
        id: 'd1-g07', tema: GEOM, tipo: 'numero',
        enunciado: R`¿Cuál es la pendiente de la recta secante a \(f(x)=x^2\) que pasa por los puntos con \(x=1\) y \(x=3\)?`,
        respuesta: 4,
        pistas: [R`Los puntos son \((1,\,1)\) y \((3,\,9)\).`, R`Pendiente \(=\dfrac{\Delta y}{\Delta x}\).`],
        solucion: R`\[ m_{\text{sec}}=\frac{f(3)-f(1)}{3-1}=\frac{9-1}{2}=4. \]`
      },
      {
        id: 'd1-g08', tema: GEOM, tipo: 'opciones',
        enunciado: R`En el gráfico de \(f\) se marcaron tres puntos. ¿En cuál de ellos la derivada es <strong>negativa</strong>?`,
        figura: {
          tipo: 'figura',
          descripcion: 'Parábola que baja hasta un mínimo en B y luego sube; A está a la izquierda del mínimo y C a la derecha',
          f: function (x) { return 0.5 * (x - 2) * (x - 2) + 0.5; },
          vista: { xmin: -0.6, xmax: 4.6, ymin: -0.6, ymax: 4, pasoX: 1, pasoY: 1 },
          puntos: [
            { x: 0.7, etiqueta: 'A', dx: 9, dy: -6 },
            { x: 2, etiqueta: 'B', dx: -4, dy: -12 },
            { x: 3.4, etiqueta: 'C', dx: -16, dy: -6 }
          ]
        },
        opciones: [R`En A`, R`En B`, R`En C`, R`En ninguno`],
        correcta: 0,
        pistas: [R`La derivada es la pendiente de la tangente. ¿Dónde la curva va bajando?`],
        solucion: R`En A la gráfica baja de izquierda a derecha, así que la tangente tiene pendiente negativa: \(f'&lt;0\). En B la tangente es horizontal (\(f'=0\)) y en C la gráfica sube (\(f'&gt;0\)).`
      },
      {
        id: 'd1-g09', tema: GEOM, tipo: 'numero',
        enunciado: R`La gráfica de \(g\) tiene una cima suave (un máximo redondeado, sin punta) en \(x=4\). ¿Cuánto vale \(g'(4)\)?`,
        respuesta: 0, prefijo: R`\(g'(4)=\)`,
        pistas: [R`Dibuja mentalmente la recta tangente justo en la cima.`],
        solucion: R`En una cima suave la recta tangente es horizontal, y una recta horizontal tiene pendiente \(0\). Por lo tanto \(g'(4)=0\).`
      },
      {
        id: 'd1-g10', tema: GEOM, tipo: 'opciones',
        enunciado: R`Se sabe que \(f(2)=5\) y \(f'(2)=3\). ¿Cuál es la ecuación de la recta tangente a la gráfica de \(f\) en \(x=2\)?`,
        opciones: [R`\(y=3x+5\)`, R`\(y=3x-1\)`, R`\(y=5x+3\)`, R`\(y=5x-7\)`],
        correcta: 1,
        pistas: [R`La tangente pasa por \((2,\,5)\) y tiene pendiente \(3\).`, R`Usa \(y=f(a)+f'(a)\,(x-a)\).`],
        solucion: R`\[ y=f(2)+f'(2)\,(x-2)=5+3\,(x-2)=3x-1. \] Comprobación: en \(x=2\) da \(y=5\), y la pendiente es \(3\).`
      },
      {
        id: 'd1-g11', tema: GEOM, tipo: 'numero',
        enunciado: R`La recta tangente a la gráfica de \(g\) en \(x=4\) es \(y=-2x+11\). ¿Cuánto vale \(g(4)\)?`,
        respuesta: 3, prefijo: R`\(g(4)=\)`,
        pistas: [R`La tangente y la curva comparten el punto de tangencia.`, R`Evalúa la recta en \(x=4\).`],
        solucion: R`La tangente pasa por el punto \((4,\,g(4))\), así que basta evaluar la recta ahí: \[ g(4)=-2\cdot 4+11=3. \] De paso, la pendiente de la recta dice que \(g'(4)=-2\).`
      },
      {
        id: 'd1-g12', tema: GEOM, tipo: 'opciones',
        enunciado: R`Para \(f(x)=x^2\) se calculan las pendientes de las secantes entre \(x=1\) y \(x=1+h\), con \(h\) cada vez más pequeño. ¿A qué recta se acercan esas secantes?`,
        opciones: [
          R`A la recta horizontal \(y=1\)`,
          R`A la recta que une \((0,\,0)\) con \((1,\,1)\)`,
          R`A la recta vertical \(x=1\)`,
          R`A la recta tangente a la parábola en \((1,\,1)\)`
        ],
        correcta: 3,
        pistas: [R`Recuerda el primer gráfico interactivo de la lección: ¿qué pasaba con la recta azul al achicar \(h\)?`],
        solucion: R`Al acercar el segundo punto al primero, las secantes tienden a la recta tangente en \((1,\,1)\). Su pendiente es \(f'(1)=2\).`
      },

      // --- Definición formal ---
      {
        id: 'd1-g13', tema: DEF, tipo: 'opciones',
        enunciado: R`¿Cuál de estas expresiones también es igual a \(f'(a)\)?`,
        opciones: [
          R`\(\displaystyle\lim_{x\to a}\frac{f(x)-f(a)}{x-a}\)`,
          R`\(\displaystyle\lim_{x\to a}\frac{f(x)-f(a)}{x}\)`,
          R`\(\displaystyle\lim_{x\to 0}\frac{f(x)-f(a)}{x-a}\)`,
          R`\(\dfrac{f(x)-f(a)}{x-a}\)`
        ],
        correcta: 0,
        pistas: [R`Parte de la definición con \(h\) y reemplaza \(x=a+h\).`, R`Si \(x=a+h\), entonces \(h=x-a\), y \(h\to 0\) equivale a \(x\to a\).`],
        solucion: R`Con \(x=a+h\) se tiene \(h=x-a\), y \(h\to 0\) es lo mismo que \(x\to a\): \[ \lim_{h\to 0}\frac{f(a+h)-f(a)}{h}=\lim_{x\to a}\frac{f(x)-f(a)}{x-a}. \]`
      },
      {
        id: 'd1-g14', tema: DEF, tipo: 'opciones',
        enunciado: R`Para \(f(x)=x^2\), ¿a qué es igual \(f(4+h)-f(4)\)?`,
        opciones: [R`\(8+h\)`, R`\(16+h^2\)`, R`\(8h+h^2\)`, R`\(h^2\)`],
        correcta: 2,
        pistas: [R`\((4+h)^2=16+8h+h^2\).`],
        solucion: R`\[ f(4+h)-f(4)=(16+8h+h^2)-16=8h+h^2. \] Un error frecuente es creer que \((4+h)^2=16+h^2\): falta el término cruzado \(8h\).`
      },
      {
        id: 'd1-g15', tema: DEF, tipo: 'numero',
        enunciado: R`Usa la definición para calcular \(f'(2)\) si \(f(x)=x^2+3x\).`,
        respuesta: 7, prefijo: R`\(f'(2)=\)`,
        pistas: [R`\(f(2)=10\).`, R`\(f(2+h)=(2+h)^2+3(2+h)=10+7h+h^2\).`, R`El cociente incremental se reduce a \(7+h\).`],
        solucion: R`\[ \begin{aligned} f(2+h) &= (2+h)^2+3(2+h)=10+7h+h^2 \\[10pt] \frac{f(2+h)-f(2)}{h} &= \frac{7h+h^2}{h}=7+h \\[10pt] f'(2) &= \lim_{h\to 0}\,(7+h)=7 \end{aligned} \]`
      },
      {
        id: 'd1-g16', tema: DEF, tipo: 'numero',
        enunciado: R`Usa la definición para calcular \(f'(2)\) si \(f(x)=\dfrac{1}{x}\). Puedes responder con una fracción, como 3/5, o con un decimal.`,
        respuesta: -0.25, prefijo: R`\(f'(2)=\)`,
        pistas: [R`\(\dfrac{1}{2+h}-\dfrac{1}{2}=\dfrac{2-(2+h)}{2\,(2+h)}\).`, R`Después de dividir por \(h\) queda \(\dfrac{-1}{2\,(2+h)}\).`],
        solucion: R`\[ \begin{aligned} \frac{1}{2+h}-\frac{1}{2} &= \frac{2-(2+h)}{2\,(2+h)}=\frac{-h}{2\,(2+h)} \\[10pt] \frac{f(2+h)-f(2)}{h} &= \frac{-1}{2\,(2+h)} \\[10pt] f'(2) &= \lim_{h\to 0}\frac{-1}{2\,(2+h)}=-\frac{1}{4} \end{aligned} \] Coincide con la fórmula de la lección: \(f'(x)=-1/x^2\).`
      },
      {
        id: 'd1-g17', tema: DEF, tipo: 'opciones',
        enunciado: R`Usando la definición, ¿cuál es la derivada de \(f(x)=x^3\)?`,
        opciones: [R`\(x^2\)`, R`\(3x\)`, R`\(3x^2+3xh+h^2\)`, R`\(3x^2\)`],
        correcta: 3,
        pistas: [R`\((x+h)^3=x^3+3x^2h+3xh^2+h^3\).`, R`Después de restar \(x^3\), todos los términos tienen al menos una \(h\).`],
        solucion: R`\[ \begin{aligned} \frac{(x+h)^3-x^3}{h} &= \frac{3x^2h+3xh^2+h^3}{h}=3x^2+3xh+h^2 \\[10pt] f'(x) &= \lim_{h\to 0}\,(3x^2+3xh+h^2)=3x^2 \end{aligned} \] La opción \(3x^2+3xh+h^2\) es el cociente simplificado, <em>antes</em> de tomar el límite.`
      },
      {
        id: 'd1-g18', tema: DEF, tipo: 'opciones',
        enunciado: R`¿Por qué \(f(x)=|x|\) no es derivable en \(x=0\)?`,
        opciones: [
          R`Porque \(f(0)=0\).`,
          R`Porque el cociente incremental tiende a \(1\) por la derecha y a \(-1\) por la izquierda.`,
          R`Porque la función no está definida en \(0\).`,
          R`Porque la función no es continua en \(0\).`
        ],
        correcta: 1,
        pistas: [R`El cociente incremental en \(0\) es \(\dfrac{|h|}{h}\). ¿Cuánto vale si \(h&gt;0\)? ¿Y si \(h&lt;0\)?`],
        solucion: R`\(\dfrac{|h|}{h}\) vale \(1\) para \(h&gt;0\) y \(-1\) para \(h&lt;0\). Como no se acerca a un único valor, el límite no existe. La función sí está definida y sí es continua en \(0\): lo que falla es que la gráfica tiene una punta.`
      }
    ]
  };

  window.Curso.registrarCapitulo('derivadas', {
    id: 'que-son',
    numero: 1,
    titulo: '¿Qué son?',
    resumen: 'Antes de calcular, hay que entender qué representa una derivada.',
    lecciones: [tasaDeCambio, interpretacionGeometrica, definicionFormal],
    guia: guia
  });
})();
