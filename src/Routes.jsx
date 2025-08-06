import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Landing from "pages/landing";
import Homepage from "pages/homepage";
import ProjectGallery from "pages/project-gallery";
import ProjectDetail from "pages/project-detail";
import AboutUs from "pages/about-us";
import Contact from "pages/contact";
import Services from "pages/services";
import Impressum from "pages/impressum";
import Datenschutz from "pages/datenschutz";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<Landing />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/project-gallery" element={<ProjectGallery />} />
          <Route path="/project-detail" element={<ProjectDetail />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;