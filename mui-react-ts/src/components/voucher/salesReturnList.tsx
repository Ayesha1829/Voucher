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
  FormControl,
  Select,
  MenuItem,
  Pagination,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  Visibility as ViewIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

// Define interfaces for type safety
interface SalesReturnVoucher {
  id: string;
  srvId: string;
  dated: string;
  description: string;
  entries: number;
  customerName?: string;
  totalAmount?: number;
  status?: "Pending" | "Approved" | "Rejected";
}

interface SalesReturnListProps {
  vouchers?: SalesReturnVoucher[];
  onView?: (voucher: SalesReturnVoucher) => void;
  onPrint?: (voucher: SalesReturnVoucher) => void;
  loading?: boolean;
}

const SalesReturnList: React.FC<SalesReturnListProps> = ({
  vouchers = [],
  onView,
  onPrint,
  loading = false,
}) => {
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredVouchers, setFilteredVouchers] = useState<SalesReturnVoucher[]>([]);

  // Sample data for demonstration (matching the image)
  const [sampleVouchers] = useState<SalesReturnVoucher[]>([
    {
      id: "1",
      srvId: "SRV 486",
      dated: "Wed, 27 Nov 2024",
      description: "lady went Sale Return Lady went Colour 320 Sale Voucher of 320 -",
      entries: 1,
      customerName: "Lady Customer",
      totalAmount: 320.00,
      status: "Approved",
    },
    {
      id: "2",
      srvId: "SRV 487",
      dated: "Wed, 27 Nov 2024",
      description: "Lady tried Slim ML Sale Return Lady Brief 319 Sale Voucher of 319",
      entries: 1,
      customerName: "Lady Customer",
      totalAmount: 319.00,
      status: "Pending",
    },
    {
      id: "3",
      srvId: "SRV 488",
      dated: "Thu, 28 Nov 2024",
      description: "Customer return due to size mismatch - Shirt XL Sale Voucher of 450",
      entries: 2,
      customerName: "John Doe",
      totalAmount: 450.00,
      status: "Approved",
    },
    {
      id: "4",
      srvId: "SRV 489",
      dated: "Thu, 28 Nov 2024",
      description: "Defective product return - Electronics Sale Voucher of 1200",
      entries: 1,
      customerName: "Tech Store",
      totalAmount: 1200.00,
      status: "Pending",
    },
  ]);

  // Use sample data if no vouchers provided
  const displayVouchers = vouchers.length > 0 ? vouchers : sampleVouchers;

  // Filter vouchers based on search term
  useEffect(() => {
    let filtered = displayVouchers;

    if (searchTerm) {
      filtered = filtered.filter(
        (voucher) =>
          voucher.srvId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          voucher.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          voucher.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVouchers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, displayVouchers]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredVouchers.length / Math.max(1, entriesPerPage)));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentVouchers = filteredVouchers.slice(startIndex, endIndex);

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Handle entries per page change
  const handleEntriesPerPageChange = (event: SelectChangeEvent<number>) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // Action handlers
  const handleView = (voucher: SalesReturnVoucher) => {
    if (onView) {
      onView(voucher);
    }
  };

  const handlePrint = (voucher: SalesReturnVoucher) => {
    if (onPrint) {
      onPrint(voucher);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#D9E1FA",
        p: { xs: 0.5, sm: 0.5, md: 0 },
      }}
    >
      {/* Header */}
      <Paper elevation={3} sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        mb: { xs: 1.5, sm: 2, md: 3 },
        mx: { xs: 0.5, sm: 0.5, md: 0 }
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1, md: 2 },
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          Sale Vouchers List
        </Typography>
      </Paper>

      {/* Main Content */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 1.5, sm: 2, md: 3 },
          mx: { xs: 0.5, sm: 0.5, md: 0 }
        }}
      >
        {/* Controls Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          {/* Show entries dropdown */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Show</Typography>
            <FormControl size="small" sx={{ minWidth: 60 }}>
              <Select
                value={entriesPerPage}
                onChange={handleEntriesPerPageChange}
                sx={{ fontSize: "0.875rem" }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2">entries</Typography>
          </Box>

          {/* Search box */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Search:</Typography>
            <TextField
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 200 }}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            mb: 3,
            borderRadius: 2,
            "& .MuiTableCell-root": {
              padding: "16px",
              fontSize: "0.875rem",
            },
            "& .MuiTableCell-head": {
              fontSize: "0.875rem",
              fontWeight: "bold",
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>SRV ID #</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Dated</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Entries</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      textAlign: "center",
                      py: 4,
                      backgroundColor: "#f5f5f5",
                      color: "#666",
                    }}
                  >
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    Loading...
                  </TableCell>
                </TableRow>
              ) : currentVouchers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      textAlign: "center",
                      py: 4,
                      backgroundColor: "#f5f5f5",
                      color: "#666",
                    }}
                  >
                    No data available in table
                  </TableCell>
                </TableRow>
              ) : (
                currentVouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {voucher.srvId}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {voucher.dated}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {voucher.description}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {voucher.entries}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleView(voucher)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Voucher">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handlePrint(voucher)}
                          >
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Showing {filteredVouchers.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(endIndex, filteredVouchers.length)} of{" "}
            {filteredVouchers.length} entries
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={currentPage === 1 || filteredVouchers.length === 0}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              sx={{
                borderColor: "#D9E1FA",
                color: "#333",
                "&:hover": {
                  borderColor: "#B8C5F2",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Previous
            </Button>

            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              size="small"
              showFirstButton
              showLastButton
              disabled={filteredVouchers.length === 0}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#333",
                  borderColor: "#D9E1FA",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#D9E1FA",
                    color: "#333",
                    "&:hover": {
                      backgroundColor: "#B8C5F2",
                    },
                  },
                },
              }}
            />

            <Button
              variant="outlined"
              size="small"
              disabled={
                currentPage === totalPages || filteredVouchers.length === 0
              }
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              sx={{
                borderColor: "#D9E1FA",
                color: "#333",
                "&:hover": {
                  borderColor: "#B8C5F2",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SalesReturnList;
