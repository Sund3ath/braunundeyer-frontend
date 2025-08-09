import React from "react";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routes from "./Routes";
import i18n from "./i18n/config";
import { EditModeProvider } from "./cms/contexts/EditModeContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <EditModeProvider>
          <Routes />
        </EditModeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export default App;
