import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<any>(null)

  function setUser(userData: any) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  return {
    user,
    setUser,
    clearUser
  }
})
