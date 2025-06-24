import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export const useSupabase = async (event: any) => {
	const supabase = serverSupabaseServiceRole(event)
	const user = await serverSupabaseUser(event)
	
	return { supabase, user }
}