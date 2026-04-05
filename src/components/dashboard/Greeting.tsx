"use client";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const Greeting = () => (
  <div className="mb-4 md:mb-6">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
      {getGreeting()}, Nikunj 👋
    </h2>
    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
      Here&apos;s a summary of your financial activity.
    </p>
  </div>
);

export default Greeting;