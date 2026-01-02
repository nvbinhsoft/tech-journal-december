import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Article from "./pages/Article";
import About from "./pages/About";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import ArticleEditor from "./pages/admin/ArticleEditor";
import TagsManager from "./pages/admin/TagsManager";
import SettingsPage from "./pages/admin/SettingsPage";
import AuditLog from "./pages/admin/AuditLog";
import NotFound from "./pages/NotFound";
import { SessionExpiredDialog } from "./components/auth/SessionExpiredDialog";
import { initializeStore } from "./lib/store";
import { auditApi } from "./lib/api";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Ensure auth/state is rehydrated and base data is fetched on hard refresh
    void initializeStore();

    // Record visit
    // We only record the visit on initial app load (SPA), or we could do it on route change if desired.
    // For now, simpler is creating one record per session/refresh.
    const recordVisit = async () => {
      try {
        await auditApi.recordVisit({
          endpoint: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          screenResolution: `${window.screen.width}x${window.screen.height}`
        });
      } catch (error) {
        // Silently fail for audit logs
        console.error('Failed to record visit', error);
      }
    };

    // Check if we are not in mock mode (store initializes mock mode check too)
    // But auditApi internally checks or the backend will fail if mock.
    // Ideally we check env here or inside api.
    if (import.meta.env.VITE_MOCK_DATA !== 'true') {
      void recordVisit();
    }

  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionExpiredDialog />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/editor" element={<ArticleEditor />} />
            <Route path="/admin/editor/:id" element={<ArticleEditor />} />
            <Route path="/admin/tags" element={<TagsManager />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/audit" element={<AuditLog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
