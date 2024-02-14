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
    <div class="column justify-center items-center q-mt-md">
      <p>Hint : </p>
      <div>
      <q-btn class="q-ma-md" label="Gadget" :disable="store.attemptCount >= 3 ? false : true" :color="store.attemptCount >= 3 ? 'green' : 'red'" @click="hintSelected = 'gadget'"></q-btn>
      <q-btn class="q-ma-md" label="Star Power" :disable="store.attemptCount >= 5 ? false : true" :color="store.attemptCount >= 5 ? 'green' : 'red'" @click="hintSelected = 'starpower'"></q-btn>
      <q-btn class="q-ma-md" label="Icon" :disable="store.attemptCount >= 7 ? false : true" :color="store.attemptCount >= 7 ? 'green' : 'red'" @click="hintSelected = 'icon'"></q-btn>
    </div>
    <div class="row justify-center q-mt-md">
      <div class="col flex" v-if="hintSelected == 'gadget'">
        <div v-for="gadget in brawlerToGuess.gadgets" :key="gadget.id">
          <q-img class="q-ma-sm" width="100px" height="auto" :src="gadget.imageUrl"></q-img>
        </div>
      </div>
      <div class="col flex" v-if="hintSelected == 'starpower'">
        <div v-for="starpower in brawlerToGuess.starPowers" :key="starpower.id">
          <q-img class="q-ma-sm" width="100px" height="auto" :src="starpower.imageUrl"></q-img>
        </div>
      </div>
      <div class="col" v-if="hintSelected == 'icon'">
          <q-img class="q-ma-sm pixel" width="100px" height="auto" :src="brawlerToGuess.imageUrl"></q-img>
      </div>
    </div>
    </div>
    <div class="column justify-center items-center q-mt-md">
      <div class="row" v-for="brawler in store.listBrawlerAttempt" :key="brawler.id">
          <div class="square flex justify-center items-center" >
            <q-img :src="brawler.imageUrl"></q-img>
          </div>
          <div
            :class="defineBackground('class', brawler.class.name)"
            class="square flex justify-center items-center"
          >
            <div class="text-center">{{ brawler.class.name }}</div>
          </div>
          <div
            :class="defineBackground('rarity', brawler.rarity.name)"
            class="square flex justify-center items-center"
          >
            <div class="text-center">{{ brawler.rarity.name }}</div>
          </div>
      </div>
    </div>
  </q-page>
</template>
  
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { BrawlStore } from 'src/stores/example-store';
import brawlers from 'src/data/brawlers.json'
import Pixelate from 'pixelate'

const store = BrawlStore()
let brawlerToGuess = ref()
let brawlerAttempt = ref()
let originalListBrawlers = ref(store.originalList);
let filteredListBrawlers = ref(store.filteredList);
let listBrawlerAttempt = ref(store.listBrawlerAttempt)
let hintSelected = ref(store.hintSelected)
let imageToPixelaze = null


onMounted(async () => {
  if (!store.brawlerToGuess?.name) {
    fetchRandomBrawler()
  }
  brawlerToGuess.value = store.brawlerToGuess
  originalListBrawlers.value = brawlers.reverse();
  console.log(brawlerToGuess.value)
  imageToPixelaze = document.querySelector(".pixel")
  let pixelate = new Pixelate(imageToPixelaze, {
    amout : 0.7
  })
})

function filterFn(val : any, update : any, abort : any) {
  if (val.length < 1) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filteredListBrawlers.value = originalListBrawlers.value.filter((v : any) => v.name.toLowerCase().startsWith(needle));
  })
}

function fetchRandomBrawler() {
  let randomNumber = pickRandomNumber(0, 77)
  store.brawlerToGuess = brawlers[randomNumber]
}

function pickRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function submitBrawler(brawler : any) {
  if(brawler != null) {
    store.addAttempt()
  listBrawlerAttempt.value.unshift(brawlerAttempt.value)
  originalListBrawlers.value = originalListBrawlers.value.filter((b: any) => b.name !== brawler.name);
  brawlerAttempt.value = null
  }
  
}

function defineBackground(cat: string, value : string) {
  if(brawlerToGuess.value[cat]?.name === value) {
    return "bg-green"; // Correspondance, retourne la classe pour une couleur de fond rouge
  } else {
    return "bg-red"; // Pas de correspondance, retourne la classe pour une couleur de fond verte
  }
}


</script>

<style scoped>

.square{
  border: 2px black solid;
  width: 70px;
  height: 70px;
}


</style>