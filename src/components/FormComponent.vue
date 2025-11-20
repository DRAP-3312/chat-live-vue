<template>
  <Transition name="slide-fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 w-[100vw] h-[100dvh] rounded-none m-0 flex flex-col overflow-hidden text-xs font-sans lg:relative lg:bottom-20 lg:left-0 lg:h-[70dvh] lg:w-[35vw] xl:w-[23vw] xl:h-[68dvh] lg:rounded-md lg:shadow-xl lg:m-0"
      :style="{ backgroundColor: chatPanelBackground }"
    >
      <div
        class="flex p-2 w-full h-[10%] justify-between items-center relative"
        :style="{
          color: chatHeaderTextColor,
          backgroundColor: chatHeaderBackground,
        }"
      >
        <div
          class="w-12 h-12 rounded-full overflow-hidden"
          v-if="icon_button_url"
        >
          <img
            :src="icon_button_url ? icon_button_url : ''"
            alt="img"
            class="w-full h-full object-cover rounded-full"
          />
        </div>
        <div class="flex p-2 flex-grow gap-1 items-center">
          <div
            class="flex flex-col justify-center items-start gap-1"
            :style="{ color: chatHeaderTextColor }"
          >
            <div class="flex justify-center items-center gap-1 text-sm">
              <strong>Bienvenido a</strong>
              <strong v-if="instanceName">{{ instanceName }}</strong>
            </div>
            <span class="text-xs">Estamos aquí para ayudarte.</span>
          </div>
        </div>
        <button
          class="absolute top-2 right-2 bg-transparent border-none text-[22px] font-bold cursor-pointer p-1 rounded-full w-[40px] h-[40px] flex items-center justify-center transition-colors duration-200 hover:bg-white/20"
          @click="handleClose"
          :style="{ color: chatHeaderTextColor }"
        >
          ✕
        </button>
      </div>

      <div class="w-full h-[2px] bg-gray-200"></div>

      <div class="w-full flex flex-col p-2" v-if="!closeModalOption">
        <div
          class="border border-gray-200 rounded-md hover:bg-gray-50 flex gap-1 justify-between items-start shadow-lg"
        >
          <div class="flex gap-1 p-2 w-full">
            <button
              v-if="!stateBtnUbication"
              @click="handleLocationPermission"
              class="flex gap-1 justify-center items-center border border-blue-500 text-gray-600 hover:text-white px-3 py-1 rounded-md hover:bg-blue-600 flex-grow"
            >
              <p class="text-lg">📍</p>
              <p>Compartir ubicación</p>
            </button>

            <button
              v-if="!stateBtnAlerts"
              @click="handleAudioPermission"
              class="flex gap-1 justify-center items-center border border-purple-500 text-gray-600 hover:text-white px-3 py-1 rounded-md hover:bg-purple-600 flex-grow"
            >
              <p class="text-lg">🔊</p>
              <p>Recibir alertas</p>
            </button>
          </div>
          <div class="flex justify-end items-center">
            <button
              @click="onCloseModalOption"
              class="hover:bg-gray-200 text-lg rounded-md w-8 h-8 justify-center items-center"
            >
              x
            </button>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col flex-grow overflow-y-auto bg-transparent p-2 relative"
      >
        <!-- Feedback de ubicación compartida -->
        <Transition name="feedback-fade">
          <div
            v-if="showLocationFeedback"
            class="feedback-message bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-bounce-subtle whitespace-nowrap"
          >
            <span class="text-lg">✓</span>
            <span class="font-medium">¡Gracias por compartir tu ubicación!</span>
          </div>
        </Transition>

        <!-- Feedback de sonido activado -->
        <Transition name="feedback-fade">
          <div
            v-if="showSoundFeedback"
            class="feedback-message bg-purple-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-bounce-subtle whitespace-nowrap"
          >
            <span class="text-lg">✓</span>
            <span class="font-medium">Notificaciones activadas</span>
          </div>
        </Transition>
        <ChatBubbleComponent
          :userMessageBackground="userMessageBackground"
          :userMessageTextColor="userMessageTextColor"
          :botMessageBackground="botMessageBackground"
          :botMessageTextColor="botMessageTextColor"
          :instanceName="instanceName"
        />
      </div>

      <div
        class="flex flex-col h-[10%]"
        :style="{ backgroundColor: chatInputBackground }"
      >
        <Transition name="fade-slide" mode="out-in">
          <div
            v-if="typingState === 'in-progress'"
            key="typing"
            class="flex items-center h-full w-full p-2"
          >
            <TypingLoader :instanceName="props.instanceName" />
          </div>
          <div v-else key="input" class="flex gap-2 items-center p-2 h-full">
            <textarea
              ref="textareaRef"
              v-model="message"
              placeholder="Enviar mensaje..."
              @keyup.enter="handleEnterKey"
              class="flex-grow p-2 outline-none resize-none text-gray-700 text-base  lg:text-xs rounded-md transition duration-150 bg-transparent border border-gray-200 focus-within:border-gray-200 focus-within:ring-1 focus-within:ring-gray-200"
              :style="{
                backgroundColor: chatInputBackground,
                color: chatInputTextColor,
                borderColor: chatInputBorderColor,
              }"
              @input="eventTextArea"
            ></textarea>
            <button
              class="w-[50px] h-[50px] lg:hidden rounded-md bg-[#131844] text-white flex items-center justify-center transition-transform duration-200 hover:scale-105 hover:bg-[#1a205a]"
              @click="sendMessage"
              :style="{
                backgroundColor: sendButtonBackground,
              }"
            >
              <SvgComponent type="sendBtn" />
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import SvgComponent from "./SvgComponent.vue";
import ChatBubbleComponent from "./ChatBubbleComponent.vue";
import { useChatMessages } from "../composable/useMessages";
import { useSessionMetrics } from "../composable/useSessionMetrics";
import { sendFlexibleEvent, CHAT_EVENTS } from "../utils/dataLayer";
import { Filter } from "bad-words";
import { bad_words_spanish_list } from "../utils/bad-words-spanish";
import { soundInstance } from "../composable/soundInstance";
import TypingLoader from "./TypingLoader.vue";

