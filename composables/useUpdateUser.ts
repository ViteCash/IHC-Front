import { useSupabaseClient } from '#imports'

interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export const useUpdateUser = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateUser = async (newData: UpdateUserData, userId: string) => {    
    loading.value = true
    error.value = null
    
    try {
      // Preparar datos para actualizar
      const dataToUpdate: Record<string, any> = {
        updated_at: new Date().toISOString()
      }
      
      // Mapear los datos del formulario a los campos en la base de datos
      if (newData.firstName !== undefined) {
        dataToUpdate.first_name = newData.firstName
      }
      
      if (newData.lastName !== undefined) {
        dataToUpdate.last_name = newData.lastName
      }
      
      if (newData.email !== undefined) {
        dataToUpdate.email = newData.email
      }
      
      // Realizar la actualización en Supabase
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', userId)
        .select()
        .single()
      
      if (updateError) {
        throw updateError
      }
      
      return { success: true }
    } catch (err: any) {
      error.value = err.message
      console.error('Error al actualizar el perfil:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    updateUser,
    loading,
    error
  }
}