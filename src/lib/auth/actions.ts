'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types'

export type AuthState = {
  error?: string
  success?: string
}

function roleDestination(role: UserRole): string {
  if (role === 'student' || role === 'instructor') return '/dashboard/cursos'
  return '/dashboard'  // superadmin, admin
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Completa todos los campos.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Correo o contraseña incorrectos.' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Confirma tu correo electrónico antes de acceder.' }
    }
    return { error: 'Error al acceder. Intenta de nuevo.' }
  }

  // Fetch role for role-based redirect
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  redirect(roleDestination((profile?.role ?? 'student') as UserRole))
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = (formData.get('first_name') as string)?.trim()
  const lastName = (formData.get('last_name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!firstName || !lastName || !email || !password) {
    return { error: 'Completa todos los campos.' }
  }
  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  }
  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: `${firstName} ${lastName}` },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/acceder`,
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Este correo ya está registrado.' }
    }
    return { error: 'No se pudo crear la cuenta. Intenta de nuevo.' }
  }

  return { success: 'Revisa tu correo para confirmar la cuenta antes de acceder.' }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/acceder')
}

export async function recoverPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get('email') as string)?.trim()

  if (!email) {
    return { error: 'Ingresa tu correo electrónico.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/actualizar-password`,
  })

  if (error) {
    return { error: 'No se pudo enviar el enlace. Verifica el correo.' }
  }

  return { success: 'Te enviamos un enlace para restablecer tu contraseña.' }
}

export async function updatePasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!password || !confirmPassword) {
    return { error: 'Completa todos los campos.' }
  }
  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  }
  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sesión expirada. Solicita un nuevo enlace de recuperación.' }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return { error: 'No se pudo actualizar la contraseña. El enlace puede haber expirado.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  redirect(roleDestination((profile?.role ?? 'student') as UserRole))
}
