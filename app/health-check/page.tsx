export default async function HealthCheckPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <main className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4 text-green-600">
        ✅ System Health Check: OK
      </h1>
      <p className="mb-6 text-gray-600">
        This page verifies that server-side data fetching and routing are fully functional.
      </p>

      <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
        <h2 className="font-semibold text-lg text-gray-800">Fetched Sample Data:</h2>
        <p className="mt-2 text-gray-700"><strong>Title:</strong> {data.title}</p>
        <p className="mt-1 text-gray-600"><strong>Body:</strong> {data.body}</p>
      </div>
    </main>
  );
}