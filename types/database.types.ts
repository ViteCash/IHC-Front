export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'alumno' | 'profesor'
          first_name: string | null
          last_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'alumno' | 'profesor'
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'alumno' | 'profesor'
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          course_code: string
          teacher_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          course_code: string
          teacher_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          course_code?: string
          teacher_id?: string
          created_at?: string
          updated_at?: string
        }
      }

      course_requests: {
        Row: {
          id: string
          course_id: string
          student_id: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          student_id: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          student_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }

      course_enrollments: {
        Row: {
          id: string
          course_id: string
          student_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          course_id: string
          student_id: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          student_id?: string
          enrolled_at?: string
        }
      }

      course_materials: {
        Row: {
          id: string
          course_id: string
          title: string
          file_name: string
          file_url: string
          file_size: number | null
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          file_name: string
          file_url: string
          file_size?: number | null
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          file_name?: string
          file_url?: string
          file_size?: number | null
          uploaded_by?: string
          created_at?: string
        }
      }

      practice_sessions: {
        Row: {
          id: string
          student_id: string
          material_id: string
          questions_generated: Json
          started_at: string
          completed_at: string | null
          total_questions: number
          correct_answers: number
          status: 'in_progress' | 'completed'
        }
        Insert: {
          id?: string
          student_id: string
          material_id: string
          questions_generated: Json
          started_at?: string
          completed_at?: string | null
          total_questions: number
          correct_answers?: number
          status?: 'in_progress' | 'completed'
        }
        Update: {
          id?: string
          student_id?: string
          material_id?: string
          questions_generated?: Json
          started_at?: string
          completed_at?: string | null
          total_questions?: number
          correct_answers?: number
          status?: 'in_progress' | 'completed'
        }
      }

      student_answers: {
        Row: {
          id: string
          session_id: string
          question_index: number
          question_text: string
          student_answer: string
          correct_answer: string
          is_correct: boolean
          answered_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_index: number
          question_text: string
          student_answer: string
          correct_answer: string
          is_correct: boolean
          answered_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question_index?: number
          question_text?: string
          student_answer?: string
          correct_answer?: string
          is_correct?: boolean
          answered_at?: string
        }
      }
    }
  }
}
