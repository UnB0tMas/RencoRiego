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