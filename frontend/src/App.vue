<template>
  <div id="app">
    <LayoutHeader />
    <router-view />
  </div>
</template>

<script>
import LayoutHeader from '@/components/layout/LayoutHeader.vue'

export default {
  name: 'App',
  components: {
    LayoutHeader
  }
} 
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>