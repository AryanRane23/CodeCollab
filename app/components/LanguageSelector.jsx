// app/page.js (Homepage with buttons to go to /java, /python etc.)

// LANGUAGE SELECT - DROPDOWN component

// app/page.js
'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleChange = (e) => {
    const selectedPath = e.target.value;
    if (selectedPath) {
      router.push(selectedPath);
    }
  };

  return (
    <main className="p-6 flex flex-col text-red-600 absolute right-[93px] top-[82px]">
      <select onChange={handleChange} className="p-2 bg-white border-white border-1 rounded text-gray-900 cursor-pointer max-h-32 overflow-y-auto"
     >
        <option value="">Select Language</option>
        {/* <optgroup label="Popular"> */}
        <option value="/javascript">JavaScript</option>
        <option value="/typescript">TypeScript</option>
        <option value="/python">Python</option>
        <option value="/java">Java</option>
        <option value="/cpp">C++</option>
        <option value="/c">C</option>
        <option value="/cs">C#</option>
        {/* </optgroup> */}
        
        <option value="/go">Go</option>
        <option value="/php">PHP</option>
        <option value="/ruby">Ruby</option>
        <option value="/swift">Swift</option>
        <option value="/kotlin">Kotlin</option>
        <option value="/rust">Rust</option>
        <option value="/r">R</option>
        <option value="/perl">Perl</option>
        <option value="/bash">Bash</option>
        <option value="/dart">Dart</option>
        <option value="/scala">Scala</option>
        <option value="/sql">SQL</option>
        <option value="/html">HTML</option>
        <option value="/xml">XML</option>
        <option value="/markdown">Markdown</option>
      </select>
    </main>
  );
}

// Aao na , pal pal titli ud 