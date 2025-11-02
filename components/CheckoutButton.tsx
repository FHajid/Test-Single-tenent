'use client';

import { useFormStatus } from 'react-dom';

export default function CheckoutButton() {
  const { pending } = useFormStatus(); // tracks form submission state

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={() => {
        if (!pending) alert('Checkout submitted');
      }}
      className={`mt-2 rounded px-4 py-2 text-white ${
        pending ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
      }`}
    >
      {pending ? 'Processing...' : 'Checkout'}
    </button>
  );
}
