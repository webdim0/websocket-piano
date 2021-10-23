<script setup>
import {ref, onMounted } from 'vue'

import { WsService } from '../services/WsService.js'

const clientId = ref('');
const message = ref('');
const messagesLog = ref([]);

const addMessage = (clientFromId, body) => {
  const today = new Date();
  const ts = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  //console.log(clientFromId);
  const clientFromShort = clientFromId.split('-')[0];
  messagesLog.value.push({
    clientFromId,
    clientFromShort,
    time: ts,
    body: `${body}`
  });
}

WsService.setListenerChat(message => {  
  if (message.addressTo === WsService.clientId && message.port === 'chat') {
    const {command, message: newMessage} = message.body;
    if (command === 'add' && newMessage) {
      //console.log(newMessage);
      addMessage(message.addressFrom, newMessage);      
    }
  }  
});

const send = () => {
  const msg = message.value.trim();
  if (msg !== '') {
    WsService.send({
      port: 'chat',
      body: {command: 'add', message: msg},
      addressFrom: WsService.clientId,
      addressTo: WsService.toClientId,
    });  
    addMessage(clientId.value, msg);    
  }  
  message.value = '';
};

const setToClientId = toClientId => {
  WsService.toClientId = toClientId;
}

onMounted(() => {
  setTimeout(()=>{ clientId.value = WsService.clientId; }, 1000);  
  
});

</script>

<template>  
  <div class="w-56">
    <div class="font-bold text-gray-500">Chat</div>
    <div class="p-2 my-2 bg-gray-700 text-white" v-for="msg in messagesLog">
      <span 
        v-if="msg.clientFromId !== clientId"
        class="text-gray-300 underline cursor-pointer" 
        @click="setToClientId(msg.clientFromId)"
      >{{ msg.clientFromShort }}</span>&nbsp;
      <span>{{ msg.time }}</span>&nbsp;
      <span>{{ msg.body }}</span>
    </div>
    <textarea 
      class="w-full border border-gray-700" 
      v-model="message"
      @keyup.enter="send"
    ></textarea>
    <br>
    <button @click="send" class="px-2 bg-gray-700 text-white">Send</button>
  </div>
</template>

<style scoped>
</style>
