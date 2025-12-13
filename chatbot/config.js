window.CHAT_CONFIG = {
    // === FUENTE DE DATOS EXTERNA ÚNICA ===
    data_source_url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUfzxFN8E2Wr4oRtEd7ivk-yn8dxMB4e8Bs30WTXwd6Ihn7CclMwhru8LczHDmswNoEXHNmtjgc1_O/pub?gid=0&single=true&output=csv", 

    // === CONFIGURACIÓN DE CACHÉ ===
    // Tiempo de vida de la caché local, en horas (Time To Live - TTL). 
    // Después de este tiempo, el chat volverá a cargar la base de datos desde Google Sheets.
    cache_ttl_hours: 4, 

    // === IDENTIDAD ===
    titulo: "Frankos Chicken & Grill 🍗",
    colorPrincipal: "#ea580c", 
    saludoInicial: "¡Hola! Bienvenido a Frankos Chicken. Soy Fedeliza. ¿Qué se te antoja hoy? 🍗",
    placeholder: "Escribe 'carta', 'precio' o selecciona una opción...",
    whatsapp: "51999999999", 

    // === SUGERENCIAS RÁPIDAS (Botones que activan las reglas) ===
    sugerencias_rapidas: [
        { texto: "Ver Carta", accion: "carta" },
        { texto: "Precios de Pollo", accion: "precio" },
        { texto: "Delivery", accion: "delivery" },
        { texto: "Horario", accion: "horario" }
    ],
    
    // NOTA: La sección 'personalidad' se cargará aquí dinámicamente desde la URL.
};
