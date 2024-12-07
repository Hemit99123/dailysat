import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession as getEmployeeSession } from './lib/employeeSession';

export const middleware = async (request: NextRequest) => {
  const protectedEmployeeBackendRoutes = [
    '/api/employee',
  ];

  const protectedEmployeeFrontendRoutes = [
    '/api-docs'
  ]

  // Check if the request path matches any protected route for backend (ONLY EMPLOYEES ALLOWED)
  const isProtectedEmployeeBackend = protectedEmployeeBackendRoutes.includes(request.nextUrl.pathname);

  if (isProtectedEmployeeBackend) {
    const isSessionValid = await getEmployeeSession();

    if (!isSessionValid) {
      return Response.json({
        error: "You do not have the proper employee authorization"
      })
    }
  }

  // Now we handle frontend for employee unauthorization because the UI would be different
  // It will redirect it to another page where it will say unauthorized
  // This makes more sense for the frontend rather than spitting out some json that could confuse the user (better UX)

  const isProtectedEmployeeFrontend = protectedEmployeeFrontendRoutes.includes(request.nextUrl.pathname);

  if (isProtectedEmployeeFrontend) {
    const isSessionValid = await getEmployeeSession();

    // relative urls do not work (/authorized)
    // so we have to augment it onto the url base itself which is what the nextUrl.clons() method does

    const url = request.nextUrl.clone()
    url.pathname = '/unauthorized'

    if (!isSessionValid) {
      return Response.redirect(url)
    }
  }

  // Allow request to proceed if no matching route is found
  return NextResponse.next();
};
