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
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Language as LanguageIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  ShoppingCart,
  Assignment,
  Inventory,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: '#D9E1FA',
  color: '#333',
  // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  // borderBottom: '1px solid #B8C5F2',
}));



const DropdownButton = styled(Button)(({ theme }) => ({
  color: '#333',
  fontWeight: '500',
  textTransform: 'none',
  fontSize: '16px',
  padding: '10px 16px',
  borderRadius: '8px',
  minWidth: 'auto',
  whiteSpace: 'nowrap',
  height: '40px',
  '&:hover': {
    backgroundColor: '#B8C5F2',
  },
  '& .MuiButton-endIcon': {
    marginLeft: '6px',
    '& svg': {
      fontSize: '18px'
    }
  },
  [theme.breakpoints.down('lg')]: {
    fontSize: '15px',
    padding: '8px 14px',
    height: '36px',
  }
}));



const RightSection = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginLeft: 'auto',
  flexShrink: 0,
  paddingLeft: '16px',
}));

interface HeaderProps {
  onNavigate: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [inventoryAnchorEl, setInventoryAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [purchaseVoucherAnchorEl, setPurchaseVoucherAnchorEl] = useState<null | HTMLElement>(null);
  const [salesVoucherAnchorEl, setSalesVoucherAnchorEl] = useState<null | HTMLElement>(null);
  const [purchaseReturnAnchorEl, setPurchaseReturnAnchorEl] = useState<null | HTMLElement>(null);
  const [salesReturnAnchorEl, setSalesReturnAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inventoryExpanded, setInventoryExpanded] = useState(false);
  const [purchaseVoucherExpanded, setPurchaseVoucherExpanded] = useState(false);
  const [salesVoucherExpanded, setSalesVoucherExpanded] = useState(false);
  const [purchaseReturnExpanded, setPurchaseReturnExpanded] = useState(false);
  const [salesReturnExpanded, setSalesReturnExpanded] = useState(false);

  // Inventory dropdown items
  const inventoryItems = [
    { id: 'add-category', label: 'Add Category' },
    { id: 'add-stock', label: 'Add Stock' },
    { id: 'stock-list', label: 'Stock List' },
    { id: 'stock-summary', label: 'Stock Summary' },
    { id: 'nil-stocks', label: 'Nil Stocks' },
  ];

  // Purchase Voucher dropdown items
  const purchaseVoucherItems = [
    { id: 'purchase-voucher', label: 'Entry P Voucher' },
    { id: 'view-purchase-voucher', label: 'View P Voucher' },
    { id: 'void-purchase-voucher', label: 'Void P Voucher' },
  ];

  // Sales Voucher dropdown items
  const salesVoucherItems = [
    { id: 'sales-voucher', label: 'Entry Sales Voucher' },
    { id: 'view-sales-voucher', label: 'View Sales Voucher' },
    { id: 'void-sales-voucher', label: 'Void Sales Voucher' },
  ];

  // Purchase Return dropdown items
  const purchaseReturnItems = [
    { id: 'entry-purchase-return', label: 'Entry Purchase Return' },
    { id: 'view-purchase-return', label: 'View Purchase Return' },
    { id: 'void-purchase-return', label: 'Void Purchase Return' },
  ];

  // Sales Return dropdown items
  const salesReturnItems = [
    { id: 'entry-sales-return', label: 'Entry Sales Return' },
    { id: 'view-sales-return', label: 'View Sales Return' },
    { id: 'void-sales-return', label: 'Void Sales Return' },
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

  // Purchase Voucher handlers
  const handlePurchaseVoucherClick = (event: React.MouseEvent<HTMLElement>) => {
    setPurchaseVoucherAnchorEl(event.currentTarget);
  };

  const handlePurchaseVoucherClose = () => {
    setPurchaseVoucherAnchorEl(null);
  };

  const handlePurchaseVoucherItemClick = (itemId: string) => {
    onNavigate(itemId);
    handlePurchaseVoucherClose();
  };

  // Sales Voucher handlers
  const handleSalesVoucherClick = (event: React.MouseEvent<HTMLElement>) => {
    setSalesVoucherAnchorEl(event.currentTarget);
  };

  const handleSalesVoucherClose = () => {
    setSalesVoucherAnchorEl(null);
  };

  const handleSalesVoucherItemClick = (itemId: string) => {
    onNavigate(itemId);
    handleSalesVoucherClose();
  };

  // Purchase Return handlers
  const handlePurchaseReturnClick = (event: React.MouseEvent<HTMLElement>) => {
    setPurchaseReturnAnchorEl(event.currentTarget);
  };

  const handlePurchaseReturnClose = () => {
    setPurchaseReturnAnchorEl(null);
  };

  const handlePurchaseReturnItemClick = (itemId: string) => {
    onNavigate(itemId);
    handlePurchaseReturnClose();
  };

  // Sales Return handlers
  const handleSalesReturnClick = (event: React.MouseEvent<HTMLElement>) => {
    setSalesReturnAnchorEl(event.currentTarget);
  };

  const handleSalesReturnClose = () => {
    setSalesReturnAnchorEl(null);
  };

  const handleSalesReturnItemClick = (itemId: string) => {
    onNavigate(itemId);
    handleSalesReturnClose();
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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileNavigation = (section: string) => {
    onNavigate(section);
    handleMobileMenuClose();
  };

  const handleInventoryToggle = () => {
    setInventoryExpanded(!inventoryExpanded);
  };

  const handlePurchaseVoucherToggle = () => {
    setPurchaseVoucherExpanded(!purchaseVoucherExpanded);
  };

  const handleSalesVoucherToggle = () => {
    setSalesVoucherExpanded(!salesVoucherExpanded);
  };

  const handlePurchaseReturnToggle = () => {
    setPurchaseReturnExpanded(!purchaseReturnExpanded);
  };

  const handleSalesReturnToggle = () => {
    setSalesReturnExpanded(!salesReturnExpanded);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{
        px: { xs: 1, md: 3 },
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: { xs: '64px', sm: '72px', md: '80px' },
        gap: { xs: 1, sm: 2 },
        maxWidth: '100%',
        overflow: 'visible'
      }}>
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMobileMenuToggle}
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            color: '#333'
          }}
        >
          <MenuIcon />
        </IconButton>



