let minutos = 4;
let segundos = 59;
cargarSegundos();

// Ejecución de los segundos:
function cargarSegundos() {
    let textSegundos;

    if (segundos < 0) {
        segundos = 59;
    }

    if (segundos < 10) {
        textSegundos = `0${segundos}`;
    } else {
        textSegundos = segundos;
    }
    document.getElementById('segundos').innerHTML = textSegundos;
    segundos--;

    cargarMinutos(segundos);
}

// Ejecución de los minutos:
function cargarMinutos(segundos) {
    let textMinutos;

    if (segundos == -1 && minutos !== 0) {
        setTimeout(() => {
            minutos--;
        }, 500);
    } else if (segundos == -1 && minutos !== 0) {
        setTimeout(() => {
            minutos = 10;
        }, 500);
    }

    if (minutos < 10) {
        textMinutos = `0${minutos}`;
    } else {
        textMinutos = minutos;
    }
    document.getElementById('minutos').innerHTML = textMinutos;

    if (segundos == 0 && minutos == 0) {
        alert("Se acabo el tiempo")
        location.reload(true);
    }
}

// Ejecución de segundos
setInterval(cargarSegundos, 1000);