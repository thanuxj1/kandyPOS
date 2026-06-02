import { NextResponse } from 'next/server'
import sql from '@/lib/db'

// ── Seed data (the current hardcoded projects) ─────────────────────────────
const SEED_PROJECTS = [
  {
    id: 'royal-bean',
    title: 'The Royal Bean Cafe',
    client: 'Royal Bean Ltd',
    category: 'Cafe & Bistro POS',
    description: 'Cloud table ordering, split-billing, and KDS dispatch deployed across 4 coffee shop branches.',
    features: JSON.stringify(['Split-billing checkout', 'Kitchen KDS sync', 'WhatsApp receipt dispatch']),
    color: 'teal',
    icon: 'cafe',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    requires_permission: false,
    project_url: 'https://kandypos.com/bean-demo',
    sort_order: 0,
  },
  {
    id: 'city-grocers',
    title: 'City Grocers Supermarket',
    client: 'City Grocers Corp',
    category: 'Supermarket POS',
    description: 'Dual-display checkouts integrated with weighing scales, barcode printers, and inventory tracking.',
    features: JSON.stringify(['Customer secondary screens', 'Weigh scale barcode sync', 'Real-time stock alerts']),
    color: 'green',
    icon: 'market',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    requires_permission: false,
    project_url: 'https://kandypos.com/grocery-demo',
    sort_order: 1,
  },
  {
    id: 'heritage-boutique',
    title: 'Heritage Fashion Boutique',
    client: 'Heritage Silk Co',
    category: 'Boutique Retail Suite',
    description: 'Elegant POS tablet counters synced with smart CRM, fashion inventory, and electronic gift cards.',
    features: JSON.stringify(['Loyalty customer CRM', 'Digital instant receipt', 'Smart tag barcode registers']),
    color: 'teal',
    icon: 'retail',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    requires_permission: true,
    project_url: null,
    sort_order: 2,
  },
]

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id                  TEXT PRIMARY KEY,
      title               TEXT NOT NULL,
      client              TEXT NOT NULL DEFAULT '',
      category            TEXT NOT NULL DEFAULT '',
      description         TEXT NOT NULL DEFAULT '',
      features            TEXT NOT NULL DEFAULT '[]',
      color               TEXT NOT NULL DEFAULT 'teal',
      icon                TEXT NOT NULL DEFAULT 'retail',
      image               TEXT,
      requires_permission BOOLEAN NOT NULL DEFAULT FALSE,
      project_url         TEXT,
      sort_order          INTEGER NOT NULL DEFAULT 0
    )
  `
}

// GET /api/projects — return all, seed on first run
export async function GET() {
  try {
    await ensureTable()
    let rows = await sql`SELECT * FROM projects ORDER BY sort_order ASC, id ASC`

    if (rows.length === 0) {
      // First-run seed
      for (const p of SEED_PROJECTS) {
        await sql`
          INSERT INTO projects (id, title, client, category, description, features, color, icon, image, requires_permission, project_url, sort_order)
          VALUES (${p.id}, ${p.title}, ${p.client}, ${p.category}, ${p.description}, ${p.features}, ${p.color}, ${p.icon}, ${p.image}, ${p.requires_permission}, ${p.project_url}, ${p.sort_order})
          ON CONFLICT (id) DO NOTHING
        `
      }
      rows = await sql`SELECT * FROM projects ORDER BY sort_order ASC, id ASC`
    }

    // Parse features JSON string back to array
    const parsed = rows.map((r) => ({
      ...r,
      features: (() => {
        try { return JSON.parse(r.features) } catch { return [] }
      })(),
      requiresPermission: r.requires_permission,
      projectUrl: r.project_url,
    }))

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('GET /api/projects error:', err)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects — create or update (upsert by id)
export async function POST(req: Request) {
  try {
    await ensureTable()
    const body = await req.json()
    const {
      id, title, client = '', category = '', description = '',
      features = [], color = 'teal', icon = 'retail',
      image = null, requiresPermission = false, projectUrl = null,
      sort_order = 0,
    } = body

    if (!id || !title) {
      return NextResponse.json({ error: 'id and title are required' }, { status: 400 })
    }

    const featuresStr = JSON.stringify(Array.isArray(features) ? features : [])

    const result = await sql`
      INSERT INTO projects (id, title, client, category, description, features, color, icon, image, requires_permission, project_url, sort_order)
      VALUES (${id}, ${title}, ${client}, ${category}, ${description}, ${featuresStr}, ${color}, ${icon}, ${image}, ${requiresPermission}, ${projectUrl}, ${sort_order})
      ON CONFLICT (id) DO UPDATE SET
        title               = EXCLUDED.title,
        client              = EXCLUDED.client,
        category            = EXCLUDED.category,
        description         = EXCLUDED.description,
        features            = EXCLUDED.features,
        color               = EXCLUDED.color,
        icon                = EXCLUDED.icon,
        image               = EXCLUDED.image,
        requires_permission = EXCLUDED.requires_permission,
        project_url         = EXCLUDED.project_url,
        sort_order          = EXCLUDED.sort_order
      RETURNING *
    `

    const row = result[0]
    return NextResponse.json({
      ...row,
      features: (() => { try { return JSON.parse(row.features) } catch { return [] } })(),
      requiresPermission: row.requires_permission,
      projectUrl: row.project_url,
    })
  } catch (err) {
    console.error('POST /api/projects error:', err)
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 })
  }
}

// DELETE /api/projects?id=xxx
export async function DELETE(req: Request) {
  try {
    await ensureTable()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id query param required' }, { status: 400 })
    }

    await sql`DELETE FROM projects WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/projects error:', err)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
