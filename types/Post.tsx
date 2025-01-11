export type Post = {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  author: string;
  tags: string[];
  image_url: string;
  slug?: string;
};
