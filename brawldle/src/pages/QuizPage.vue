<template>
  <q-page>
    <div class="row justify-center q-mt-lg">
      <q-select filled v-model="brawlerAttempt" use-input input-debounce="0" label="Select a Brawler"
        :options="filteredListBrawlers" @filter="filterFn" option-label="name" option-value="name">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-img :src="scope.opt.imageUrl" width="30px" height="auto"></q-img>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="row justify-center q-mt-md">
      <q-btn label="Validate" @click="submitBrawler(brawlerAttempt)"></q-btn>
    </div>
    <div class="row justify-center q-mt-md">
      <div v-for="brawler in store.listBrawlerAttempt" :key="brawler.id">
        <div>{{ brawler.name }}</div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </q-page>
</template>
  
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { BrawlStore } from 'src/stores/example-store';
import brawlers from 'src/data/brawlers.json'

const store = BrawlStore()
let brawlerToGuess = ref<object>({} as object)
let brawlerAttempt = ref()
let originalListBrawlers = ref(store.originalList);
let filteredListBrawlers = ref(store.filteredList);
let listBrawlerAttempt = ref(store.listBrawlerAttempt)


onMounted(async () => {
  if (!store.brawlerToGuess?.name) {
    await fetchRandomBrawler()
  }
  brawlerToGuess.value = store.brawlerToGuess
  originalListBrawlers.value = brawlers.reverse();
  console.log(brawlerToGuess.value)
})

function filterFn(val : any, update : any, abort : any) {
  if (val.length < 2) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filteredListBrawlers.value = originalListBrawlers.value.filter((v : any) => v.name.toLowerCase().startsWith(needle));
  })
}

async function fetchRandomBrawler() {
  let randomNumber = pickRandomNumber(0, 77)
  store.brawlerToGuess = await fetch(`https://api.brawlapi.com/v1/brawlers/160000${randomNumber}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('bad response fetch')
      }
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error(error)
    })
}

function pickRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function submitBrawler(brawler : any) {
  store.addAttempt()
  listBrawlerAttempt.value.push(brawlerAttempt.value)
  originalListBrawlers.value = originalListBrawlers.value.filter((b: any) => b.name !== brawler.name);
  brawlerAttempt.value = null
}






</script>