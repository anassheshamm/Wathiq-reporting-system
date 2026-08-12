import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext"; // 1. Import the SearchProvider
import AppRoutes from "./routes/AppRouter";

const App = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <AppRoutes />
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;