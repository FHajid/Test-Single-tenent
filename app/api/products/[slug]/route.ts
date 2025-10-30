import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const sb = supabaseAnon();
  const { data: product, error } = await sb.from('products').select('*').eq('slug', params.slug).single();
  if (error || !product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: st } = await sb.from('stock').select('qty').eq('product_id', product.id).single();
  return NextResponse.json({ ...product, qty: st?.qty ?? 0 });
}
