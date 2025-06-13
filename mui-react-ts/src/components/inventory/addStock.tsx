import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

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
}

interface Category {
  id: string;
  name: string;
}



const CreateStocks: React.FC = () => {
  // Sample data for categories and units
  const [categories] = useState<Category[]>([
    { id: "1", name: "Electronics" },
    { id: "2", name: "Clothing" },
    { id: "3", name: "Food & Beverages" },
    { id: "4", name: "Books" },
    { id: "5", name: "Home & Garden" },
  ]);



  // State for stock items
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: "1",
      itemName: "",
      itemCode: "",
      qty: 0,
      category: "",
      unit: "",
      rate: 0,
      total: 0,
    },
  ]);

  // Function to generate unique ID
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 11);
  };

  // Function to calculate total
  const calculateTotal = (qty: number, rate: number): number => {
    return qty * rate;
  };

  // Function to handle input changes
  const handleInputChange = (
    id: string,
    field: keyof StockItem,
    value: string | number
  ) => {
    setStockItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate total when qty or rate changes
          if (field === "qty" || field === "rate") {
            updatedItem.total = calculateTotal(
              field === "qty" ? Number(value) : item.qty,
              field === "rate" ? Number(value) : item.rate
            );
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Function to add new row
  const addNewRow = () => {
    const newItem: StockItem = {
      id: generateId(),
      itemName: "",
      itemCode: "",
      qty: 0,
      category: "",
      unit: "",
      rate: 0,
      total: 0,
    };
    setStockItems([...stockItems, newItem]);
  };

  // Function to remove row
  const removeRow = (id: string) => {
    if (stockItems.length > 1) {
      setStockItems(stockItems.filter((item) => item.id !== id));
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Validate that all required fields are filled
    const isValid = stockItems.every(
      (item) =>
        item.itemName.trim() !== "" &&
        item.itemCode.trim() !== "" &&
        item.qty > 0 &&
        item.category !== "" &&
        item.unit !== "" &&
        item.rate > 0
    );

    if (!isValid) {
      alert("Please fill in all required fields for all items.");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Stock items to submit:", stockItems);
    alert("Stock items created successfully!");

    // Reset form
    setStockItems([
      {
        id: generateId(),
        itemName: "",
        itemCode: "",
        qty: 0,
        category: "",
        unit: "",
        rate: 0,
        total: 0,
      },
    ]);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
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
          }}
        >
          Create Stocks
        </Typography>

        {/* Stock Items Table */}
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Item Code</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>QTY</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Rate</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.itemName}
                      onChange={(e) =>
                        handleInputChange(item.id, "itemName", e.target.value)
                      }
                      placeholder="Enter item name"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.itemCode}
                      onChange={(e) =>
                        handleInputChange(item.id, "itemCode", e.target.value)
                      }
                      placeholder="Enter item code"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.qty || ""}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "qty",
                          Number(e.target.value)
                        )
                      }
                      placeholder="0"
                      variant="outlined"
                      slotProps={{ htmlInput: { min: 0 } }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={item.category}
                        onChange={(e) =>
                          handleInputChange(item.id, "category", e.target.value)
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select category</em>
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.name}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.unit}
                      onChange={(e) =>
                        handleInputChange(item.id, "unit", e.target.value)
                      }
                      placeholder="Enter unit"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.rate || ""}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "rate",
                          Number(e.target.value)
                        )
                      }
                      placeholder="0.00"
                      variant="outlined"
                      slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.total.toFixed(2)}
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => removeRow(item.id)}
                      disabled={stockItems.length === 1}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Buttons */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addNewRow}
            sx={{
              backgroundColor: "#4fc3f7",
              "&:hover": {
                backgroundColor: "#29b6f6",
              },
            }}
          >
            ADD ROW
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{
              px: 4,
              py: 1,
              fontSize: "1.1rem",
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateStocks;
