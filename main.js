/* ==========================================================================
   MAIN.JS - VERSIÓN FINAL (MODO GOOGLE + PERFIL COMPLETO)
   ========================================================================== */

// 1. CONFIGURACIÓN
const SHEET_ID = '1ew2qtysq4rwWkL7VU2MTaOv2O3tmD28kFYN5eVHCiUY'; 
const SHEET_NAME = 'negocios'; 
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// Recursos visuales
const IMAGEN_DEFECTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2364748b'%3ESin Logo%3C/text%3E%3C/svg%3E";
const HTML_LOADER = '<div class="mi-loader"></div>';

// Elementos del DOM
const container = document.getElementById('rewardsList');
const filtrosContainer = document.getElementById('shortcode-filtros');
const welcomeMsg = document.getElementById('welcomeMessage');

/* ==========================================================================
   2. SISTEMA DE RUTAS (ROUTER)
   ========================================================================== */
function manejarRuta() {
    const ruta = window.location.pathname;
    // Limpiamos la ruta para obtener el usuario (ej: "/nike" -> "nike")
    const usuarioNegocio = ruta.replace(/^\//, '').toLowerCase();

    if (usuarioNegocio && usuarioNegocio !== 'index.html') {
        // Estamos en: premios.pe/nike -> Cargar Perfil
        cargarPerfilNegocio(usuarioNegocio);
    } else {
        // Estamos en: premios.pe -> Cargar Directorio (Buscador)
        cargarDirectorio();
    }
}

// Navegación SPA (Sin recargar)
function irANegocio(usuario) {
    history.pushState(null, null, `/${usuario}`);
    manejarRuta();
}

window.addEventListener('popstate', manejarRuta);


/* ==========================================================================
   3. MODO DIRECTORIO (LISTA SIMPLE TIPO GOOGLE)
   ========================================================================== */
async function cargarDirectorio() {
    // 1. Preparamos la vista
    if (filtrosContainer) filtrosContainer.style.display = 'block'; // Mostrar buscador grande
    if (welcomeMsg) welcomeMsg.style.display = 'none';
    
    container.innerHTML = HTML_LOADER;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        container.innerHTML = ''; 

        // 2. Ordenamos alfabéticamente (A-Z)
        data.sort((a, b) => a.nombre.localeCompare(b.nombre));

        // 3. Renderizamos la lista simple
        data.forEach(negocio => {
            // Nota: Agregamos la clase 'business-card' para que el filtro funcione, 
            // pero visualmente usará la clase 'simple-item' del CSS nuevo.
            const itemHTML = `
                <div class="simple-item business-card" 
                    data-name="${negocio.nombre}"
                    onclick="irANegocio('${negocio.usuario}')">
                    
                    <span class="business-name">${negocio.nombre}</span>
                    <span style="color:#ccc; font-size:1.2rem;">›</span>
                </div>
            `;
            container.innerHTML += itemHTML;
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="text-align:center; color:red;">Error cargando directorio.</p>';
    }
}


/* ==========================================================================
   4. MODO PERFIL DE NEGOCIO (VISTA INTERNA)
   ========================================================================== */
async function cargarPerfilNegocio(usuarioSlug) {
    // 1. Ocultamos el buscador de la portada
    if (filtrosContainer) filtrosContainer.style.display = 'none';
    
    container.innerHTML = HTML_LOADER;

    try {
        // A. Buscamos el negocio en la tabla maestra
        const response = await fetch(API_URL);
        const negocios = await response.json();
        const negocio = negocios.find(n => n.usuario && n.usuario.toLowerCase() === usuarioSlug);

        if (!negocio) {
            container.innerHTML = '<h2 style="text-align:center; margin-top:50px;">Negocio no encontrado</h2><div style="text-align:center"><button onclick="irANegocio(\'\')" style="padding:10px 20px; margin-top:20px; cursor:pointer;">Volver al Inicio</button></div>';
            return;
        }

        // B. Obtenemos el ID del Sheet del Cliente
        const idHojaExterna = negocio.tabla_premios_clientes; 

        if (!idHojaExterna) {
            container.innerHTML = `<h2 style="text-align:center;">${negocio.nombre}</h2><p style="text-align:center;">Este negocio aún no ha configurado sus premios.</p>`;
            return;
        }

        // C. Generamos el Header (Logo + Info + Buscador Puntos)
        let urlLogo = (negocio.logo && negocio.logo.trim() !== '') ? negocio.logo : generarAvatar(negocio.nombre);
        
        let headerHTML = `
            <div style="text-align:center; margin-bottom:30px; padding: 20px 0; border-bottom: 1px solid #f1f3f4; animation: aparecer 0.5s ease-out;">
                <img src="${urlLogo}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; margin-bottom:15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                
                <h1 style="margin:0; font-size:2rem; color:var(--text-dark);">${negocio.nombre}</h1>
                <p style="color:var(--text-gray); margin:5px 0 20px 0;">${negocio.distrito} - ${negocio.provincia}</p>
                
                <div style="max-width:400px; margin:0 auto; display:flex; gap:10px;">
                    <input type="number" id="inputDNI" placeholder="Ingresa tu DNI..." style="flex:1; padding:12px; border-radius:24px; border:1px solid #dfe1e5; outline:none; padding-left: 20px;">
                    <button onclick="consultarPuntos('${idHojaExterna}')" style="background:var(--primary); color:white; border:none; padding:0 24px; border-radius:24px; cursor:pointer; font-weight:600;">Ver Puntos</button>
                </div>
                <div id="resultadoPuntos" style="margin-top:15px; font-weight:bold; color:var(--primary); min-height: 24px;"></div>
            </div>
            
            <h3 style="margin-bottom:20px; color:var(--text-gray); font-size: 1.2rem;">Catálogo de Premios</h3>
            
            <div id="listaPremiosNegocio" class="rewards-container">
                ${HTML_LOADER} 
            </div>
        `;

        container.innerHTML = headerHTML;

        // D. Cargamos los premios de la hoja externa
        cargarPremiosDeNegocio(idHojaExterna);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="text-align:center; color:red;">Error cargando el perfil.</p>';
    }
}


/* ==========================================================================
   5. CARGAR PREMIOS (TABLA EXTERNA)
   ========================================================================== */
async function cargarPremiosDeNegocio(sheetId) {
    const urlPremios = `https://opensheet.elk.sh/${sheetId}/premios`;
    const divLista = document.getElementById('listaPremiosNegocio');

    try {
        const res = await fetch(urlPremios);
        const premios = await res.json();

        divLista.innerHTML = ''; // Limpiar loader

        if(premios.length === 0) {
            divLista.innerHTML = '<p style="text-align:center; width:100%; color:#888;">No hay premios disponibles.</p>';
            return;
        }

        premios.forEach(premio => {
            // Renderizamos TARJETAS bonitas para los premios
            const card = `
                <article class="reward-card" onclick="abrirModal({
                        imagen: '${premio.imagen || IMAGEN_DEFECTO}',
                        titulo: '${premio.nombre}',
                        puntos: '${premio.puntos}',
                        negocio: 'Canje',
                        categoria: '${premio.categoria}',
                        descripcion: '${premio.descripcion_larga || premio.descripcion_corta}'
                    })">
                    
                    <div class="reward-image">
                        <img src="${premio.imagen}" onerror="this.src='${IMAGEN_DEFECTO}'">
                    </div>
                    <div class="reward-content">
                        <div class="reward-vendor">${premio.categoria || 'General'}</div>
                        <h3 class="reward-title">${premio.nombre}</h3>
                        <span class="reward-points">${premio.puntos} Puntos</span>
                        <p class="reward-desc">${premio.descripcion_corta || ''}</p>
                    </div>
                </article>
            `;
            divLista.innerHTML += card;
        });

    } catch (e) {
        divLista.innerHTML = '<p style="color:red">Error cargando lista de premios.</p>';
    }
}


/* ==========================================================================
   6. CONSULTAR PUNTOS (TABLA EXTERNA)
   ========================================================================== */
async function consultarPuntos(sheetId) {
    const dniInput = document.getElementById('inputDNI');
    const resultadoDiv = document.getElementById('resultadoPuntos');
    const dniBuscado = dniInput.value.trim();

    if(!dniBuscado) {
        resultadoDiv.innerHTML = '<span style="color:red">Escribe tu DNI</span>';
        return;
    }

    resultadoDiv.innerHTML = '<span style="color:#64748b">Buscando...</span>';
    
    // Conectar a la pestaña 'clientes'
    const urlClientes = `https://opensheet.elk.sh/${sheetId}/clientes`;

    try {
        const res = await fetch(urlClientes);
        const clientes = await res.json();

        // Búsqueda flexible (DNI, dni, Dni) y comparando texto vs texto
        const cliente = clientes.find(c => {
            const valorEnFila = c.dni || c.DNI || c.Dni;
            return String(valorEnFila).trim() === String(dniBuscado);
        });

        if(cliente) {
            const puntos = cliente.puntos || cliente.Puntos || 0;
            resultadoDiv.innerHTML = `✅ El DNI ${dniBuscado} tiene <b>${puntos}</b> Puntos.`;
        } else {
            resultadoDiv.innerHTML = `<span style="color:#64748b">No encontramos puntos para el DNI ${dniBuscado}.</span>`;
        }

    } catch (e) {
        console.error(e);
        resultadoDiv.innerHTML = 'Error de conexión con la base de datos.';
    }
}


/* ==========================================================================
   7. UTILIDADES
   ========================================================================== */

// Filtrado del Buscador Principal
function filtrarNegocios() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const texto = searchInput.value.toLowerCase();
    const items = document.querySelectorAll('.business-card');

    items.forEach(item => {
        const nombre = item.getAttribute('data-name').toLowerCase();
        // Mostrar si el nombre contiene el texto buscado
        if (nombre.includes(texto)) {
            item.style.display = 'flex'; // 'flex' para mantener el layout del simple-item
        } else {
            item.style.display = 'none';
        }
    });
}

// Generador de Logo Automático
function generarAvatar(nombre) {
    const n = nombre ? nombre.replace(/\s+/g, '+') : 'Negocio';
    return `https://ui-avatars.com/api/?name=${n}&background=random&color=fff&size=150&bold=true`;
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar el HTML del buscador (si usas filtros.js)
    if (typeof cargarFiltros === "function") cargarFiltros();
    
    // 2. Iniciar el router para decidir qué mostrar
    manejarRuta();
});
