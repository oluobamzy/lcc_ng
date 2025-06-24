export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  title: string;
  description?: string;
  tags?: string[];
  uploadedAt?: Date | string;
  size?: number;
}