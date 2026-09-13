import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const personId = searchParams.get('person_id')

  let query = supabase
    .from('encounter')
    .select('*, person:person_id(id, name)')
    .order('date', { ascending: false })

  if (personId) {
    query = query.eq('person_id', personId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (!body.person_id || !body.date) {
    return NextResponse.json(
      { error: 'Campos "person_id" e "date" são obrigatórios' },
      { status: 400 }
    )
  }

  const { data: person } = await supabase
    .from('person')
    .select('id')
    .eq('id', body.person_id)
    .single()

  if (!person) {
    return NextResponse.json({ error: 'Pessoa não encontrada' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('encounter')
    .insert({
      person_id: body.person_id,
      date: body.date,
      location: body.location || null,
      prayer_request: body.prayer_request || null,
      notes: body.notes || null,
      contacts: body.contacts || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
