const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen px-4 text-center">
      <p className="text-sm font-semibold text-blue-600">404 error</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Page not found 😕
      </h1>
      <p className="mt-4 text-base text-gray-600">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <div className="mt-6">
        <a
          href="/"
          className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Go back home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
