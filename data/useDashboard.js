import { ref } from 'vue';

export const useDashboard = () => {
  const currentDateTime = ref(null);

  const setCurrentDateTime = (dateTime) => {
    currentDateTime.value = dateTime;
  };

  return {
    currentDateTime,
    setCurrentDateTime
  };
};
