export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          PropertyFinder Pro
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to your property search application!
        </p>
        <div className="space-y-4">
          <a 
            href="/properties" 
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Properties
          </a>
          <a 
            href="/wizard" 
            className="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Take Property Quiz
          </a>
          <a 
            href="/login" 
            className="block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}