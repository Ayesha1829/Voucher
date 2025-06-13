import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CssBaseline,
  Fab,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';

const drawerWidth = 280;

// Styled components
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  backgroundColor: '#D9E1FA',
  color: '#333',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const FloatingMenuButton = styled(Fab)(() => ({
  position: 'fixed',
  top: '80px',
  left: '20px',
  backgroundColor: '#D9E1FA',
  color: '#ffffff',
  zIndex: 1300,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#B8C5F2',
  },
}));

interface LayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onNavigate: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentSection, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getSectionTitle = (section: string): string => {
    const sectionTitles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'add-category': 'Add Category',
      'add-stock': 'Add Stock',
      'stock-list': 'Stock List',
      'stock-summary': 'Stock Summary',
      'nil-stocks': 'Nil Stocks',
      'journal-voucher': 'Journal Voucher',
      'cash-voucher': 'Cash Voucher',
      'purchase-voucher': 'Purchase Voucher',
      'sale-voucher': 'Sale Voucher',
      'reports': 'Reports',
      'settings': 'Settings',
    };
    return sectionTitles[section] || 'Dashboard';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)', backgroundColor: '#D9E1FA' }}>
      <CssBaseline />

      {/* Floating Menu Button - Only visible when sidebar is closed */}
      {!sidebarOpen && (
        <FloatingMenuButton
          onClick={handleDrawerToggle}
          aria-label="open menu"
        >
          <MenuIcon />
        </FloatingMenuButton>
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
        currentSection={currentSection}
      />

      {/* Main Content Area */}
      <Main open={sidebarOpen}>
        <Box
          sx={{
            backgroundColor: '#D9E1FA',
            minHeight: 'calc(100vh - 64px)',
            borderRadius: '0',
            padding: 0,
          }}
        >
          {children}
        </Box>
      </Main>
    </Box>
  );
};

export default Layout;
