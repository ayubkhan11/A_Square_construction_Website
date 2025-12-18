// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // This tells Next.js to serve the static index.html
  }, []);
  
  return (
    <>
      {/* Empty component - Next.js will serve static files */}
    </>
  );
}