import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import AddCategory from './components/inventory/addCategory';
import './App.css';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#D9E1FA',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#D9E1FA',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [currentSection, setCurrentSection] = useState<string>('add-category');

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'add-category':
        return <AddCategory />;
      case 'dashboard':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Dashboard - Coming Soon</h2>
          </div>
        );
      case 'add-stock':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Add Stock - Coming Soon</h2>
          </div>
        );
      case 'stock-list':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Stock List - Coming Soon</h2>
          </div>
        );
      case 'stock-summary':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Stock Summary - Coming Soon</h2>
          </div>
        );
      case 'nil-stocks':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Nil Stocks - Coming Soon</h2>
          </div>
        );
      case 'journal-voucher':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Journal Voucher - Coming Soon</h2>
          </div>
        );
      case 'cash-voucher':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Cash Voucher - Coming Soon</h2>
          </div>
        );
      case 'purchase-voucher':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Purchase Voucher - Coming Soon</h2>
          </div>
        );
      case 'sale-voucher':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Sale Voucher - Coming Soon</h2>
          </div>
        );
      case 'reports':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Reports - Coming Soon</h2>
          </div>
        );
      case 'settings':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
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
      <Layout currentSection={currentSection} onNavigate={handleNavigate}>
        {renderContent()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
