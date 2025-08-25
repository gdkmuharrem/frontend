// app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Siteye gelenleri varsayılan dil sayfasına yönlendir
  redirect('/tr');
}
