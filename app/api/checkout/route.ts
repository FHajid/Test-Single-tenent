import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import { revalidateTag } from 'next/cache';
import { CATALOG_TAG } from '@/lib/constants';

export async function POST(req: Request) {
  const { productId } = await req.json();
  const sb = supabaseService();
  const { data, error } = await sb.rpc('checkout_atomic', { p_product_id: productId });

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  if (data === true) {
    // Revalidate the catalog cache
    revalidateTag(CATALOG_TAG, '');
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: 'Out of stock' }, { status: 409 });
}
