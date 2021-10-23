<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
// https://tonejs.github.io/
import * as Tone from 'tone'
import { WsService } from '../services/WsService.js'

defineProps({
  title: String
})

const playSound = ref(true);
const sendSound = ref(true);
const allowRemote = ref(true);

WsService.setListenerPiano(message => {  
  if (message.addressTo === WsService.clientId && message.port === 'piano') {
    const {command, button, buttonState} = message.body;
    if (command === 'play' && button && buttonState) {
      //console.log(message);
      if (allowRemote.value) {
        playButton(button, buttonState);
      } 
    }
  }  
});

const buttonNoteCodes = {
  w0: 'C4',
  w1: 'D4',
  w2: 'E4',
  w3: 'F4',
  w4: 'G4',
  w5: 'A4',
  w6: 'B4',
  b0: 'C4s',
  b1: 'D4s',
  b2: 'F4s',
  b3: 'G4s',
  b4: 'A4s',  
};

let buttonStates = reactive({
  w0: 'up',
  w1: 'up',
  w2: 'up',
  w3: 'up',
  w4: 'up',
  w5: 'up',
  w6: 'up',
  b0: 'up',
  b1: 'up',
  b2: 'up',
  b3: 'up',
  b4: 'up',  
});

const synth = new Tone.Synth().toDestination();

const playButton = (button, direction) => {
  if (direction === 'down') {
      synth.triggerAttack(buttonNoteCodes[button], '8n')    
    } else {
      synth.triggerRelease()
    }  
}

const toggle = (button, direction) => {
  //console.log(direction);  
  if (playSound.value) {
    playButton(button, direction);
  }  
  if (sendSound.value) {
    WsService.send({
      port: 'piano',
      body: {command: 'play', button: button, buttonState: direction},
      addressFrom: WsService.clientId,
      addressTo: WsService.toClientId,
    });
  }  

  buttonStates[button] = direction;
}

const keysToggle = (direction, event) => {
  //console.log(event.target.nodeName)
  const tag = event.target.nodeName.toLowerCase();
  const key = event.key.toLowerCase();
  if (tag === 'body') {
    if (key === 'a') {
      toggle('w0', direction);
    } else if (key === 's') {
      toggle('w1', direction);
    } else if (key === 'd') {
      toggle('w2', direction);
    } else if (key === 'f') {
      toggle('w3', direction);
    } else if (key === 'g') {
      toggle('w4', direction);
    } else if (key === 'h') {
      toggle('w5', direction);
    } else if (key === 'j') {
      toggle('w6', direction);
    } else if (key === 'w') {
      toggle('b0', direction);
    } else if (key === 'e') {
      toggle('b1', direction);
    } else if (key === 't') {
      toggle('b2', direction);
    } else if (key === 'y') {
      toggle('b3', direction);
    } else if (key === 'u') {
      toggle('b4', direction);
    }
  }
}
const keysToggleDown = e => {
  keysToggle('down', e);
}
const keysToggleUp = e => {
  keysToggle('up', e);
}

onMounted(() => {
  window.addEventListener('keydown', keysToggleDown);
  window.addEventListener('keyup', keysToggleUp);
});

onUnmounted(() => {
  window.removeEventListener('keydown', keysToggleDown);
  window.removeEventListener('keyup', keysToggleUp);
});

</script>

