export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  cover_image: string;
  images: string[]; // JSONB in DB, but we'll treat as array of URLs
  created_at: string;
}

export type CreateProductInput = Omit<Product, 'id' | 'created_at'>;
export type UpdateProductInput = Partial<CreateProductInput>;
