/* Progreso del estudiante.
 *
 * Todo el estado vive en un solo objeto JSON. Hoy se guarda en localStorage;
 * para pasar a Supabase basta con reemplazar `Almacen` por un adaptador que
 * lea/escriba ese mismo JSON en una tabla (por ejemplo `progreso(user_id, datos jsonb)`).
 * El resto del sitio solo habla con `Progreso`.
 */
(function () {
  'use strict';

  var CLAVE = 'calculo.progreso.v1';

  var Almacen = {
    leer: function () {
      try {
        var crudo = window.localStorage.getItem(CLAVE);
        return crudo ? JSON.parse(crudo) : null;
      } catch (e) {
        return null;
      }
    },
    escribir: function (estado) {
      try {
        window.localStorage.setItem(CLAVE, JSON.stringify(estado));
      } catch (e) { /* modo privado o almacenamiento bloqueado: se sigue en memoria */ }
    },
    borrar: function () {
      try { window.localStorage.removeItem(CLAVE); } catch (e) {}
    }
  };

  function estadoVacio() {
    return {
      v: 1,
      lecciones: {},   // { 'derivadas/que-son/tasa-de-cambio': fechaISO }
      ejercicios: {},  // { id: { resuelto, intentos, pistas, vioSolucion, limpio, fecha } }
      racha: 0,
      mejorRacha: 0,
      dias: [],        // días distintos con actividad, 'AAAA-MM-DD'
      eventos: {},     // { casiCero: true, ... }
      medallas: {}     // { id: fechaISO }
    };
  }

  var estado = Object.assign(estadoVacio(), Almacen.leer() || {});
  var oyentes = [];

  function hoy() {
    var d = new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function guardar() {
    var dia = hoy();
    if (estado.dias.indexOf(dia) === -1) estado.dias.push(dia);
    Almacen.escribir(estado);
    oyentes.forEach(function (f) { f(estado); });
  }

  function fichaEjercicio(id) {
    if (!estado.ejercicios[id]) {
      estado.ejercicios[id] = { resuelto: false, intentos: 0, pistas: 0, vioSolucion: false, limpio: false };
    }
    return estado.ejercicios[id];
  }

  var Progreso = {
    estado: function () { return estado; },

    alCambiar: function (f) { oyentes.push(f); },

    // --- Lecciones ---
    leccionCompleta: function (ruta) { return !!estado.lecciones[ruta]; },
    completarLeccion: function (ruta) {
      if (estado.lecciones[ruta]) return;
      estado.lecciones[ruta] = new Date().toISOString();
      guardar();
    },

    // --- Ejercicios ---
    ejercicio: function (id) {
      return estado.ejercicios[id] || { resuelto: false, intentos: 0, pistas: 0, vioSolucion: false, limpio: false };
    },
    registrarIntento: function (id, correcto) {
      var e = fichaEjercicio(id);
      if (e.resuelto) return e;
      e.intentos += 1;
      if (correcto) {
        e.resuelto = true;
        e.limpio = e.intentos === 1 && e.pistas === 0 && !e.vioSolucion;
        e.fecha = new Date().toISOString();
        estado.racha += 1;
        if (estado.racha > estado.mejorRacha) estado.mejorRacha = estado.racha;
      } else {
        estado.racha = 0;
      }
      guardar();
      return e;
    },
    registrarPista: function (id) {
      var e = fichaEjercicio(id);
      if (e.resuelto) return;
      e.pistas += 1;
      guardar();
    },
    registrarSolucionVista: function (id) {
      var e = fichaEjercicio(id);
      if (e.resuelto) return;
      e.vioSolucion = true;
      guardar();
    },
    reiniciarEjercicios: function (ids) {
      ids.forEach(function (id) { delete estado.ejercicios[id]; });
      estado.racha = 0;
      guardar();
    },

    // --- Eventos sueltos (interacción con gráficos, etc.) ---
    evento: function (nombre) {
      if (estado.eventos[nombre]) return;
      estado.eventos[nombre] = true;
      guardar();
    },

    // --- Medallas ---
    tieneMedalla: function (id) { return !!estado.medallas[id]; },
    otorgarMedalla: function (id) {
      if (estado.medallas[id]) return false;
      estado.medallas[id] = new Date().toISOString();
      Almacen.escribir(estado);
      return true;
    },

    // --- Mantenimiento ---
    reiniciarTodo: function () {
      Almacen.borrar();
      estado = estadoVacio();
      guardar();
    },
    exportar: function () { return JSON.stringify(estado, null, 2); },
    importar: function (texto) {
      var datos = JSON.parse(texto);
      if (!datos || datos.v !== 1) throw new Error('Formato no reconocido');
      estado = Object.assign(estadoVacio(), datos);
      guardar();
    }
  };

  window.Progreso = Progreso;
})();
