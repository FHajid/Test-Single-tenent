import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase';

export async function GET() {
  const sb = supabaseAnon();
  const { data: products, error: e1 } = await sb.from('products').select('*').order('id');
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });

  const ids = (products ?? []).map(p => p.id);
  const { data: stocks, error: e2 } = await sb.from('stock').select('*').in('product_id', ids.length?ids:[-1]);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  const qtyMap = new Map<number, number>();
  (stocks ?? []).forEach(s => qtyMap.set(s.product_id, s.qty));
  return NextResponse.json((products ?? []).map(p => ({ ...p, qty: qtyMap.get(p.id) ?? 0 })));
}
