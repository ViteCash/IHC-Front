<script lang="ts" setup>
import HeaderDashboard from '~/components/Header/Desktop/HeaderDashboard.vue'
import { useSupabaseClient } from '#imports'
const route = useRoute()
const { course } = route.params as { course: string }
const supabase = useSupabaseClient()

const enrolledStudents = ref<any[]>([])
const teacher = ref<any | null>(null)
const courseTitle = ref(course)
const loading = ref(true)

const getCourseWithDetailsByTitle = async (
  title: string
): Promise<{ id: string; teacher: any } | null> => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      id,
      teacher:teacher_id (
        id, first_name, last_name, email
      )
    `)
    .eq('title', title)
    .limit(1)
    .single()

  if (error) {
    console.error('Error al buscar el curso:', error.message)
    return null
  }

  return data
}

const fetchCourseData = async () => {
  loading.value = true

  const courseData = await getCourseWithDetailsByTitle(course)

  if (!courseData) {
    loading.value = false
    return
  }

  teacher.value = courseData.teacher

  const { data, error } = await supabase
    .from('course_enrollments')
    .select('student:student_id (id, email, first_name, last_name)')
    .eq('course_id', courseData.id)

  if (error) {
    console.error('Error al obtener estudiantes:', error.message)
  } else {
    enrolledStudents.value = data.map((item) => item.student)
  }

  loading.value = false
}

onMounted(fetchCourseData)
</script>

<template>
  <HeaderDashboard :courseName="courseTitle" />

  <div class="p-8 space-y-10">
    <!-- Vite, Diego, esta es la sección de profesoras -->
    <section class="mb-10 bg-secondary-800 p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold mb-4 text-white">Profesores</h2>
      <div v-if="teacher" class="flex items-center space-x-4 border-b pb-4 text-white   ">
        <UAvatar
          size="md"
          :text="(teacher.first_name[0] || '') + (teacher.last_name[0] || '')"
          color="primary"
        />
        <div>
          <p class="text-lg font-medium uppercase">
            {{ teacher.first_name }} {{ teacher.last_name }}
          </p>
        </div>
      </div>
      <div v-else class="text-gray-500">No se encontró profesor asignado.</div>
    </section>

    <!-- Y esta la de los estudiantes -->
    <section class="mb-10 bg-primary-500 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-white">Compañeros de clase</h2>
        <p class="text-white text-sm">{{ enrolledStudents.length }} alumnos</p>
      </div>

      <div v-if="loading">Cargando...</div>
      <div v-else-if="enrolledStudents.length === 0" class="text-white">No hay estudiantes matriculados.</div>
      <ul v-else class="space-y-4 text-white">
        <li
          v-for="student in enrolledStudents"
          :key="student.id"
          class="flex items-center space-x-4"
        >
          <UAvatar
            size="md"
            :text="(student.first_name[0] || '') + (student.last_name[0] || '')"
            color="gray"
          />
          <div>
            <p class="text-base font-medium uppercase">
              {{ student.first_name }} {{ student.last_name }}
            </p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style>
    .prueba{
        border: 1px solid black;
    }

    .containereee {
        border: 1px solid black;
        height: 100vh;
        width: 100%;
    }
</style>
