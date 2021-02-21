<template lang="pug">
  #hello
    img(:src="chat" width="65%")
    .text meet some strangers
</template>

<script>
import chat from '@/assets/img/volodymyr-hryshchenko-V5vqWC9gyEU-unsplash.jpg';

export default {
  data() {
    return {
      chat,
    }
  }
}
</script>

<style lang="scss">
  #hello {
    height: 500px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .text {
      font-size: 40px;
      color: red;
      margin-top: 40px;
      font-family: monospace;
      text-align: center;
    }
  }
</style>
