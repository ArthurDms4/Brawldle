<template>
  <q-page class="row items-center justify-evenly">
    <q-btn size="40px" label="Start a new quiz" color="red" @click="startQuiz">

    </q-btn>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BrawlStore } from 'src/stores/example-store';

const store = BrawlStore()
const router = useRouter()
const arr1 = [
  {
    value: 1
  },
  {
    value: 2
  }
]
const arr2 = [
  {
    value: 1
  },
  {
    value: 2
  }
]

onMounted(() => {
  if(store.brawlerToGuess?.name) {
    console.log("redirection")
    startQuiz()
  }
  if(containsAll(arr1,arr2)) {
    console.log("meme tab")
  }

})

const containsAll = (arr1: any[], arr2: any[]) => {
  return arr2.every(arr2Item => {
    return arr1.some(arr1Item => {
      // Check if values of all properties match
      return Object.keys(arr2Item).every(key => arr2Item[key] === arr1Item[key]);
    });
  });
};

function startQuiz() {
  router.push("/newQuiz")
}

</script>
