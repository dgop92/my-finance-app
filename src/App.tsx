import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "@/components/layout/layout";
import { Dashboard } from "@/features/core/pages/dashboard/dashboard-page";
import { SavingSourcePage } from "@/features/core/pages/saving-sources/saving-source-page";
import { FinancialRecords } from "@/features/core/pages/financial-records/financial-records-page";
import { Analysis } from "@/features/analytics/pages/analysis";
import { NotFound } from "@/components/layout/not-found";
import { PATHS } from "@/lib/paths";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FinancialRecordDetailPage } from "./features/core/pages/financial-records/financial-records-detail-page";
import { FinancialRecordCreatePage } from "./features/core/pages/financial-records/financial-records-create-page";
import { FinancialRecordsEditPage } from "./features/core/pages/financial-records/financial-records-edit-page";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
            <Route
              path={PATHS.SAVINGS_SOURCES}
              element={<SavingSourcePage />}
            />
            <Route
              path={PATHS.FINANCIAL_RECORDS}
              element={<FinancialRecords />}
            />
            <Route
              path={PATHS.FINANCIAL_RECORD_CREATE}
              element={<FinancialRecordCreatePage />}
            />
            <Route
              path={PATHS.FINANCIAL_RECORD_DETAIL}
              element={<FinancialRecordDetailPage />}
            />
            <Route
              path={PATHS.FINANCIAL_RECORD_EDIT}
              element={<FinancialRecordsEditPage />}
            />
            <Route path={PATHS.ANALYSIS} element={<Analysis />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
