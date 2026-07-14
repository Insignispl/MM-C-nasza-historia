export interface WeddingSettings {
  id: string;
  groom_name: string;
  bride_name: string;
  bride_maiden_name: string | null;
  couple_name: string;
  wedding_date: string;
  location: string;
  story_text: string | null;
  cover_image: string | null;
  primary_color: string;
  secondary_color: string;
  guest_password: string;
  allow_uploads: boolean;
  require_moderation: boolean;
  created_at: string;
  updated_at: string;
}

export type MediaType = "image" | "video";

export interface Media {
  id: string;
  type: MediaType;
  storage_path: string;
  public_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  guest_name: string | null;
  uploaded_by: string | null;
  approved: boolean;
  featured: boolean;
  created_at: string;
}

export interface GuestbookEntry {
  id: string;
  author_name: string;
  message: string;
  relation: string | null;
  media_url: string | null;
  approved: boolean;
  created_at: string;
}
