import Image from "next/image";

export default function Home() {
  return (
    <div
      className="relative font-sans min-h-screen flex flex-col items-center justify-center p-8 sm:p-20"
    >
      {/* Background image layer */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/test1.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
        {/* Optional gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-green-900/30 dark:bg-black/50" />
      </div>

      <main className="flex flex-col gap-10 items-center w-full max-w-xl relative">
        <h1 className="text-4xl font-bold text-green-900 dark:text-green-200 text-center bg-white/70 dark:bg-gray-900/70 rounded-lg p-4">
          About Tree Tracker
        </h1>
        <p className="text-lg text-green-800 dark:text-green-300 text-center bg-white/70 dark:bg-gray-900/70 rounded-lg p-4">
          Tree Tracker helps you track, manage, and celebrate trees in your community. Our mission is to make the world greener, one tree at a time.
        </p>
      </main>

      <footer className="mt-16 text-green-700 dark:text-green-300 text-sm text-center">
        &copy; {new Date().getFullYear()} Tree Tracker. All rights reserved.
      </footer>
    </div>
  );
}