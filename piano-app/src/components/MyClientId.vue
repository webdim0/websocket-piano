<script setup>
import {ref, onMounted } from 'vue'

import { WsService } from '../services/WsService.js'

const clientId = ref('');

onMounted(() => {
  setTimeout(_=>{ clientId.value = WsService.clientId; }, 1000);  
});

const copyToClipboard = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(clientId.value).then(function() {
      /* clipboard successfully set */
      //console.log('clipboard ok');
    }, function() {
      /* clipboard write failed */
    });
  }  
}

</script>

<template>  
  <div class="flex">
    <label style="width: 45px;" class="text-gray-700">My Id</label>
    <div class="flex-grow">
      <input v-model="clientId" id="client-id" autocomplete="false" class="w-full pl-1 border border-gray-700">
    </div>    
    <div class="pl-2">
      <button class="block px-1 bg-gray-500 text-white" @click="copyToClipboard">ctrl+c</button>
    </div>
  </div>
</template>

<style scoped>
</style>
