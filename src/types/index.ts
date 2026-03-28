export interface Status {
  id: string
  name: string
  color: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  color: string | null
  created_at: string
}

export interface Book {
  id: string
  title: string
  author: string | null
  cover_image_url: string | null
  status_id: string | null
  note: string | null
  pos_x: number | null
  pos_y: number | null
  created_at: string
  updated_at: string
}

export interface BookWithRelations extends Book {
  status: Status | null
  categories: Category[]
}

export interface GoogleBook {
  id: string
  title: string
  authors: string[]
  thumbnail: string | null
}
