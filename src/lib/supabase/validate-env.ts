function decodeJwtPayload(token: string): { ref?: string } | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    return JSON.parse(atob(padded)) as { ref?: string }
  } catch {
    return null
  }
}

export function formatAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Something went wrong'

  if (message.toLowerCase().includes('invalid api key')) {
    return 'Invalid Supabase API key. Copy a fresh anon key from Supabase Dashboard → Project Settings → API and update your .env file, then restart the dev server.'
  }

  if (message.toLowerCase().includes('user already registered')) {
    return 'An account with this email already exists. Try signing in instead.'
  }

  if (message.toLowerCase().includes('password')) {
    return message
  }

  return message
}

export function getSupabaseProjectRef(anonKey: string): string | null {
  return decodeJwtPayload(anonKey)?.ref ?? null
}

export function validateSupabaseConfig(url: string, anonKey: string): string | null {
  if (!url || !anonKey) {
    return 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env'
  }

  const ref = getSupabaseProjectRef(anonKey)
  if (!ref || ref.includes('\uFFFD') || ref.length < 10) {
    return 'Supabase anon key looks corrupted. Copy it again from the dashboard without extra spaces or line breaks.'
  }

  if (!url.includes(ref)) {
    return `API key is for project "${ref}" but URL is "${url}". They must match.`
  }

  return null
}
