// Supabase Configuration
// Reemplaza estos valores con las credenciales de tu proyecto en Supabase (Settings -> API)
const SUPABASE_URL = 'https://ewbuylsdyfukgvxwxmpi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YnV5bHNkeWZ1a2d2eHd4bXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMzA5MjIsImV4cCI6MjA5NjYwNjkyMn0.tC_bDRUuFtXNUcKXNVQVYhFhQWCbNlVtuaTYsetrC8o';

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        title: "Impresiones 3D",
        description: "Figuras coleccionables, prototipos, componentes de robótica y piezas personalizadas bajo pedido.",
        image: "",
        icon: "fa-cubes-three-d",
        price: "A convenir"
    },
    {
        id: 2,
        title: "Mangas y Cómics",
        description: "Historietas, tomos y ediciones especiales de tus series y sagas preferidas para expandir tu colección.",
        image: "",
        icon: "fa-book-open",
        price: "Desde Gs. 35.000"
    },
    {
        id: 3,
        title: "Decoración y Stickers",
        description: "Pósters en alta definición y stickers de vinilo perfectos para personalizar todos tus espacios y accesorios.",
        image: "",
        icon: "fa-palette",
        price: "Desde Gs. 5.000"
    }
];

const ADMIN_PASSWORD_HASH = 'bb6478238080e4322cccf4a6f501bccf48564adb54aa1ec8a073411ad9807329'; // Hash de 'geekhaus2026'

let products = [];
let isAdmin = false;
let uploadedBase64 = ''; // Almacena temporalmente la imagen subida/pegada en Base64

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check if admin session is already active
    isAdmin = sessionStorage.getItem('geekhaus_admin') === 'true';
    if (isAdmin) {
        showAdminView();
    }

    // 2. Setup interactive image upload listeners (drag & drop, paste, click)
    setupImageUpload();

    // 3. Load products from Supabase
    await loadProducts();

    // 4. Render
    renderCatalog();
});

// Load products from Supabase (or Fallback if not configured)
async function loadProducts() {
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_KEY === 'YOUR_SUPABASE_ANON_KEY') {
        console.warn("Supabase no está configurado. Usando productos por defecto.");
        products = [...DEFAULT_PRODUCTS];
        return;
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (response.ok) {
            products = await response.json();
            console.log("Productos cargados exitosamente de Supabase:", products);
        } else {
            throw new Error(`Error en respuesta: ${response.statusText}`);
        }
    } catch (err) {
        console.error("Error al conectar con Supabase. Usando productos por defecto:", err);
        products = [...DEFAULT_PRODUCTS];
    }
}

// Render dynamic catalog cards
function renderCatalog() {
    const container = document.getElementById('catalog-grid-container');
    if (!container) return;

    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; color: #888;">No hay productos disponibles en el catálogo.</p>';
        return;
    }

    products.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'carta catalog-card';

        // Media display (image or icon placeholder)
        let mediaHtml = '';
        if (prod.image && prod.image.trim() !== '') {
            mediaHtml = `
                <div class="card-img-placeholder img-container">
                    <img src="${prod.image}" alt="${prod.title}" class="catalog-card-img">
                </div>
            `;
        } else {
            const iconClass = prod.icon || 'fa-cubes-three-d';
            mediaHtml = `
                <div class="card-img-placeholder">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
            `;
        }

        // WhatsApp redirect message link with price
        const priceSuffix = prod.price ? ` (Precio: ${prod.price})` : '';
        const encodedText = encodeURIComponent(`¡Hola! Me interesa el producto: ${prod.title}${priceSuffix}.`);
        const waLink = `https://wa.me/595982098001?text=${encodedText}`;

        // Admin-only elements
        const adminHtml = isAdmin ? `
            <button class="delete-btn" onclick="deleteProduct(${prod.id})">
                <i class="fa-solid fa-trash"></i> Eliminar
            </button>
        ` : '';

        // Display price in card
        const priceHtml = prod.price ? `<div class="card-price">${prod.price}</div>` : '';

        card.innerHTML = `
            ${mediaHtml}
            <h3>${prod.title}</h3>
            ${priceHtml}
            <p>${prod.description}</p>
            <a href="${waLink}" target="_blank" class="btn-card">Consultar</a>
            ${adminHtml}
        `;

        container.appendChild(card);
    });
}

