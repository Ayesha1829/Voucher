import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Collapse,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Dashboard,
  Inventory,
  Receipt,
  Category,
  Add,
  List as ListIcon,
  ExpandLess,
  ExpandMore,
  ShoppingCart,
  Assessment,
  Settings,
  Search,
  Close,
} from "@mui/icons-material";

const drawerWidth = 280;

// Styled components
const StyledDrawer = styled(Drawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    borderRight: "2px solid #D9E1FA",
    top: 0, // Position from the very top
    height: "100vh", // Full viewport height
    zIndex: 1400, // Higher z-index to overlay header and content
    display: "flex",
    flexDirection: "column",
    overflow: "hidden", // Prevent overall scrolling
  },
}));

const SidebarHeader = styled(Box)(() => ({
  backgroundColor: "#D9E1FA",
  padding: "20px 16px",
  textAlign: "center",
  borderBottom: "2px solid #B8C5F2",
  flexShrink: 0, // Don't shrink the header
}));

const SearchContainer = styled(Box)(() => ({
  padding: "16px",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #e0e0e0",
  flexShrink: 0, // Don't shrink the search container
}));

const ScrollableMenuContainer = styled(Box)(() => ({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#D9E1FA",
    borderRadius: "3px",
    "&:hover": {
      backgroundColor: "#B8C5F2",
    },
  },
}));

const SidebarFooter = styled(Box)(() => ({
  padding: "16px",
  textAlign: "center",
  borderTop: "1px solid #e0e0e0",
  backgroundColor: "#ffffff",
  flexShrink: 0, // Don't shrink the footer
}));

const StyledSearchField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f8f9ff",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#D9E1FA",
    },
    "&:hover fieldset": {
      borderColor: "#B8C5F2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#9BB0E8",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "14px",
  },
}));

const StyledListItemButton = styled(ListItemButton)(() => ({
  borderRadius: "8px",
  margin: "4px 8px",
  "&:hover": {
    backgroundColor: "#f8f9ff",
  },
  "&.Mui-selected": {
    backgroundColor: "#D9E1FA",
    "&:hover": {
      backgroundColor: "#B8C5F2",
    },
  },
}));

const SubListItem = styled(ListItemButton)(() => ({
  paddingLeft: "48px",
  borderRadius: "8px",
  margin: "2px 16px",
  "&:hover": {
    backgroundColor: "#f8f9ff",
  },
  "&.Mui-selected": {
    backgroundColor: "#D9E1FA",
    "&:hover": {
      backgroundColor: "#B8C5F2",
    },
  },
}));

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  currentSection: string;
}

interface MenuSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: {
    id: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  onNavigate,
  currentSection,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "inventory",
  ]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const menuSections: MenuSection[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <Dashboard />,
    },
    {
      id: "inventory",
      title: "Inventory",
      icon: <Inventory />,
      hasSubmenu: true,
      submenu: [
        { id: "add-category", title: "Add Category", icon: <Category /> },
        { id: "add-stock", title: "Add Stock", icon: <Add /> },
        { id: "stock-list", title: "Stock List", icon: <ListIcon /> },
        { id: "stock-summary", title: "Stock Summary", icon: <Assessment /> },
        { id: "nil-stocks", title: "Nil Stocks", icon: <ShoppingCart /> },
      ],
    },
    {
      id: "vouchers",
      title: "Vouchers",
      icon: <Receipt />,
      hasSubmenu: true,
      submenu: [
        { id: "purchase-voucher", title: "Purchase Voucher", icon: <Receipt /> },
        { id: "purchase-return-list", title: "Purchase Return", icon: <Receipt /> },
        { id: "sales-voucher", title: "Sales Voucher", icon: <Receipt /> },
        { id: "sales-return-list", title: "Sales Return", icon: <Receipt /> },
        { id: "journal-voucher", title: "Journal Voucher", icon: <Receipt /> },
        { id: "cash-voucher", title: "Cash Voucher", icon: <Receipt /> },
      ],
    },
    {
      id: "reports",
      title: "Reports",
      icon: <Assessment />,
    },
    {
      id: "settings",
      title: "Settings",
      icon: <Settings />,
    },
  ];

  const handleSectionClick = (sectionId: string, hasSubmenu?: boolean) => {
    if (hasSubmenu) {
      setExpandedSections((prev) =>
        prev.includes(sectionId)
          ? prev.filter((id) => id !== sectionId)
          : [...prev, sectionId]
      );
    } else {
      onNavigate(sectionId);
    }
  };

  const handleSubmenuClick = (submenuId: string) => {
    onNavigate(submenuId);
  };

  const isExpanded = (sectionId: string) =>
    expandedSections.includes(sectionId);

  // Filter menu sections based on search query
  const filteredMenuSections = menuSections.filter((section) => {
    if (searchQuery.trim() === "") return true;

    const matchesSection = section.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSubmenu = section.submenu?.some((submenu) =>
      submenu.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return matchesSection || matchesSubmenu;
  });

  return (
    <StyledDrawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      {/* Header */}
      <SidebarHeader>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            EV System
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#333",
              "&:hover": {
                backgroundColor: "#B8C5F2",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Voucher Management
        </Typography>
      </SidebarHeader>

      {/* Search Bar */}
      <SearchContainer>
        <StyledSearchField
          fullWidth
          size="small"
          placeholder="Search for..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#666", fontSize: "20px" }} />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      {/* Scrollable Navigation Menu */}
      <ScrollableMenuContainer>
        <List sx={{ pt: 2, pb: 2 }}>
          {filteredMenuSections.map((section) => (
            <React.Fragment key={section.id}>
              <ListItem disablePadding>
                <StyledListItemButton
                  selected={currentSection === section.id}
                  onClick={() => handleSectionClick(section.id, section.hasSubmenu)}
                >
                  <ListItemIcon sx={{ color: "#666" }}>
                    {section.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={section.title}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: "500",
                        color: "#333",
                      },
                    }}
                  />
                  {section.hasSubmenu &&
                    (isExpanded(section.id) ? <ExpandLess /> : <ExpandMore />)}
                </StyledListItemButton>
              </ListItem>

              {/* Submenu */}
              {section.hasSubmenu && (
                <Collapse
                  in={isExpanded(section.id)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {section.submenu?.map((submenuItem) => (
                      <ListItem key={submenuItem.id} disablePadding>
                        <SubListItem
                          selected={currentSection === submenuItem.id}
                          onClick={() => handleSubmenuClick(submenuItem.id)}
                        >
                          <ListItemIcon sx={{ color: "#666", minWidth: "36px" }}>
                            {submenuItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={submenuItem.title}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontSize: "14px",
                                color: "#555",
                              },
                            }}
                          />
                        </SubListItem>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </ScrollableMenuContainer>

      {/* Footer */}
      <SidebarFooter>
        <Typography variant="caption" sx={{ color: "#999" }}>
          Version 1.0.0
        </Typography>
      </SidebarFooter>
    </StyledDrawer>
  );
};

export default Sidebar;
