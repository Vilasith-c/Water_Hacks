import { auth } from '@clerk/nextjs/server';
import DocumentManager from '@/components/DocumentManager';

export default async function Dashboard() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-blue-600">Enterprise Collab</h1>
          <p className="text-gray-600 mb-6">Secure AI-powered document management.</p>
          <a href="/sign-in" className="inline-block bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Enterprise Dashboard</h1>
        <div className="text-gray-600 text-sm">User: {userId}</div>
      </header>
      
      <main className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Recent Documents</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">14</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Pending Workflows</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">3</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Storage Usage</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">45%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Timeline</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">John uploaded Employee Handbook</p>
                  <p className="text-xs text-gray-500">09:21 AM</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Sarah approved Leave Policy</p>
                  <p className="text-xs text-gray-500">09:24 AM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">AI Insights</h2>
            <p className="text-sm text-blue-900 mb-4">
              Employee Rahul has not accessed Finance documents in 94 days.
            </p>
            <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Review Access</button>
          </div>
        </div>

        <DocumentManager organizationId="org_default_test_id" />
      </main>
    </div>
  );
}
