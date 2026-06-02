import { NextResponse } from 'next/server'
import sql from '@/lib/db'

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    )
  `
}

// GET /api/settings — returns all settings as a flat object { key: value }
export async function GET() {
  try {
    await ensureTable()
    const rows = await sql`SELECT key, value FROM settings`
    const result: Record<string, string> = {}
    for (const row of rows) {
      result[row.key] = row.value
    }
    return NextResponse.json(result)
  } catch (err) {
    console.error('GET /api/settings error:', err)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// POST /api/settings — upsert one or more { key: value } pairs
export async function POST(req: Request) {
  try {
    await ensureTable()
    const body = await req.json() as Record<string, string>

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Body must be a key-value object' }, { status: 400 })
    }

    for (const [key, value] of Object.entries(body)) {
      await sql`
        INSERT INTO settings (key, value)
        VALUES (${key}, ${value ?? ''})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/settings error:', err)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
