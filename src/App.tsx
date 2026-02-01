
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Subject from "./pages/Subject";
import BranchSemester from "./pages/BranchSemester";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import InstitutePage from "./pages/pseo/InstitutePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/:branch/:semester" element={<BranchSemester />} />
          <Route path="/subject/:name" element={<Subject />} />

          {/* pSEO Routes */}
          <Route path="/ipu/:instituteId/:branchId" element={<InstitutePage />} />
          <Route path="/ipu/:instituteId/:branchId/:topic" element={<InstitutePage />} />
          <Route path="/ipu/:instituteId/:branchId/resources/:subjectId/:type?" element={<InstitutePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
