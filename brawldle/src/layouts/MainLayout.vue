<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          Brawldle
        </q-toolbar-title>
        <q-btn v-if="store.brawlerToGuess" icon="home" color="red" @click="backHome()">
          
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BrawlStore } from 'src/stores/example-store';
import { useRouter } from 'vue-router';

const store = BrawlStore()
const router = useRouter()

function backHome() {
  store.brawlerToGuess = {}
  store.listBrawlerAttempt = []
  store.originalList = []
  store.attemptCount = 0;
  store.filteredList = []
  router.push("/")
}
</script>
