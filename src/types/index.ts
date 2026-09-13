export interface Person {
  id: string
  name: string
  gender: string | null
  age: number | null
  hometown: string | null
  story: string | null
  contacts: string | null
  created_at: string
  updated_at: string
}

export interface PersonCreate {
  name: string
  gender?: string
  age?: number
  hometown?: string
  story?: string
  contacts?: string
}

export interface PersonUpdate {
  name?: string
  gender?: string
  age?: number
  hometown?: string
  story?: string
  contacts?: string
}

export interface Encounter {
  id: string
  person_id: string
  date: string
  location: string | null
  prayer_request: string | null
  notes: string | null
  contacts: string | null
  created_at: string
  updated_at: string
}

export interface EncounterWithPerson extends Encounter {
  person: {
    id: string
    name: string
  }
}

export interface EncounterCreate {
  person_id: string
  date: string
  location?: string
  prayer_request?: string
  notes?: string
  contacts?: string
}

export interface EncounterUpdate {
  person_id?: string
  date?: string
  location?: string
  prayer_request?: string
  notes?: string
  contacts?: string
}
