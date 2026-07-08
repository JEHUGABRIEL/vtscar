import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

// Simple SHA-256 hash (not bcrypt but fine for internal admin)
function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex')
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
)

const DEFAULT_ADMIN = {
  email: 'admin@liamgroupe.org',
  password: 'admin123',
  name: 'Admin LIAM',
}

async function createAdmin() {
  console.log('Creating default admin...')
  console.log(`  Email:    ${DEFAULT_ADMIN.email}`)
  console.log(`  Password: ${DEFAULT_ADMIN.password}`)

  const { data: existing } = await supabase
    .from('admins')
    .select('id')
    .eq('email', DEFAULT_ADMIN.email)
    .single()

  if (existing) {
    console.log('  ⓘ Admin already exists, updating password...')
    const { error } = await supabase
      .from('admins')
      .update({ password_hash: hashPassword(DEFAULT_ADMIN.password) })
      .eq('id', existing.id)
    if (error) {
      console.error('  ✗ Error updating admin:', error.message)
      process.exit(1)
    }
    console.log('  ✓ Password updated!')
  } else {
    const { error } = await supabase
      .from('admins')
      .insert({
        email: DEFAULT_ADMIN.email,
        password_hash: hashPassword(DEFAULT_ADMIN.password),
        name: DEFAULT_ADMIN.name,
      })
    if (error) {
      console.error('  ✗ Error creating admin:', error.message)
      process.exit(1)
    }
    console.log('  ✓ Admin created!')
  }

  console.log('\nDone! You can now login at /admin with:')
  console.log(`  Email:    ${DEFAULT_ADMIN.email}`)
  console.log(`  Password: ${DEFAULT_ADMIN.password}`)
}

createAdmin().catch(console.error)
