window.onscroll = function() {myFunction()};

var navbar = document.querySelector('.navbar');
var sticky = navbar.offsetTop;

function myFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}

function scrollToAboutMe() {
    document.getElementById('Aboutme').scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

function goToCatalog() {
    // cambiar por la URL del catálogo
    window.location.href = 'catalogo';
}

function buscarMakerWorld() {
    const query = document.getElementById('search-3d-query').value.trim();
    if (!query) {
        alert("Por favor, escribe lo que estás buscando para iniciar la búsqueda.");
        return;
    }
    const url = `https://makerworld.com/es/search/models?keyword=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
}

function buscarCults3D() {
    const query = document.getElementById('search-3d-query').value.trim();
    if (!query) {
        alert("Por favor, escribe lo que estás buscando para iniciar la búsqueda.");
        return;
    }
    const url = `https://cults3d.com/es/b%C3%BAsqueda?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
}

function enviarPedidoWhatsApp() {
    const link = document.getElementById('client-model-link').value.trim();
    if (!link) {
        alert("Por favor, pegá el link del modelo que elegiste antes de enviar el pedido.");
        return;
    }
    const message = `¡Hola! Quiero hacer un pedido de este modelo: ${link}. Aguardo el presupuesto.`;
    const url = `https://wa.me/595982098001?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

