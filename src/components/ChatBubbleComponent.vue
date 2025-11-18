<template>
  <div ref="messagesContainer" class="messages-container hide-scrollbar">
    <!-- Group messages by date -->
    <template
      v-for="(group, groupIndex) in groupedMessages"
      :key="`group-${groupIndex}`"
    >
      <!-- Date separator -->
      <div v-if="group.formattedDate" class="flex justify-center my-4">
        <div class="date-separator">
          {{ group.formattedDate }}
        </div>
      </div>

      <!-- Messages group -->
      <div
        v-for="(item, index) in group.messages"
        :key="item._id || index"
        :class="[
          'message-wrapper',
          {
            'message-wrapper-sent': item.role === 'user',
            'message-wrapper-received': item.role === 'agent',
          },
        ]"
      >
        <!-- Attachments (if exists) - shown first without background -->
        <div
          v-if="item.attachments && item.attachments.length > 0"
          :class="[
            'attachments-container',
            { 'attachments-grid': hasImages(item.attachments) },
          ]"
        >
          <AttachmentComponent
            v-for="(attachment, attIndex) in item.attachments"
            :key="attIndex"
            :attachment="attachment"
            :isMultiple="item.attachments.length > 1"
          />
        </div>

        <!-- Text content (if exists) - with background -->
        <div
          v-if="item.content"
          :class="[
            'message',
            {
              'message-sent': item.role === 'user',
              'message-received': item.role === 'agent',
            },
          ]"
          :style="{
            backgroundColor:
              item.role === 'user'
                ? userMessageBackground
                : botMessageBackground,
            color:
              item.role === 'user' ? userMessageTextColor : botMessageTextColor,
          }"
        >
          <ChatMessageContent :content="item.content" />
        </div>

        <!-- Timestamp -->
        <div
          v-if="item.createdAt"
          :class="[
            'timestamp',
            {
              'timestamp-sent': item.role === 'user',
              'timestamp-received': item.role === 'agent',
            },
          ]"
        >
          {{ formatTime(item.createdAt) }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from "vue";
import { useChatMessages } from "../composable/useMessages";
import ChatMessageContent from "./ChatMessageContent.vue";
import AttachmentComponent from "./AttachmentComponent.vue";

const { messages, typingState } = useChatMessages();
const messagesContainer = ref(null);

// Filter out deleted messages
const filteredMessages = computed(() => {
  return messages.value.filter((msg) => !msg.deleteMarker);
});

const formatGroupDate = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(date);

  if (messageDate.toDateString() === today.toDateString()) return "Hoy";
  if (messageDate.toDateString() === yesterday.toDateString()) return "Ayer";

  return messageDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const groupedMessages = computed(() => {
  if (!filteredMessages.value?.length) return [];

  const groups = [];
  let currentGroup = null;

  for (const message of filteredMessages.value) {
    if (!message.createdAt) {
      if (!currentGroup) {
        currentGroup = {
          formattedDate: null,
          messages: [],
        };
        groups.push(currentGroup);
      }
      currentGroup.messages.push(message);
      continue;
    }

    const messageDate = new Date(message.createdAt);
    const messageDay = messageDate.toDateString();

    if (
      !currentGroup ||
      (currentGroup.messages[0]?.createdAt &&
        new Date(currentGroup.messages[0].createdAt).toDateString() !==
          messageDay)
    ) {
      currentGroup = {
        formattedDate: formatGroupDate(message.createdAt),
        messages: [],
      };
      groups.push(currentGroup);
    }

    currentGroup.messages.push(message);
  }

  return groups;
});

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

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const hasImages = (attachments) => {
  return attachments.some((att) => att.mimeType?.startsWith("image/"));
};

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

/* Message wrapper - contains both attachments and text */
.message-wrapper {
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  max-width: 70%;
  gap: 8px;
}

.message-wrapper-sent {
  margin-left: auto;
  align-items: flex-end;
}

.message-wrapper-received {
  margin-right: auto;
  align-items: flex-start;
}

/* Message bubble (only for text content) */
.message {
  padding: 5px 10px;
  border-radius: 12px;
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
  max-width: 100%;
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

.timestamp {
  font-size: 10px;
  margin-top: 2px;
  opacity: 0.6;
  color: #666;
  font-weight: 400;
}

.timestamp-sent {
  align-self: flex-end;
  text-align: right;
}

.timestamp-received {
  align-self: flex-start;
  text-align: left;
}

@media (max-width: 480px) {
  .message-wrapper {
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

/* Attachments container */
.attachments-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 300px;
}

/* Grid layout for images */
.attachments-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  max-width: 100%;
}

/* Single image should be larger */
.attachments-grid:has(.attachment-item:only-child) {
  grid-template-columns: 1fr;
  max-width: 300px;
}

/* Two images side by side */
.attachments-grid:has(.attachment-item:nth-child(2):last-child) {
  grid-template-columns: repeat(2, 1fr);
  max-width: 300px;
}

/* Date separator */
.date-separator {
  padding: 0.25rem 1rem;
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #e5e7eb;
  border-radius: 0.375rem;
  font-weight: 400;
  text-align: center;
}
</style>
