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
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
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
    <Box sx={{
      width: '100%',
      mx: "auto",
      overflow: 'hidden'
    }}>
      {/* Main Content Container */}
      <Box sx={{ width: '100%', mx: 'auto' }}>
        <Paper elevation={3} sx={{
          p: { xs: 2, sm: 2, md: 3 },
          m: 0,
          borderRadius: 0,
          width: '100%'
        }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{
            mb: { xs: 2, md: 3 },
            fontWeight: "bold",
            color: "black",
            backgroundColor: "#D9E1FA",
            py: { xs: 1.5, md: 2 },
            px: { xs: 1, md: 0 },
            borderRadius: 1,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
          }}
        >
          Create Stocks
        </Typography>

        {/* Stock Items - Mobile Card Layout */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
          {stockItems.map((item, index) => (
            <Card key={item.id} sx={{ mb: 2, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Item #{index + 1}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => removeRow(item.id)}
                  disabled={stockItems.length === 1}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Item Name"
                  size="small"
                  value={item.itemName}
                  onChange={(e) => handleInputChange(item.id, "itemName", e.target.value)}
                  placeholder="Enter item name"
                />

                <TextField
                  fullWidth
                  label="Item Code"
                  size="small"
                  value={item.itemCode}
                  onChange={(e) => handleInputChange(item.id, "itemCode", e.target.value)}
                  placeholder="Enter item code"
                />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    size="small"
                    type="number"
                    value={item.qty || ""}
                    onChange={(e) => handleInputChange(item.id, "qty", Number(e.target.value))}
                    placeholder="0"
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                  <TextField
                    fullWidth
                    label="Unit"
                    size="small"
                    value={item.unit}
                    onChange={(e) => handleInputChange(item.id, "unit", e.target.value)}
                    placeholder="Unit"
                  />
                </Box>

                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={item.category}
                    label="Category"
                    onChange={(e) => handleInputChange(item.id, "category", e.target.value)}
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

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Rate"
                    size="small"
                    type="number"
                    value={item.rate || ""}
                    onChange={(e) => handleInputChange(item.id, "rate", Number(e.target.value))}
                    placeholder="0.00"
                    slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  />
                  <TextField
                    fullWidth
                    label="Total"
                    size="small"
                    value={item.total.toFixed(2)}
                    slotProps={{ input: { readOnly: true } }}
                    sx={{
                      "& .MuiInputBase-input": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Stock Items Table - Desktop Layout */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              borderRadius: 2,
              '& .MuiTableCell-root': {
                padding: '16px',
                fontSize: '1rem'
              },
              '& .MuiTableCell-head': {
                fontSize: '0.875rem',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{
                  fontWeight: "bold",
                  minWidth: { xs: '90px', sm: '120px', md: 'auto' },
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                }}>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Item Name</Box>
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Item</Box>
                </TableCell>
                <TableCell sx={{
                  fontWeight: "bold",
                  minWidth: { xs: '80px', sm: '100px', md: 'auto' },
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                }}>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Item Code</Box>
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Code</Box>
                </TableCell>
                <TableCell sx={{
                  fontWeight: "bold",
                  minWidth: { xs: '60px', sm: '70px', md: 'auto' },
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                }}>
                  QTY
                </TableCell>
                <TableCell sx={{
                  fontWeight: "bold",
                  minWidth: { xs: '90px', sm: '120px', md: 'auto' },
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                }}>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Category</Box>
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Cat.</Box>
                </TableCell>
                <TableCell sx={{
                  fontWeight: "bold",
                  minWidth: { xs: '60px', sm: '80px', md: 'auto' },
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                }}>
                  Unit
                </TableCell>
                <TableCell sx={{
                  fontWeight: "bold",
                  minWidth: { xs: '70px', sm: '90px', md: 'auto' },
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                }}>
                  Rate
                </TableCell>
                <TableCell sx={{
                  fontWeight: "bold",
                  minWidth: { xs: '70px', sm: '90px', md: 'auto' },
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                }}>
                  Total
                </TableCell>
                <TableCell sx={{
                  fontWeight: "bold",
                  minWidth: { xs: '60px', sm: '80px', md: 'auto' },
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                }}>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Actions</Box>
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Act.</Box>
                </TableCell>
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
                      sx={{
                        minWidth: { xs: '90px', sm: '140px', md: 'auto' },
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                        },
                        '& .MuiInputBase-input::placeholder': {
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }
                        }
                      }}
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
                      placeholder="Item code"
                      variant="outlined"
                      sx={{
                        minWidth: { xs: '80px', sm: '120px', md: 'auto' },
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                        },
                        '& .MuiInputBase-input::placeholder': {
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }
                        }
                      }}
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
                      sx={{
                        minWidth: { xs: '50px', sm: '70px', md: 'auto' },
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                          textAlign: 'center'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{
                        minWidth: { xs: '90px', sm: '140px', md: 'auto' },
                        '& .MuiSelect-select': {
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                        }
                      }}
                    >
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
                      placeholder="Unit"
                      variant="outlined"
                      sx={{
                        minWidth: { xs: '60px', sm: '90px', md: 'auto' },
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                        },
                        '& .MuiInputBase-input::placeholder': {
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }
                        }
                      }}
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
                      sx={{
                        minWidth: { xs: '60px', sm: '80px', md: 'auto' },
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                          textAlign: 'right'
                        }
                      }}
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
                        minWidth: { xs: '60px', sm: '80px', md: 'auto' },
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f5f5f5",
                          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                          textAlign: 'right'
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
                      sx={{
                        minWidth: { xs: '32px', md: 'auto' },
                        padding: { xs: '4px', md: '8px' }
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: { xs: '16px', md: '20px' } }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            mt: { xs: 2, md: 3 },
            display: "flex",
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
            px: { xs: 1, sm: 0 }
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addNewRow}
            sx={{
              backgroundColor: "#4fc3f7",
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: '200px', md: 'auto' },
              py: { xs: 1.5, md: 1 },
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
              px: { xs: 3, md: 4 },
              py: { xs: 1.5, md: 1 },
              fontSize: { xs: "1rem", md: "1.1rem" },
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: '200px', md: 'auto' },
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
      </Box>
    </Box>
  );
};

export default CreateStocks;
