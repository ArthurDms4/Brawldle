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

onMounted(() => {
  if(store.brawlerToGuess?.name) {
    console.log("redirection")
    startQuiz()
  }
})

function startQuiz() {
  router.push("/newQuiz")
}

</script>
