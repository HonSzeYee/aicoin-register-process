import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollTakeoverProvider } from "@/context/ScrollTakeoverContext";
import { AppStateProvider } from "@/context/AppStateContext";
import AppLayout from "@/layouts/AppLayout";
import AiCoinOnboardingDashboard from "@/pages/Dashboard";
import AccountsRegistrationPage from "@/pages/AccountsRegistrationPage";
import DevGuidePage from "@/pages/DevGuidePage";
import PlaceholderPage from "@/pages/PlaceholderPage";
import FaqPage from "@/pages/FaqPage";
import WorkflowPage from "@/pages/WorkflowPage";

export default function App() {
  return (
    <AppStateProvider>
      <ScrollTakeoverProvider threshold={40} hysteresis={12} exitDelayMs={120} stopDelayMs={120}>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<AiCoinOnboardingDashboard />} />
              <Route path="accounts" element={<AccountsRegistrationPage />} />
              <Route path="dev" element={<DevGuidePage />} />
              <Route path="tools" element={<PlaceholderPage title="软件使用" />} />
              <Route path="workflow" element={<WorkflowPage />} />
              <Route path="faq" element={<FaqPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ScrollTakeoverProvider>
    </AppStateProvider>
  );
}