// Toggle Admin Panel / Login Modal
function toggleAdminPanel() {
    if (isAdmin) {
        const panel = document.getElementById('admin-control-panel');
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            panel.scrollIntoView({ behavior: 'smooth' });
        } else {
            panel.style.display = 'none';
        }
    } else {
        document.getElementById('admin-login-modal').style.display = 'flex';
        document.getElementById('admin-password-input').focus();
    }
}

function closeLoginModal() {
    document.getElementById('admin-login-modal').style.display = 'none';
    document.getElementById('login-error-msg').style.display = 'none';
    document.getElementById('admin-password-input').value = '';
}

// SHA-256 helper
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function loginAdmin() {
    const input = document.getElementById('admin-password-input').value;
    const errorMsg = document.getElementById('login-error-msg');
    
    const hashed = await hashPassword(input);
    
    if (hashed === ADMIN_PASSWORD_HASH) {
        isAdmin = true;
        sessionStorage.setItem('geekhaus_admin', 'true');
        sessionStorage.setItem('geekhaus_admin_hash', hashed); // Almacenamos el hash para las consultas RPC
        closeLoginModal();
        showAdminView();
        renderCatalog(); // Re-render para mostrar botones de borrar
    } else {
        errorMsg.style.display = 'block';
    }
}

function showAdminView() {
    const fab = document.getElementById('admin-fab');
    if (fab) {
        fab.innerHTML = '<i class="fa-solid fa-lock-open"></i>';
        fab.style.background = '#28a745';
        fab.style.color = '#fff';
    }
    
    document.getElementById('admin-control-panel').style.display = 'block';
}

function logoutAdmin() {
    isAdmin = false;
    sessionStorage.removeItem('geekhaus_admin');
    sessionStorage.removeItem('geekhaus_admin_hash');
    
    const fab = document.getElementById('admin-fab');
    if (fab) {
        fab.innerHTML = '<i class="fa-solid fa-lock"></i>';
        fab.style.background = '#ffbf00';
        fab.style.color = '#111';
    }
    
    document.getElementById('admin-control-panel').style.display = 'none';
    renderCatalog();
}

