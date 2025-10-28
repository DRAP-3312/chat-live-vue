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
    <span
      class="flex flex-row items-center gap-1 min-w-0 justify-center"
      v-if="props.instanceName"
    >
      <span class="text-gray-500 truncate animate-color-pulse">
        {{ props.instanceName }}
      </span>

      <span class="items-center whitespace-nowrap animate-color-pulse">
        está escribiendo
      </span>

      <div class="loader">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
        <div class="dot dot-4"></div>
        <div class="dot dot-5"></div>
      </div>
    </span>
  </div>
</template>

<style scoped>
@keyframes color-pulse {
  0%,
  100% {
    color: #4b5563;
  }
  50% {
    color: #9ca3af;
  }
}

.animate-color-pulse {
  animation: color-pulse 1.5s ease-in-out infinite;
}

/* dots */
.loader {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 100%;
}

.dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 3px;
  border-radius: 50%;
  -webkit-animation: dot-pulse2 1.5s ease-in-out infinite;
  animation: dot-pulse2 1.5s ease-in-out infinite;
}

.dot-1 {
  background-color: #333333;
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

.dot-2 {
  background-color: #666666;
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.dot-3 {
  background-color: #999999;
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.dot-4 {
  background-color: #cccccc;
  -webkit-animation-delay: 0.9s;
  animation-delay: 0.9s;
}

.dot-5 {
  background-color: #aaaaaa;
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}

@keyframes dot-pulse2 {
  0% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    opacity: 0.5;
  }

  50% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    opacity: 0.5;
  }
}

.typing-wrapper {
  display: inline-flex;
  white-space: nowrap;
}
</style>
