var tamanoPagina = 20;
var rutaImagenes = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
var query;
var queryNext;
var queryInit = 'https://pokeapi.co/api/v2/pokemon?limit=' + tamanoPagina;
var searchQuery = 'https://pokeapi.co/api/v2/pokemon/';
var favorito = [];

function cargarPokemon() {
    container = document.getElementById("results");
    fetch(query || queryInit).then(res=>res.json()).then((res)=>{
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
            buttonelem.addEventListener("click", botonFavorito)
            element.appendChild(imgelem);
            element.appendChild(spanelem);
            element.appendChild(buttonelem);
            element.addEventListener("click", botonPokemon);
            container.appendChild(element);
            queryNext = res.next;
        }
    }
    );
}

function botonPokemon(e) {
    id = e.currentTarget.dataset.id;
    abrirDetalles(id);
}

function botonBuscar(e) {
    id = document.getElementById("search").value.toLowerCase();
    // Se pasa directo a la API y espera minusculas
    abrirDetalles(id);
}
function botonFavorito(e) {
    e.stopPropagation();
    // Hacer que no aparezca la ventana
    id = e.target.parentElement.dataset.id;
    if (favorito.includes(id)) {
        favorito = favorito.filter(id=>id !== id);
        // Eliminarlo
        e.target.className = "pokefav material-symbols-outlined icononofill";
    } else {
        favorito.push(id);
        e.target.className = "pokefav material-symbols-outlined iconofill";
    }
    actualizarLS();
}
function actualizarLS() {
    localStorage.setItem("juanelolaPokeClientFav", JSON.stringify(favorito));
}
function obtenerLS() {
    favorito = JSON.parse(localStorage.getItem("juanelolaPokeClientFav"));
}
function abrirDetalles(id) {
    fetch(searchQuery + id).then(res=>res.json()).then((res)=>{
        pokeabils = document.getElementById("pokeabils");
        poketypes = document.getElementById("poketypes");
        document.getElementById("pokedetailsimg").src = rutaImagenes + id + ".png";
        document.getElementById("pokedetailsname").innerText = res.name.charAt(0).toUpperCase() + res.name.slice(1);
        document.getElementById("pokedetxp").innerText = res.base_experience + " XP";
        document.getElementById("pokedetwt").innerText = (res.weight / 10) + " kg";
        document.getElementById("pokedetht").innerText = (res.height / 10) + " m";
        pokeabils.replaceChildren();
        // Borra todos los elementos dentro
        poketypes.replaceChildren();
        for (var i = 0; i < res.abilities.length; i++) {
            abilelem = document.createElement("span");
            abilelem.className = "pokeabil";
            abilelem.innerText = res.abilities[i].ability.name.charAt(0).toUpperCase() + res.abilities[i].ability.name.slice(1);
            pokeabils.appendChild(abilelem);
        }
        for (var i = 0; i < res.types.length; i++) {
            typeelem = document.createElement("span");
            typeelem.className = "poketype";
            typeelem.innerText = res.types[i].type.name.charAt(0).toUpperCase() + res.types[i].type.name.slice(1);
            poketypes.appendChild(typeelem);
        }
        document.getElementById("pokedetails").showModal();
    }
    ).catch(error=>{
        alert("No se encuentra el Pokemon. Asegúrese que esté bien escrito.")
    }
    );
}

function cargarMas() {
    query = queryNext;
    cargarPokemon();
}

function init() {
    const dialogElem = document.getElementById('pokedetails');
    dialogElem.addEventListener('click', ()=>dialogElem.close());
    const divElem = document.getElementById('pokedetailsdialog');
    divElem.addEventListener('click', (event)=>event.stopPropagation());
    const searchButton = document.getElementById('searchbutton');
    searchButton.addEventListener('click', botonBuscar);
    obtenerLS();
    cargarPokemon();
}
