import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAuthenticated, unauthorized } from '@/lib/session'

export async function GET() {
  if (!(await isAuthenticated())) return unauthorized()

  const { data, error } = await supabase
    .from('person')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

const VALID_GENDERS = ['Masculino', 'Feminino']

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized()

  const body = await request.json()

  if (!body.name) {
    return NextResponse.json({ error: 'Campo "nome" é obrigatório' }, { status: 400 })
  }

  if (body.gender && !VALID_GENDERS.includes(body.gender)) {
    return NextResponse.json({ error: 'Gênero inválido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('person')
    .insert({
      name: body.name,
      gender: body.gender || null,
      age: body.age || null,
      hometown: body.hometown || null,
      story: body.story || null,
      contacts: body.contacts || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
