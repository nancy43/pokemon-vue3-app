<template>
  <nav class="p-3 border-gray-200 rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <a href="/" class="flex items-center">
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Pokemon</span>
      </a>
    </div>
  </nav>
  <br>
  <div class="flex flex-col min-h-screen">
    <div class="flex justify-center">
      <div class="relative w-1/2">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input @keyup.enter="searchPokemon" type="search" v-model="searchTerm" id="default-search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Pokemons...">
        <button @click="searchPokemon" class="text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600">Search</button>
      </div>
    </div>
    <div v-if="filteredPokemons.length === 0">
      <p class="flex justify-center">No match for the entered pokemon name</p>
    </div>
    <div>
      <div v-if="isLoading">
        <div class="spinner"></div>
      </div>
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 py-10">
          <div v-for="pokemon in legendaries" :key="pokemon.id" class="flex flex-col items-center border rounded-xl bg-coral-red text-white" @click="goToDetails(pokemon.id)">
            <div class=" w-full rounded-t-xl py-5 pl-4 cursor-pointer relative">
              <p>{{ pokemon.id }}</p>
              <div class="w-full flex gap-y-2 flex-col items-center py-3">
                <p class="uk-text-large font-bold" v-text="pokemon.name.toUpperCase()"></p>
                <img :src="pokemonSprite(pokemon.id)" alt="pokemon sprite">
              </div>
              <div class="flex justify-center gap-3 flex-wrap">
                <p>
                  <template v-for="(pokemonType, index) in pokemonstype.filter(pokemonType => pokemonType.pokemon_id === pokemon.id)">
                    {{ index !== 0 ? ', ' : ''}} {{ pokemonType.pokemon_v2_type.name.charAt(0).toUpperCase() + pokemonType.pokemon_v2_type.name.slice(1)}}
                  </template>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer class="p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 mt-auto">
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
import axios from 'axios'
import {ref, computed, watch, onMounted, toRefs} from 'vue'
import { useRouter } from 'vue-router'


export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()
    const searchTerm = ref('')
    const isLoading = ref(false)
    const pokemons = ref([])
    const pokemonstype = ref([])
    const filteredPokemons = computed(() => {
      return pokemons.value.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      })
    })
    const legendaries = computed(() => {
      return pokemons.value.filter((pokemon) => pokemon.is_legendary === true)
    })

    const searchPokemon = async () => {
      // method logic
      if (searchTerm.value === '') {
        fetchPokemon();
      } else {
        pokemons.value = filteredPokemons.value;
      }
    }
    const goToDetails = (id) => {
      router.push({ path: '/details/' + id });
    }
    const pokemonSprite = (id) => {
      // method logic
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    }
    const fetchPokemon = async () => {
      isLoading.value = true;
      try {
        const query = `
        query {
          pokemon_v2_pokemonspecies {
            is_legendary
            name
            id
            generation_id
          }
          pokemon_v2_pokemontype {
            pokemon_id
            pokemon_v2_type {
              name
              id
            }
          }
          pokemon_v2_pokemonsprites {
            pokemon_id
            sprites
          }
        }
      `
        const {data} = await axios({
          url: 'https://beta.pokeapi.co/graphql/v1beta',
          method: 'post',
          headers: {
            'content-type': 'application/json',
            'x-method-used': 'graphiql',
          },
          data: JSON.stringify({query}),
        });
        pokemonstype.value = data.data.pokemon_v2_pokemontype;
        pokemons.value = data.data.pokemon_v2_pokemonspecies;
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    watch(searchTerm, (val) => {
      if (val === '') {
        fetchPokemon()
      }
    })
    onMounted(fetchPokemon);
    return {
      searchTerm,
      fetchPokemon,
      filteredPokemons,
      isLoading,
      pokemons,
      pokemonstype,
      legendaries,
      searchPokemon,
      goToDetails,
      pokemonSprite,
      router,
      ...toRefs(searchTerm, filteredPokemons, isLoading, pokemons, pokemonstype, filteredPokemons, legendaries)
    }
  }
}
</script>
