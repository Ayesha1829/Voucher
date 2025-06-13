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
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

// Define interfaces for type safety
interface PurchaseItem {
  id: string;
  item: string;
  category: string;
  rate: number;
  quantity: number;
  unit: string;
  gst: number;
  total: number;
}

interface Supplier {
  id: string;
  name: string;
}

const PurchaseVoucher: React.FC = () => {
  // Sample data for suppliers
  const [suppliers] = useState<Supplier[]>([
    { id: "1", name: "ABC Electronics Ltd." },
    { id: "2", name: "XYZ Trading Co." },
    { id: "3", name: "Global Supplies Inc." },
    { id: "4", name: "Tech Solutions Pvt Ltd." },
    { id: "5", name: "Premium Goods Co." },
  ]);

  // Sample categories
  const [categories] = useState<string[]>([
    "Electronics",
    "Clothing",
    "Food & Beverages",
    "Books",
    "Home & Garden",
    "Furniture",
  ]);

  // Sample units
  const [units] = useState<string[]>([
    "Pieces",
    "Kg",
    "Liters",
    "Meters",
    "Boxes",
  ]);

  // State for voucher details
  const [voucherDate, setVoucherDate] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [closingBalance, setClosingBalance] = useState("");

  // State for purchase items
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    {
      id: "1",
      item: "",
      category: "",
      rate: 0,
      quantity: 0,
      unit: "",
      gst: 0,
      total: 0,
    },
  ]);

  // Function to generate unique ID
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Function to calculate total including GST
  const calculateTotal = (
    rate: number,
    quantity: number,
    gst: number
  ): number => {
    const subtotal = rate * quantity;
    const gstAmount = (subtotal * gst) / 100;
    return subtotal + gstAmount;
  };

  // Function to handle input changes
  const handleInputChange = (
    id: string,
    field: keyof PurchaseItem,
    value: string | number
  ) => {
    setPurchaseItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate total when rate, quantity, or GST changes
          if (field === "rate" || field === "quantity" || field === "gst") {
            updatedItem.total = calculateTotal(
              field === "rate" ? Number(value) : item.rate,
              field === "quantity" ? Number(value) : item.quantity,
              field === "gst" ? Number(value) : item.gst
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
    const newItem: PurchaseItem = {
      id: generateId(),
      item: "",
      category: "",
      rate: 0,
      quantity: 0,
      unit: "",
      gst: 0,
      total: 0,
    };
    setPurchaseItems([...purchaseItems, newItem]);
  };

  // Function to handle form submission
  const handleSave = () => {
    // Validate that all required fields are filled
    const isValid =
      voucherDate.trim() !== "" &&
      selectedSupplier !== "" &&
      purchaseItems.every(
        (item) =>
          item.item.trim() !== "" &&
          item.category !== "" &&
          item.rate > 0 &&
          item.quantity > 0 &&
          item.unit !== ""
      );

    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }

    // Here you would typically send the data to your backend
    const voucherData = {
      date: voucherDate,
      supplier: selectedSupplier,
      closingBalance: closingBalance,
      items: purchaseItems,
      grandTotal: purchaseItems.reduce((sum, item) => sum + item.total, 0),
    };

    console.log("Purchase voucher data:", voucherData);
    alert("Purchase voucher saved successfully!");

    // Reset form
    setVoucherDate("");
    setSelectedSupplier("");
    setClosingBalance("");
    setPurchaseItems([
      {
        id: generateId(),
        item: "",
        category: "",
        rate: 0,
        quantity: 0,
        unit: "",
        gst: 0,
        total: 0,
      },
    ]);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#D9E1FA",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        p: 0,
        pl: 0,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 1600,
          ml: 2,
          my: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#4fc3f7",
            color: "white",
            py: 2,
            px: 3,
            borderRadius: 1,
            mb: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Purchase Voucher
          </Typography>
        </Box>

        {/* Voucher Details Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Date
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={voucherDate}
                onChange={(e) => setVoucherDate(e.target.value)}
                variant="outlined"
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Supplier
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Supplier</em>
                  </MenuItem>
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Closing balance
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={closingBalance}
                onChange={(e) => setClosingBalance(e.target.value)}
                placeholder="0.00"
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>

        {/* Items Table */}
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ mb: 3, width: "100%" }}
        >
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", minWidth: 200, p: 2 }}>
                  ITEM
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 150, p: 2 }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 120, p: 2 }}>
                  Rate
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 120, p: 2 }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 120, p: 2 }}>
                  Unit
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 100, p: 2 }}>
                  GST%
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 150, p: 2 }}>
                  TOTAL
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ p: 2 }}>
                    {index === 0 ? (
                      <FormControl fullWidth size="small">
                        <Select
                          value={item.item}
                          onChange={(e) =>
                            handleInputChange(item.id, "item", e.target.value)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Item</em>
                          </MenuItem>
                          <MenuItem value="Laptop">Laptop</MenuItem>
                          <MenuItem value="Mouse">Mouse</MenuItem>
                          <MenuItem value="Keyboard">Keyboard</MenuItem>
                          <MenuItem value="Monitor">Monitor</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        size="small"
                        value={item.item}
                        onChange={(e) =>
                          handleInputChange(item.id, "item", e.target.value)
                        }
                        placeholder="Enter item"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ p: 2 }}>
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
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ p: 2 }}>
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
                    />
                  </TableCell>
                  <TableCell sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      placeholder="0"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ p: 2 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={item.unit}
                        onChange={(e) =>
                          handleInputChange(item.id, "unit", e.target.value)
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select unit</em>
                        </MenuItem>
                        {units.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.gst || ""}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "gst",
                          Number(e.target.value)
                        )
                      }
                      placeholder="0"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.total.toFixed(2)}
                      variant="outlined"
                      disabled
                      sx={{
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Row Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
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
            Add Row
          </Button>
        </Box>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#45a049",
              },
              px: 4,
              py: 1,
              fontSize: "1.1rem",
            }}
          >
            SAVE
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PurchaseVoucher