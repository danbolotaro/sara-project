import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAuthenticated, unauthorized } from '@/lib/session'

const INVALID_ID_CODE = '22P02'

const VALID_GENDERS = ['Masculino', 'Feminino']

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) return unauthorized()

  const { id } = await params

  const { data, error } = await supabase
    .from('person')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error && error.code !== INVALID_ID_CODE) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Pessoa não encontrada' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) return unauthorized()

  const { id } = await params
  const body = await request.json()

  if (body.gender && !VALID_GENDERS.includes(body.gender)) {
    return NextResponse.json({ error: 'Gênero inválido' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = {}
  if (body.name !== undefined) updateData.name = body.name
  if (body.gender !== undefined) updateData.gender = body.gender
  if (body.age !== undefined) updateData.age = body.age
  if (body.hometown !== undefined) updateData.hometown = body.hometown
  if (body.story !== undefined) updateData.story = body.story
  if (body.contacts !== undefined) updateData.contacts = body.contacts

  const { data, error } = await supabase
    .from('person')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Pessoa não encontrada' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) return unauthorized()

  const { id } = await params

  const { data, error } = await supabase
    .from('person')
    .delete()
    .eq('id', id)
    .select('id')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Pessoa não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Pessoa excluída com sucesso' })
}
