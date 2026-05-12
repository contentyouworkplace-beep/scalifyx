import Link from 'next/link';

export function LegalFooter() {
  return (
    <footer className="border-t border-border mt-20 py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
        <p>© 2026 Scalify. All rights reserved.</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/refund" className="hover:text-white transition">Refund Policy</Link>
          <Link href="/shipping" className="hover:text-white transition">Shipping</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
