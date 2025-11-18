<template>
  <div class="attachment-item">
    <!-- Image Attachment -->
    <div
      v-if="isImage"
      :class="[
        'relative w-full overflow-hidden group transition-all duration-200 rounded-lg'
      ]"
    >
      <div
        v-if="loading"
        :class="[
          'flex items-center justify-center bg-gray-300 bg-opacity-50 rounded-lg animate-pulse w-full',
          isMultiple ? 'aspect-square' : 'h-48'
        ]"
      >
        <div class="loader"></div>
      </div>

      <div
        v-if="error"
        class="relative"
        @click="openUrl"
        @mouseover="onFocus"
        @mouseleave="onOut"
      >
        <div
          :class="[
            'flex flex-col text-gray-600 items-center justify-center bg-gray-200 rounded-lg cursor-pointer transition-all duration-300 group-hover:brightness-75 group-hover:scale-[1.02] w-full',
            isMultiple ? 'aspect-square' : 'h-48'
          ]"
        >
          <div
            v-if="!focusImg"
            class="flex flex-col w-full h-full justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216v77.38l-24.69-24.7a16,16,0,0,0-22.62,0L144,133.37,93.66,83.05a16,16,0,0,0-22.63,0L40,114.33V56ZM216,200H40V153.37l52.69-52.68,67.31,67.31a8,8,0,0,0,11.32-11.31L155.31,140l38-38,22.69,22.7V200ZM148,100a12,12,0,1,1,12,12A12,12,0,0,1,148,100Z"
              ></path>
              <line
                x1="40"
                y1="216"
                x2="216"
                y2="40"
                stroke="currentColor"
                stroke-width="16"
              />
            </svg>
            <p class="text-sm mt-2">Imagen no disponible</p>
          </div>
        </div>
        <!-- Hover overlay for broken images -->
        <div
          v-if="focusImg"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg transition-opacity duration-300 pointer-events-none"
        >
          <div class="text-center text-white">
            <p class="text-sm font-semibold drop-shadow-lg">
              {{ attachment.fileName }}
            </p>
            <p class="text-xs mt-1 opacity-90">Click para abrir</p>
          </div>
        </div>
      </div>

      <!-- Image container with overlay -->
      <div v-if="!error" class="relative rounded-lg overflow-hidden">
        <img
          :src="attachment.url"
          :alt="attachment.fileName"
          :class="[
            'cursor-pointer transition-all duration-300 rounded-lg w-full',
            isMultiple ? 'aspect-square object-cover' : 'h-auto max-h-96 object-contain',
            'group-hover:brightness-75 group-hover:scale-[1.02]',
            { hidden: loading }
          ]"
          @load="onImageLoad"
          @error="onImageError"
          @click="openUrl"
          @mouseover="onFocus"
          @mouseleave="onOut"
        />
        <!-- Hover overlay -->
        <div
          v-if="focusImg && !loading"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 pointer-events-none rounded-lg"
        >
          <div class="text-center text-white">
            <p class="text-sm font-semibold drop-shadow-lg">
              {{ attachment.fileName }}
            </p>
            <p class="text-xs mt-1 opacity-90">Click para abrir</p>
          </div>
        </div>
      </div>
    </div>

    <!-- PDF Attachment -->
    <div
      v-else-if="isPdf"
      class="group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 w-full bg-slate-700 hover:bg-slate-600 hover:shadow-lg hover:scale-[1.02]"
      @click="openUrl"
      @mouseover="onFocus"
      @mouseleave="onOut"
    >
      <div
        class="flex-shrink-0 flex flex-col items-center transition-transform group-hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#E8320E"
          viewBox="0 0 256 256"
        >
          <path
            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z"
          ></path>
        </svg>
        <p class="text-sm font-medium text-white mt-2">PDF</p>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-white truncate">
          {{ attachment.fileName }}
        </p>
        <p class="text-xs text-gray-200">{{ formatFileSize(attachment.fileSize) }}</p>
        <p v-if="focusImg" class="text-xs text-purple-300 mt-1">
          Click para abrir
        </p>
      </div>
    </div>

    <!-- Other File Types -->
    <div
      v-else
      class="group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 w-full bg-gray-800 bg-opacity-30 hover:bg-opacity-50 hover:shadow-lg hover:scale-[1.02]"
      @click="openUrl"
      @mouseover="onFocus"
      @mouseleave="onOut"
    >
      <div
        class="flex-shrink-0 flex flex-col items-center transition-transform group-hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#E8320E"
          viewBox="0 0 256 256"
        >
          <path
            d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-61.66a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,164.69V120a8,8,0,0,1,16,0v44.69l10.34-10.35A8,8,0,0,1,157.66,154.34Z"
          ></path>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-white truncate">
          {{ attachment.fileName }}
        </p>
        <p class="text-xs text-gray-200">{{ formatFileSize(attachment.fileSize) }}</p>
        <p v-if="focusImg" class="text-xs text-purple-300 mt-1">
          Click para abrir
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  attachment: {
    type: Object,
    required: true,
  },
  isMultiple: {
    type: Boolean,
    default: false,
  },
});

const loading = ref(true);
const error = ref(false);
const focusImg = ref(false);

const isImage = computed(() => {
  return props.attachment.mimeType?.startsWith("image/");
});

const isPdf = computed(() => {
  return props.attachment.mimeType === "application/pdf";
});

const onFocus = () => (focusImg.value = true);
const onOut = () => (focusImg.value = false);

const onImageLoad = () => {
  loading.value = false;
  error.value = false;
};

const onImageError = () => {
  loading.value = false;
  error.value = true;
};

const openUrl = () => {
  window.open(props.attachment.url, "_blank");
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.attachment-item {
  width: 100%;
}

.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
