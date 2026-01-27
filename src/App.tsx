import AICoinOnboardingDashboard from "./pages/Dashboard";
import { ScrollTakeoverProvider } from "@/context/ScrollTakeoverContext";

export default function App() {
  return (
    <ScrollTakeoverProvider threshold={56} hysteresis={12} exitDelayMs={120} stopDelayMs={120}>
      <div className="min-h-screen">
        <AICoinOnboardingDashboard />
      </div>
    </ScrollTakeoverProvider>
  );
}
