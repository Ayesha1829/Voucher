import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

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

  // State for voucher details - store in yyyy-mm-dd format for date input
  const [voucherDate, setVoucherDate] = useState("");

  // Helper function to format date to dd/mm/yyyy for display
  const formatDateToDisplay = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
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
      date: formatDateToDisplay(voucherDate), // Convert to dd/mm/yyyy for display/storage
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
    <Box sx={{
      width: { xs: '100%', md: '100vw' },
      position: { xs: 'static', md: 'relative' },
      left: { xs: 'auto', md: '50%' },
      right: { xs: 'auto', md: '50%' },
      marginLeft: { xs: '0', md: 'calc(-50vw + 20vw)' },
      marginRight: { xs: '0', md: '-50vw' },
      py: { xs: 2, md: 4 },
      px: { xs: 2, md: 6 },
      minHeight: '100vh',
      backgroundColor: '#D9E1FA'
    }}>
      {/* Main Content Container */}
      <Box sx={{ width: '100%', mx: 'auto' }}>
        <Paper elevation={3} sx={{
          p: { xs: 2, md: 3 },
          mb: { xs: 2, md: 3 },
          borderRadius: { xs: 1, md: 2 },
          mx: { xs: 0, md: 0 },
          width: '100%'
        }}>
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
            Purchase Voucher
          </Typography>
        </Box>

        {/* Voucher Details Section */}
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr'
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
                slotProps={{
                  htmlInput: {
                    max: "2099-12-31"
                  }
                }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                Supplier
              </Typography>
              <Autocomplete
                size="small"
                options={suppliers}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                value={suppliers.find(supplier => supplier.name === selectedSupplier) || null}
                onChange={(_, newValue) => {
                  if (typeof newValue === 'string') {
                    setSelectedSupplier(newValue);
                  } else if (newValue) {
                    setSelectedSupplier(newValue.name);
                  } else {
                    setSelectedSupplier('');
                  }
                }}
                inputValue={selectedSupplier}
                onInputChange={(_, newInputValue) => {
                  setSelectedSupplier(newInputValue);
                }}
                freeSolo={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select or type supplier name"
                    variant="outlined"
                  />
                )}
                filterOptions={(options, { inputValue }) => {
                  const filtered = options.filter((option) =>
                    option.name.toLowerCase().includes(inputValue.toLowerCase())
                  );
                  return filtered;
                }}
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
          {purchaseItems.map((item, index) => (
            <Card key={item.id} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Item #{index + 1}
                </Typography>
                {purchaseItems.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => {
                      setPurchaseItems(purchaseItems.filter(i => i.id !== item.id));
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
                  <Autocomplete
                    size="small"
                    options={['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Printer', 'Scanner', 'Tablet', 'Phone']}
                    getOptionLabel={(option) => option}
                    value={item.item || null}
                    onChange={(_, newValue) => {
                      handleInputChange(item.id, "item", newValue || '');
                    }}
                    inputValue={item.item}
                    onInputChange={(_, newInputValue) => {
                      handleInputChange(item.id, "item", newInputValue);
                    }}
                    freeSolo={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select or type item name"
                        variant="outlined"
                      />
                    )}
                    filterOptions={(options, { inputValue }) => {
                      const filtered = options.filter((option) =>
                        option.toLowerCase().includes(inputValue.toLowerCase())
                      );
                      return filtered;
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Category</Typography>
                  <Autocomplete
                    size="small"
                    options={categories}
                    getOptionLabel={(option) => option}
                    value={item.category || null}
                    onChange={(_, newValue) => {
                      handleInputChange(item.id, "category", newValue || '');
                    }}
                    inputValue={item.category}
                    onInputChange={(_, newInputValue) => {
                      handleInputChange(item.id, "category", newInputValue);
                    }}
                    freeSolo={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select or type category"
                        variant="outlined"
                      />
                    )}
                    filterOptions={(options, { inputValue }) => {
                      const filtered = options.filter((option) =>
                        option.toLowerCase().includes(inputValue.toLowerCase())
                      );
                      return filtered;
                    }}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
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
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Quantity</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) => handleInputChange(item.id, "quantity", Number(e.target.value))}
                      placeholder="0"
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Unit</Typography>
                    <Autocomplete
                      size="small"
                      options={units}
                      getOptionLabel={(option) => option}
                      value={item.unit || null}
                      onChange={(_, newValue) => {
                        handleInputChange(item.id, "unit", newValue || '');
                      }}
                      inputValue={item.unit}
                      onInputChange={(_, newInputValue) => {
                        handleInputChange(item.id, "unit", newInputValue);
                      }}
                      freeSolo={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select or type unit"
                          variant="outlined"
                        />
                      )}
                      filterOptions={(options, { inputValue }) => {
                        const filtered = options.filter((option) =>
                          option.toLowerCase().includes(inputValue.toLowerCase())
                        );
                        return filtered;
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>GST (%)</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.gst || ""}
                      onChange={(e) => handleInputChange(item.id, "gst", Number(e.target.value))}
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
                <TableCell sx={{ fontWeight: "bold", minWidth: 100, p: 2 }}>
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ p: 2 }}>
                    <Autocomplete
                      size="small"
                      options={['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Printer', 'Scanner', 'Tablet', 'Phone']}
                      getOptionLabel={(option) => option}
                      value={item.item || null}
                      onChange={(_, newValue) => {
                        handleInputChange(item.id, "item", newValue || '');
                      }}
                      inputValue={item.item}
                      onInputChange={(_, newInputValue) => {
                        handleInputChange(item.id, "item", newInputValue);
                      }}
                      freeSolo={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select or type item"
                          variant="outlined"
                        />
                      )}
                      filterOptions={(options, { inputValue }) => {
                        const filtered = options.filter((option) =>
                          option.toLowerCase().includes(inputValue.toLowerCase())
                        );
                        return filtered;
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ p: 2 }}>
                    <Autocomplete
                      size="small"
                      options={categories}
                      getOptionLabel={(option) => option}
                      value={item.category || null}
                      onChange={(_, newValue) => {
                        handleInputChange(item.id, "category", newValue || '');
                      }}
                      inputValue={item.category}
                      onInputChange={(_, newInputValue) => {
                        handleInputChange(item.id, "category", newInputValue);
                      }}
                      freeSolo={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select or type category"
                          variant="outlined"
                        />
                      )}
                      filterOptions={(options, { inputValue }) => {
                        const filtered = options.filter((option) =>
                          option.toLowerCase().includes(inputValue.toLowerCase())
                        );
                        return filtered;
                      }}
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
                    <Autocomplete
                      size="small"
                      options={units}
                      getOptionLabel={(option) => option}
                      value={item.unit || null}
                      onChange={(_, newValue) => {
                        handleInputChange(item.id, "unit", newValue || '');
                      }}
                      inputValue={item.unit}
                      onInputChange={(_, newInputValue) => {
                        handleInputChange(item.id, "unit", newInputValue);
                      }}
                      freeSolo={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select or type unit"
                          variant="outlined"
                        />
                      )}
                      filterOptions={(options, { inputValue }) => {
                        const filtered = options.filter((option) =>
                          option.toLowerCase().includes(inputValue.toLowerCase())
                        );
                        return filtered;
                      }}
                    />
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
                  <TableCell sx={{ p: 2 }}>
                    {purchaseItems.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => {
                          setPurchaseItems(purchaseItems.filter(i => i.id !== item.id));
                        }}
                        size="small"
                        sx={{
                          "&:hover": {
                            backgroundColor: "#ffebee",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
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

export default PurchaseVoucher;