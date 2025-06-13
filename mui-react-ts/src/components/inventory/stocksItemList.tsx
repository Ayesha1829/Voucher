import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

// Define interfaces for type safety
interface StockItem {
  id: string;
  itemName: string;
  itemCode: string;
  qty: number;
  category: string;
  unit: string;
  rate: number;
  total: number;
  dateAdded?: string;
  status?: "Active" | "Low Stock" | "Out of Stock";
}

interface StockItemListProps {
  stockItems?: StockItem[];
  onEdit?: (item: StockItem) => void;
  onDelete?: (id: string) => void;
  onView?: (item: StockItem) => void;
}

const StocksItemList: React.FC<StockItemListProps> = ({
  stockItems = [],
  onEdit,
  onDelete,
  onView,
}) => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredItems, setFilteredItems] = useState<StockItem[]>([]);

  // State for edit functionality
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [editFormData, setEditFormData] = useState<StockItem | null>(null);

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // State for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // State for managing stock items internally
  const [internalStockItems, setInternalStockItems] = useState<StockItem[]>([]);

  // Sample data for demonstration (in real app, this would come from props or API)
  const [sampleStockItems] = useState<StockItem[]>([
    {
      id: "1",
      itemName: "Laptop Dell XPS 13",
      itemCode: "DELL-XPS-001",
      qty: 15,
      category: "Electronics",
      unit: "Pieces",
      rate: 1200.0,
      total: 18000.0,
      dateAdded: "2024-01-15",
      status: "Active",
    },
    {
      id: "2",
      itemName: "Office Chair",
      itemCode: "CHAIR-001",
      qty: 3,
      category: "Furniture",
      unit: "Pieces",
      rate: 250.0,
      total: 750.0,
      dateAdded: "2024-01-14",
      status: "Low Stock",
    },
    {
      id: "3",
      itemName: "Coffee Beans Premium",
      itemCode: "COFFEE-PREM-001",
      qty: 0,
      category: "Food & Beverages",
      unit: "Kg",
      rate: 25.0,
      total: 0.0,
      dateAdded: "2024-01-13",
      status: "Out of Stock",
    },
    {
      id: "4",
      itemName: "Programming Book - React",
      itemCode: "BOOK-REACT-001",
      qty: 8,
      category: "Books",
      unit: "Pieces",
      rate: 45.0,
      total: 360.0,
      dateAdded: "2024-01-12",
      status: "Active",
    },
    {
      id: "5",
      itemName: "Garden Hose 50ft",
      itemCode: "HOSE-50FT-001",
      qty: 12,
      category: "Home & Garden",
      unit: "Pieces",
      rate: 35.0,
      total: 420.0,
      dateAdded: "2024-01-11",
      status: "Active",
    },
  ]);

  // Initialize internal stock items with sample data
  useEffect(() => {
    if (stockItems.length > 0) {
      setInternalStockItems(stockItems);
    } else {
      setInternalStockItems(sampleStockItems);
    }
  }, [stockItems, sampleStockItems]);

  // Use internal stock items for display
  const displayItems = internalStockItems;

  // Get unique categories for filter dropdown
  const categories = Array.from(
    new Set(displayItems.map((item) => item.category))
  );
  const statuses = ["Active", "Low Stock", "Out of Stock"];

  // Filter items based on search term and filters
  useEffect(() => {
    let filtered = displayItems;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredItems(filtered);
  }, [searchTerm, categoryFilter, statusFilter, displayItems]);

  // Calculate summary statistics
  const totalItems = filteredItems.length;
  const totalValue = filteredItems.reduce((sum, item) => sum + item.total, 0);
  const lowStockItems = filteredItems.filter(
    (item) => item.status === "Low Stock"
  ).length;
  const outOfStockItems = filteredItems.filter(
    (item) => item.status === "Out of Stock"
  ).length;

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Low Stock":
        return "warning";
      case "Out of Stock":
        return "error";
      default:
        return "default";
    }
  };

  // Handler functions for edit and delete
  const handleEditClick = (item: StockItem) => {
    setEditingItem(item);
    setEditFormData({ ...item });
    setEditDialogOpen(true);
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditFormChange = (
    field: keyof StockItem,
    value: string | number
  ) => {
    if (editFormData) {
      const updatedData = { ...editFormData, [field]: value };

      // Recalculate total when qty or rate changes
      if (field === "qty" || field === "rate") {
        updatedData.total =
          (field === "qty" ? Number(value) : editFormData.qty) *
          (field === "rate" ? Number(value) : editFormData.rate);
      }

      setEditFormData(updatedData);
    }
  };

  const handleEditSave = () => {
    if (editFormData && editingItem) {
      setInternalStockItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? editFormData : item
        )
      );
      setEditDialogOpen(false);
      setEditingItem(null);
      setEditFormData(null);
      setSnackbarMessage("Item updated successfully!");
      setSnackbarOpen(true);
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingItem(null);
    setEditFormData(null);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setInternalStockItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemToDelete)
      );
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setSnackbarMessage("Item deleted successfully!");
      setSnackbarOpen(true);
      if (onDelete) {
        onDelete(itemToDelete);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 1400,
        mx: "auto",
        color: "white",
        backgroundColor: "#D9E1FA",
      }}
    >
      {/* Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "black",
            backgroundColor: "#D9E1FA",
            py: 2,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <InventoryIcon fontSize="large" />
          Stock Items List
        </Typography>

        {/* Summary Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h5" component="div">
                {totalItems}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h5" component="div">
                ${totalValue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock
              </Typography>
              <Typography variant="h5" component="div" color="warning.main">
                {lowStockItems}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Out of Stock
              </Typography>
              <Typography variant="h5" component="div" color="error.main">
                {outOfStockItems}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Search and Filter Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              sx={{ minWidth: 250, flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="textSecondary">
              <FilterIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              {filteredItems.length} items found
            </Typography>
          </Box>
        </Box>

        {/* Stock Items Table */}
        {filteredItems.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No stock items found.{" "}
            {searchTerm || categoryFilter || statusFilter
              ? "Try adjusting your filters."
              : "Add some stock items to get started."}
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Item Code</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>QTY</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Rate</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date Added</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f9f9f9" },
                      backgroundColor:
                        item.status === "Out of Stock"
                          ? "#ffebee"
                          : item.status === "Low Stock"
                          ? "#fff3e0"
                          : "inherit",
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.itemName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {item.itemCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.category}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.qty}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.unit}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${item.rate.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        ${item.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status || "Active"}
                        size="small"
                        color={getStatusColor(item.status || "Active") as any}
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {item.dateAdded || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onView?.(item)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Item">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleEditClick(item)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Item">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleEditCancel}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Stock Item</DialogTitle>
          <DialogContent>
            {editFormData && (
              <Box sx={{ pt: 2 }}>
                <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Item Name"
                    value={editFormData.itemName}
                    onChange={(e) =>
                      handleEditFormChange("itemName", e.target.value)
                    }
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                  <TextField
                    label="Item Code"
                    value={editFormData.itemCode}
                    onChange={(e) =>
                      handleEditFormChange("itemCode", e.target.value)
                    }
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                  <FormControl sx={{ flex: 1, minWidth: 150 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={editFormData.category}
                      label="Category"
                      onChange={(e) =>
                        handleEditFormChange("category", e.target.value)
                      }
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ flex: 1, minWidth: 120 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={editFormData.unit}
                      label="Unit"
                      onChange={(e) =>
                        handleEditFormChange("unit", e.target.value)
                      }
                    >
                      {["Pieces", "Kg", "Liters", "Meters", "Boxes"].map(
                        (unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={editFormData.qty}
                    onChange={(e) =>
                      handleEditFormChange("qty", Number(e.target.value))
                    }
                    sx={{ flex: 1, minWidth: 120 }}
                  />
                  <TextField
                    label="Rate"
                    type="number"
                    value={editFormData.rate}
                    onChange={(e) =>
                      handleEditFormChange("rate", Number(e.target.value))
                    }
                    sx={{ flex: 1, minWidth: 120 }}
                  />
                  <TextField
                    label="Total"
                    value={editFormData.total.toFixed(2)}
                    disabled
                    sx={{ flex: 1, minWidth: 120 }}
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCancel}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this stock item? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Paper>
    </Box>
  );
};

export default StocksItemList;
