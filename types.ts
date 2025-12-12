
export interface BlogPost {
  id: number;
  date: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  content?: {
    rendered: string;
  };
  type?: string;
  acf?: {
    post_url?: string;
  };
}

export interface NavItem {
  name: string;
  href: string;
}

export interface Project {
  title: string;
  role: string;
  description: string;
  size: 'large' | 'tall' | 'wide' | 'medium' | 'small';
}

export interface ProjectPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf: {
    title?: string;
    description?: string;
    url?: string;
    event_image?: number;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
  };
}
