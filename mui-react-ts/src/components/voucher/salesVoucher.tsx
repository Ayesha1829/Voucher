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
  Card,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

// Define interfaces for type safety
interface SalesItem {
  id: string;
  item: string;
  dzn: number;
  pcs: number;
  rate: number;
  category: string;
  detail: string;
  disc: number;
  exDisc: number;
  total: number;
}

interface Party {
  id: string;
  name: string;
}

const SalesVoucher: React.FC = () => {
  // Sample data for parties
  const [parties] = useState<Party[]>([
    { id: "1", name: "ABC Retail Store" },
    { id: "2", name: "XYZ Wholesale Co." },
    { id: "3", name: "Global Distributors" },
    { id: "4", name: "Premium Sales Ltd." },
    { id: "5", name: "Local Market Co." },
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

  // State for voucher details
  const [voucherDate, setVoucherDate] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [carton, setCarton] = useState("");
  const [closingBalance, setClosingBalance] = useState("");

  // State for sales items
  const [salesItems, setSalesItems] = useState<SalesItem[]>([
    {
      id: "1",
      item: "",
      dzn: 0,
      pcs: 0,
      rate: 0,
      category: "",
      detail: "",
      disc: 0,
      exDisc: 0,
      total: 0,
    },
  ]);

  // Function to generate unique ID
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Function to calculate total with discounts
  const calculateTotal = (
    dzn: number,
    pcs: number,
    rate: number,
    disc: number,
    exDisc: number
  ): number => {
    const totalPieces = dzn * 12 + pcs; // Assuming 1 dozen = 12 pieces
    const subtotal = totalPieces * rate;
    const discountAmount = (subtotal * disc) / 100;
    const afterDiscount = subtotal - discountAmount;
    const exDiscountAmount = (afterDiscount * exDisc) / 100;
    return afterDiscount - exDiscountAmount;
  };

  // Function to handle input changes
  const handleInputChange = (
    id: string,
    field: keyof SalesItem,
    value: string | number
  ) => {
    setSalesItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate total when relevant fields change
          if (["dzn", "pcs", "rate", "disc", "exDisc"].includes(field)) {
            updatedItem.total = calculateTotal(
              field === "dzn" ? Number(value) : item.dzn,
              field === "pcs" ? Number(value) : item.pcs,
              field === "rate" ? Number(value) : item.rate,
              field === "disc" ? Number(value) : item.disc,
              field === "exDisc" ? Number(value) : item.exDisc
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
    const newItem: SalesItem = {
      id: generateId(),
      item: "",
      dzn: 0,
      pcs: 0,
      rate: 0,
      category: "",
      detail: "",
      disc: 0,
      exDisc: 0,
      total: 0,
    };
    setSalesItems([...salesItems, newItem]);
  };

  // Function to handle form submission
  const handleSave = () => {
    // Validate that all required fields are filled
    const isValid =
      voucherDate.trim() !== "" &&
      selectedParty !== "" &&
      salesItems.every(
        (item) =>
          item.item.trim() !== "" &&
          item.category !== "" &&
          item.rate > 0 &&
          (item.dzn > 0 || item.pcs > 0)
      );

    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }

    // Here you would typically send the data to your backend
    const voucherData = {
      date: voucherDate,
      party: selectedParty,
      carton: carton,
      closingBalance: closingBalance,
      items: salesItems,
      grandTotal: salesItems.reduce((sum, item) => sum + item.total, 0),
    };

    console.log("Sales voucher data:", voucherData);
    alert("Sales voucher saved successfully!");

    // Reset form
    setVoucherDate("");
    setSelectedParty("");
    setCarton("");
    setClosingBalance("");
    setSalesItems([
      {
        id: generateId(),
        item: "",
        dzn: 0,
        pcs: 0,
        rate: 0,
        category: "",
        detail: "",
        disc: 0,
        exDisc: 0,
        total: 0,
      },
    ]);
  };

  return (
    <Box
      sx={{
        width: '100%',
        mx: "auto",
        overflow: 'hidden'
      }}
    >
      {/* Main Content Container */}
      <Box sx={{ width: '100%', mx: 'auto' }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 2, md: 3 },
            m: 0,
            borderRadius: 0,
            width: '100%'
          }}
        >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#D9E1FA",
            color: "black",
            py: { xs: 1.5, md: 2 },
            px: { xs: 2, md: 3 },
            borderRadius: 1,
            mb: { xs: 2, md: 3 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}
          >
            Sales Voucher
          </Typography>
        </Box>

        {/* Voucher Details Section */}
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr 1fr'
            },
            gap: { xs: 2, md: 3 },
            mb: 2
          }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>
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
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                Party
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedParty}
                  onChange={(e) => setSelectedParty(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Party</em>
                  </MenuItem>
                  {parties.map((party) => (
                    <MenuItem key={party.id} value={party.name}>
                      {party.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                Carton
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={carton}
                onChange={(e) => setCarton(e.target.value)}
                placeholder="0"
                variant="outlined"
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>
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

        {/* Items - Mobile Card Layout */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
          {salesItems.map((item, index) => (
            <Card key={item.id} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Item #{index + 1}
                </Typography>
                {salesItems.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSalesItems(salesItems.filter(i => i.id !== item.id));
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Item</Typography>
                  {index === 0 ? (
                    <FormControl fullWidth size="small">
                      <Select
                        value={item.item}
                        onChange={(e) => handleInputChange(item.id, "item", e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value=""><em>Item</em></MenuItem>
                        <MenuItem value="Shirt">Shirt</MenuItem>
                        <MenuItem value="Pants">Pants</MenuItem>
                        <MenuItem value="Jacket">Jacket</MenuItem>
                        <MenuItem value="Shoes">Shoes</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      value={item.item}
                      onChange={(e) => handleInputChange(item.id, "item", e.target.value)}
                      placeholder="Enter item"
                    />
                  )}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>DZN</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.dzn || ""}
                      onChange={(e) => handleInputChange(item.id, "dzn", Number(e.target.value))}
                      placeholder="0"
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>PCS</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.pcs || ""}
                      onChange={(e) => handleInputChange(item.id, "pcs", Number(e.target.value))}
                      placeholder="0"
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Rate</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={item.rate || ""}
                    onChange={(e) => handleInputChange(item.id, "rate", Number(e.target.value))}
                    placeholder="0.00"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Category</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={item.category}
                      onChange={(e) => handleInputChange(item.id, "category", e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value=""><em>Select category</em></MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Detail</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.detail}
                    onChange={(e) => handleInputChange(item.id, "detail", e.target.value)}
                    placeholder="Enter detail"
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Disc (%)</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.disc || ""}
                      onChange={(e) => handleInputChange(item.id, "disc", Number(e.target.value))}
                      placeholder="0"
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Ex.Disc (%)</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.exDisc || ""}
                      onChange={(e) => handleInputChange(item.id, "exDisc", Number(e.target.value))}
                      placeholder="0"
                    />
                  </Box>
                </Box>

                <Box sx={{ p: 1, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Total</Typography>
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    ${item.total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Items Table - Desktop Layout */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ mb: 3, width: "100%" }}
          >
            <Table sx={{ minWidth: 1400 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", minWidth: 180, p: 2 }}>
                  ITEM
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 100, p: 2 }}>
                  DZN
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 100, p: 2 }}>
                  PCS
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 120, p: 2 }}>
                  Rate
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 140, p: 2 }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 160, p: 2 }}>
                  Detail
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 100, p: 2 }}>
                  Disc
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 100, p: 2 }}>
                  Ex.Disc
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", minWidth: 140, p: 2 }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesItems.map((item, index) => (
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
                          <MenuItem value="Shirt">Shirt</MenuItem>
                          <MenuItem value="Pants">Pants</MenuItem>
                          <MenuItem value="Jacket">Jacket</MenuItem>
                          <MenuItem value="Shoes">Shoes</MenuItem>
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
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.dzn || ""}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "dzn",
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
                      type="number"
                      value={item.pcs || ""}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "pcs",
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
                      value={item.detail}
                      onChange={(e) =>
                        handleInputChange(item.id, "detail", e.target.value)
                      }
                      placeholder="Enter detail"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.disc || ""}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "disc",
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
                      type="number"
                      value={item.exDisc || ""}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "exDisc",
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
        </Box>

        {/* Add Row Button */}
        <Box sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
          mb: { xs: 2, md: 3 }
        }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addNewRow}
            sx={{
              backgroundColor: "#4fc3f7",
              "&:hover": {
                backgroundColor: "#29b6f6",
              },
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: '0.9rem', md: '1rem' },
              width: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: '300px', sm: 'none' }
            }}
          >
            Add Row
          </Button>
        </Box>

        {/* Save Button */}
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          mb: { xs: 2, md: 0 }
        }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#45a049",
              },
              px: { xs: 3, md: 4 },
              py: { xs: 1.5, md: 1 },
              fontSize: { xs: '1rem', md: '1.1rem' },
              width: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: '300px', sm: 'none' }
            }}
          >
            SAVE
          </Button>
        </Box>
      </Paper>
      </Box>
    </Box>
  );
};

export default SalesVoucher;