// Add Product to Supabase
async function addNewProduct() {
    const title = document.getElementById('new-prod-title').value.trim();
    const desc = document.getElementById('new-prod-desc').value.trim();
    const urlImg = document.getElementById('new-prod-image').value.trim();
    const icon = document.getElementById('new-prod-icon').value;
    const price = document.getElementById('new-prod-price').value.trim();

    // Priorizar la imagen local subida/pegada en Base64, sino usar la URL de internet
    const img = uploadedBase64 || urlImg;

    if (!title || !desc) {
        alert("Por favor rellena el título y la descripción.");
        return;
    }

    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_KEY === 'YOUR_SUPABASE_ANON_KEY') {
        alert("Supabase no está configurado. Configura las credenciales en catalogo.js para poder guardar.");
        return;
    }

    const currentHash = sessionStorage.getItem('geekhaus_admin_hash') || '';

    try {
        // Llamada RPC segura a la base de datos de Supabase
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/add_product_secure`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                p_password_hash: currentHash,
                p_title: title,
                p_description: desc,
                p_image: img,
                p_icon: icon,
                p_price: price
            })
        });

        if (response.ok) {
            console.log("Producto agregado exitosamente a Supabase.");
            // Recargar catálogo y limpiar formulario
            await loadProducts();
            renderCatalog();
            
            document.getElementById('new-prod-title').value = '';
            document.getElementById('new-prod-desc').value = '';
            document.getElementById('new-prod-price').value = '';
            clearImageUpload(); // Restablecer la carga de imagen
        } else {
            const errDetail = await response.text();
            throw new Error(`Error en la base de datos: ${errDetail}`);
        }
    } catch (err) {
        console.error("Error al agregar el producto:", err);
        alert("Hubo un error al agregar el producto a la base de datos. Verifica la consola.");
    }
}

// Configurar triggers para la carga interactiva de imágenes (drag & drop, paste, click)
function setupImageUpload() {
    const container = document.getElementById('image-upload-container');
    const fileInput = document.getElementById('new-prod-file');
    const urlInput = document.getElementById('new-prod-image');
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('upload-placeholder');
    const controls = document.getElementById('image-preview-controls');

    if (!container || !fileInput) return;

    // Hacer clic en el contenedor abre la selección de archivos
    container.addEventListener('click', (e) => {
        // Solo abrir el diálogo si no se hizo clic en uno de los botones de control
        if (e.target.tagName !== 'BUTTON') {
            fileInput.click();
        }
    });

    // Escuchar la selección de archivos (galería, cámara, etc.)
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleSelectedFile(file);
        }
    });

    // Drag & Drop
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.classList.add('dragover');
    });

    container.addEventListener('dragleave', () => {
        container.classList.remove('dragover');
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleSelectedFile(file);
        }
    });

    // Escuchar el evento de pegar (Ctrl+V) globalmente cuando el panel de administrador está visible
    document.addEventListener('paste', (e) => {
        if (!isAdmin) return;
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                handleSelectedFile(file);
                break;
            }
        }
    });

    // Escuchar el input de la URL para mostrar vista previa en vivo
    urlInput.addEventListener('input', () => {
        const url = urlInput.value.trim();
        if (url) {
            preview.src = url;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
            if (controls) controls.style.display = 'flex';
            
            // Si hay una URL de internet, borrar cualquier imagen local previamente cargada
            fileInput.value = '';
            uploadedBase64 = '';
        } else {
            if (!uploadedBase64) {
                clearImageUpload();
            }
        }
    });
}

// Procesar el archivo seleccionado, arrastrado o pegado
function handleSelectedFile(file) {
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('upload-placeholder');
    const controls = document.getElementById('image-preview-controls');
    const urlInput = document.getElementById('new-prod-image');

    const reader = new FileReader();
    reader.onload = function(event) {
        // Comprimir la imagen antes de subirla para no saturar la base de datos (max 800x800px)
        compressImage(event.target.result, 800, 800, 0.7, (compressedBase64) => {
            uploadedBase64 = compressedBase64;
            preview.src = compressedBase64;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
            if (controls) controls.style.display = 'flex';
            urlInput.value = ''; // La imagen local toma prioridad
        });
    };
    reader.readAsDataURL(file);
}

// Redimensionamiento y compresión de imagen usando HTML5 Canvas (salida JPEG comprimida)
function compressImage(base64Str, maxWidth, maxHeight, quality, callback) {
    const img = new Image();
    img.src = base64Str;
    img.onload = function() {
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo relación de aspecto
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
            }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a base64 JPEG con la calidad indicada
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        callback(compressedBase64);
    };
}

// Girar la imagen cargada 90 grados a la derecha
window.rotateImage90Deg = function() {
    const preview = document.getElementById('image-preview');
    const urlInput = document.getElementById('new-prod-image');
    const activeImage = uploadedBase64 || urlInput.value.trim();

    if (!activeImage) return;

    const img = new Image();
    img.src = activeImage;
    img.onload = function() {
        const canvas = document.createElement('canvas');
        // Intercambiar dimensiones para rotación de 90 grados
        canvas.width = img.height;
        canvas.height = img.width;

        const ctx = canvas.getContext('2d');
        // Trasladar origen al centro de rotación y rotar
        ctx.translate(canvas.width, 0);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(img, 0, 0);

        // Generar nuevo base64
        const rotatedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        uploadedBase64 = rotatedBase64;
        
        if (preview) {
            preview.src = rotatedBase64;
        }
        
        // Si originalmente era una URL externa, ahora pasa a ser base64 local
        urlInput.value = '';
    };
};

// Limpiar la imagen o URL seleccionada
window.clearImageUpload = function() {
    const fileInput = document.getElementById('new-prod-file');
    const urlInput = document.getElementById('new-prod-image');
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('upload-placeholder');
    const controls = document.getElementById('image-preview-controls');

    if (fileInput) fileInput.value = '';
    if (urlInput) urlInput.value = '';
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }
    if (placeholder) placeholder.style.display = 'block';
    if (controls) controls.style.display = 'none';
    uploadedBase64 = '';
}

// Delete Product from Supabase
async function deleteProduct(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto de la base de datos?")) {
        return;
    }

    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_KEY === 'YOUR_SUPABASE_ANON_KEY') {
        alert("Supabase no está configurado.");
        return;
    }

    const currentHash = sessionStorage.getItem('geekhaus_admin_hash') || '';

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/delete_product_secure`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                p_password_hash: currentHash,
                p_id: id
            })
        });

        if (response.ok) {
            console.log("Producto eliminado exitosamente.");
            await loadProducts();
            renderCatalog();
        } else {
            const errDetail = await response.text();
            throw new Error(`Error en la base de datos: ${errDetail}`);
        }
    } catch (err) {
        console.error("Error al eliminar el producto:", err);
        alert("Hubo un error al eliminar el producto. Verifica la consola.");
    }
}
