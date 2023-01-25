<template>
  <nav class="p-3 border-gray-200 rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <a href="/" class="flex items-center">
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Pokemon</span>
      </a>
      <div class="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
        <ul class="flex flex-col mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
          <li>
            <a href="/" class="block py-2 pl-3 pr-4 text-bold hover:text-blue-800 text-black" aria-current="page">HOME</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="flex flex-col min-h-screen">
    <div v-if="isLoading">
      <div class="spinner"></div>
    </div>
    <div v-else>
      <div class="overflow-auto bg-white min-h-screen flex">
        <div class="w-4/5 mx-auto">
          <div class="grid grid-cols-3 gap-x-0 md:p-10 drop-shadow-2xl">
            <div class="bg-gray-100 p-5 flex flex-col items-center">
              <p class="md:text-xl text-bold text-blue-600 p-2">{{ pokemon.id }}</p>
              <img :src="isShiny ? pokemonShinySprite(pokemon.id) : pokemonSprite(pokemon.id)" alt="pokemon sprite" class="w-full md:w-64 mx-auto my-5">
              <p class="md:text-xl p-4 text-blue-600">{{ pokemon.name.toUpperCase() }}</p>
              <button @click="toggleShiny" type="button" class="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Switch to Shiny</button>
            </div>
            <div class="bg-gray-100 p-10">
              <p class="md:text-xl text-center text-black">
                <span class="text-blue-600 italic text-center">
                ABILITIES:
                </span>
                <template v-if="pokemonAbilities.length">
                {{ pokemonAbilitiesString }}
                </template>
                  <template v-else>This pokemon doesn't have any abilities</template>
              </p>
              <br>
              <p class="md:text-xl text-center text-black">
                <span class="text-center italic text-bold text-blue-600">
                  BASE HAPPINESS:
                </span>
                {{ pokemon.base_happiness }}
              </p>
              <br>
              <p class="md:text-xl text-center text-black">
                <span class="text-center italic text-bold text-blue-600">
                  CAPTURE RATE:
                </span>
                {{ pokemon.capture_rate }}
              </p>
              <br>
              <p class="md:text-xl text-center text-black">
                <span class="text-center italic text-bold text-blue-600">
                  HATCH COUNTER:
                </span>
                {{pokemon.hatch_counter}}
              </p>
              <br>
              <p class="text-black italic text-center md:text-xl">
                <span class="text-blue-600 text-center">
                  TYPE:
                </span> {{ pokemonTypesString }}
              </p>
            </div>
            <div class="bg-gray-100 p-10">
              <p class="md:text-xl text-center">
                <span class="italic text-center text-bold text-blue-600">
                  MOVES:
                </span>
                <template v-if="pokemonMoves.length === 0">This Pokemon doesn't have any moves.</template>
                <template v-else>
                  <template v-for="(pokemonMove, index) in pokemonMoves.slice(0,50).filter(move => move.generation_id === pokemon.generation_id)">
                    {{ index !== 0 ? ', ' : ''}}{{ pokemonMove.name.charAt(0).toUpperCase() + pokemonMove.name.slice(1) }}
                  </template>
                </template>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer class="p-4 mt-auto bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://www.linkedin.com/in/nancy-sharma-757840103/" class="hover:underline">Nancy Sharma</a>. All Rights Reserved.
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
      <li>
        <a href="https://github.com/nancy43" class="mr-4 hover:underline md:mr-6 ">Github</a>
      </li>
    </ul>
  </footer>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLoading: false,
      pokemon: {},
      pokemonTypes: [],
      pokemonAbilities: [],
      pokemonMoves: [],
      isShiny: false,
    }
  },
  computed: {
    pokemonTypesString() {
      const types = this.pokemonTypes.filter(type => type.pokemon_id === this.pokemon.id)
          .map(type => type.pokemon_v2_type.name);
      let upperCaseTypes = types.map(type => type.charAt(0).toUpperCase() + type.slice(1));
      return upperCaseTypes.join(', ');
    },
    pokemonAbilitiesString() {
      const abilities = this.pokemonAbilities.map(ability => ability.pokemon_v2_ability.name);
      let upperCaseAbilities = abilities.map(ability => ability.charAt(0).toUpperCase() + ability.slice(1));
      let uniqueAbilities = upperCaseAbilities.filter((ability, index) => upperCaseAbilities.indexOf(ability) === index);
      return uniqueAbilities.join(', ');
    },
  },
  created() {
    this.fetchPokemon();
  },
  methods: {
    async fetchPokemon() {
      const id = this.$route.params.id;
      const query = `
    query {
      pokemon_v2_pokemonspecies(where: { id: { _eq: ${id} } }) {
        id
        name
        base_happiness
        is_legendary
        capture_rate
        generation_id
        hatch_counter
      }

      pokemon_v2_pokemontype {
        pokemon_id
        pokemon_v2_type {
          name
          id
        }
      }
  pokemon_v2_move {
    name
    generation_id
    accuracy
  }
      pokemon_v2_pokemonability {
        pokemon_id
        pokemon_v2_ability {
          is_main_series
          name
        }
      }
    }
  `;
      try {
        const {data} = await axios({
          url: 'https://beta.pokeapi.co/graphql/v1beta',
          method: 'post',
          headers: {
            'content-type': 'application/json',
            'x-method-used': 'graphiql',
          },
          data: JSON.stringify({query}),
        });
        this.pokemon = data.data.pokemon_v2_pokemonspecies[0];
        this.pokemonTypes = data.data.pokemon_v2_pokemontype;
        this.pokemonAbilities = data.data.pokemon_v2_pokemonability.filter(ability => ability.pokemon_id === this.pokemon.id);
        this.pokemonMoves = data.data.pokemon_v2_move.filter(move => move.generation_id === this.pokemon.generation_id);
      } catch (error) {
        console.log(error);
      }
    },
    pokemonSprite(id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    },
    pokemonShinySprite(pokemonId) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`;
    },
    toggleShiny() {
      this.isShiny = !this.isShiny;
    },
  },
};
</script>
