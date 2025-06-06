import { NextPage } from 'next';
import { ErrorProps } from 'next/error';

const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
      <p className="mt-4 text-gray-600">
        Please try refreshing the page or contact support if the problem persists.
      </p>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage; 