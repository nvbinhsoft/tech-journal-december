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
import NotFound from "./pages/NotFound";
import { SessionExpiredDialog } from "./components/auth/SessionExpiredDialog";

const queryClient = new QueryClient();

const App = () => (
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

