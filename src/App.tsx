import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout/layout";
import { NotFound } from "@/components/layout/not-found";
import { AccountsPage } from "@/features/accounts/pages/accounts-page";
import { LedgerEntriesPage } from "@/features/ledger-entries/pages/entries-page";
import { PATHS } from "@/lib/paths";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to={PATHS.ACCOUNTS} replace />} />
            <Route path={PATHS.ACCOUNTS} element={<AccountsPage />} />
            <Route path={PATHS.LEDGER_ENTRIES} element={<LedgerEntriesPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
