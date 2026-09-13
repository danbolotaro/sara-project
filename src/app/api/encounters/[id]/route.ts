import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('encounter')
    .select('*, person:person_id(id, name)')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Encontro não encontrado' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const updateData: Record<string, unknown> = {}
  if (body.person_id !== undefined) updateData.person_id = body.person_id
  if (body.date !== undefined) updateData.date = body.date
  if (body.location !== undefined) updateData.location = body.location
  if (body.prayer_request !== undefined) updateData.prayer_request = body.prayer_request
  if (body.notes !== undefined) updateData.notes = body.notes
  if (body.contacts !== undefined) updateData.contacts = body.contacts

  const { data, error } = await supabase
    .from('encounter')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Encontro não encontrado' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { error } = await supabase
    .from('encounter')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Encontro não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Encontro excluído com sucesso' })
}
