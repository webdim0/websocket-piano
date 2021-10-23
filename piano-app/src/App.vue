<script setup>
import PianoKeyboard from './components/PianoKeyboard.vue'
import MyClientId from './components/MyClientId.vue'
import ToClientId from './components/ToClientId.vue'
import Chat from './components/Chat.vue'
</script>

<template>
  <div class="container mx-auto pt-7">
    <div class="inline-grid grid-cols-2 gap-4">
      <div class="pr-2">
        <MyClientId />
        <ToClientId class="mt-2" />
      </div>
      <div></div>
      <div>
        <PianoKeyboard title="Piano keyboard" />
      </div>
      <div class="pl-6">
        <Chat />
      </div>
    </div>
  </div>  
</template>