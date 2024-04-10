import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CountriesTable from "./pages/CountriesTable";
import { QueryClient, QueryClientProvider } from "react-query";
import Weather from "./pages/Weather";
import { ThemeProvider, createTheme } from "@mui/material";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      retry: 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 985,
      lg: 1156,
      xl: 1920,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<CountriesTable />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
