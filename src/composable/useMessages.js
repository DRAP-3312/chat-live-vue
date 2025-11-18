import { ref } from "vue";

const messages = ref([]);
const openChat = ref(false);
const custom_style = ref({});
const closeModalOption = ref(false);
const stateBtnAlerts = ref(false);
const stateBtnUbication = ref(false);
const typingState = ref("");

export const useChatMessages = () => {
  const addMessage = (newMessage) => {
    setValueOpenChat(true);
    messages.value.push(newMessage);
  };

  const setValueMessages = (val) => {
    messages.value = val;
  };

  const setValueOpenChat = (value) => {
    openChat.value = value;
  };

  const setCustomStyle = (val) => {
    custom_style.value = val;
  };

  const onCloseModalOption = () => {
    closeModalOption.value = true;
  };

  const setStateBtnAlert = (val) => {
    stateBtnAlerts.value = val;

    if (stateBtnAlerts.value && stateBtnUbication.value) {
      closeModalOption.value = true;
    }
  };

  const setTypingStateWidget = (state) => (typingState.value = state);

  const setStateBtnUbication = (val) => {
    stateBtnUbication.value = val;
    if (stateBtnAlerts.value && stateBtnUbication.value) {
      closeModalOption.value = true;
    }
  };

  const deleteMessages = (messageIds) => {
    if (!Array.isArray(messageIds)) {
      return;
    }

    messages.value = messages.value.map((msg) => {
      if (messageIds.includes(msg._id)) {
        return { ...msg, deleteMarker: true };
      }
      return msg;
    });
  };

  return {
    messages,
    typingState,
    addMessage,
    setValueMessages,
    openChat,
    setValueOpenChat,
    custom_style,
    setCustomStyle,
    closeModalOption,
    onCloseModalOption,
    stateBtnAlerts,
    stateBtnUbication,
    setStateBtnAlert,
    setStateBtnUbication,
    setTypingStateWidget,
    deleteMessages,
  };
};
