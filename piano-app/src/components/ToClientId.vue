<script setup>
import {ref, watch, onMounted } from 'vue'

import { WsService } from '../services/WsService.js'

const clientId = ref('');

onMounted(() => {
  watch(clientId, (clientId) => {
    WsService.toClientId = clientId;
  })  
});

WsService.setListenerToClientId(toClientId => {
  clientId.value = toClientId;
});

const copyFromClipboard = () => {
  if (navigator.clipboard) {
	  navigator.clipboard.readText().then( text => { 
      clientId.value = text; 
    });
  };  
}

</script>

<template>  
  <div class="flex">
    <label style="width: 45px;" class="text-gray-700">To Id</label>
    <div class="flex-grow">
      <input v-model="clientId" id="to-client-id" autocomplete="false" class="w-full pl-1 border border-gray-700">
    </div>
    <div class="pl-2">
      <button class="block px-1 bg-gray-500 text-white" @click="copyFromClipboard">ctrl+v</button>
    </div>
  </div>
</template>

<style scoped>
</style>
