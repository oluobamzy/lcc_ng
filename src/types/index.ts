export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  slug: string;
  tags: string[];
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  path: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface SiteSettings {
  churchName: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  serviceTimes: {
    sunday: string[];
    wednesday: string;
    youth: string;
  };
}