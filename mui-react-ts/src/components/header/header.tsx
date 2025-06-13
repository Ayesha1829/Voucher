import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Language as LanguageIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: '#D9E1FA',
  color: '#333',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid #B8C5F2',
}));

const LogoContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: '32px',
}));

const NavButton = styled(Button)(() => ({
  color: '#333',
  fontWeight: '500',
  textTransform: 'none',
  fontSize: '16px',
  padding: '8px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#B8C5F2',
  },
}));

const DropdownButton = styled(Button)(() => ({
  color: '#333',
  fontWeight: '500',
  textTransform: 'none',
  fontSize: '16px',
  padding: '8px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#B8C5F2',
  },
}));



const RightSection = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginLeft: 'auto',
}));

interface HeaderProps {
  onNavigate: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [inventoryAnchorEl, setInventoryAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);

  // Inventory dropdown items
  const inventoryItems = [
    { id: 'add-category', label: 'Add Category' },
    { id: 'add-stock', label: 'Add Stock' },
    { id: 'stock-list', label: 'Stock List' },
    { id: 'stock-summary', label: 'Stock Summary' },
    { id: 'nil-stocks', label: 'Nil Stocks' },
  ];

  // Language options
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const handleInventoryClick = (event: React.MouseEvent<HTMLElement>) => {
    setInventoryAnchorEl(event.currentTarget);
  };

  const handleInventoryClose = () => {
    setInventoryAnchorEl(null);
  };

  const handleInventoryItemClick = (itemId: string) => {
    onNavigate(itemId);
    handleInventoryClose();
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageSelect = (languageCode: string) => {
    console.log('Selected language:', languageCode);
    // TODO: Implement language change logic with API
    handleLanguageClose();
  };

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ px: 3 }}>
        {/* Logo Section */}
        <LogoContainer>
          <img
            src="/image.png"
            alt="Company Logo"
            style={{
              width: '60px',
              height: '40px',
              marginRight: '16px',
              objectFit: 'contain',
            }}
          />
        </LogoContainer>

        {/* Navigation Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Purchase Voucher */}
          <NavButton onClick={() => onNavigate('purchase-voucher')}>
            Purchase Voucher
          </NavButton>

          {/* Purchase Return */}
          <NavButton onClick={() => onNavigate('purchase-return')}>
            Purchase Return
          </NavButton>

          {/* Sales Voucher */}
          <NavButton onClick={() => onNavigate('sales-voucher')}>
            Sales Voucher
          </NavButton>

          {/* Sales Return */}
          <NavButton onClick={() => onNavigate('sales-return')}>
            Sales Return
          </NavButton>

          {/* Inventory Dropdown */}
          <DropdownButton
            onClick={handleInventoryClick}
            endIcon={<ExpandMoreIcon />}
          >
            Inventory
          </DropdownButton>
          <Menu
            anchorEl={inventoryAnchorEl}
            open={Boolean(inventoryAnchorEl)}
            onClose={handleInventoryClose}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: '#ffffff',
                  border: '1px solid #D9E1FA',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  mt: 1,
                },
              },
            }}
          >
            {inventoryItems.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => handleInventoryItemClick(item.id)}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f8f9ff',
                  },
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Right Section */}
        <RightSection>
          {/* Language Selector */}
          <IconButton
            onClick={handleLanguageClick}
            sx={{
              color: '#333',
              '&:hover': {
                backgroundColor: '#B8C5F2',
              },
            }}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={languageAnchorEl}
            open={Boolean(languageAnchorEl)}
            onClose={handleLanguageClose}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: '#ffffff',
                  border: '1px solid #D9E1FA',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  mt: 1,
                  minWidth: '180px',
                },
              },
            }}
          >
            {languages.map((language) => (
              <MenuItem
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f8f9ff',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{language.flag}</span>
                  <Typography>{language.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: '#B8C5F2' }} />

          {/* User Account */}
          <IconButton
            sx={{
              color: '#333',
              '&:hover': {
                backgroundColor: '#B8C5F2',
              },
            }}
          >
            <AccountCircleIcon />
          </IconButton>

          {/* User Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="body2" sx={{ color: '#333', fontWeight: '500' }}>
              devinc
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Admin
            </Typography>
          </Box>
        </RightSection>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;