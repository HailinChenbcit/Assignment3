poke_id = null;
poke_name = null;
poke_type = null;
page_number = null;
g_data_type = null;

const colors = {
  fire: ["#ff4242", "#fccccc"],
  grass: ["#91e496", "#ccfcd0"],
  electric: ["#FCF7DE", "#faefb9"],
  water: ["#DEF3FD", "#bbe6fa"],
  ground: ["#f4e7da", "#fad8b6"],
  rock: ["#d5d5d4", "#a6a6a2"],
  fairy: ["#fceaff", "#edbff5"],
  poison: ["#979797", "#3bd15a"],
  bug: ["#f8d5a3", "#fcba5b"],
  dragon: ["#97b3e6", "#6384c2"],
  psychic: ["#eceda1", "#f0f283"],
  flying: ["#F5F5F5", "#f5e9e9"],
  fighting: ["#ff8c8c", "#bfb6a4"],
  normal: ["#f5ffcb", "#fafae3"],
  ice: ["#d1fffd", "#1ae8df"],
  dark: ["#370000", "#5c0101"],
  steel: ["#226945", "#0ad670"],
  shadow: ["#e6edee", "#93a1a3"],
};

async function paginate_type(page_number) {
  let total_pages = Math.ceil(g_data_type.pokemon.length / 9);
  // display page buttons
  var html = "";
  for (cur_page = 0; cur_page < total_pages; cur_page++) {
    html += `<span><button id="${cur_page + 1}">${
      cur_page + 1
    }</button></span>`;
    $("#page_numbers").html(html);
  }

  html = "";

  pokemons = [];
  pokemon_ids = [];
  for (i = 0; i < g_data_type["pokemon"].length; i++) {
    pokemons.push(g_data_type["pokemon"][i]["pokemon"]["name"]);
    id = g_data_type["pokemon"][i]["pokemon"]["url"];
    pokemon_ids.push(id.substr(34).slice(0, -1));
  }

  result = "";

  for (i = (page_number - 1) * 9; i < page_number * 9; i++) {
    poke_name = pokemons[i];
    poke_id = pokemon_ids[i];

    await $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon/${poke_id}`,
      type: "GET",
      success: function process(data) {
        allowed = data.types[0].type.name;
        obj_colors = Object.keys(colors).filter((key) => allowed.includes(key));
        color_code = colors[obj_colors];
        result += `<div class="image_container" style="background:linear-gradient(45deg, ${color_code[0]}, ${color_code[1]});"> <a href='profile/${poke_id}' id= ${poke_id}>
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke_id}.png">
                            </img>
                            </a>
                            <div class='card_header'>
                            <div class='poke__number'>
                            #${poke_id}
                            </div>
                            </div>
                            <div>${poke_name}</div>
                            </div>`;
      },
    });
  }
  $("main").html(result);
}

function process_type(data) {
  g_data_type = data;
  paginate_type(1);
}

async function process_region(g_data_region) {
  pokemons = [];
  pokemon_ids = [];
  for (i = 0; i < g_data_region["pokemon_entries"].length; i++) {
    pokemons.push(
      g_data_region["pokemon_entries"][i]["pokemon_species"]["name"]
    );
    id = g_data_region["pokemon_entries"][i]["pokemon_species"]["url"];
    pokemon_ids.push(id.substr(42).slice(0, -1));
  }

  result = "";

  for (i = 0; i < pokemons.length; i++) {
    poke_name = pokemons[i];
    poke_id = pokemon_ids[i];

    await $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon/${poke_id}`,
      type: "GET",
      success: function process(data) {
        allowed = data.types[0].type.name;
        obj_colors = Object.keys(colors).filter((key) => allowed.includes(key));
        color_code = colors[obj_colors];
        result += `<div class="image_container" style="background:linear-gradient(45deg, ${color_code[0]}, ${color_code[1]});"> <a href='profile/${poke_id}' id= ${poke_id}>
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke_id}.png">
                    </img>
                    </a>
                    <div class='card_header'>
                    <div class='poke__number'>
                    #${poke_id}
                    </div>
                    </div>
                    <div>${poke_name}</div>
                    </div>`;
      },
    });
  }
  $("main").html(result);
}

function display_by_type() {
  var selected_type = $("#poke_type option:selected").val();
  $.ajax({
    url: `https://pokeapi.co/api/v2/type/${selected_type}`,
    type: "GET",
    success: process_type,
  });
}

function display_by_region() {
  var selected_option = $("#poke_region option:selected").val();
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokedex/${selected_option}`,
    type: "GET",
    success: process_region,
  });
}

const d = new Date();
var now = new Date(Date.now());
let time =
  d.toLocaleDateString() + " " + now.getHours() + ":" + now.getMinutes();

function insertSearchEventToTheTimeLine(poke_type) {
  $.ajax({
    url: "http://localhost:8000/timeline/insert",
    type: "put",
    data: {
      text: ` Client has searched for ${poke_type}`,
      time: `${time}`,
    },
    success: function (r) {
      // console.log(r);
    },
  });
}

$(document).ready(function () {
  display_by_type();

  $("#poke_type").change(() => {
    poke_type = $("#poke_type option:selected").val();
    $(".pagination").show();
    display_by_type();
    insertSearchEventToTheTimeLine(poke_type);
  });

  $("#poke_region").change(() => {
    $(".pagination").hide();
    display_by_region();
  });

  $("#search").click(() => {
    poke_name = $("#poke_name").val();
    insertSearchEventToTheTimeLine(poke_name)
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon/${poke_name}`,
      type: "GET",
      success: function process(data) {
        poke_name = data.name;
        poke_id = data.id;
        result = "";
        result += `<div class="image_container"> <a href='profile/${poke_id}' id= ${poke_id}>
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke_id}.png">
                    </img>
                    </a>
                    <div class='card_header'>
                    <div class='poke__number'>
                    #${poke_id}
                    </div>
                    </div>
                    <div>${poke_name}</div>
                    </div>`;
        result += "</div>";
      },
    });
    $("main").html(result);
    $(".pagination").hide();
  });

  // display prev/next button and select page number
  $("#page_numbers").on("click", "button", function () {
    page_number = this.id;
    paginate_type(page_number);
  });

  // Prev / Next button
  $("#prev").click(() => {
    if (page_number > 1) {
      page_number--;
      paginate_type(page_number);
    }
  });

  // Prev / Next button
  $("#next").click(() => {
    if (page_number * 9 < g_data_type.pokemon.length) {
      page_number++;
      paginate_type(page_number);
    }
  });
});
