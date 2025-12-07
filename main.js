// main.js - VERSIÓN DIRECTORIO DE NEGOCIOS

// 1. CONFIGURACIÓN
const SHEET_ID = 'TU_ID_DE_GOOGLE_SHEET_AQUI'; 
const SHEET_NAME = 'Hoja1'; // Asegúrate que coincida con el nombre de la pestaña
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

const rewardsList = document.getElementById('rewardsList');

// --- FUNCIÓN PRINCIPAL: CARGAR NEGOCIOS ---
async function cargarNegocios() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        rewardsList.innerHTML = ''; // Limpiar "Cargando..."

        data.forEach(negocio => {
            // Creamos la tarjeta del NEGOCIO
            // Usamos 'usuario' para el link (ej: #/nike)
            const cardHTML = `
                <article class="reward-card business-card" 
                    data-category="${negocio.categoria}" 
                    data-name="${negocio.nombre}"
                    data-location="${negocio.distrito}"
                    onclick="irANegocio('${negocio.usuario}')">
                    
                    <div class="reward-image">
                        <img src="${negocio.logo}" alt="${negocio.nombre}" onerror="this.src='https://via.placeholder.com/150'">
                    </div>
                    <div class="reward-content">
                        <div class="reward-vendor">${negocio.categoria}</div>
                        <h3 class="reward-title">${negocio.nombre}</h3>
                        <p class="reward-desc">
                            📍 ${negocio.distrito}, ${negocio.provincia}
                        </p>
                        <span class="reward-points" style="background:#f1f5f9; color:#64748b; margin-top:5px; font-size:0.8rem;">
                            Ver premios →
                        </span>
                    </div>
                </article>
            `;
            rewardsList.innerHTML += cardHTML;
        });

        // Activamos el buscador después de crear las tarjetas
        if(document.getElementById('searchInput')) {
            activarBuscador();
        }

    } catch (error) {
        console.error('Error:', error);
        rewardsList.innerHTML = '<p style="text-align:center; color:red;">Error cargando negocios.</p>';
    }
}

// --- FUNCIÓN DE NAVEGACIÓN ---
function irANegocio(usuario) {
    // Esto cambia la URL a: premios.pe/#/nike
    // En el futuro, aquí detectaremos ese cambio para cargar los premios de Nike
    window.location.hash = `/${usuario}`;
}

// --- FUNCIÓN DE BÚSQUEDA (Adaptada a Negocios) ---
function activarBuscador() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    function filtrar() {
        const texto = searchInput.value.toLowerCase();
        const cat = categoryFilter ? categoryFilter.value : 'all';
        const cards = document.querySelectorAll('.business-card');

        cards.forEach(card => {
            const nombre = card.getAttribute('data-name').toLowerCase();
            const ubicacion = card.getAttribute('data-location').toLowerCase();
            const categoria = card.getAttribute('data-category'); // Tal cual viene del Excel

            // Lógica de coincidencia
            const matchTexto = nombre.includes(texto) || ubicacion.includes(texto);
            const matchCat = cat === 'all' || categoria.toLowerCase() === cat.toLowerCase();

            card.style.display = (matchTexto && matchCat) ? 'flex' : 'none';
        });
    }

    searchInput.addEventListener('input', filtrar);
    if(categoryFilter) categoryFilter.addEventListener('change', filtrar);
}

// --- INICIO ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargamos el shortcode de filtros (si existe filtros.js)
    if (typeof cargarFiltros === "function") cargarFiltros();
    
    // 2. Cargamos la lista de negocios
    cargarNegocios();
});
