import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout/layout";
import { NotFound } from "@/components/layout/not-found";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { AccountsPage } from "@/features/accounts/pages/accounts-page";
import { LedgerEntriesPage } from "@/features/ledger-entries/pages/entries-page";
import { BatchModePage } from "@/features/batch-mode/pages/batch-mode-page";
import { DataTransferPage } from "@/features/data-transfer/pages/data-transfer-page";
import { PATHS } from "@/lib/paths";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={PATHS.HOME} element={<DashboardPage />} />
            <Route path={PATHS.ACCOUNTS} element={<AccountsPage />} />
            <Route path={PATHS.LEDGER_ENTRIES} element={<LedgerEntriesPage />} />
            <Route path={PATHS.BATCH_MODE} element={<BatchModePage />} />
            <Route path={PATHS.DATA_TRANSFER} element={<DataTransferPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
