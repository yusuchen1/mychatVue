<template>
    <div class="index-background">
      <router-view></router-view>
    </div>
  </template>
  
  <script setup>
  </script>
  
<style>
.index-background {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  background-image: url('https://sc-mychat.oss-cn-hangzhou.aliyuncs.com/index-background.png');
  /* background-image: url('/images/index-background.png'); */
  background-repeat: no-repeat;
  background-size:100% 100%;
}
</style>
  