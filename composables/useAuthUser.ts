import { useSupabaseUser, useSupabaseClient } from '#imports'
import type { User } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types.ts'

export type UserRole = 'alumno' | 'profesor'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
}

export const useAuthUser = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const userProfile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Cargar perfil del usuario
  const fetchUserProfile = async () => {
    if (!user.value) return null
    
    loading.value = true
    error.value = null
    
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()
        
      if (profileError) throw profileError
      userProfile.value = data
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Registro de usuario
  const register = async (email: string, password: string, role: UserRole, firstName: string, lastName: string) => {
    loading.value = true
    error.value = null
    
    try {
      // Registrar usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password
      })
      
      if (authError) throw authError
      
      if (authData.user) {
        // Crear perfil con rol
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            role,
            first_name: firstName,
            last_name: lastName
          })
          
        if (profileError) throw profileError
      }
      
      return authData
    } catch (err: any) {
      error.value = err.message
      console.error('Error al registrar el usuario:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Login
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (authError) throw authError
      
      if (data.user) {
        await fetchUserProfile()
      }
      
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Logout
  const logout = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { error: logoutError } = await supabase.auth.signOut()
      
      if (logoutError) throw logoutError
      
      userProfile.value = null
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  // Verificar si el usuario tiene un rol específico
  const hasRole = (role: UserRole) => {
    return userProfile.value?.role === role
  }
  
  // Cargar perfil del usuario cuando cambia el usuario autenticado
  watch(user, async (newUser) => {
    if (newUser) {
      await fetchUserProfile()
    } else {
      userProfile.value = null
    }
  }, { immediate: true })
  
  return {
    user,
    userProfile,
    loading,
    error,
    register,
    login,
    logout,
    fetchUserProfile,
    hasRole,
  }
}