        {/* Navigation Menu */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: { md: 3, lg: 4 },
          flex: 1,
          justifyContent: 'flex-start',
          maxWidth: 'calc(100% - 200px)', // More space since no logo
          overflow: 'visible'
        }}>
          {/* Purchase Voucher Dropdown */}
          <DropdownButton
            onClick={handlePurchaseVoucherClick}
            endIcon={<ExpandMoreIcon />}
          >
            Purchase Voucher
          </DropdownButton>
          <Menu
            anchorEl={purchaseVoucherAnchorEl}
            open={Boolean(purchaseVoucherAnchorEl)}
            onClose={handlePurchaseVoucherClose}
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
            {purchaseVoucherItems.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => handlePurchaseVoucherItemClick(item.id)}
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

          {/* Purchase Return Dropdown */}
          <DropdownButton
            onClick={handlePurchaseReturnClick}
            endIcon={<ExpandMoreIcon />}
          >
            Purchase Return
          </DropdownButton>
          <Menu
            anchorEl={purchaseReturnAnchorEl}
            open={Boolean(purchaseReturnAnchorEl)}
            onClose={handlePurchaseReturnClose}
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
            {purchaseReturnItems.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => handlePurchaseReturnItemClick(item.id)}
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

          {/* Sales Voucher Dropdown */}
          <DropdownButton
            onClick={handleSalesVoucherClick}
            endIcon={<ExpandMoreIcon />}
          >
            Sales Voucher
          </DropdownButton>
          <Menu
            anchorEl={salesVoucherAnchorEl}
            open={Boolean(salesVoucherAnchorEl)}
            onClose={handleSalesVoucherClose}
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
            {salesVoucherItems.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => handleSalesVoucherItemClick(item.id)}
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

          {/* Sales Return Dropdown */}
          <DropdownButton
            onClick={handleSalesReturnClick}
            endIcon={<ExpandMoreIcon />}
          >
            Sales Return
          </DropdownButton>
          <Menu
            anchorEl={salesReturnAnchorEl}
            open={Boolean(salesReturnAnchorEl)}
            onClose={handleSalesReturnClose}
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
            {salesReturnItems.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => handleSalesReturnItemClick(item.id)}
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
              display: { xs: 'none', sm: 'flex' },
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
          <Box sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            <Typography variant="body2" sx={{ color: '#333', fontWeight: '500' }}>
              devinc
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Admin
            </Typography>
          </Box>
        </RightSection>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: '#ffffff',
            pt: 2,
          },
        }}
      >
        <List>
          {/* Purchase Voucher Section */}
          <ListItem
            onClick={handlePurchaseVoucherToggle}
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f8f9ff' }
            }}
          >
            <ListItemIcon>
              <ShoppingCart sx={{ color: '#333' }} />
            </ListItemIcon>
            <ListItemText
              primary="Purchase Voucher"
              sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
            />
            {purchaseVoucherExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          {/* Purchase Voucher Submenu */}
          <Collapse in={purchaseVoucherExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {purchaseVoucherItems.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => handleMobileNavigation(item.id)}
                  sx={{
                    pl: 4,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8f9ff' }
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        fontWeight: 400
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* Purchase Return Section */}
          <ListItem
            onClick={handlePurchaseReturnToggle}
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f8f9ff' }
            }}
          >
            <ListItemIcon>
              <Assignment sx={{ color: '#333' }} />
            </ListItemIcon>
            <ListItemText
              primary="Purchase Return"
              sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
            />
            {purchaseReturnExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          {/* Purchase Return Submenu */}
          <Collapse in={purchaseReturnExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {purchaseReturnItems.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => handleMobileNavigation(item.id)}
                  sx={{
                    pl: 4,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8f9ff' }
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        fontWeight: 400
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* Sales Voucher Section */}
          <ListItem
            onClick={handleSalesVoucherToggle}
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f8f9ff' }
            }}
          >
            <ListItemIcon>
              <ShoppingCart sx={{ color: '#333' }} />
            </ListItemIcon>
            <ListItemText
              primary="Sales Voucher"
              sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
            />
            {salesVoucherExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          {/* Sales Voucher Submenu */}
          <Collapse in={salesVoucherExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {salesVoucherItems.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => handleMobileNavigation(item.id)}
                  sx={{
                    pl: 4,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8f9ff' }
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        fontWeight: 400
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* Sales Return Section */}
          <ListItem
            onClick={handleSalesReturnToggle}
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f8f9ff' }
            }}
          >
            <ListItemIcon>
              <Assignment sx={{ color: '#333' }} />
            </ListItemIcon>
            <ListItemText
              primary="Sales Return"
              sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
            />
            {salesReturnExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          {/* Sales Return Submenu */}
          <Collapse in={salesReturnExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {salesReturnItems.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => handleMobileNavigation(item.id)}
                  sx={{
                    pl: 4,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8f9ff' }
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        fontWeight: 400
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* Inventory Section */}
          <ListItem
            onClick={handleInventoryToggle}
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f8f9ff' }
            }}
          >
            <ListItemIcon>
              <Inventory sx={{ color: '#333' }} />
            </ListItemIcon>
            <ListItemText
              primary="Inventory"
              sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
            />
            {inventoryExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          {/* Inventory Submenu */}
          <Collapse in={inventoryExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {inventoryItems.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => handleMobileNavigation(item.id)}
                  sx={{
                    pl: 4,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8f9ff' }
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        fontWeight: 400
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {/* Language Selection */}
          <ListItem
            onClick={handleLanguageClick}
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f8f9ff' }
            }}
          >
            <ListItemIcon>
              <LanguageIcon sx={{ color: '#333' }} />
            </ListItemIcon>
            <ListItemText
              primary="Language"
              sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
            />
          </ListItem>
        </List>
      </Drawer>
    </StyledAppBar>
  );
};

export default Header;