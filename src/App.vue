<template>
  <div id="a">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<style scoped>
#a{
  position: fixed;
  left: 0;
  top:0;
  width: 100%;
  height: 100vh;;
  /* background-color: aqua; */
}
</style>