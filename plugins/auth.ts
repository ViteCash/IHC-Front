import { useAuthUser } from "~/composables/useAuthUser"

export default defineNuxtPlugin(async () => {
  const { fetchUserProfile } = useAuthUser()
  
  await fetchUserProfile()
})