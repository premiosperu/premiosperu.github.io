// modal.js

// 1. Inyectar el HTML del modal en el documento
function cargarModal() {
    // Si ya existe el modal, no lo volvemos a crear
    if (document.getElementById('rewardModal')) return;

    const modalHTML = `
    <div id="rewardModal" class="modal-backdrop">
        <div class="modal-content">
            <div class="close-btn" onclick="closeModal()"><span>&times;</span></div>
            <img id="modalImg" src="" class="modal-img">
            <div class="modal-body">
                <div class="modal-header-row">
                    <span id="modalVendor" class="modal-vendor">NEGOCIO</span>
                    <span id="modalCategory" class="modal-category">Categoría</span>
                </div>
                <h2 id="modalTitle" class="modal-title">Título</h2>
                <span id="modalPoints" class="modal-points">0 puntos</span>
                <p id="modalDesc" class="modal-desc-long">Descripción...</p>
            </div>
        </div>
    </div>`;

    // Lo agregamos al final del body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Activamos el cierre al hacer clic fuera
    const modal = document.getElementById('rewardModal');
    window.onclick = function(event) { 
        if (event.target == modal) closeModal(); 
    }
}

// 2. Función para ABRIR el modal con datos
function abrirModal(datos) {
    // Aseguramos que el modal exista
    cargarModal();

    const modal = document.getElementById('rewardModal');
    
    // Llenamos los datos
    document.getElementById('modalImg').src = datos.imagen;
    document.getElementById('modalTitle').textContent = datos.titulo;
    document.getElementById('modalPoints').textContent = datos.puntos + ' puntos';
    document.getElementById('modalVendor').textContent = datos.negocio;
    document.getElementById('modalCategory').textContent = datos.categoria;
    document.getElementById('modalDesc').textContent = datos.descripcion;

    // Mostramos
    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.add('show'); }, 10);
}

// 3. Función para CERRAR
function closeModal() {
    const modal = document.getElementById('rewardModal');
    if(modal) {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
}
