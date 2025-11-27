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
    // Navega en la misma pestaña a Boton2.html
    window.location.href = 'https://www.instagram.com/geekhaus.py/';
    // Si no quieres que la página anterior quede en el historial usa:
    // window.location.replace('Boton2.html');
}

