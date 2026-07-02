# RencoRiego - Código actualizado

Este documento contiene los tres archivos completos y actualizados del proyecto:

- `index.html`
- `styles.css`
- `app.js`

Cambios principales incluidos:

- CSS separado en `styles.css`.
- JavaScript separado en `app.js`.
- En el HTML solo queda la configuración de Tailwind como script propio del proyecto.
- Se eliminó la numeración editable para cambiar ubicación.
- El cambio de ubicación queda únicamente con botones claros de **Subir** y **Bajar**.
- Se agregó animación visual y aviso de movimiento cuando una fila cambia de lugar.
- Después de mover una fila, el foco queda en la fila/botón movido para no perder la referencia.
- Se mejoró la vista responsiva: en pantallas pequeñas la tabla se convierte en tarjetas legibles y los controles ocupan todo el ancho.
- Los nombres siguen siendo editables.
- `Celia Villaverde` queda por defecto después de `Walter`.
- Los regantes con `0` horas siguen apareciendo en la tabla, pero no aparecen en el PNG/reporte.
- La columna **Orden/Mover** no se incluye en la descarga PNG/reporte.
- La descarga PNG refleja el orden, nombres y horas actuales de la tabla.
- El modal de SweetAlert2 ahora usa un diseño más sobrio y profesional, con verde oscuro como color principal.
- El formulario del modal es más responsivo y evita textos partidos o desbordados en pantallas pequeñas.
- El loader de descarga es más compacto, serio y responsivo.
- La generación del PNG ya no cambia temporalmente el ancho visible de la página; ahora captura una copia oculta del reporte, evitando el salto/expansión de pantalla.
- Los modales de alerta, confirmación, error y éxito mantienen estilos consistentes, accesibles y adaptables.
- No se usa `localStorage`; todo se reinicia al recargar la página.

---

## `index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rol de Riego - Comunidad de Renco</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Configuración Tailwind: se queda en el HTML -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            riego: {
              50: "#f0fdf4",
              100: "#dcfce7",
              200: "#bbf7d0",
              300: "#86efac",
              400: "#4ade80",
              500: "#22c55e",
              600: "#16a34a",
              700: "#15803d",
              800: "#166534",
              900: "#14532d",
            },
          },
          fontFamily: {
            serif: ["Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
            sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
          },
        },
      },
    };
  </script>

  <!-- Flowbite -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css" rel="stylesheet" />

  <!-- Estilos propios -->
  <link rel="stylesheet" href="styles.css" />
</head>
<body class="text-gray-800 font-sans antialiased min-h-screen flex flex-col bg-gray-50">
<!-- Navbar -->
<nav class="bg-riego-700 shadow-lg sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center gap-3 min-w-0">
        <div class="bg-white p-2 rounded-full text-riego-700 shadow-md shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0110 10c0 2.34-.81 4.49-2.16 6.18l-1.42-1.42A8 8 0 104 12H2a10 10 0 0110-10zm0 4v6l5 3-1 1.73L13 13.41V6h-1z"/>
          </svg>
        </div>
        <span class="text-white text-base sm:text-lg font-bold tracking-wide truncate">Sistema de Regantes - Renco</span>
      </div>
    </div>
  </div>
</nav>

<!-- Contenido Principal -->
<main class="flex-grow container mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-7xl">
  <!-- Panel de Control -->
  <section class="bg-white shadow-2xl rounded-2xl overflow-hidden mb-6 sm:mb-8 border border-riego-100">
    <div class="px-4 py-5 sm:px-6 border-b border-riego-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-riego-50/50">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-riego-900">Generar Cronograma</h2>
        <p class="text-sm text-riego-700 mt-1">Turnos de <strong>Torreyoq Kucho</strong></p>
      </div>
      <div class="text-xs font-bold bg-riego-100 text-riego-800 px-4 py-2 rounded-full border border-riego-200 shadow-sm whitespace-nowrap w-fit">
        Comunidad: Renco
      </div>
    </div>

    <div class="p-4 sm:p-6 bg-white">
      <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
        <div class="w-full sm:w-5/12 lg:w-1/3">
          <label for="horaInicio" class="block mb-2 text-sm font-bold text-riego-800">Fecha y Hora de Inicio</label>
          <input
            type="datetime-local"
            id="horaInicio"
            class="bg-white border border-riego-200 text-gray-900 text-sm rounded-lg focus:ring-riego-500 focus:border-riego-500 block w-full p-2.5 shadow-sm transition-all"
          />
        </div>

        <button
          id="btnCalcular"
          type="button"
          class="w-full sm:w-auto px-6 py-3 bg-riego-600 hover:bg-riego-700 text-white font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Calcular Turnos
        </button>
      </div>
    </div>
  </section>

  <!-- Indicaciones -->
  <section class="mb-6 bg-white rounded-2xl border border-riego-100 shadow-lg p-4 sm:p-5">
    <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <div>
        <h3 class="font-bold text-riego-900 text-base">Editar regantes y orden</h3>
        <p class="text-sm text-gray-600 mt-1">
          Edita nombres y horas en la tabla. Para cambiar el orden usa los botones claros de Subir y Bajar; el movimiento se resalta y se muestra un aviso para no perder la referencia.
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-riego-800">
        <span class="rounded-full bg-riego-50 border border-riego-100 px-3 py-2 font-semibold">1. Edita el nombre</span>
        <span class="rounded-full bg-riego-50 border border-riego-100 px-3 py-2 font-semibold">2. Ajusta las horas</span>
        <span class="rounded-full bg-riego-50 border border-riego-100 px-3 py-2 font-semibold">3. Reordena con Subir/Bajar</span>
      </div>
    </div>
  </section>

  <!-- Área de Captura -->
  <section class="mb-10">
    <div id="area-captura" class="bg-white w-full shadow-2xl border border-riego-200 rounded-2xl overflow-hidden mx-auto transition-all duration-300">
      <!-- Encabezado -->
      <div class="border-b-4 border-riego-700 p-5 sm:p-8 text-center bg-gradient-to-b from-white to-riego-50">
        <div class="flex justify-center mb-4">
          <div class="h-14 w-14 sm:h-16 sm:w-16 bg-riego-100 rounded-full flex items-center justify-center text-riego-700 shadow-lg">
            <svg class="w-9 h-9 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M12 4v7m-6 4h12" />
            </svg>
          </div>
        </div>

        <h1 id="tituloRiego" class="font-serif text-2xl sm:text-3xl font-bold text-riego-900 uppercase tracking-wider mb-2">Rol de Riego</h1>
        <p class="text-riego-800 text-sm font-bold uppercase mb-1">Comunidad de Renco</p>
        <span class="text-riego-700 text-xs font-bold uppercase bg-riego-100 px-4 py-1.5 rounded-full border border-riego-200 inline-block shadow-sm">
          Sistema: Torreyoq Kucho
        </span>

        <div class="mt-4 text-xs text-gray-500 font-mono" id="fechaGeneracion">
          Emitido: --
        </div>
      </div>

      <!-- Tabla -->
      <div class="tabla-scroll p-2 sm:p-0">
        <table class="tabla-documento min-w-full text-sm text-left divide-y divide-riego-200">
          <thead>
          <tr class="bg-riego-100 text-riego-900 uppercase text-xs font-bold tracking-wider">
            <th class="p-3 sm:p-4 text-center border-r border-riego-200">Usuario / Beneficiario</th>
            <th class="p-3 sm:p-4 text-center border-r border-riego-200">Horas</th>
            <th class="p-3 sm:p-4 text-center border-r border-riego-200">Inicio</th>
            <th class="p-3 sm:p-4 text-center border-r border-riego-200">Fin</th>
            <th class="p-3 sm:p-4 text-center columna-acciones" data-report-hidden="true">Orden</th>
          </tr>
          </thead>
          <tbody id="cuerpoTabla" class="divide-y divide-riego-100 bg-white">
          <!-- JS -->
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="p-5 sm:p-6 bg-riego-50 border-t-2 border-riego-200 flex flex-col sm:flex-row justify-between items-center text-xs text-riego-700 gap-4">
        <div class="text-center sm:text-left">
          <span class="font-bold text-riego-900 block">Total Usuarios que Riegan</span>
          <span id="totalUsuarios" class="text-2xl font-mono text-riego-900 font-bold">0</span>
        </div>
        <div class="text-center sm:text-right">
          <p class="italic mb-1 text-riego-600">"El agua es vida, úsala con responsabilidad"</p>
          <p class="font-bold text-riego-500 text-[10px]">COMUNIDAD DE RENCO - TORREYOQ KUCHO</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Botón Descarga -->
  <div class="flex justify-center pb-12">
    <button
      id="btnDescargar"
      type="button"
      class="group relative inline-flex items-center justify-center px-6 sm:px-8 py-4 font-bold text-white bg-riego-800 rounded-full text-sm sm:text-base hover:bg-riego-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-riego-700"
    >
      <svg class="w-6 h-6 mr-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Descargar Rol (PNG)
    </button>
  </div>
