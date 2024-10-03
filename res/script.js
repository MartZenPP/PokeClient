var tamanoPagina = 20;
var rutaImagenes = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
var query;
var queryNext;
var queryInit = 'https://pokeapi.co/api/v2/pokemon?limit=' + tamanoPagina;
var searchQuery;

function cargarPokemon() {
container = document.getElementById("results");
fetch(query || queryInit)
.then(res => res.json())
.then((res) => {
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
    buttonelem.className = "pokefav material-symbols-outlined icononofill";
    buttonelem.innerText = "star";
    element.appendChild(imgelem);
    element.appendChild(spanelem);
    element.appendChild(buttonelem);
    container.appendChild(element);
    queryNext = res.next;
}
});
}

function cargarMas() {
    query = queryNext;
    cargarPokemon();
}