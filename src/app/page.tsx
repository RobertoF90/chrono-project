import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';

export default function Page() {
  return (
    <div>
        <p
      className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
    >
      <strong>Welcome to Chrono Project.</strong> This is the app for {' '}
      <a href="/dashboard" className="text-blue-500">
       Managing your time
      </a>
      , brought to you by Roberto Franco.
    </p>
    </div>
  );
}