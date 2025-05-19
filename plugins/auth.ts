import { useAuthUser } from "~/composables/useAuthUser"

export default defineNuxtPlugin(async () => {
  const { fetchUserProfile } = useAuthUser()
  
  // Intentar cargar el perfil de usuario al inicializar la aplicación
  await fetchUserProfile()
})