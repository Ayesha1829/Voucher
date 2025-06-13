import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import Header from "./components/header/header";
import Layout from "./components/layout/Layout";
import AddCategory from "./components/inventory/addCategory";
import CreateStocks from "./components/inventory/addStock";
import StocksItemList from "./components/inventory/stocksItemList";
import PurchaseVoucher from "./components/voucher/purchaseVoucher";
import PurchaseReturnList from "./components/voucher/purchaseReturnList";
import SalesVoucher from "./components/voucher/salesVoucher";
import SalesReturnList from "./components/voucher/salesReturnList";
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
  const [currentSection, setCurrentSection] = useState<string>("add-category");

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
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
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Stock Summary - Coming Soon</h2>
          </div>
        );
      case "nil-stocks":
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Nil Stocks - Coming Soon</h2>
          </div>
        );
      case "purchase-voucher":
        return <PurchaseVoucher />;
      case "purchase-return":
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Purchase Return - Coming Soon</h2>
          </div>
        );
      case "purchase-return-list":
        return <PurchaseReturnList />;
      case "sales-return-list":
        return <SalesReturnList />;
      case "sales-voucher":
        return <SalesVoucher />;
      case "sales-return":
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Sales Return - Coming Soon</h2>
          </div>
        );
      case "journal-voucher":
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Journal Voucher - Coming Soon</h2>
          </div>
        );
      case "cash-voucher":
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Cash Voucher - Coming Soon</h2>
          </div>
        );
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
