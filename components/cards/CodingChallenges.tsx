import Link from "next/link";
import { Code2Icon, RocketIcon } from "lucide-react"; // Using professional icons

export default function CodingChallenges() {
  return (
    <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      {/* Icon + Title */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-100 dark:bg-blue-700 p-2 rounded-full">
          <RocketIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Coding Challenge of the Day
        </h3>
      </div>

      {/* Challenge Statement */}
      <div className="mt-4 px-4 py-3 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-md border border-dashed border-blue-300 dark:border-blue-700 shadow-inner">
        <div className="flex items-start gap-2">
          <Code2Icon className="mt-1 text-blue-500 dark:text-blue-300" />
          <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold leading-snug">
            Flash up your logic,{" "}
            <span className="text-blue-600 dark:text-blue-300">
              Golden Flash
            </span>
            ! <br />
            Today’s challenge is just one click away ⚡
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-4">
        <Link
          href="/challenges"
          className="inline-block text-white bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 px-4 py-2 rounded-md font-semibold text-sm transition-all duration-300 hover:brightness-110 "
        >
          Try Now →
        </Link>
      </div>
    </div>
  );
}
