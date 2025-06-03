<script setup lang="ts">
import { useStudentCourses } from '~/composables/useStudentCourses'

const { userProfile, logout } = useAuthUser()
const router = useRouter()

const courseRequest = ref('')

const handleLogout = async () => {
  await logout()
  router.push('/')
}

const redirectToCourse = (name: string) => {
  router.push(`/alumno/cursos/${name}`)
}

const { courses, isLoading, error, refresh, count } = useStudentCourses()
console.log('Courses:', courses.value)


</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <UContainer class="py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Panel de Alumno</h1>
        <UPopover class="flex flex-col gap-2 w-28 justify-end items-end">
          <img src="../../public/user.ico" alt="User Avatar" class="rounded-full cursor-pointer"
            style="width: 32px; height: 30px; cursor: pointer;" />

          <template #content>
            <div class="flex flex-col items-center gap-2 justify-center h-full">
              <UButton class="flex justify-center cursor-pointer w-full" color="secondary">Perfil</UButton>
              <UButton @click="handleLogout" class="cursor-pointer" color="neutral">
                Cerrar sesión
              </UButton>
            </div>
          </template>
        </UPopover>
      </div>

      <UCard>
        <div class="p-4">
          <ClientOnly>
            <h2 class="text-xl font-semibold mb-4">
              Bienvenido, {{ userProfile?.first_name || '...' }}
            </h2>
            <p>Aquí podrás ver tus clases y materiales de estudio.</p>
          </ClientOnly>

          <!-- Aquí iría el contenido específico del alumno -->
          <div class="mt-6 space-y-4">
            <UCard>
              <template #header>
                <h3 class="text-lg font-medium">Mis cursos</h3>
              </template>
              <div class="p-4">
                <p v-if="isLoading">Cargando cursos...</p>
                <p v-else-if="courses.length === 0">No hay cursos</p>
                <!-- <p v-else>{{courses[0].title}}</p> -->
                <div v-else class="flex flew-row gap-4">
                  <div v-for="course in courses" :key="course.id" class="border-radio p-2 bg-secondary-500 text-white" @click="redirectToCourse(course.title)">
                    <h4 class="text-lg font-semibold">{{ course.title }} > </h4>
                  </div>
                </div>
                <!-- <p v-for="course in courses">{{ courses[0].title }}</p> -->
              </div>
            </UCard>
            <UCard>
              <template #header>
                <h3 class="text-lg font-medium">Solicitar entrar a un curso</h3>
              </template>
              <div class="p-4">
                <p class="text-gray-500 mb-2">Ingresa el ID del curso al que deseas solicitar acceso:</p>
                <UInput v-model="courseRequest" placeholder="aH2ek10" class="mb-4 mr-5" />
                <UButton color="secondary" @click="() => console.log('Solicitar acceso al curso:', courseRequest)">
                  Solicitar acceso
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<style scoped>
.boder {
  border: 1px solid red;
}

.border-radio {
  border: 1px soldid primary;
  border-radius: 10px;
  cursor: pointer;
}
</style>
