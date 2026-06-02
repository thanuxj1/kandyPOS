import { NextResponse } from 'next/server'
import sql from '@/lib/db'

// ── Seed data (the current hardcoded testimonials) ─────────────────────────
const SEED_TESTIMONIALS = [
  { id: 't1', name: 'Thanuja Senanayake', role: 'Managing Director', company: 'The Royal Bean Cafe', text: 'Kandy POS transformed our order speed! Table checkouts take literally 3 seconds now. Our waiters love the handheld terminals, and kitchen slip print-errors have dropped to zero.', rating: 5, avatar: '/professional-headshot-1.png', sort_order: 0 },
  { id: 't2', name: 'Mohamed Rilwan', role: 'Operations Head', company: 'City Grocers Supermarket', text: 'Superb inventory control. We managed to load over 15,000 barcode lines without a single hitch. Even during internet outages, the checkout counter works perfectly. Essential software!', rating: 5, avatar: '/professional-headshot-2.png', sort_order: 1 },
  { id: 't3', name: 'Dilini Perera', role: 'Founder & Creative', company: 'Heritage Silk Boutique', text: 'Beautiful layout, easy training. We got our sales staff comfortable with the billing tablet in just 10 minutes. The automated WhatsApp bills save us hundreds in paper roll costs.', rating: 5, avatar: '/professional-headshot-3.png', sort_order: 2 },
  { id: 't4', name: 'Kasun Silva', role: 'Franchise Owner', company: 'Burger Hub', text: 'The multi-branch management is phenomenal. I can monitor live sales from all 4 of my outlets straight from my phone. A total game-changer for my business operations.', rating: 5, avatar: '/professional-headshot-4.png', sort_order: 3 },
  { id: 't5', name: 'Amala Fernando', role: 'Retail Manager', company: 'Glow Cosmetics', text: 'Customer loyalty features have brought our repeat customer rate up by 40%. The UI is so slick and modern, our cashiers love using it every day.', rating: 5, avatar: '/professional-headshot-5.png', sort_order: 4 },
  { id: 't6', name: 'Ruwan Wijesinghe', role: 'CEO', company: 'Wijesinghe Hardware', text: "Handling bulk inventory and wholesale pricing used to be a nightmare. Kandy POS handles variable pricing tiers effortlessly. Best POS investment we've ever made.", rating: 5, avatar: '/professional-headshot-1.png', sort_order: 5 },
  { id: 't7', name: 'Chaminda Jayasuriya', role: 'Owner', company: 'Jayasuriya Auto Parts', text: 'The system is incredibly fast and reliable. Even when our internet drops, we never miss a sale. The offline mode is a lifesaver for businesses in Sri Lanka.', rating: 5, avatar: '/professional-headshot-2.png', sort_order: 6 },
  { id: 't8', name: 'Nadeesha Kuruppu', role: 'Finance Director', company: 'Kuruppu Textiles', text: 'Accounting integration is seamless. We save at least 15 hours a week on manual bookkeeping. It\'s the most comprehensive ERP we\'ve used.', rating: 5, avatar: '/professional-headshot-3.png', sort_order: 7 },
  { id: 't9', name: 'Suresh Bandara', role: 'General Manager', company: 'Bandara Hotels', text: 'The AI chatbot features have revolutionized how we take reservations. Our staff can focus on the guests while the system handles the busywork.', rating: 5, avatar: '/professional-headshot-4.png', sort_order: 8 },
]

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      role       TEXT NOT NULL DEFAULT '',
      company    TEXT NOT NULL DEFAULT '',
      text       TEXT NOT NULL,
      rating     INTEGER NOT NULL DEFAULT 5,
      avatar     TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `
}

// GET /api/testimonials — return all, seed on first run
export async function GET() {
  try {
    await ensureTable()
    let rows = await sql`SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC`

    if (rows.length === 0) {
      // First-run seed
      for (const t of SEED_TESTIMONIALS) {
        await sql`
          INSERT INTO testimonials (id, name, role, company, text, rating, avatar, sort_order)
          VALUES (${t.id}, ${t.name}, ${t.role}, ${t.company}, ${t.text}, ${t.rating}, ${t.avatar}, ${t.sort_order})
          ON CONFLICT (id) DO NOTHING
        `
      }
      rows = await sql`SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC`
    }

    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/testimonials error:', err)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

// POST /api/testimonials — create or update (upsert by id)
export async function POST(req: Request) {
  try {
    await ensureTable()
    const body = await req.json()
    const { id, name, role = '', company = '', text, rating = 5, avatar = '', sort_order = 0 } = body

    if (!id || !name || !text) {
      return NextResponse.json({ error: 'id, name and text are required' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO testimonials (id, name, role, company, text, rating, avatar, sort_order)
      VALUES (${id}, ${name}, ${role}, ${company}, ${text}, ${rating}, ${avatar}, ${sort_order})
      ON CONFLICT (id) DO UPDATE SET
        name       = EXCLUDED.name,
        role       = EXCLUDED.role,
        company    = EXCLUDED.company,
        text       = EXCLUDED.text,
        rating     = EXCLUDED.rating,
        avatar     = EXCLUDED.avatar,
        sort_order = EXCLUDED.sort_order
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (err) {
    console.error('POST /api/testimonials error:', err)
    return NextResponse.json({ error: 'Failed to save testimonial' }, { status: 500 })
  }
}

// DELETE /api/testimonials?id=xxx
export async function DELETE(req: Request) {
  try {
    await ensureTable()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id query param required' }, { status: 400 })
    }

    await sql`DELETE FROM testimonials WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/testimonials error:', err)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
