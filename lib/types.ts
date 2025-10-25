export interface PortfolioSeries {
  id: string
  title: string
  description: string | null
  cover_image_url: string
  order_index: number
  created_at: string
  updated_at: string
  published?: boolean
  image_count?: number
}

export interface PortfolioImage {
  id: string
  series_id: string
  image_url: string
  title: string | null
  caption: string | null
  order_index: number
  created_at: string
  published?: boolean
}

export interface AdminSession {
  id: string
  session_token: string
  expires_at: string
  created_at: string
}
