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
        está escribiendo<span class="dots"></span>
      </span>
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

/* --- dots animations --- */
.dots::after {
  content: "";
  display: inline-block;
  width: 1em;
  text-align: left;
  animation: dots steps(4, end) 1.2s infinite;
}

@keyframes dots {
  0% {
    content: "";
  }
  25% {
    content: ".";
  }
  50% {
    content: "..";
  }
  75% {
    content: "...";
  }
  100% {
    content: "";
  }
}
</style>
