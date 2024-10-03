var tamanoPagina = 40;
var rutaImagenes = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
var query;
var queryNext;
var queryInit = 'https://pokeapi.co/api/v2/pokemon?limit=' + tamanoPagina;
var searchQuery = 'https://pokeapi.co/api/v2/pokemon/';
let favorito = [];
let historial = [];

function cargarPokemon() {
    container = document.getElementById("results");
    fetch(query || queryInit).then(res=>res.json()).then((res)=>{ // Se usa la URL inicial si no hay una URL que se desee usar (por ejemplo una de página)
        document.getElementById("searchstatus").innerText = "Existen " + res.count + " Pokemones. Busque su favorito con el buscador o explore el Pokédex abajo.";
        for (var i = 0; i < res.results.length; i++) {
            pokeId = res.results[i].url.split("/")[6];
            element = document.createElement("div");
            element.dataset.id = pokeId;
            element.className = "pokebutton";
            imgelem = document.createElement("img");
            imgelem.className = "pokeimg";
            imgelem.src = rutaImagenes + pokeId + ".png";
            spanelem = document.createElement("span");
            spanelem.className = "pokename";
            spanelem.innerText = res.results[i].name.charAt(0).toUpperCase() + res.results[i].name.slice(1);
            buttonelem = document.createElement("button");
            buttonelem.className = "pokefav material-symbols-outlined " + (favorito.includes(pokeId) ? "iconofill" : "icononofill");
            buttonelem.innerText = "star";
            buttonelem.addEventListener("click", botonFavorito); // Hacer clic en botón de favorito
            element.appendChild(imgelem);
            element.appendChild(spanelem);
            element.appendChild(buttonelem);
            element.addEventListener("click", botonPokemon); // Hacer clic en pokemon
            container.appendChild(element);
            queryNext = res.next; // Preparar para cargar siguiente página
        }
    }
    ).catch(error=>{
        alert("Hubo un error al comunicarse con PokeAPI.")
    }
    );
}

function botonPokemon(e) {
    id = e.currentTarget.dataset.id;
    abrirDetalles(id);
}

function buscar(e) {
    e.preventDefault(); // Impide que el formulario sea enviado normalmente
    busqueda = e.target.elements.search.value;
    id = busqueda.toLowerCase(); // Se pasa directo a la API y espera minusculas
    historial.push(busqueda);
    actualizarBusquedas();
    actualizarLS();
    abrirDetalles(id);
}

function actualizarBusquedas() {
    hist = document.getElementById("searchhistory");
    hist.replaceChildren();
    for (var i = 0; i < historial.length; i++) {
        histelem = document.createElement("option");
        histelem.value = historial[i];
        hist.appendChild(histelem);
    }
}

function botonFavorito(e) {
    e.stopPropagation(); // Hacer que no aparezca la ventana
    id = e.target.parentElement.dataset.id;
    if (favorito.includes(id)) {
        favorito = favorito.filter(item=>item !== id); // Eliminarlo
    } else {
        favorito.push(id);
    }
    actualizarFavs();
    actualizarLS();
}
function botonFavDialog(elem) {
    id = document.getElementById("pokedetails").dataset.id;
    if (favorito.includes(id)) {
        favorito = favorito.filter(item=>item !== id); // Eliminarlo
        elem.className = "pokefav material-symbols-outlined icononofill";
    } else {
        favorito.push(id);
        elem.className = "pokefav material-symbols-outlined iconofill";
    }
    actualizarFavs();
    actualizarLS();
}
function actualizarFavs() {
    container = document.getElementById("results");
    for (var i = 0; i < container.children.length; i++) {
        elem = container.children[i];
        elem.querySelector(".pokefav").className = "pokefav material-symbols-outlined " + (favorito.includes(elem.dataset.id) ? "iconofill" : "icononofill");
    }
}
function actualizarLS() {
    localStorage.setItem("juanelolaPokeClientFav", JSON.stringify(favorito));
    localStorage.setItem("juanelolaPokeClientHis", JSON.stringify(historial));
}
function obtenerLS() {
    favorito = JSON.parse(localStorage.getItem("juanelolaPokeClientFav")) || [];
    historial = JSON.parse(localStorage.getItem("juanelolaPokeClientHis")) || [];
}
function abrirDetalles(id) {
    fetch(searchQuery + id).then(res=>res.json()).then((res)=>{
        id = res.id.toString(); // Algunas operaciones se harían con el ID de texto (nombre) del pokemon en lugar del ID numérico, esto nos asegura que tengamos el ID numérico siempre y en string para que funcione el favorito.includes
        pokeabils = document.getElementById("pokeabils");
        poketypes = document.getElementById("poketypes");
        document.getElementById("pokedetails").dataset.id = id;
        document.getElementById("botonfavdialog").className = "material-symbols-outlined " + (favorito.includes(id) ? "iconofill" : "icononofill");
        document.getElementById("pokedetailsimg").src = rutaImagenes + id + ".png";
        document.getElementById("pokedetailsname").innerText = res.name.replace('-', ' ');
        document.getElementById("pokedetxp").innerText = res.base_experience + " XP";
        document.getElementById("pokedetwt").innerText = (res.weight / 10) + " kg";
        document.getElementById("pokedetht").innerText = (res.height / 10) + " m";
        pokeabils.replaceChildren(); // Borra todos los elementos dentro
        poketypes.replaceChildren();
        for (var i = 0; i < res.abilities.length; i++) {
            abilelem = document.createElement("span");
            abilelem.className = "pokeabil";
            abilelem.innerText = res.abilities[i].ability.name.replace('-', ' ');
            pokeabils.appendChild(abilelem);
        }
        for (var i = 0; i < res.types.length; i++) {
            typeelem = document.createElement("span");
            typeelem.className = "poketype";
            typeelem.innerText = res.types[i].type.name.replace('-', ' ');
            poketypes.appendChild(typeelem);
        }
        document.getElementById("pokedetails").showModal();
    }
    ).catch(error=>{
        alert("No se encuentra el Pokemon. Asegúrese que esté bien escrito.")
    }
    );
}
function cerrarDialog() {
    document.getElementById("pokedetails").close();
}
function cargarMas() {
    query = queryNext;
    cargarPokemon();
}
function eliminarFavoritos() {
    if (confirm("¿Está seguro de que desea continuar?")) {
        favorito = [];
        actualizarFavs();
        actualizarLS();
    }
}
function eliminarHistorial() {
    if (confirm("¿Está seguro de que desea continuar?")) {
        historial = [];
        actualizarBusquedas();
        actualizarLS();
    }
}
function init() {
    const dialogElem = document.getElementById('pokedetails');
    dialogElem.addEventListener('click', ()=>dialogElem.close());
    const divElem = document.getElementById('pokedetailsdialog');
    divElem.addEventListener('click', (event)=>event.stopPropagation());
    const searchForm = document.getElementById('searchform');
    searchForm.addEventListener('submit', buscar);
    obtenerLS();
    actualizarBusquedas();
    cargarPokemon();
}
