import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Diagram Builder</h1>
      <Link href="/diagram">Create Diagram</Link>
    </div>
  );
}