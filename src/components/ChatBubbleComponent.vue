<template>
  <div ref="messagesContainer" class="messages-container hide-scrollbar">
    <div
      v-for="(item, index) in messages"
      :key="index"
      :class="[
        'message',

        {
          'message-sent': item.role === 'user',
          'message-received': item.role === 'agent',
        },
      ]"
      :style="{
        backgroundColor:
          item.role === 'user' ? userMessageBackground : botMessageBackground,
        color:
          item.role === 'user' ? userMessageTextColor : botMessageTextColor,
      }"
    >
      <ChatMessageContent :content="item.content" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { useChatMessages } from "../composable/useMessages";
import ChatMessageContent from "./ChatMessageContent.vue";

const { messages, typingState } = useChatMessages();
const messagesContainer = ref(null);

const props = defineProps({
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
  instanceName: {
    type: String,
    default: "",
  },
});

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value || typingState.value) {
      setTimeout(() => {
        messagesContainer.value.scrollTop =
          messagesContainer.value.scrollHeight;
      }, 50);
    }
  });
};

onMounted(scrollToBottom);

// Observa los mensajes para hacer scroll
watch(messages, scrollToBottom, { deep: true });
watch(typingState, (newState) => {
  if (newState === "in-progress") {
    scrollToBottom();
  }
});
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
.message {
  margin: 2px 0;
  padding: 5px 10px;
  border-radius: 12px;
  max-width: 70%;
  min-width: 40px;
  overflow-wrap: break-word;
  word-break: break-word;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transform: translateY(-4px);
  transition: all 0.2s ease-in-out;
  font-family: "Inter", "Segoe UI", "Open Sans", -apple-system,
    BlinkMacSystemFont, sans-serif;
  font-weight: 400;
  font-size: 16px;
  padding: 0.8rem 1rem;
}

.messages-container {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  background-color: transparent;
}

.message:hover {
  transform: translateY(-6px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.07), 0 4px 8px rgba(0, 0, 0, 0.07),
    0 8px 16px rgba(0, 0, 0, 0.07), 0 16px 32px rgba(0, 0, 0, 0.07);
}

.message-sent {
  margin-left: auto;
}

.message-received {
  margin-right: auto;
}

.timestamp {
  font-size: 10px;
  margin-top: 5px;
  opacity: 0.7;
  align-self: flex-end;
  color: inherit;
}

@media (max-width: 480px) {
  .message {
    max-width: 85%;
  }

  .messages-container {
    padding: 5px;
  }
}

/* scroool */
/* Scrollbar oculto por defecto */
.hide-scrollbar::-webkit-scrollbar {
  width: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hide-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.hide-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background 0.3s ease;
}

/* Mostrar scrollbar al hacer hover */
.hide-scrollbar:hover::-webkit-scrollbar {
  opacity: 1;
}

.hide-scrollbar:hover::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

/* Para Firefox */
.hide-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease;
}

.hide-scrollbar:hover {
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

/* Para otros navegadores */
.hide-scrollbar {
  -ms-overflow-style: none;
  overflow-y: scroll;
}
</style>
