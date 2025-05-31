import { useAuthUser } from "~/composables/useAuthUser"

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, userProfile, fetchUserProfile } = useAuthUser()
  
  // // Rutas públicas que no requieren autenticación
  // const publicRoutes = ['/auth/login', '/auth/register', '/auth/confirm']
  
  // // Si la ruta es pública, permitir acceso
  if (['/','/auth/confirm'].includes(to.path)) {
    return
  }
  
  // Verificar si el usuario está autenticado
  if (!user.value) {
    return navigateTo('/')
  }
  
  // Cargar perfil si aún no está cargado
  if (!userProfile.value) {
    await fetchUserProfile()
  }
  
  // Rutas específicas para roles
  const profesorRoutes = ['/profesor', '/profesor/dashboard']
  const alumnoRoutes = ['/alumno', '/alumno/dashboard']
  
  // Verificar acceso basado en rol
  if (profesorRoutes.includes(to.path) && userProfile.value?.role !== 'profesor') {
    return navigateTo('/unauthorized')
  }
  
  if (alumnoRoutes.includes(to.path) && userProfile.value?.role !== 'alumno') {
    return navigateTo('/unauthorized')
  }
})