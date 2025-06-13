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
  width: '100%',
  margin: '0',
  position: 'relative',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  maxWidth: 'none',
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
    <Box sx={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', py: 4 }}>
      <MainCard>
        <Box sx={{ p: 4 }}>
          {/* Header Card */}
          <HeaderCard>
            <HeaderTitle variant="h4">
              Add Category
            </HeaderTitle>
          </HeaderCard>

          {/* Content */}
          <Box>
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

              <StyledTextField
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
              <StyledButton
                onClick={handleSaveCategory}
                sx={{ mr: 2, minWidth: '120px' }}
              >
                SAVE
              </StyledButton>

              <StyledButton
                onClick={handleToggleExistingCategories}
                sx={{ minWidth: '180px' }}
              >
                {showExistingCategories ? 'Hide Categories' : 'Existing Categories'}
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </MainCard>

      {/* Existing Categories Section */}
      {showExistingCategories && (
        <CategoryListContainer>
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
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: '#666',
                fontStyle: 'italic',
                py: 3
              }}
            >
              No categories added yet
            </Typography>
          ) : (
            <List>
              {categories.map((category, index) => (
                <React.Fragment key={category.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      '&:hover': {
                        backgroundColor: '#f8f9ff',
                        borderRadius: '8px',
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6" sx={{ color: '#333', fontWeight: '500' }}>
                            {category.name}
                          </Typography>
                          <Chip
                            label={category.id}
                            size="small"
                            sx={{
                              backgroundColor: '#D9E1FA',
                              color: '#333',
                              fontFamily: 'monospace',
                              fontSize: '12px'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                          Created: {category.createdAt.toLocaleDateString()} at {category.createdAt.toLocaleTimeString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < categories.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CategoryListContainer>
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