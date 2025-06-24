import { useSupabase } from '~/server/useSupabase'

export default defineEventHandler(async (event) => {
	const { supabase, user } = await useSupabase(event)

	const { data: courses, error } = await supabase
		.from('courses')
		.select('*')
		.eq('teacher_id', user?.id)
		
	return {
		courses,
		error
	}
})
