<template>
  <q-page>
    <div class="row justify-center q-pt-lg">
      <q-select class="bg-red" filled v-model="brawlerAttempt" use-input input-debounce="0" label="Select a Brawler"
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
      <q-btn color="blue" label="Validate" @click="submitBrawler(brawlerAttempt)"></q-btn>
    </div>

    <div class="row justify-center">
      <div class="column text-center q-mt-md">
        <div class="text-h5 text-white ">Hint</div>
        <div class="flex">
          <div><q-btn class="q-ma-md" label="Gadget" :disable="store.attemptCount >= 3 ? false : true" :color="store.attemptCount >= 3 ? 'green' : 'red'" @click="hintSelected = 'gadget'"></q-btn>
          <p class="text-white" v-if="store.attemptCount < 3">{{ 3 - store.attemptCount }} attempt left</p>
          </div>
          <div>
          <q-btn class="q-ma-md" label="Star Power" :disable="store.attemptCount >= 5 ? false : true" :color="store.attemptCount >= 5 ? 'green' : 'red'" @click="hintSelected = 'starpower'"></q-btn>
          <p class="text-white" v-if="store.attemptCount < 3">{{ 5 - store.attemptCount }} attempt left</p>
        </div>
        <div>
          <q-btn class="q-ma-md" label="Icon" :disable="store.attemptCount >= 7 ? false : true" :color="store.attemptCount >= 7 ? 'green' : 'red'" @click="hintSelected = 'icon'"></q-btn>
          <p class="text-white" v-if="store.attemptCount < 3">{{ 7 - store.attemptCount }} attempt left</p>
        </div>
        </div>

        <div class="row justify-center q-mt-md">
          <div class="col flex justify-center" v-if="hintSelected == 'gadget'">
            <div v-for="gadget in brawlerToGuess.gadgets" :key="gadget.id">
              <q-img class="q-ma-sm" width="100px" height="auto" :src="gadget.imageUrl"></q-img>
            </div>
          </div>

          <div class="col flex justify-center" v-if="hintSelected == 'starpower'">
            <div v-for="starpower in brawlerToGuess.starPowers" :key="starpower.id">
              <q-img class="q-ma-sm" width="100px" height="auto" :src="starpower.imageUrl"></q-img>
            </div>
          </div>
          
          <div class="col" v-if="hintSelected == 'icon'">
              <q-img id="pixelize" class="q-ma-sm pixel" width="100px" height="auto" :src="brawlerToGuess.imageUrl"/>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-center">
      <div class="column q-mt-md">
        <div class="row" v-for="brawler in listBrawlerAttempt" :key="brawler.id">
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
    </div>


    <teleport to="body">

      <q-dialog v-model="dialogSuccess" persistent>
        <q-card class="q-pa-lg items-center justify-center">
          <q-img :src="brawlerToGuess.imageUrl"></q-img>
          <h3>Good Job !</h3>
          <p>The brawler to guess was {{ brawlerToGuess.name }}</p>
           <q-btn class="text-center" label="Close" color="red" @click="backHome"></q-btn>
        </q-card>
      </q-dialog>
    </teleport>
  </q-page>
</template>
  
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { BrawlStore } from 'src/stores/example-store';
import brawlers from 'src/data/brawlers.json'
import { pixelateImage } from 'src/libs/pixelate'
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';


const store = BrawlStore()
const $q = useQuasar()
const router = useRouter()
let brawlerToGuess = ref()
let brawlerAttempt = ref()
let originalListBrawlers = ref(store.originalList);
let filteredListBrawlers = ref(store.filteredList);
let listBrawlerAttempt = ref([] as any[])
let hintSelected = ref(store.hintSelected)
let imageToPixelaze = null
let dialogSuccess = ref(false)

onMounted(async () => {
  listBrawlerAttempt.value = store.listBrawlerAttempt
  if (!store.brawlerToGuess?.name) {
    fetchRandomBrawler()
  }
  brawlerToGuess.value = store.brawlerToGuess
  originalListBrawlers.value = brawlers.reverse();
  console.log(brawlerToGuess.value)
  let originalImage = document.querySelector("#pixelize") as HTMLImageElement;
  
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
  if(brawlerAttempt.value.name == brawlerToGuess.value.name) {
    dialogSuccess.value = true
  }
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

function backHome() {
  dialogSuccess.value = false
  store.backHome()
  router.push("/")
}


</script>

<style scoped>

.square{
  border: 2px black solid;
  width: 70px;
  height: 70px;
}

.pixel {
  filter: blur(9px);
}



</style>