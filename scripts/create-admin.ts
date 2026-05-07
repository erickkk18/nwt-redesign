// Facts:
// 1. One-off CLI: `pnpm tsx scripts/create-admin.ts`. Not imported.
// 2. Glob: scripts/create-admin.ts returned No files found.
// 3. Writes one document to MongoDB collection `users` via Payload Local API.
//    Fields: { email, password (hashed), name, role: 'admin' }.
// 4. User: "create me an account. if doenst have an account it automatically
//    goes to login".

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const EMAIL = process.env.ADMIN_EMAIL ?? 'jhay.dev1840@gmail.com'
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'NwtAdmin!2026'
const NAME = process.env.ADMIN_NAME ?? 'Admin'

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: EMAIL } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const u = existing.docs[0] as { id: string; email: string; role?: string }
    await payload.update({
      collection: 'users',
      id: u.id,
      data: { password: PASSWORD, role: 'admin', name: NAME },
    })
    console.log(`✓ Updated existing user ${EMAIL} (id=${u.id}) → role=admin, password reset.`)
  } else {
    const created = await payload.create({
      collection: 'users',
      data: { email: EMAIL, password: PASSWORD, name: NAME, role: 'admin' },
    })
    console.log(`✓ Created admin user ${EMAIL} (id=${created.id}).`)
  }

  console.log('')
  console.log('Login at:  http://localhost:3001/admin')
  console.log(`Email:     ${EMAIL}`)
  console.log(`Password:  ${PASSWORD}`)
  console.log('')
  console.log('Change the password after first login (top-right avatar → Account).')

  process.exit(0)
}

main().catch((err) => {
  console.error('create-admin failed:', err)
  process.exit(1)
})
