// ========== VARIABLES DEL SISTEMA ==========
const CAPACIDAD_MAXIMA = 5;
let vehiculosDentro = 0;
let contadorRegistros = 0;
let hayRegistros = false;

// ========== FUNCIONES PRINCIPALES ==========

// Simular ENTRADA de vehículo
function simularEntrada() {
    const mensajeDiv = document.getElementById('mensajeRFID');
    
    // Validar capacidad máxima
    if (vehiculosDentro >= CAPACIDAD_MAXIMA) {
        mostrarMensaje(
            '<i class="bi bi-x-octagon-fill me-2"></i> ACCESO BLOQUEADO: Parqueo lleno (5/5)', 
            'danger'
        );
        return;
    }
    
    // Incrementar contador
    vehiculosDentro++;
    
    // Actualizar visualización
    actualizarPanel();
    ocuparEspacio();
    
    // Mostrar mensaje de éxito
    mostrarMensaje(
        '<i class="bi bi-check-circle-fill me-2"></i> ENTRADA PERMITIDA. Tarjeta RFID validada correctamente.', 
        'success'
    );
    
    // Registrar en la tabla
    agregarRegistro('ENTRADA');
}

// Simular SALIDA de vehículo
function simularSalida() {
    // Validar que haya vehículos dentro
    if (vehiculosDentro <= 0) {
        mostrarMensaje(
            '<i class="bi bi-exclamation-triangle-fill me-2"></i> No hay vehículos en el parqueo', 
            'warning'
        );
        return;
    }
    
    // Decrementar contador
    vehiculosDentro--;
    
    // Actualizar visualización
    actualizarPanel();
    liberarEspacio();
    
    // Mostrar mensaje de éxito
    mostrarMensaje(
        '<i class="bi bi-check-circle-fill me-2"></i> SALIDA REGISTRADA. Tarjeta RFID validada correctamente.', 
        'success'
    );
    
    // Registrar en la tabla
    agregarRegistro('SALIDA');
}

// ========== MOSTRAR MENSAJE ==========
function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensajeRFID');
    
    const clases = {
        'success': 'alert alert-success border-0 shadow-sm',
        'danger': 'alert alert-danger border-0 shadow-sm',
        'warning': 'alert alert-warning border-0 shadow-sm'
    };
    
    mensajeDiv.className = 'mt-4 fade-in ' + (clases[tipo] || clases['success']);
    mensajeDiv.innerHTML = texto;
    mensajeDiv.classList.remove('d-none');
    
    // Auto-ocultar después de 4 segundos
    setTimeout(() => {
        mensajeDiv.classList.add('d-none');
    }, 4000);
}

// ========== ACTUALIZAR PANEL DE ESTADO ==========
function actualizarPanel() {
    // Actualizar números
    document.getElementById('vehiculosDentro').textContent = vehiculosDentro;
    
    const disponibles = CAPACIDAD_MAXIMA - vehiculosDentro;
    document.getElementById('espaciosDisponibles').textContent = disponibles;
    
    // Actualizar tarjeta de estado
    const estadoCard = document.getElementById('estadoSistema');
    const mensajeEstado = document.getElementById('mensajeEstado');
    
    if (vehiculosDentro >= CAPACIDAD_MAXIMA) {
        estadoCard.className = 'card tarjeta-estado h-100 estado-lleno';
        mensajeEstado.innerHTML = '<i class="bi bi-x-octagon-fill"></i> PARQUEO LLENO';
    } else {
        estadoCard.className = 'card tarjeta-estado h-100 estado-disponible';
        mensajeEstado.innerHTML = '<i class="bi bi-check-circle-fill"></i> Disponible';
    }
}

// ========== OCUPAR ESPACIO VISUAL ==========
function ocuparEspacio() {
    for (let i = 1; i <= CAPACIDAD_MAXIMA; i++) {
        const espacio = document.getElementById('espacio' + i);
        if (!espacio.classList.contains('ocupado')) {
            espacio.classList.add('ocupado');
            
            const badge = espacio.querySelector('.badge');
            badge.className = 'badge bg-white text-primary mt-2 fw-bold';
            badge.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>Ocupado';
            
            // Animación de entrada
            espacio.style.animation = 'none';
            espacio.offsetHeight; // Trigger reflow
            espacio.style.animation = 'fadeIn 0.5s ease-in';
            
            break;
        }
    }
}

// ========== LIBERAR ESPACIO VISUAL ==========
function liberarEspacio() {
    for (let i = CAPACIDAD_MAXIMA; i >= 1; i--) {
        const espacio = document.getElementById('espacio' + i);
        if (espacio.classList.contains('ocupado')) {
            espacio.classList.remove('ocupado');
            
            const badge = espacio.querySelector('.badge');
            badge.className = 'badge bg-secondary mt-2';
            badge.textContent = 'Libre';
            
            break;
        }
    }
}

// ========== AGREGAR REGISTRO A LA TABLA ==========
function agregarRegistro(tipo) {
    // Si es el primer registro, limpiar mensaje de "sin registros"
    if (!hayRegistros) {
        document.getElementById('cuerpoTabla').innerHTML = '';
        hayRegistros = true;
    }
    
    contadorRegistros++;
    const horaActual = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    const nuevaFila = document.createElement('tr');
    nuevaFila.className = 'fade-in';
    
    const claseBadge = tipo === 'ENTRADA' ? 'badge-entrada' : 'badge-salida';
    const iconoTipo = tipo === 'ENTRADA' ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle';
    
    nuevaFila.innerHTML = `
        <td class="fw-bold text-muted">#${contadorRegistros}</td>
        <td><span class="${claseBadge}"><i class="bi ${iconoTipo} me-1"></i>${tipo}</span></td>
        <td class="font-monospace">${horaActual}</td>
        <td>
            <div class="d-flex align-items-center justify-content-center gap-2">
                <div class="progress flex-grow-1" style="height: 8px; max-width: 100px;">
                    <div class="progress-bar bg-primary" style="width: ${(vehiculosDentro / CAPACIDAD_MAXIMA) * 100}%"></div>
                </div>
                <span class="small fw-bold text-muted">${vehiculosDentro}/${CAPACIDAD_MAXIMA}</span>
            </div>
        </td>
    `;
    
    // Insertar al principio
    cuerpoTabla.insertBefore(nuevaFila, cuerpoTabla.firstChild);
}

// ========== INICIALIZAR SISTEMA ==========
window.onload = function() {
    actualizarPanel();
};