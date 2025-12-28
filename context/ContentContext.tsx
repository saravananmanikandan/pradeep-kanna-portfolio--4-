import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types based on the JSON structure
export interface ContentData {
  navbar: {
    items: { name: string; id: string }[];
  };
  hero: {
    greeting: string;
    name: string;
    roles: {
      primary: string;
      secondary: string;
    };
    location: string;
    buttons: {
      blog: string;
    };
    status: {
      active: string;
    };
  };
  about: {
    lines: string[];
  };
  experience: {
    title: string;
    projects: {
      title: string;
      role: string;
      description: string;
      className: string;
      gradient: string;
      borderHover: string;
    }[];
  };
  initiatives: {
    title: string;
    subtitle: string;
    readMore: string;
    exploreButton: string;
    emptyState: string;
    tabs: {
      media: string;
      events: string;
    };
  };
  footer: {
    title: string;
    subtitle: string;
    copyright: string;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
    social: {
      linkedin: string;
      twitter: string;
      instagram: string;
    };
    ticker: {
      items: string[];
    };
    developer: {
      text: string;
      url: string;
    }
  };
}

interface ContentContextType {
  content: ContentData | null;
  loading: boolean;
  error: string | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/content.json');
        if (!response.ok) {
          throw new Error('Failed to load content configuration');
        }
        const data = await response.json();
        setContent(data);
      } catch (err: any) {
        console.error('Error fetching content:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