</main>

<footer class="bg-white border-t border-riego-100 mt-auto py-6 shadow-md">
  <div class="max-w-7xl mx-auto px-4 text-center text-sm text-riego-600">
    © 2023 - 2026 Junta de Usuarios Renco. Todos los derechos reservados.
  </div>
</footer>

<!-- Librerías externas -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js"></script>

<!-- JavaScript propio -->
<script src="app.js"></script>
</body>
</html>
```

---

## `styles.css`

```css
body {
  background-color: #f9fafb;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

:focus-visible {
  outline: 3px solid #16a34a;
  outline-offset: 3px;
}

.celda-editable:focus,
.input-nombre:focus {
  background-color: #ffffff;
  outline: 3px solid #16a34a;
  outline-offset: 2px;
  border-color: #16a34a;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.18);
}

.tabla-scroll {
  overflow-x: auto;
}

.tabla-documento {
  border-collapse: collapse;
  width: 100%;
  border-top: 4px solid #15803d;
}

.tabla-documento th,
.tabla-documento td {
  border: 1px solid #dbe5df;
  vertical-align: middle;
  padding: 0.85rem;
  text-align: center;
}

.tabla-documento th {
  background: #dcfce7;
  color: #064e3b;
  font-weight: 900;
  letter-spacing: 0.06em;
}

.tabla-documento tbody td {
  background: #ffffff;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.tabla-documento tbody tr:nth-child(even) td {
  background: #fbfefc;
}

.tabla-documento tbody tr:hover td {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.hora-celda {
  white-space: nowrap;
}

.font-num {
  font-family: "Courier New", Courier, monospace;
  letter-spacing: -0.5px;
}

.estado-no-riega {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 800;
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 9999px;
  padding: 0.45rem 0.85rem;
  white-space: nowrap;
}

.estado-pendiente {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 800;
  color: #4b5563;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  padding: 0.45rem 0.85rem;
  white-space: nowrap;
}

.input-nombre,
.celda-editable {
  min-height: 2.6rem;
  border: 1px solid #cbd5d1;
  background: #ffffff;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.input-nombre:hover,
.celda-editable:hover {
  border-color: #86efac;
  background-color: #f7fee7;
}

.input-nombre {
  min-width: 160px;
}

.celda-horas {
  background: #f8fffb !important;
}

.celda-horas .celda-editable {
  width: 5.4rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  background: #f0fdf4;
  border-color: #86efac;
  color: #14532d;
  font-size: 1.05rem;
}

.celda-inicio,
.celda-fin {
  background: #f8fffb !important;
}

.columna-acciones {
  background: #ffffff !important;
}

.fila-regante {
  position: relative;
  transition:
    background-color 0.22s ease,
    box-shadow 0.22s ease,
    outline-color 0.22s ease;
  will-change: transform;
}

.fila-regante:focus {
  outline: 3px solid #16a34a;
  outline-offset: -3px;
}

.fila-reordenada {
  z-index: 2;
}

.fila-enfocada td {
  animation: resaltarMovimiento 1.1s ease-out;
}

@keyframes resaltarMovimiento {
  0% {
    background-color: #bbf7d0;
    box-shadow: inset 0 0 0 3px #15803d, 0 16px 34px rgba(22, 101, 52, 0.2);
  }
  38% {
    background-color: #dcfce7;
    box-shadow: inset 0 0 0 3px #22c55e, 0 12px 26px rgba(22, 101, 52, 0.16);
  }
  100% {
    background-color: inherit;
    box-shadow: none;
  }
}

.acciones-mover {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 12rem;
}

.boton-mover {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.38rem;
  min-width: 5.6rem;
  min-height: 2.55rem;
  border-radius: 9999px;
  border: 1px solid #86efac;
  background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
  color: #14532d;
  font-weight: 900;
  line-height: 1;
  box-shadow: 0 3px 10px rgba(22, 101, 52, 0.08);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.boton-mover__icono {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.45rem;
  height: 1.45rem;
  border-radius: 9999px;
  background: #dcfce7;
  color: #166534;
  font-size: 1rem;
  font-weight: 900;
}

.boton-mover__texto {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.boton-mover:hover:not(:disabled),
.boton-mover:focus-visible:not(:disabled) {
  background: #dcfce7;
  border-color: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(22, 101, 52, 0.18);
  outline: none;
}

.boton-mover:active:not(:disabled) {
  transform: translateY(0);
}

.boton-mover:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.boton-mover:disabled .boton-mover__icono {
  background: #f3f4f6;
  color: #9ca3af;
}

.toast-movimiento {
  position: fixed;
  left: 50%;
  bottom: 1.25rem;
  z-index: 60;
  transform: translateX(-50%) translateY(120%);
  max-width: min(92vw, 520px);
  padding: 0.85rem 1rem;
  border-radius: 9999px;
  border: 1px solid #86efac;
  background: #14532d;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 800;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.22);
  opacity: 0;
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.toast-movimiento.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.report-hidden-temp,
.force-desktop-layout .tabla-documento tr.report-hidden-temp,
.force-desktop-layout .tabla-documento th.report-hidden-temp,
.force-desktop-layout .tabla-documento td.report-hidden-temp,
.force-desktop-layout .tabla-documento .report-hidden-temp {
  display: none !important;
}

.reporte-texto {
  display: inline-block;
  min-width: 70px;
  text-align: center;
  font-weight: 800;
}

.reporte-nombre {
  min-width: 160px;
  text-align: center;
  white-space: normal;
}

@media screen and (max-width: 700px) {
  .tabla-scroll {
    overflow-x: visible;
  }

  .tabla-documento,
  .tabla-documento thead,
  .tabla-documento tbody,
  .tabla-documento th,
  .tabla-documento td,
  .tabla-documento tr {
    display: block;
    width: 100%;
  }

  .tabla-documento {
    border-top: none;
  }

  .tabla-documento thead {
    display: none;
  }

  .tabla-documento tr {
    border: 1px solid #bbf7d0;
    border-radius: 1.1rem;
    margin-bottom: 1rem;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.09);
    background-color: white;
    overflow: hidden;
  }

  .tabla-documento tr:hover {
    background-color: #ffffff;
  }

  .tabla-documento td {
    border: none;
    border-bottom: 1px solid #dbe5df;
    padding: 0.95rem 1rem;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    min-height: auto;
    background: #ffffff !important;
  }

  .tabla-documento td:last-child {
    border-bottom: none;
  }

  .tabla-documento td::before {
    content: attr(data-label);
    display: block;
    font-weight: 900;
    color: #14532d;
    text-align: left;
    font-size: 0.76rem;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tabla-documento td input {
    width: 100% !important;
    max-width: none;
    text-align: left !important;
  }

  .tabla-documento td .celda-editable {
    text-align: center !important;
    max-width: none;
    width: 100% !important;
  }

  .input-nombre,
  .celda-editable {
    min-height: 2.9rem;
    border-radius: 0.9rem;
    padding-left: 0.9rem;
    padding-right: 0.9rem;
  }

  .celda-horas {
    background: #f0fdf4 !important;
  }

  .celda-horas::before {
    text-align: center !important;
  }

  .celda-inicio,
  .celda-fin {
    align-items: center !important;
    text-align: center !important;
    background: #f8fffb !important;
  }

  .celda-inicio::before,
  .celda-fin::before {
    width: 100%;
    text-align: center !important;
  }

  .columna-acciones {
    background: #ecfdf5 !important;
  }

  .columna-acciones::before {
    text-align: center !important;
  }

  .acciones-mover {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    width: 100%;
    min-width: 0;
  }

  .boton-mover {
    width: 100%;
    min-width: 0;
    min-height: 3rem;
    border-radius: 0.95rem;
  }

  .boton-mover__texto {
    font-size: 0.82rem;
  }

  .toast-movimiento {
    bottom: 0.8rem;
    border-radius: 1rem;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fila-enfocada td {
    animation: none;
    box-shadow: inset 0 0 0 3px #16a34a;
  }

  .fila-regante,
  .boton-mover,
  .toast-movimiento {
    transition: none !important;
  }
}

.force-desktop-layout .tabla-scroll {
  overflow: visible !important;
}

.force-desktop-layout .tabla-documento,
.force-desktop-layout .tabla-documento thead,
.force-desktop-layout .tabla-documento tbody,
.force-desktop-layout .tabla-documento tr {
  display: table !important;
  width: 100% !important;
}

.force-desktop-layout .tabla-documento thead {
  display: table-header-group !important;
}

.force-desktop-layout .tabla-documento tbody {
  display: table-row-group !important;
}

.force-desktop-layout .tabla-documento th,
.force-desktop-layout .tabla-documento td {
  display: table-cell !important;
  position: static !important;
  padding: 1rem !important;
  width: auto !important;
  height: auto !important;
  border-bottom: 1px solid #dbe5df !important;
  border-right: 1px solid #dbe5df !important;
  text-align: center !important;
  justify-content: center !important;
}

.force-desktop-layout .tabla-documento th {
  background-color: #dcfce7;
  color: #14532d;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.force-desktop-layout .tabla-documento td::before {
  display: none !important;
}

.force-desktop-layout .tabla-documento tr {
  border: none !important;
  border-radius: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
  background-color: transparent !important;
  display: table-row !important;
}

.force-desktop-layout .tabla-documento td input {
  text-align: center !important;
  width: 100% !important;
  display: inline-block !important;
}

.force-desktop-layout .tabla-documento tr.report-hidden-temp,
.force-desktop-layout .tabla-documento th.report-hidden-temp,
.force-desktop-layout .tabla-documento td.report-hidden-temp,
.force-desktop-layout .tabla-documento .report-hidden-temp {
  display: none !important;
  width: 0 !important;
  max-width: 0 !important;
  padding: 0 !important;
  border: 0 !important;
}

/* ==========================================================
   SWEETALERT2: MODALES, FORMULARIO Y LOADER RESPONSIVO
   Diseño sobrio, profesional y sin saltos de pantalla
   ========================================================== */
.swal2-container {
  padding: clamp(0.5rem, 2vw, 1rem) !important;
  overflow-x: hidden !important;
}

.swal2-backdrop-show {
  background: rgba(15, 23, 42, 0.62) !important;
  backdrop-filter: blur(3px);
}

.modal-riego {
  width: min(92vw, 480px) !important;
  max-width: 480px !important;
  max-height: calc(100dvh - 1.5rem) !important;
  border-radius: 1rem !important;
  padding: 0 !important;
  overflow: hidden !important;
  font-family: "Inter", system-ui, -apple-system, sans-serif !important;
  background: #ffffff !important;
  border: 1px solid #d8e3dc !important;
  box-shadow: 0 24px 56px rgba(15, 23, 42, 0.28) !important;
}

.modal-riego--loader {
  width: min(90vw, 390px) !important;
  max-width: 390px !important;
}

.modal-riego::before {
  content: "";
  display: block;
  height: 0.3rem;
  background: #14532d;
}

.modal-riego .swal2-icon {
  margin: 1rem auto 0.25rem !important;
  transform: scale(0.92);
}

.modal-riego__title {
  color: #123524 !important;
  font-size: clamp(1.08rem, 3.4vw, 1.35rem) !important;
  line-height: 1.2 !important;
  font-weight: 850 !important;
  letter-spacing: -0.01em !important;
  padding: 1rem 1.15rem 0 !important;
  margin: 0 !important;
}

.modal-riego__content {
  width: 100% !important;
  color: #374151 !important;
  font-size: clamp(0.88rem, 2.9vw, 0.96rem) !important;
  line-height: 1.5 !important;
  padding: 0.75rem 1.15rem 0 !important;
  margin: 0 !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  max-height: calc(100dvh - 13rem) !important;
}

.modal-riego__content * {
  box-sizing: border-box;
}

.modal-riego__actions {
  width: 100% !important;
  display: flex !important;
  align-items: stretch !important;
  justify-content: center !important;
  gap: 0.65rem !important;
  padding: 1rem 1.15rem 1.15rem !important;
  margin: 0 !important;
}

.modal-riego__confirm,
.modal-riego__cancel {
  flex: 1 1 0 !important;
  min-width: 0 !important;
  min-height: 2.85rem !important;
  border-radius: 0.75rem !important;
  padding: 0.8rem 0.95rem !important;
  font-weight: 800 !important;
  font-size: 0.92rem !important;
  line-height: 1.15 !important;
  letter-spacing: -0.005em !important;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease !important;
}

.modal-riego__confirm {
  background: #14532d !important;
  color: #ffffff !important;
  border: 1px solid #14532d !important;
  box-shadow: 0 10px 22px rgba(20, 83, 45, 0.18) !important;
}

.modal-riego__confirm:hover,
.modal-riego__confirm:focus-visible {
  background: #0f3f24 !important;
  border-color: #0f3f24 !important;
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(20, 83, 45, 0.23) !important;
}

.modal-riego__cancel {
  background: #ffffff !important;
  color: #1f2937 !important;
  border: 1px solid #cfd8d3 !important;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06) !important;
}

.modal-riego__cancel:hover,
.modal-riego__cancel:focus-visible {
  background: #f8faf9 !important;
  border-color: #9aa8a0 !important;
  transform: translateY(-1px);
}

.modal-riego__validation {
  width: calc(100% - 2.3rem) !important;
  margin: 0.8rem auto 0 !important;
  border-radius: 0.75rem !important;
  background: #fff7ed !important;
  color: #9a3412 !important;
  border: 1px solid #fed7aa !important;
  font-weight: 750 !important;
  font-size: 0.88rem !important;
}

.modal-riego-formulario {
  margin-top: 0.15rem;
  text-align: left;
}

.modal-riego-ayuda {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.7rem;
  align-items: start;
  padding: 0.85rem;
  border: 1px solid #d8e3dc;
  background: #f8faf9;
  color: #1f3d2d;
  border-radius: 0.85rem;
  font-weight: 650;
  font-size: clamp(0.82rem, 2.8vw, 0.9rem);
}

.modal-riego-ayuda strong {
  color: #123524;
  font-weight: 850;
}

.modal-riego-ayuda__icono {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.55rem;
  height: 2rem;
  flex: 0 0 auto;
  border-radius: 0.55rem;
  background: #e9f2ed;
  color: #14532d;
  border: 1px solid #c7d8cf;
  font-size: 0.72rem;
  line-height: 1;
  font-weight: 900;
  white-space: nowrap;
}

.modal-riego-opciones {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem;
  margin-top: 0.85rem;
}

.opcion-riego {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "marca titulo"
    "marca descripcion";
  column-gap: 0.7rem;
  row-gap: 0.18rem;
  align-items: start;
  min-height: 0;
  padding: 0.9rem;
  border: 1px solid #d8e3dc;
  border-radius: 0.9rem;
  background: #ffffff;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease,
    background-color 0.16s ease;
}

.opcion-riego:hover,
.opcion-riego:focus-within {
  border-color: #6b8f79;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.opcion-riego input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.opcion-riego__titulo {
  grid-area: titulo;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  color: #123524;
  font-weight: 850;
  font-size: clamp(0.95rem, 3vw, 1.02rem);
  line-height: 1.25;
}

.opcion-riego__marca {
  grid-area: marca;
  width: 1.15rem;
  height: 1.15rem;
  margin-top: 0.12rem;
  border-radius: 9999px;
  border: 2px solid #7ba28a;
  background: #ffffff;
  box-shadow: inset 0 0 0 3px #ffffff;
  flex: 0 0 1.15rem;
}

.opcion-riego__descripcion {
  grid-area: descripcion;
  color: #4b5563;
  font-size: clamp(0.8rem, 2.7vw, 0.86rem);
  line-height: 1.42;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.opcion-riego.seleccionada {
  border-color: #14532d;
  background: #f7faf8;
  box-shadow: 0 0 0 3px rgba(20, 83, 45, 0.08);
}

.opcion-riego.seleccionada .opcion-riego__marca {
  border-color: #14532d;
  background: #14532d;
  box-shadow: inset 0 0 0 4px #ffffff;
}

.loader-riego {
  width: 100%;
  margin-top: 0.25rem;
  text-align: center;
}

.loader-riego__icono {
  width: clamp(3.1rem, 14vw, 3.8rem);
  height: clamp(3.1rem, 14vw, 3.8rem);
  margin: 0 auto 0.85rem;
  border-radius: 9999px;
  border: 4px solid #e3ebe6;
  border-top-color: #14532d;
  animation: girarLoaderRiego 0.9s linear infinite;
}

.loader-riego__gota {
  display: none;
}

.loader-riego__texto {
  display: block;
  max-width: 100%;
  color: #123524;
  font-weight: 850;
  font-size: clamp(0.92rem, 3.4vw, 1rem);
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.loader-riego__detalle {
  display: block;
  max-width: 100%;
  margin-top: 0.3rem;
  color: #64748b;
  font-size: clamp(0.78rem, 2.7vw, 0.86rem);
  line-height: 1.4;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.loader-riego__barra {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 0.42rem;
  margin-top: 0.9rem;
  border-radius: 9999px;
  background: #e3ebe6;
}

.loader-riego__barra::before {
  content: "";
  position: absolute;
  inset: 0;
  width: 38%;
  border-radius: inherit;
  background: #14532d;
  animation: avanzarLoaderRiego 1.1s ease-in-out infinite;
}

@keyframes girarLoaderRiego {
  to {
    transform: rotate(360deg);
  }
}

@keyframes avanzarLoaderRiego {
  0% {
    transform: translateX(-120%);
  }
  50% {
    transform: translateX(85%);
  }
  100% {
    transform: translateX(265%);
  }
}

@media screen and (max-width: 520px) {
  .swal2-container {
    padding: 0.45rem !important;
  }

  .modal-riego {
    width: min(94vw, 420px) !important;
    border-radius: 0.9rem !important;
  }

  .modal-riego::before {
    height: 0.25rem;
  }

  .modal-riego__title {
    padding: 0.9rem 0.9rem 0 !important;
    font-size: clamp(1rem, 4.7vw, 1.16rem) !important;
  }

  .modal-riego__content {
    padding: 0.65rem 0.9rem 0 !important;
    max-height: calc(100dvh - 12.5rem) !important;
  }

  .modal-riego__actions {
    flex-direction: column-reverse !important;
    padding: 0.9rem !important;
    gap: 0.55rem !important;
  }

  .modal-riego__confirm,
  .modal-riego__cancel {
    width: 100% !important;
    min-height: 2.95rem !important;
    font-size: 0.9rem !important;
  }

  .modal-riego-ayuda {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.75rem;
  }

  .modal-riego-ayuda__icono {
    width: fit-content;
    min-width: 2.6rem;
    height: 1.75rem;
  }

  .opcion-riego {
    padding: 0.8rem;
    column-gap: 0.6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loader-riego__icono,
  .loader-riego__barra::before {
    animation: none !important;
  }

  .opcion-riego,
  .modal-riego__confirm,
  .modal-riego__cancel {
    transition: none !important;
  }
}


```

---

## `app.js`

```javascript
// ==========================================================
// DATOS POR DEFECTO
// SIEMPRE SE INICIA DESDE AQUÍ
// NO SE PERSISTE NADA EN LOCALSTORAGE
// Celia Villaverde queda después de Walter.
// ==========================================================
const datosBase = [
  ["Marleni", 8],
  ["Lalo", 12],
  ["Berta", 4],
  ["Mario", 8],
  ["Luzma", 8],
  ["Hermelinda", 4],
  ["Aguedo", 28],
  ["Walter", 8],
  ["Celia Villaverde", 4],
  ["Lucha", 4],
  ["Rita", 12],
  ["Custodio", 8]
];

let regantes = [];
let horaInicioGlobal = null;
let temporizadorToast = null;

// ==========================================================
// UTILIDADES
// ==========================================================
function crearEstadoInicial() {
  const marca = Date.now();

  regantes = datosBase.map(([nombre, horas], index) => ({
    id: `regante-${index}-${marca}`,
    nombre,
    horas
  }));
}

function buscarRegantePorId(id) {
  return regantes.find((regante) => regante.id === id);
}

function normalizarHorasValor(valor) {
  let horas = Number(valor);

  if (!Number.isFinite(horas) || horas < 0) {
    horas = 0;
  }

  return Math.floor(horas);
}

function normalizarHorasInput(input) {
  const valor = normalizarHorasValor(input.value);
  input.value = valor;
  return valor;
}

function normalizarNombreInput(input) {
  const nombre = input.value.trim();

  if (!nombre) {
    input.value = "Sin nombre";
    return "Sin nombre";
  }

  return nombre;
}

function sincronizarRegantesDesdeDOM() {
  const filas = document.querySelectorAll("#cuerpoTabla tr");
  const regantesActualizados = [];

  filas.forEach((tr) => {
    const reganteExistente = buscarRegantePorId(tr.dataset.id);
    const inputNombre = tr.querySelector('input[data-field="nombre"]');
    const inputHoras = tr.querySelector('input[data-field="horas"]');

    const nombre = inputNombre
      ? normalizarNombreInput(inputNombre)
      : (reganteExistente?.nombre || "Sin nombre");

    const horas = inputHoras
      ? normalizarHorasInput(inputHoras)
      : normalizarHorasValor(reganteExistente?.horas || 0);

    regantesActualizados.push({
      id: tr.dataset.id,
      nombre,
      horas
    });
  });

  regantes = regantesActualizados;
}

function formatearFechaDocumento(fecha) {
  if (!fecha) {
    return `<span class="estado-pendiente">Pendiente</span>`;
  }

  const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  const diaSemana = dias[fecha.getDay()];
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();

  let horas = fecha.getHours();
  const minutos = fecha.getMinutes();
  const ampm = horas >= 12 ? "PM" : "AM";

  horas = horas % 12 || 12;
  const minutosStr = minutos.toString().padStart(2, "0");

  let badgeHTML = "";
  const hora24 = fecha.getHours();

  if (hora24 === 0 && minutos === 0) {
    badgeHTML = `<span class="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">Medianoche</span>`;
  } else if (hora24 === 12 && minutos === 0) {
    badgeHTML = `<span class="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-800">Mediodía</span>`;
  }

  return `
    <div class="flex flex-col items-center leading-tight">
      <span class="text-[10px] sm:text-xs text-gray-600 font-bold uppercase">${diaSemana}, ${dia} ${mes} ${anio}</span>
      <div class="font-bold mt-1 flex items-center hora-celda">
        <span class="font-num text-base sm:text-lg">${horas}:${minutosStr}</span>
        <span class="text-xs ml-1.5">${ampm}</span>
        ${badgeHTML}
      </div>
    </div>
  `;
}

function htmlNoRiega() {
  return `<span class="estado-no-riega">No riega</span>`;
}

function htmlPendiente() {
  return `<span class="estado-pendiente">Pendiente</span>`;
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function clasesModalRiego(extraPopup = "") {
  return {
    popup: `modal-riego ${extraPopup}`.trim(),
    title: "modal-riego__title",
    htmlContainer: "modal-riego__content",
    actions: "modal-riego__actions",
    confirmButton: "modal-riego__confirm",
    cancelButton: "modal-riego__cancel",
    validationMessage: "modal-riego__validation"
  };
}

function mostrarAlertaRiego({ icon, title, text, confirmButtonText = "Entendido" }) {
  return Swal.fire({
    icon,
    title,
    text,
    confirmButtonText,
    buttonsStyling: false,
    customClass: clasesModalRiego()
  });
}

function htmlFormularioTipoRiego() {
  return `
    <div class="modal-riego-formulario">
      <div class="modal-riego-ayuda">
        <span class="modal-riego-ayuda__icono" aria-hidden="true">PNG</span>
        <span><strong>Reporte:</strong> se generará con el orden, nombres y horas actuales. No incluirá filas con 0 horas ni la columna Orden.</span>
      </div>

      <div class="modal-riego-opciones" role="radiogroup" aria-label="Tipo de riego">
        <label class="opcion-riego" for="tipoPrimerRiego">
          <input id="tipoPrimerRiego" type="radio" name="tipoRiego" value="Primer" />
          <span class="opcion-riego__marca" aria-hidden="true"></span>
          <span class="opcion-riego__titulo">Primer Riego</span>
          <span class="opcion-riego__descripcion">Usa el título: Rol del Primer Riego.</span>
        </label>

        <label class="opcion-riego" for="tipoSegundoRiego">
          <input id="tipoSegundoRiego" type="radio" name="tipoRiego" value="Segundo" />
          <span class="opcion-riego__marca" aria-hidden="true"></span>
          <span class="opcion-riego__titulo">Segundo Riego</span>
          <span class="opcion-riego__descripcion">Usa el título: Rol del Segundo Riego.</span>
        </label>
      </div>
    </div>
  `;
}

function actualizarSeleccionTipoRiego() {
  document.querySelectorAll(".opcion-riego").forEach((label) => {
    const input = label.querySelector('input[name="tipoRiego"]');
    label.classList.toggle("seleccionada", Boolean(input?.checked));
  });
}

function configurarFormularioTipoRiego() {
  document.querySelectorAll('input[name="tipoRiego"]').forEach((input) => {
    input.addEventListener("change", actualizarSeleccionTipoRiego);
  });

  const primerRiego = document.getElementById("tipoPrimerRiego");

  if (primerRiego) {
    primerRiego.checked = true;
    actualizarSeleccionTipoRiego();
    primerRiego.focus({ preventScroll: true });
  }
}

function obtenerTipoRiegoSeleccionado() {
  const seleccionado = document.querySelector('input[name="tipoRiego"]:checked');

  if (!seleccionado) {
    Swal.showValidationMessage("Seleccione Primer Riego o Segundo Riego para continuar.");
    return false;
  }

  return seleccionado.value;
}

function mostrarLoaderDescarga(tipo) {
  Swal.fire({
    title: "Generando reporte",
    html: `
      <div class="loader-riego" role="status" aria-live="polite" aria-label="Generando reporte de riego">
        <div class="loader-riego__icono" aria-hidden="true">
          <span class="loader-riego__gota"></span>
        </div>
        <span id="loaderTextoDescarga" class="loader-riego__texto">Preparando imagen del ${escaparHtml(tipo)} Riego...</span>
        <span class="loader-riego__detalle">Espera unos segundos. La pantalla no cambiará de tamaño durante la captura.</span>
        <div class="loader-riego__barra" aria-hidden="true"></div>
      </div>
    `,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    buttonsStyling: false,
    customClass: clasesModalRiego("modal-riego--loader")
  });
}

function actualizarLoaderDescarga(mensaje) {
  const loaderTexto = document.getElementById("loaderTextoDescarga");

  if (loaderTexto) {
    loaderTexto.textContent = mensaje;
  }
}

// ==========================================================
// RENDER DE TABLA
// ==========================================================
function renderizarTabla() {
  const tbody = document.getElementById("cuerpoTabla");
  const fechaGen = document.getElementById("fechaGeneracion");

  tbody.innerHTML = "";

  const hoy = new Date();
  fechaGen.textContent = `Emitido el: ${hoy.toLocaleDateString("es-PE")} ${hoy.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit"
  })}`;

  regantes.forEach((regante, index) => {
    const tr = document.createElement("tr");
    tr.className = "fila-regante hover:bg-riego-50 border-b border-riego-100 transition-colors";
    tr.dataset.id = regante.id;
    tr.tabIndex = -1;

    // Nombre editable
    const tdNombre = document.createElement("td");
    tdNombre.className = "p-3 text-center border-r border-riego-100 font-semibold text-sm break-words";
    tdNombre.dataset.label = "Usuario";

    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.value = regante.nombre;
    inputNombre.dataset.field = "nombre";
    inputNombre.dataset.id = regante.id;
    inputNombre.className = "input-nombre w-full text-center font-semibold text-gray-800 border rounded-lg px-2 py-1.5";
    inputNombre.placeholder = "Nombre del regante";
    inputNombre.setAttribute("aria-label", `Nombre del regante ${index + 1}`);

    tdNombre.appendChild(inputNombre);
    tr.appendChild(tdNombre);

    // Horas editables
    const tdHoras = document.createElement("td");
    tdHoras.className = "p-2 text-center border-r border-riego-100 celda-horas";
    tdHoras.dataset.label = "Horas asignadas";

    const inputHoras = document.createElement("input");
    inputHoras.type = "number";
    inputHoras.value = regante.horas;
    inputHoras.min = "0";
    inputHoras.step = "1";
    inputHoras.inputMode = "numeric";
    inputHoras.dataset.field = "horas";
    inputHoras.dataset.id = regante.id;
    inputHoras.className = "celda-editable text-center font-mono font-bold mx-auto block";
    inputHoras.setAttribute("aria-label", `Horas asignadas a ${regante.nombre}`);

    tdHoras.appendChild(inputHoras);
    tr.appendChild(tdHoras);

    // Inicio
    const tdInicio = document.createElement("td");
    tdInicio.className = "p-2 text-center border-r border-riego-100 celda-inicio";
    tdInicio.dataset.label = "Hora inicio";
    tdInicio.innerHTML = htmlPendiente();
    tr.appendChild(tdInicio);

    // Fin
    const tdFin = document.createElement("td");
    tdFin.className = "p-2 text-center border-r border-riego-100 celda-fin";
    tdFin.dataset.label = "Hora fin";
    tdFin.innerHTML = htmlPendiente();
    tr.appendChild(tdFin);

    // Acciones para mover
    const tdAcciones = document.createElement("td");
    tdAcciones.className = "p-2 text-center columna-acciones";
    tdAcciones.dataset.label = "Cambiar orden";
    tdAcciones.dataset.reportHidden = "true";

    const acciones = document.createElement("div");
    acciones.className = "acciones-mover";

    const btnSubir = crearBotonMover({
      id: regante.id,
      accion: "subir",
      nombre: regante.nombre,
      texto: "Subir",
      icono: "↑",
      disabled: index === 0
    });

    const btnBajar = crearBotonMover({
      id: regante.id,
      accion: "bajar",
      nombre: regante.nombre,
      texto: "Bajar",
      icono: "↓",
      disabled: index === regantes.length - 1
    });

    acciones.appendChild(btnSubir);
    acciones.appendChild(btnBajar);
    tdAcciones.appendChild(acciones);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });

  enlazarEventosTabla();
  recalcularCronograma();
}

function crearBotonMover({ id, accion, nombre, texto, icono, disabled }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "boton-mover";
  button.title = `${texto} una posición`;
  button.setAttribute("aria-label", `${texto} a ${nombre} una posición`);
  button.dataset.action = accion;
  button.dataset.id = id;
  button.disabled = disabled;
  button.innerHTML = `
    <span class="boton-mover__icono" aria-hidden="true">${icono}</span>
    <span class="boton-mover__texto">${texto}</span>
  `;
  return button;
}

// ==========================================================
// EVENTOS
// ==========================================================
function enlazarEventosTabla() {
  const tbody = document.getElementById("cuerpoTabla");

  tbody.querySelectorAll('input[data-field="horas"]').forEach((input) => {
    input.addEventListener("input", () => {
      const regante = buscarRegantePorId(input.dataset.id);
      const horas = normalizarHorasInput(input);

      if (regante) {
        regante.horas = horas;
      }

      recalcularCronograma();
    });

    input.addEventListener("change", () => {
      const regante = buscarRegantePorId(input.dataset.id);
      const horas = normalizarHorasInput(input);

      if (regante) {
        regante.horas = horas;
      }

      recalcularCronograma();
    });

    input.addEventListener("blur", () => {
      const regante = buscarRegantePorId(input.dataset.id);
      const horas = normalizarHorasInput(input);

      if (regante) {
        regante.horas = horas;
      }

      recalcularCronograma();
    });
  });

  tbody.querySelectorAll('input[data-field="nombre"]').forEach((input) => {
    input.addEventListener("input", () => {
      const regante = buscarRegantePorId(input.dataset.id);

      if (regante) {
        regante.nombre = input.value;
      }
    });

    input.addEventListener("blur", () => {
      const regante = buscarRegantePorId(input.dataset.id);
      const nombre = normalizarNombreInput(input);

      if (regante) {
        regante.nombre = nombre;
      }
    });
  });

  tbody.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      moverConBoton(button.dataset.id, button.dataset.action);
    });
  });
}

// ==========================================================
// ORDENAMIENTO CON BOTONES Y ANIMACIÓN
// ==========================================================
function moverConBoton(id, accion) {
  sincronizarRegantesDesdeDOM();

  const indiceActual = regantes.findIndex((regante) => regante.id === id);

  if (indiceActual === -1) {
    return;
  }

  const indiceDestino = accion === "subir" ? indiceActual - 1 : indiceActual + 1;

  if (indiceDestino < 0 || indiceDestino >= regantes.length) {
    return;
  }

  const reganteMovido = regantes[indiceActual];
  const posicionesAntes = capturarPosicionesFilas();

  intercambiarRegantes(indiceActual, indiceDestino);
  renderizarTabla();
  animarReordenamiento(posicionesAntes, id);
  enfocarFilaMovida(id, accion);
  mostrarAvisoMovimiento(reganteMovido.nombre, accion, indiceDestino + 1);
}

function intercambiarRegantes(indiceA, indiceB) {
  const temporal = regantes[indiceA];
  regantes[indiceA] = regantes[indiceB];
  regantes[indiceB] = temporal;
}

function capturarPosicionesFilas() {
  const posiciones = new Map();

  document.querySelectorAll("#cuerpoTabla tr").forEach((tr) => {
    posiciones.set(tr.dataset.id, tr.getBoundingClientRect().top);
  });

  return posiciones;
}

function animarReordenamiento(posicionesAntes, idPrincipal) {
  requestAnimationFrame(() => {
    const filas = Array.from(document.querySelectorAll("#cuerpoTabla tr"));

    filas.forEach((fila) => {
      const topAnterior = posicionesAntes.get(fila.dataset.id);

      if (typeof topAnterior !== "number") {
        return;
      }

      const topActual = fila.getBoundingClientRect().top;
      const diferencia = topAnterior - topActual;

      if (Math.abs(diferencia) < 1) {
        return;
      }

      fila.style.transition = "none";
      fila.style.transform = `translateY(${diferencia}px)`;
      fila.classList.add("fila-reordenada");
    });

    requestAnimationFrame(() => {
      filas.forEach((fila) => {
        fila.style.transition = "transform 520ms cubic-bezier(0.16, 1, 0.3, 1)";
        fila.style.transform = "";

        if (fila.dataset.id === idPrincipal) {
          fila.classList.add("fila-enfocada");
        }

        window.setTimeout(() => {
          fila.style.transition = "";
          fila.classList.remove("fila-reordenada", "fila-enfocada");
        }, 1120);
      });
    });
  });
}

function enfocarFilaMovida(id, accion) {
  window.setTimeout(() => {
    const fila = document.querySelector(`#cuerpoTabla tr[data-id="${CSS.escape(id)}"]`);

    if (!fila) {
      return;
    }

    fila.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

    const botonPreferido = fila.querySelector(`button[data-action="${accion}"]:not(:disabled)`);
    const botonAlternativo = fila.querySelector("button:not(:disabled)");

    if (botonPreferido) {
      botonPreferido.focus({ preventScroll: true });
    } else if (botonAlternativo) {
      botonAlternativo.focus({ preventScroll: true });
    } else {
      fila.focus({ preventScroll: true });
    }
  }, 120);
}

function mostrarAvisoMovimiento(nombre, accion, posicion) {
  let toast = document.getElementById("toastMovimiento");
  let live = document.getElementById("estadoMovimiento");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastMovimiento";
    toast.className = "toast-movimiento";
    document.body.appendChild(toast);
  }

  if (!live) {
    live = document.createElement("div");
    live.id = "estadoMovimiento";
    live.className = "sr-only";
    live.setAttribute("aria-live", "polite");
    document.body.appendChild(live);
  }

  const verbo = accion === "subir" ? "subió" : "bajó";
  const mensaje = `${nombre} ${verbo} a la posición ${posicion}`;

  toast.textContent = mensaje;
  live.textContent = mensaje;

  window.clearTimeout(temporizadorToast);
  toast.classList.add("visible");

  temporizadorToast = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2200);
}

// ==========================================================
// CÁLCULO DEL CRONOGRAMA
// ==========================================================
function recalcularCronograma() {
  const totalSpan = document.getElementById("totalUsuarios");
  const filas = document.querySelectorAll("#cuerpoTabla tr");

  let horaAcumulada = horaInicioGlobal ? new Date(horaInicioGlobal) : null;
  let totalQueRiegan = 0;

  filas.forEach((tr) => {
    const inputHoras = tr.querySelector('input[data-field="horas"]');
    const tdInicio = tr.querySelector(".celda-inicio");
    const tdFin = tr.querySelector(".celda-fin");

    const horas = inputHoras ? normalizarHorasValor(inputHoras.value) : 0;

    if (horas <= 0) {
      tdInicio.innerHTML = htmlNoRiega();
      tdFin.innerHTML = htmlNoRiega();
      return;
    }

    totalQueRiegan++;

    if (!horaAcumulada) {
      tdInicio.innerHTML = htmlPendiente();
      tdFin.innerHTML = htmlPendiente();
      return;
    }

    const inicio = new Date(horaAcumulada);
    const fin = new Date(inicio.getTime() + horas * 60 * 60 * 1000);

    tdInicio.innerHTML = formatearFechaDocumento(inicio);
    tdFin.innerHTML = formatearFechaDocumento(fin);

    horaAcumulada = fin;
  });

  totalSpan.textContent = totalQueRiegan;
}

// ==========================================================
// ACCIONES PRINCIPALES
// ==========================================================
function establecerInicioRiego() {
  const valor = document.getElementById("horaInicio").value;

  if (!valor) {
    mostrarAlertaRiego({
      icon: "warning",
      title: "Dato requerido",
      text: "Por favor seleccione fecha y hora de inicio"
    });
    return;
  }

  horaInicioGlobal = new Date(valor);
  sincronizarRegantesDesdeDOM();
  recalcularCronograma();

  document.getElementById("area-captura").scrollIntoView({
    behavior: "smooth"
  });
}

function iniciarDescarga() {
  if (!horaInicioGlobal) {
    mostrarAlertaRiego({
      icon: "error",
      title: "Sin datos",
      text: 'Primero genere el cronograma seleccionando fecha y hora y pulsando "Calcular Turnos"'
    });
    return;
  }

  sincronizarRegantesDesdeDOM();
  recalcularCronograma();

  const regantesConHoras = regantes.filter((regante) => normalizarHorasValor(regante.horas) > 0);

  if (regantesConHoras.length === 0) {
    mostrarAlertaRiego({
      icon: "warning",
      title: "Sin usuarios para el reporte",
      text: "Todos los regantes tienen 0 horas. El reporte necesita al menos un usuario con horas mayores a 0."
    });
    return;
  }

  Swal.fire({
    title: "Descargar reporte",
    html: htmlFormularioTipoRiego(),
    showCancelButton: true,
    confirmButtonText: "Generar PNG",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    focusConfirm: false,
    buttonsStyling: false,
    customClass: clasesModalRiego(),
    didOpen: configurarFormularioTipoRiego,
    preConfirm: obtenerTipoRiegoSeleccionado
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      descargarImagen(result.value);
    }
  });
}

function descargarImagen(tipo) {
  const area = document.getElementById("area-captura");

  sincronizarRegantesDesdeDOM();
  recalcularCronograma();

  const reporte = crearAreaReporteParaCaptura(area, tipo);

  mostrarLoaderDescarga(tipo);

  window.setTimeout(() => {
    actualizarLoaderDescarga("Capturando la tabla en alta resolución...");
  }, 180);

  window.requestAnimationFrame(() => {
    html2canvas(reporte, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: 1200,
      width: 1200
    })
      .then((canvas) => {
        actualizarLoaderDescarga("Preparando la descarga del archivo...");

        const link = document.createElement("a");
        link.download = `Rol_Riego_${tipo}_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        Swal.fire({
          icon: "success",
          title: "Imagen descargada",
          text: "El PNG del rol de riego se generó correctamente.",
          timer: 2200,
          showConfirmButton: false,
          buttonsStyling: false,
          customClass: clasesModalRiego()
        });
      })
      .catch((err) => {
        console.error(err);
        mostrarAlertaRiego({
          icon: "error",
          title: "Error al generar la imagen",
          text: "No se pudo generar el PNG. Revise la tabla e inténtelo nuevamente."
        });
      })
      .finally(() => {
        reporte.remove();
        recalcularCronograma();
      });
  });
}

// ==========================================================
// PREPARACIÓN DEL REPORTE PNG
// ==========================================================
function crearAreaReporteParaCaptura(area, tipo) {
  const reporte = area.cloneNode(true);
  reporte.id = "area-captura-reporte";
  reporte.setAttribute("aria-hidden", "true");
  reporte.classList.add("force-desktop-layout");

  const tituloReporte = reporte.querySelector("#tituloRiego");

  if (tituloReporte) {
    tituloReporte.textContent = `Rol del ${tipo} Riego`;
  }

  copiarValoresInputsAlReporte(area, reporte);
  convertirInputsATexto(reporte);
  ocultarElementosParaReporte(reporte);

  reporte.style.position = "fixed";
  reporte.style.top = "0";
  reporte.style.left = "0";
  reporte.style.width = "1200px";
  reporte.style.maxWidth = "none";
  reporte.style.pointerEvents = "none";
  reporte.style.zIndex = "-1";

  document.body.appendChild(reporte);
  return reporte;
}

function copiarValoresInputsAlReporte(areaOriginal, areaReporte) {
  const inputsOriginales = areaOriginal.querySelectorAll("input");
  const inputsReporte = areaReporte.querySelectorAll("input");

  inputsReporte.forEach((inputReporte, index) => {
    const inputOriginal = inputsOriginales[index];

    if (inputOriginal) {
      inputReporte.value = inputOriginal.value;
    }
  });
}

function convertirInputsATexto(area) {
  const inputs = area.querySelectorAll("input");
  const reemplazos = [];

  inputs.forEach((input) => {
    const span = document.createElement("span");
    span.textContent = input.value;
    span.className = "reporte-texto";

    if (input.dataset.field === "nombre") {
      span.classList.add("reporte-nombre");
    }

    input.parentNode.replaceChild(span, input);
    reemplazos.push({ input, span });
  });

  return reemplazos;
}

function restaurarInputs(reemplazos) {
  reemplazos.forEach(({ input, span }) => {
    if (span.parentNode) {
      span.parentNode.replaceChild(input, span);
    }
  });
}

function ocultarElementosParaReporte(area) {
  const elementosOcultos = [];

  // Oculta del reporte la columna de controles de orden/movimiento.
  area.querySelectorAll('[data-report-hidden="true"]').forEach((elemento) => {
    elemento.classList.add("report-hidden-temp");
    elementosOcultos.push(elemento);
  });

  // Oculta del reporte las filas con 0 horas, pero las mantiene en la tabla normal.
  area.querySelectorAll("#cuerpoTabla tr").forEach((tr) => {
    const id = tr.dataset.id;
    const regante = buscarRegantePorId(id);
    const horas = normalizarHorasValor(regante?.horas || 0);

    if (horas <= 0) {
      tr.classList.add("report-hidden-temp");
      elementosOcultos.push(tr);
    }
  });

  return elementosOcultos;
}

function restaurarElementosOcultos(elementosOcultos) {
  elementosOcultos.forEach((elemento) => {
    elemento.classList.remove("report-hidden-temp");
  });
}

// ==========================================================
// INICIALIZACIÓN
// ==========================================================
window.addEventListener("load", () => {
  crearEstadoInicial();

  const ahora = new Date();
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
  document.getElementById("horaInicio").value = ahora.toISOString().slice(0, 16);

  document.getElementById("btnCalcular").addEventListener("click", establecerInicioRiego);
  document.getElementById("btnDescargar").addEventListener("click", iniciarDescarga);

  renderizarTabla();
});
```
