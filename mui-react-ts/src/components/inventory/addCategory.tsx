import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom styled components with the specified color scheme
const MainCard = styled(Card)(() => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  border: 'none',
  maxWidth: '800px',
  margin: '0 auto',
}));

const HeaderCard = styled(Card)(() => ({
  backgroundColor: '#D9E1FA',
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  border: 'none',
  margin: '0 0 24px 0',
}));

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#D9E1FA',
  color: '#333',
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '16px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  border: '2px solid #D9E1FA',
  '&:hover': {
    backgroundColor: '#B8C5F2',
    borderColor: '#B8C5F2',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#D9E1FA',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#B8C5F2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9BB0E8',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
    fontWeight: '500',
  },
}));

const HeaderTitle = styled(Typography)(() => ({
  color: '#333',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '20px',
  fontSize: '28px',
}));

const CategoryListContainer = styled(Paper)(() => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '16px',
  marginTop: '20px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  border: '1px solid #D9E1FA',
}));

// Interface for Category
interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

const AddCategory: React.FC = () => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showExistingCategories, setShowExistingCategories] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [nextId, setNextId] = useState<number>(1);

  // Generate sequential ID for categories
  const generateUniqueId = (): string => {
    const id = nextId.toString();
    setNextId(prev => prev + 1);
    return id;
  };

  // Handle saving a new category
  const handleSaveCategory = () => {
    if (categoryName.trim() === '') {
      setSnackbarMessage('Please enter a category name');
      setSnackbarOpen(true);
      return;
    }

    // Check if category already exists
    const existingCategory = categories.find(
      cat => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (existingCategory) {
      setSnackbarMessage('Category already exists');
      setSnackbarOpen(true);
      return;
    }

    const newCategory: Category = {
      id: generateUniqueId(),
      name: categoryName.trim(),
      createdAt: new Date(),
    };

    setCategories(prev => [...prev, newCategory]);
    setCategoryName('');
    setSnackbarMessage('Category added successfully!');
    setSnackbarOpen(true);
  };

  // Handle showing/hiding existing categories
  const handleToggleExistingCategories = () => {
    setShowExistingCategories(!showExistingCategories);
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
          Add Category
        </Typography>

        {/* Content */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: '#333',
              fontWeight: '600',
              textAlign: 'center'
            }}
          >
            Category Name
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveCategory();
              }
            }}
            sx={{ mb: 3 }}
          />
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSaveCategory}
            sx={{
              mr: 2,
              minWidth: '120px',
              backgroundColor: "#4fc3f7",
              "&:hover": {
                backgroundColor: "#29b6f6",
              },
            }}
          >
            SAVE
          </Button>

          <Button
            variant="contained"
            onClick={handleToggleExistingCategories}
            sx={{
              minWidth: '180px',
              backgroundColor: "#4fc3f7",
              "&:hover": {
                backgroundColor: "#29b6f6",
              },
            }}
          >
            {showExistingCategories ? 'Hide Categories' : 'Existing Categories'}
          </Button>
        </Box>
      </Paper>

      {/* Existing Categories Section */}
      {showExistingCategories && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: '#333',
              fontWeight: '600',
              textAlign: 'center'
            }}
          >
            Existing Categories ({categories.length})
          </Typography>

          {categories.length === 0 ? (
            <Box sx={{
              textAlign: 'center',
              py: 6,
              backgroundColor: '#f8f9ff',
              borderRadius: 2,
              border: '2px dashed #D9E1FA'
            }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  fontStyle: 'italic',
                  mb: 2
                }}
              >
                No categories added yet
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                }}
              >
                Start by adding your first category above
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              backgroundColor: '#f8f9ff',
              borderRadius: 2,
              p: 2
            }}>
              <List sx={{ p: 0 }}>
                {categories.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                          backgroundColor: '#f0f7ff',
                          borderColor: '#D9E1FA',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: '600' }}>
                              {category.name}
                            </Typography>
                            <Chip
                              label={`ID: ${category.id}`}
                              size="small"
                              sx={{
                                backgroundColor: '#D9E1FA',
                                color: '#333',
                                fontFamily: 'monospace',
                                fontSize: '11px',
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            📅 Created: {category.createdAt.toLocaleDateString()} at {category.createdAt.toLocaleTimeString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarMessage.includes('successfully') ? 'success' : 'warning'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCategory;