'use client';
import { useState } from 'react';
const tabs = ['Description', 'Specs', 'Reviews'] as const;

export default function ProductTabs({ description, specs, reviews }:{
  description: string; specs: string; reviews: string[];
}) {
  const [active, setActive] = useState<(typeof tabs)[number]>('Description');
  return (
    <div className="mt-4">
      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t} onClick={()=>setActive(t)} className={`px-3 py-1 rounded border ${active===t?'bg-gray-100':''}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="mt-3 border rounded p-3">
        {active==='Description' && <p>{description}</p>}
        {active==='Specs' && <pre className="whitespace-pre-wrap">{specs}</pre>}
        {active==='Reviews' && <ul className="list-disc pl-5">{reviews?.length?reviews.map((r,i)=><li key={i}>{r}</li>):<li>No reviews yet.</li>}</ul>}
      </div>
    </div>
  );
}
