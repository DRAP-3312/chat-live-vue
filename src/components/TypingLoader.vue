<script setup>
const props = defineProps({
  instanceName: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="flex gap-2 p-3 text-gray-500 text-xs typing-wrapper">
    <div
      class="flex flex-row items-center gap-2 min-w-0 justify-center"
      v-if="props.instanceName"
    >
      <span class="text-gray-600 truncate font-medium">
        {{ props.instanceName }}
      </span>

      <span class="items-center whitespace-nowrap text-gray-500">
        está escribiendo
      </span>

      <!-- Dots con animación de ola -->
      <span class="typing-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Animación de ola en los puntos */
.typing-dots {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 1em;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #9ca3af;
  animation: wave 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes wave {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}
</style>