const props = defineProps({
  idAgent: {
    type: String,
    required: true,
  },
  api_key: {
    type: String,
    required: true,
  },
  gaTrackingId: {
    type: String,
    default: "",
  },
  socket: {
    type: Object,
    required: true,
  },
  sendMetricsNow: {
    type: Function,
    required: true,
  },
  chatPanelBackground: {
    type: String,
    default: "#ffffff",
  },
  chatHeaderBackground: {
    type: String,
    default: "#131844",
  },
  chatHeaderTextColor: {
    type: String,
    default: "#ffffff",
  },
  // chatMessagesBackground: {
  //   type: String,
  //   default: "#f8f9fc",
  // },
  chatInputBackground: {
    type: String,
    default: "#ffffff",
  },
  chatInputTextColor: {
    type: String,
    default: "#474747",
  },
  chatInputBorderColor: {
    type: String,
    default: "#ccc",
  },
  sendButtonBackground: {
    type: String,
    default: "#131844",
  },
  sendButtonHoverBackground: {
    type: String,
    default: "#1a205a",
  },
  userMessageBackground: {
    type: String,
    default: "#15be86",
  },
  userMessageTextColor: {
    type: String,
    default: "#ffffff",
  },
  botMessageBackground: {
    type: String,
    default: "#f5f5f5",
  },
  botMessageTextColor: {
    type: String,
    default: "#3f3f3f",
  },

  socketUrl: {
    type: String,
    default: "",
  },

  nameSpace: {
    type: String,
    default: "",
  },
  instanceName: {
    type: String,
  },
  icon_button_url: {
    type: String,
  },
});

const emit = defineEmits(["close"]);
const textareaRef = ref(null);
const isVisible = ref(false);
const typingUser = ref(false);
const showLocationFeedback = ref(false);
const showSoundFeedback = ref(false);

const {
  addMessage,
  closeModalOption,
  typingState,
  onCloseModalOption,
  stateBtnAlerts,
  stateBtnUbication,
  setStateBtnAlert,
  setStateBtnUbication,
} = useChatMessages();

