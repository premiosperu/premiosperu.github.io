// filtros.js - SOLO ESTRUCTURA VACÍA

function cargarFiltros() {
    const contenedor = document.getElementById('shortcode-filtros');
    if (!contenedor) return;

    const html = `
    <div class="filters-container">
        <input type="text" id="searchInput" class="search-box" placeholder="Buscar negocio, distrito o provincia...">
        
        <select id="categoryFilter" class="filter-select">
            <option value="all">Todas las Categorías</option>
            </select>

        <select id="depaFilter" class="filter-select">
            <option value="all">Todos los Departamentos</option>
            <option value="Lima">Lima</option>
            <option value="Arequipa">Arequipa</option>
            </select>
    </div>`;

    contenedor.innerHTML = html;

    // Activamos los escuchadores
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const depaFilter = document.getElementById('depaFilter');

    // Verificamos que la función de filtrado exista antes de conectar
    if (typeof filtrarNegocios === 'function') {
        searchInput.addEventListener('input', filtrarNegocios);
        categoryFilter.addEventListener('change', filtrarNegocios);
        depaFilter.addEventListener('change', filtrarNegocios);
    }
}
