import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import Header from "./components/header/header";
import Layout from "./components/layout/Layout";
import AddCategory from "./components/inventory/addCategory";
import CreateStocks from "./components/inventory/addStock";
import StocksItemList from "./components/inventory/stocksItemList";
import StockSummary from "./components/inventory/stockSummary";
import NilStocks from "./components/inventory/nilStocks";
import PurchaseVoucher from "./components/voucher/purchaseVoucher";
import PurchaseReturnList from "./components/voucher/purchaseReturnList";
import EntryPurchaseReturn from "./components/voucher/entryPurchaseReturn";
import EntrySalesReturn from "./components/voucher/entrySalesReturn";
import SalesVoucher from "./components/voucher/salesVoucher";
import SalesReturnList from "./components/voucher/salesReturnList";
import ViewPurchaseVoucher from "./components/voucher/viewPurchaseVoucher";
import ViewSalesVoucher from "./components/voucher/viewSalesVoucher";
import VoidPurchaseVoucher from "./components/voucher/voidPurchaseVoucher";
import VoidSalesVoucher from "./components/voucher/voidSalesVoucher";
import VoidSalesReturn from "./components/voucher/voidSalesReturn";
import Login from "./components/auth/Login";
import "./App.css";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#D9E1FA",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#D9E1FA",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [currentSection, setCurrentSection] = useState<string>("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log('🔍 Auth Check - Token found:', !!token);

    if (!token) {
      console.log('❌ No token found - showing login');
      setCheckingAuth(false);
      setIsAuthenticated(false);
      return;
    }

    console.log('🔍 Verifying token with backend...');
    // Verify token with backend
    fetch("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log('🔍 Token verification response:', res.status);
        return res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`);
      })
      .then((data) => {
        console.log('✅ Token valid - user authenticated:', data);
        setIsAuthenticated(true);
        setCheckingAuth(false);
      })
      .catch((error) => {
        console.log('❌ Token verification failed:', error);
        console.log('🗑️ Removing invalid token');
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setCheckingAuth(false);
      });
  }, []);

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const renderContent = () => {
    switch (currentSection) {
      case "add-category":
        return <AddCategory />;
      case "dashboard":
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Dashboard - Coming Soon</h2>
          </div>
        );
      case "add-stock":
        return <CreateStocks />;
      case "stock-list":
        return <StocksItemList />;
      case "stock-summary":
        return <StockSummary />;
      case "nil-stocks":
        return <NilStocks />;
      case "purchase-voucher":
        return <PurchaseVoucher />;
      case "view-purchase-voucher":
        return <ViewPurchaseVoucher />;
      case "void-purchase-voucher":
        return <VoidPurchaseVoucher />;
      case "entry-purchase-return":
        return <EntryPurchaseReturn />;
      case "purchase-return-list":
        return <PurchaseReturnList />;
      case "view-purchase-return":
        return <PurchaseReturnList />;
      case "void-purchase-return":
        return <VoidPurchaseVoucher />;
      case "entry-sales-return":
        return <EntrySalesReturn />;
      case "view-sales-return":
        return <SalesReturnList />;
      case "void-sales-return":
        return <VoidSalesReturn />;
      case "sales-voucher":
        return <SalesVoucher />;
      case "view-sales-voucher":
        return <ViewSalesVoucher />;
      case "void-sales-voucher":
        return <VoidSalesVoucher />;
      case "reports":
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Reports - Coming Soon</h2>
          </div>
        );
      case "settings":
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Settings - Coming Soon</h2>
          </div>
        );
      default:
        return <AddCategory />;
    }
  };

  if (checkingAuth) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#D9E1FA",
          }}
        >
          <div>Loading...</div>
        </Box>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLoginSuccess={handleLoginSuccess} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* Header */}
        <Header onNavigate={handleNavigate} />

        {/* Main Content with Sidebar */}
        <Box sx={{ display: "flex", flex: 1 }}>
          <Layout currentSection={currentSection} onNavigate={handleNavigate}>
            {renderContent()}
          </Layout>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
