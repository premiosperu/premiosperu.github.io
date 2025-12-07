// CONTENIDO DE: filtros.js

function cargarFiltros() {
    // 1. Buscamos el hueco donde poner los filtros
    const contenedor = document.getElementById('shortcode-filtros');
    
    // Si no pusiste el hueco en el HTML, no hacemos nada y salimos.
    if (!contenedor) return;

    // 2. El HTML de tus filtros (Copiado de tu versión anterior)
    const html = `
    <div class="filters-container">
        <input type="text" id="searchInput" class="search-box" placeholder="Buscar un premio...">
        
        <select id="categoryFilter" class="filter-select">
            <option value="all">Categoría (Todas)</option>
            <option value="tecnologia">Tecnología</option>
            <option value="deporte">Deporte</option>
            <option value="accesorios">Accesorios</option>
            <option value="escolar">Escolar</option>
        </select>
        
        <select id="vendorFilter" class="filter-select">
            <option value="all">Negocio (Todos)</option>
            <option value="nike">Nike Store</option>
            <option value="ishop">iShop</option>
            <option value="sony">Sony Center</option>
            <option value="falabella">Falabella</option>
            <option value="augusto">I.E. Augusto Salazar Bondy</option>
        </select>
    </div>`;

    // 3. Inyectamos el HTML
    contenedor.innerHTML = html;

    // 4. Activamos los "oídos" (Listeners)
    // NOTA: 'filterRewards' es una función que está en tu index.html. 
    // Como ambos archivos están conectados, esto funcionará.
    document.getElementById('searchInput').addEventListener('input', filterRewards);
    document.getElementById('categoryFilter').addEventListener('change', filterRewards);
    document.getElementById('vendorFilter').addEventListener('change', filterRewards);
}
