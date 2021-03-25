$(document).ready(function() {

    // Objetos
    var Palabra = new Object(),
        filaInicio = 0,
        columnaInicio = 0,
        filaFin = 0,
        columnaFin = 0,
        celdaInicio = null,
        celdaFin = null,

        posFila = 0,
        posColumna = 0,
        longitud = 0,
        texto = 0,
        direccion = 0;

    var celdasInicio = [];
    var celdasFin = [];
    var posFilaInicio = [];
    var posColumnaInicio = [];
    var direcciones = [];
    var posFilaFin = [];
    var posColumnaFin = [];

    var palabrasOriginales = [];
    var palabrasRestantes = [];
    var palabrasDescubiertas = [];
    var contadorPalabras = 0;

    var contadorSeleccionadas = 0;
    var celdaUno = null, celdaDos = null;

    var sopaGenerada = false;

    function saberCelda(event) {
        if (sopaGenerada) {
            if (palabrasOriginales.length != palabrasDescubiertas.length) {
                var fuenteEvento = event.target;
                if (!fuenteEvento.classList.contains('celdaCorrecta')) {
                    if (fuenteEvento.classList.length == 0) {
                        $(fuenteEvento).addClass('celdaSeleccionada');
                        if (celdaUno == null)
                            celdaUno = fuenteEvento;
                        else
                            celdaDos = fuenteEvento;
                        contadorSeleccionadas++;
                    } else if (fuenteEvento.classList.contains('celdaSeleccionada')) {
                        $(fuenteEvento).removeClass('celdaSeleccionada');
                        contadorSeleccionadas--;
                        celdaUno = null;
                    }
                    if (contadorSeleccionadas == 2) {
                        var incorrecta = true;
                        for (var i = 0; i < palabrasOriginales.length; i++) {
                            if (celdasInicio[i] == celdaUno && celdasFin[i] == celdaDos) {
                                marcarPalabraCorrecta(palabrasOriginales[i]);
                                incorrecta = false;
                                break;
                            }
                        }

                        if (incorrecta) {
                            //setTimeout(function() {
                                $(celdaUno).removeClass('celdaSeleccionada');
                                $(celdaUno).addClass('celdaIncorrecta');
                                $(celdaDos).removeClass('celdaSeleccionada');
                                $(celdaDos).addClass('celdaIncorrecta');
                            //}, 1000);
                            setTimeout(function() {
                                alert('The choosen word is not correct.')
                                $(celdaUno).removeClass('celdaIncorrecta');
                                $(celdaDos).removeClass('celdaIncorrecta');
                                celdaUno = null;
                                celdaDos = null;
                                contadorSeleccionadas = 0;
                            }, 200);
                        } else {
                            $(celdaUno).removeClass('celdaSeleccionada');
                            $(celdaDos).removeClass('celdaSeleccionada');
                            celdaUno = null;
                            celdaDos = null;
                            contadorSeleccionadas = 0;
                        }
                        
                    }
                }
            } else {
                if (confirm('Felicidades has completado la sopa de letras. Si quieres volver a jugar selecciona el botón <<Aceptar>>.'))
                    location.reload(true);
            }
        } else
            alert('No se puede empezar el juego, hasta que no agregues las palabras y selecciones el botón <<AÑADIR>>');
    }

    function anadirPalabra() {
        var palabra = document.getElementById('palabraNueva').value;
        if (palabrasOriginales.length < 15 && !sopaGenerada) {
            if (palabra.length >= 2 && palabra.length <= 10 && !palabra.includes(' ') && !palabra.includes('-') &&
        !palabra.includes(',') && !palabra.includes('.') && !palabra.includes('!') && !palabra.includes('¡') &&
        !palabra.includes('¿') && !palabra.includes('?') && !palabra.includes('_') && !palabra.includes(':') &&
        !palabra.includes(';')) {
                anadirPalabraLista(palabra);
                if (document.getElementById('jugar').disabled == true)
                    document.getElementById('jugar').disabled = false;
                document.getElementById('palabraNueva').value = "";
            } else
                alert('Necesitas escribir una palabra con al menos 2 y maximo de 10 caracteres.\n No se puede utilizar espacios o caracteres especiales.');
        } else
            alert('El limite de la palabra es de 15 caracteres.');
    }

    function anadirPalabraLista(palabraLista) {
        palabraLista = palabraLista.toUpperCase();
        palabrasOriginales.push(palabraLista);
        var palabra = '';
        contadorPalabras++;
        if (contadorPalabras % 2 != 0)
            palabra += '<div id="' + contadorPalabras + '" class="palabra impar">' + palabraLista + '</div>';
        else
            palabra += '<div id="' + contadorPalabras + '" class="palabra par">' + palabraLista + '</div>';
        // Añadimos el HTML generado
        $('div#lista').append(palabra);
    }

    function generarTabla() {
        var tabla = '';
        for (var i = 0; i < 15; i++) {
            tabla += '<div class="fila">'
            for (var j = 0; j < 15; j++)
                tabla += '<div></div>';
            tabla += '\n</div>';
        }
        // Añadimos el HTML generado
        $('div#tabla').html(tabla);
        document.getElementById('jugar').addEventListener("click", jugar);
        document.getElementById('anadir').addEventListener("click", anadirPalabra);
        document.getElementById('help').addEventListener("click", ayudarProfesor);
        asignarEvento();
    }

    function obtenerCelda(numFila, numColumna) {
        if (numFila > 0 && numFila <= 15 && numColumna > 0 && numColumna <= 15) {
            // Buscamos la fila
            var fila = 'div#tabla div';
            for (var i = 1; i < numFila; i++)
                fila = $(fila).next();
            // Buscamos la columna
            var columna = $(fila).children()[numColumna - 1];

            return columna;
        } else {
            alert('Something went wrong.');
            return null;
        }
    }

    function asignarEvento() {
        $("div#tabla div.fila div").on( "click", saberCelda);
    }

    generarTabla();

    

    obtenerCelda(3, 3);

    function anadirPalabraSopa(palabra) {
        palabra = palabra.toUpperCase();
        var creada = false;
        var longitud = palabra.length;
        while (!creada) {
            var posFila = parseInt((Math.random() * 15 + 1));
            var posColumna = parseInt((Math.random() * 15 + 1));
            var direccion = parseInt((Math.random() * 8 + 1));
            switch (direccion) {
                case 1:
                    // 1: arr
                    if (posFila - longitud > 0)
                        creada = true;
                    break;
                case 2:
                    // 2: arr-der
                    if (posFila - longitud > 0 && posColumna + longitud < 15)
                        creada = true;
                    break;
                case 3:
                    // 3: der
                    if (posColumna + longitud < 15)
                        creada = true;
                    break;
                case 4:
                    // 4: aba-der
                    if (posFila + longitud < 15 && posColumna + longitud < 15)
                        creada = true;
                    break;
                case 5:
                    // 5: aba
                    if (posFila + longitud < 15)
                        creada = true;
                    break;
                case 6:
                    // 6: aba-izq
                    if (posFila + longitud < 15 && posColumna - longitud > 0)
                        creada = true;
                    break;
                case 7:
                    // 7: izq
                    if (posColumna - longitud > 0)
                        creada = true;
                    break;
                case 8:
                    // 8: arr-izq
                    if (posFila - longitud > 0 && posColumna - longitud > 0)
                        creada = true;
                    break;
            }

            // No habría que marcar, hay que añadirla comprobando que no haya otra.
            if (creada) {
                var hayOtra = comprobarSiHayOtraPalabra(longitud, posFila, posColumna, direccion);
                if (hayOtra)
                    creada = false;
            }
        }
        escribirPalabraSopa(palabra, posFila, posColumna, direccion);
    }

    function escribirPalabraSopa(palabra, posFila, posColumna, direccion) {
        palabra = palabra.toUpperCase();
        var posicion = -3;
        for (var i = 0; i < palabrasOriginales.length; i++) {
            if (palabrasOriginales[i] == palabra) {
                posicion = i;
                break;
            }
        }
        palabrasOriginales[posicion].filaInicio = posFila;
        palabrasOriginales[posicion].columnaInicio = posColumna;
        celdasInicio[posicion] = obtenerCelda(posFila, posColumna);
        posFilaInicio[posicion] = posFila;
        posColumnaInicio[posicion] = posColumna;
        direcciones[posicion] = direccion;
        var indice = 0;
        var longitud = palabra.length;
        obtenerCelda(posFila, posColumna).innerHTML = palabra.charAt(indice);
        while (indice < longitud - 1) {
            switch (direccion) {
                case 1:
                    // 1: arr
                    posFila--;
                    break;
                case 2:
                    // 2: arr-der
                    posFila--; posColumna++;
                    break;
                case 3:
                    // 3: der
                    posColumna++;
                    break;
                case 4:
                    // 4: aba-der
                    posFila++; posColumna++;
                    break;
                case 5:
                    // 5: aba
                    posFila++;
                    break;
                case 6:
                    // 6: aba-izq
                    posFila++; posColumna--;
                    break;
                case 7:
                    // 7: izq
                    posColumna--;
                    break;
                case 8:
                    // 8: arr-izq
                    posFila--; posColumna--;
                    break;
            }
            indice++;
            obtenerCelda(posFila, posColumna).innerHTML = palabra.charAt(indice);
        }
        palabrasOriginales[posicion].filaFin = posFila;
        palabrasOriginales[posicion].columnaFin = posColumna;
        celdasFin[posicion] = obtenerCelda(posFila, posColumna);
        posFilaFin[posicion] = posFila;
        posColumnaFin[posicion] = posColumna;
    }

    function comprobarSiHayOtraPalabra(longitud, posFila, posColumna, direccion) {
        var hayOtra = false;
        while (longitud > 1) {
            switch (direccion) {
                case 1:
                    // 1: arr
                    posFila--;
                    break;
                case 2:
                    // 2: arr-der
                    posFila--; posColumna++;
                    break;
                case 3:
                    // 3: der
                    posColumna++;
                    break;
                case 4:
                    // 4: aba-der
                    posFila++; posColumna++;
                    break;
                case 5:
                    // 5: aba
                    posFila++;
                    break;
                case 6:
                    // 6: aba-izq
                    posFila++; posColumna--;
                    break;
                case 7:
                    // 7: izq
                    posColumna--;
                    break;
                case 8:
                    // 8: arr-izq
                    posFila--; posColumna--;
                    break;
            }
            if ($(obtenerCelda(posFila, posColumna)).html().length > 0)
                return true;
            longitud--;
        }
        return false;
    }

    function rellenarSopa() {
        var letras = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'Y', 'Z');
        for (var i = 1; i <= 15; i++) {
            for (var j = 1; j <= 15; j++) {
                var celda = obtenerCelda(i, j);
                if ($(celda).html().length == 0) {
                    var aleatorio = Math.floor(Math.random() * letras.length);
                    celda.innerHTML = letras[aleatorio];
                }
            }
        }
        sopaGenerada = true;
    }

    function ayudarProfesor() {
        if (sopaGenerada) {
            for (var i = 0; i < palabrasOriginales.length; i++) {
                var palabrita = palabrasOriginales[i];
                var indice = i;
                for (var j = 0; j < palabrasDescubiertas.length; j++) {
                    if (palabrita == palabrasDescubiertas[j]) {
                        palabrita = null;
                        break;
                    }
                }
                if (palabrita != null)
                    marcarPalabraTemporalmente(palabrita, posFilaInicio[indice], posColumnaInicio[indice], direcciones[indice]);
            }
            setTimeout(function() {
                for (var i = 0; i < palabrasOriginales.length; i++) {
                    var palabrita = palabrasOriginales[i];
                    var indice = i;
                    for (var j = 0; j < palabrasDescubiertas.length; j++) {
                        if (palabrita == palabrasDescubiertas[j]) {
                            palabrita = null;
                            break;
                        }
                    }
                    if (palabrita != null)
                        eliminarMarcadoTemporal(palabrita, posFilaInicio[indice], posColumnaInicio[indice], direcciones[indice])
                }
            }, 500);
        }
    }

    function eliminarMarcadoTemporal(palabra, posFila, posColumna, direccion) {
        palabra = palabra.toUpperCase();
        longitud = palabra.length;
        var celda = obtenerCelda(posFila, posColumna);
        $(celda).removeClass('celdaAyudaProfesor');
        while (longitud > 1) {
            switch (direccion) {
                case 1:
                    // 1: arr
                    posFila--;
                    break;
                case 2:
                    // 2: arr-der
                    posFila--; posColumna++;
                    break;
                case 3:
                    // 3: der
                    posColumna++;
                    break;
                case 4:
                    // 4: aba-der
                    posFila++; posColumna++;
                    break;
                case 5:
                    // 5: aba
                    posFila++;
                    break;
                case 6:
                    // 6: aba-izq
                    posFila++; posColumna--;
                    break;
                case 7:
                    // 7: izq
                    posColumna--;
                    break;
                case 8:
                    // 8: arr-izq
                    posFila--; posColumna--;
                    break;
            }
            celda = obtenerCelda(posFila, posColumna);
            $(celda).removeClass('celdaAyudaProfesor');
            longitud--;
        }
    }

    function marcarPalabraTemporalmente(palabra, posFila, posColumna, direccion) {
        palabra = palabra.toUpperCase();
        longitud = palabra.length;
        var celda = obtenerCelda(posFila, posColumna);
        $(celda).addClass('celdaAyudaProfesor');
        while (longitud > 1) {
            switch (direccion) {
                case 1:
                    // 1: arr
                    posFila--;
                    break;
                case 2:
                    // 2: arr-der
                    posFila--; posColumna++;
                    break;
                case 3:
                    // 3: der
                    posColumna++;
                    break;
                case 4:
                    // 4: aba-der
                    posFila++; posColumna++;
                    break;
                case 5:
                    // 5: aba
                    posFila++;
                    break;
                case 6:
                    // 6: aba-izq
                    posFila++; posColumna--;
                    break;
                case 7:
                    // 7: izq
                    posColumna--;
                    break;
                case 8:
                    // 8: arr-izq
                    posFila--; posColumna--;
                    break;
            }
            celda = obtenerCelda(posFila, posColumna);
            $(celda).addClass('celdaAyudaProfesor');
            longitud--;
        }
    }

    function marcarPalabraCorrecta(palabra) {
        tacharPalabraLista(palabra);
        palabrasDescubiertas.push(palabra);
        var indice = -3;
        for (var i = 0; i < palabrasOriginales.length; i++) {
            if (palabrasOriginales[i] == palabra) {
                indice = i;
                break;
            }
        }
        marcarPalabraSeleccionada(palabra, posFilaInicio[indice], posColumnaInicio[indice], direcciones[indice]);
        setTimeout(function() {
            if (palabrasDescubiertas.length == palabrasOriginales.length) {
                if (confirm('Felicidades has completado la sopa de letras. Si quieres volver a jugar selecciona el botón <<Aceptar>>. \n ¿Quieres volver a intentarlo?'))
                    location.reload(true);
            }
        }, 1000);
    }

    function marcarPalabraSeleccionada(palabra, posFila, posColumna, direccion) {
        palabra = palabra.toUpperCase();
        longitud = palabra.length;
        var celda = obtenerCelda(posFila, posColumna);
        $(celda).addClass('celdaCorrecta');
        while (longitud > 1) {
            switch (direccion) {
                case 1:
                    // 1: arr
                    posFila--;
                    break;
                case 2:
                    // 2: arr-der
                    posFila--; posColumna++;
                    break;
                case 3:
                    // 3: der
                    posColumna++;
                    break;
                case 4:
                    // 4: aba-der
                    posFila++; posColumna++;
                    break;
                case 5:
                    // 5: aba
                    posFila++;
                    break;
                case 6:
                    // 6: aba-izq
                    posFila++; posColumna--;
                    break;
                case 7:
                    // 7: izq
                    posColumna--;
                    break;
                case 8:
                    // 8: arr-izq
                    posFila--; posColumna--;
                    break;
            }
            celda = obtenerCelda(posFila, posColumna);
            $(celda).addClass('celdaCorrecta');
            longitud--;
        }
        tacharPalabraLista(palabra);
    }

    function tacharPalabraLista(palabra) {
        palabra = palabra.toUpperCase();
        if (parseInt($('div#lista').children().length) > 1) {
            var palabraLista = $('div#lista').children()[1];
            for (var i = 1; i < $('div#lista').children().length; i++) {
                if ($(palabraLista).html() == palabra)
                    $(palabraLista).addClass('tachado');
                else
                    palabraLista = $(palabraLista).next();
            }
        }
        

    }

    function jugar() {
        if (palabrasOriginales.length != 0 && !sopaGenerada) {
            document.getElementById('jugar').disabled = true;
            document.getElementById('anadir').disabled = true;
            document.getElementById('palabraNueva').disabled = true;
            document.getElementById('help').disabled = false;
            for (var i = 0; i < palabrasOriginales.length; i++)
                anadirPalabraSopa(palabrasOriginales[i]);
            rellenarSopa();
        }
    }
})