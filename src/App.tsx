import { useContext, useEffect } from "react";
import useRouteElement from "./useRouteElement";
import { ToastContainer } from "react-toastify";
import { AppContext } from "./contexts/app.context";
import { LocalStorageEventTarget } from "./ultils/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProvider } from "./contexts/app.context.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

function App() {
  const useRoute = useRouteElement();
  const { reset } = useContext(AppContext);

  useEffect(() => {
    LocalStorageEventTarget.addEventListener("clearLS", reset);
    return () => {
      LocalStorageEventTarget.removeEventListener("clearLS", reset);
    };
  }, [reset]);
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ErrorBoundary>
            {useRoute}
            <ToastContainer />
          </ErrorBoundary>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
