<script setup lang="ts">
import {routes} from '../router';
import {ref} from "vue";

const routeList = ref(routes)

</script>

<template>
  <ul>
    <li v-for="route in routeList" :key="route.path">
      <a :href="route.path">{{ decodeURI(route.path) }}</a>
    </li>
  </ul>
</template>

<style scoped>

</style>