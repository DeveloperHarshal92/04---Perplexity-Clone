import { createBrowserRouter, Navigate, useRouteError } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Profile from "../features/chat/pages/Profile";

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const errorMessage =
    error?.statusText || error?.message || "An unexpected error occurred.";

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-[#faf8f5] text-[#27251e] font-sans selection:bg-[#016a71]/15">
      <div className="w-full max-w-[440px] bg-[#fdfbfa] border border-[#d1d1cd] rounded-[16px] p-6 sm:p-8 card-subtle-shadow text-center">
        <div className="w-10 h-10 rounded-[12px] bg-[#27251e] text-[#faf8f5] flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[20px]">error_outline</span>
        </div>
        <h1 className="text-[20px] font-normal text-[#27251e] tracking-tight mb-2">
          Workspace Error
        </h1>
        <p className="text-[13px] text-[#72706b] mb-6 leading-relaxed">
          {errorMessage}
        </p>
        <div className="flex gap-2.5 justify-center">
          <button
            type="button"
            onClick={() => window.location.assign("/")}
            className="px-4 py-2 rounded-[12px] bg-[#27251e] text-[#faf8f5] text-[13px] font-normal hover:bg-[#000000] active:scale-[0.99] transition-all cursor-pointer"
          >
            Return to Search
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-[6px] border border-[#d1d1cd] bg-transparent text-[#72706b] hover:text-[#27251e] hover:bg-[#f0ede6] text-[13px] font-normal active:scale-[0.99] transition-all cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/profile",
    element: (
      <Protected>
        <Profile />
      </Protected>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/discover",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/spaces",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/library",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/explore",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
