export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl">
          Welcome to the <span className="text-indigo-600">Education Platform</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Master full-stack development, data science, and modern engineering with our interactive courses.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <button className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Browse Courses
          </button>
          <button className="px-8 py-3 bg-white text-slate-900 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            Student Login
          </button>
        </div>
      </div>
    </main>
  );
}