<template>
  <div>
  <h1 class="font-bold text-gray-500">{{ title }}</h1>
  <div>
    <input type="checkbox" id="play-sound" v-model="playSound"> <label for="play-sound">Play</label>
    <input class="ml-3" type="checkbox" id="send-sound" v-model="sendSound"> <label for="send-sound">Send sound</label>
    <input class="ml-3" type="checkbox" id="allow-remote" v-model="allowRemote"> <label for="allow-remote">Allow remote sound</label>
  </div>
  <div class="mt-2 flex relative">    
    <div 
      @mouseup="toggle('w0', 'up')"
      @mousedown="toggle('w0', 'down')" 
      class="piano-button-white piano-button-white-0"
      :class="{'piano-button-white-down': buttonStates['w0'] === 'down'}"
    >A</div>
    <div 
      @mouseup="toggle('b0', 'up')"
      @mousedown="toggle('b0', 'down')" 
      class="piano-button-black piano-button-black-0"
      :class="{'piano-button-black-down': buttonStates['b0'] === 'down'}" 
    >W</div>
    <div 
      @mouseup="toggle('w1', 'up')"
      @mousedown="toggle('w1', 'down')" 
      class="piano-button-white piano-button-white-1"
      :class="{'piano-button-white-down': buttonStates['w1'] === 'down'}"
    >S</div>
    <div 
      @mouseup="toggle('b1', 'up')"
      @mousedown="toggle('b1', 'down')" 
      class="piano-button-black piano-button-black-1"
      :class="{'piano-button-black-down': buttonStates['b1'] === 'down'}" 
    >E</div>
    <div 
      @mouseup="toggle('w2', 'up')"
      @mousedown="toggle('w2', 'down')" 
      class="piano-button-white piano-button-white-2"
      :class="{'piano-button-white-down': buttonStates['w2'] === 'down'}"
    >D</div>
    <div 
      @mouseup="toggle('w3', 'up')"
      @mousedown="toggle('w3', 'down')" 
      class="piano-button-white piano-button-white-3"
      :class="{'piano-button-white-down': buttonStates['w3'] === 'down'}"
    >F</div>
    <div 
      @mouseup="toggle('b2', 'up')"
      @mousedown="toggle('b2', 'down')" 
      class="piano-button-black piano-button-black-2"
      :class="{'piano-button-black-down': buttonStates['b2'] === 'down'}" 
    >T</div>
    <div 
      @mouseup="toggle('w4', 'up')"
      @mousedown="toggle('w4', 'down')" 
      class="piano-button-white piano-button-white-4"
      :class="{'piano-button-white-down': buttonStates['w4'] === 'down'}"
    >G</div>
    <div 
      @mouseup="toggle('b3', 'up')"
      @mousedown="toggle('b3', 'down')" 
      class="piano-button-black piano-button-black-3"
      :class="{'piano-button-black-down': buttonStates['b3'] === 'down'}" 
    >Y</div>
    <div 
      @mouseup="toggle('w5', 'up')"
      @mousedown="toggle('w5', 'down')" 
      class="piano-button-white piano-button-white-5"
      :class="{'piano-button-white-down': buttonStates['w5'] === 'down'}"
    >H</div>
    <div 
      @mouseup="toggle('b4', 'up')"
      @mousedown="toggle('b4', 'down')" 
      class="piano-button-black piano-button-black-4"
      :class="{'piano-button-black-down': buttonStates['b4'] === 'down'}" 
    >U</div>
    <div 
      @mouseup="toggle('w6', 'up')"
      @mousedown="toggle('w6', 'down')" 
      class="piano-button-white piano-button-white-6"
      :class="{'piano-button-white-down': buttonStates['w6'] === 'down'}"
    >J</div>
  </div>
  </div>
</template>

<style scoped>
  .piano-button-white {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 50px;
    height: 200px;
    border: 1px solid black;
    padding-bottom: 5px;
    color: darkgrey;
  }
  .piano-button-white-down {
    background-color: #ccc;
  }
  .piano-button-white-0, .piano-button-white-1, .piano-button-white-2, .piano-button-white-3, .piano-button-white-4, .piano-button-white-5 {
    border-right-width: 0;
  }
  .piano-button-black {
    position: absolute;
    left: 35px; 
    top: 3px;   
    width: 30px;
    height: 130px;
    border: 1px solid black;
    background-color: black;
    display: flex;
    align-items: flex-end;
    justify-content: center;    
    padding-bottom: 5px;
    color: darkgrey;
  }
  .piano-button-black-down {
    background-color: #676060;
    color: white;
  }
  .piano-button-black-1 {    
    left: 85px;    
  }  
  .piano-button-black-2 {    
    left: 185px;    
  }
  .piano-button-black-3 {    
    left: 235px;    
  }
  .piano-button-black-4 {    
    left: 285px;    
  }
</style>
