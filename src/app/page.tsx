export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-4xl font-bold mb-4">AI Interview Helper</h1>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Prepare for your interviews with our AI-powered interview helper. Create interview sessions, 
          track your performance, and improve your skills.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">User Authentication</h2>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Register with full name, email, and password</li>
              <li>Secure login with JWT authentication</li>
              <li>View and manage your profile</li>
              <li>Secure session management</li>
            </ul>
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">API Endpoints:</span>
              <code className="block mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-x-auto">
                POST /api/auth/register<br />
                POST /api/auth/login<br />
                GET /api/auth/me<br />
                GET /api/auth/logout
              </code>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Interview Sessions</h2>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Create new interview sessions</li>
              <li>Specify job position, company, and meeting details</li>
              <li>Track interview performance</li>
              <li>View your interview history</li>
            </ul>
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">API Endpoints:</span>
              <code className="block mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-x-auto">
                POST /api/interview<br />
                GET /api/interview<br />
                GET /api/interview/:id<br />
                PUT /api/interview/:id<br />
                DELETE /api/interview/:id
              </code>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500">
          © 2025 AI Interview Helper. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
