// app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;
  const { slug } = params;

  const sb = supabaseAnon();

  const { data: product, error: e1 } = await sb
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (e1 || !product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: st } = await sb
    .from('stock')
    .select('qty')
    .eq('product_id', product.id)
    .single();

  return NextResponse.json({ ...product, qty: st?.qty ?? 0 });
}