const { requestLocationPermission } = useSessionMetrics();
const { enableSound } = soundInstance;

const message = ref("");
const id = localStorage.getItem("userUUID");
const filter = new Filter();
let typingTimeout = null;

//timer to typing state
const eventTextArea = (event) => {
  const input = event.target.value;

  typingUser.value = input.trim() !== "";

  if (typingTimeout) clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    typingUser.value = false;
  }, 1000);
};

watch(typingUser, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    props.socket.emit("typing-user-state", newVal);
  }
});

watch(isVisible, (val) => {
  if (val && textareaRef.value) {
    setTimeout(() => {
      textareaRef.value.focus();
    }, 100);
  }
});

const sendMessage = () => {
  const valueToSend = filter.clean(message.value.trim());
  const utms = JSON.parse(localStorage.getItem("utm_obj"));
  if (valueToSend && props.socket) {
    const form = {
      content: valueToSend,
      role: "user",
    };
    addMessage(form);

    props.socket.emit(
      "send-chat-message",
      {
        userUUID: id ?? "",
        message: valueToSend,
        agentId: props.idAgent,
        api_key: props.api_key,
        utms,
      },
      (val) => {}
    );

    const data = {
      chat_session_id: id,
      chat_message_length: valueToSend.length,
      chat_message_type: "text",
    };
    sendFlexibleEvent(CHAT_EVENTS.MESSAGE_SENT_CLIENT, data);

    message.value = "";
  }
};

const handleEnterKey = () => {
  // Solo enviar mensaje en pantallas lg o mayores
  if (window.innerWidth >= 1024) {
    sendMessage();
  }
};

onMounted(() => {
  filter.addWords(...bad_words_spanish_list);
  if (textareaRef.value) {
    textareaRef.value.focus();
  }

  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});

const closePanel = () => {
  isVisible.value = false;
};

const handleClose = () => {
  sendFlexibleEvent(CHAT_EVENTS.WIDGET_CLOSED, {
    chat_form_close: true,
  });
  closePanel();
  emit("close");
};

// Funciones para manejar los clics en los botones de permisos
const handleLocationPermission = async () => {
  try {
    await requestLocationPermission();
    setStateBtnUbication(true);
    props.sendMetricsNow();

    // Mostrar feedback de agradecimiento
    showLocationFeedback.value = true;
    setTimeout(() => {
      showLocationFeedback.value = false;
    }, 3000);
  } catch (error) {
    console.error("Error al solicitar permiso de ubicación:", error);
  }
};

const handleAudioPermission = () => {
  enableSound();
  setStateBtnAlert(true);

  // Mostrar feedback de confirmación
  showSoundFeedback.value = true;
  setTimeout(() => {
    showSoundFeedback.value = false;
  }, 3000);
};
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
/* Animaciones */
.slide-fade-enter-active {
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}
.slide-fade-leave-active {
  transition: all 0.3s ease-in;
  transform-origin: center;
}
.slide-fade-enter-from {
  transform: scale(0);
  opacity: 0;
}
.slide-fade-enter-to {
  transform: scale(1);
  opacity: 1;
}
.slide-fade-leave-from {
  transform: scale(1);
  opacity: 1;
}
.slide-fade-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

/* Estilo del mensaje de feedback */
.feedback-message {
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
}

/* Animación de feedback */
.feedback-fade-enter-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}
.feedback-fade-leave-active {
  transition: opacity 0.3s ease-in, transform 0.3s ease-in;
}
.feedback-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) scale(0.9);
}
.feedback-fade-enter-to {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
.feedback-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
.feedback-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.9);
}

/* Animación sutil de bounce - usa margin en lugar de transform */
@keyframes bounce-subtle {
  0%, 100% {
    margin-top: 0;
  }
  50% {
    margin-top: -3px;
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle 0.6s ease-in-out;
}
.line-separate {
  width: 100%;
  height: 2px;
  background-color: rgb(228, 229, 231);
}

/* typing */

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
