import React, { useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography, Stack, CircularProgress } from '@mui/material';

const RecipeGenerator = ({ pantryItems }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const ingredients = pantryItems.join(','); // Convert array to comma-separated string
      const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
        params: {
          ingredients: ingredients,
          number: 5, // Number of recipes to fetch
          apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY, // Ensure to set this in .env.local
        },
      });
      const recipeIds = response.data.map(recipe => recipe.id);
      const recipeInfoPromises = recipeIds.map(id => axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: {
          apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
        },
      }));
      const recipeInfos = await Promise.all(recipeInfoPromises);
      const recipesWithSourceUrl = response.data.map((recipe, index) => ({
        ...recipe,
        sourceUrl: recipeInfos[index].data.sourceUrl,
      }));
      setRecipes(recipesWithSourceUrl);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ mt: 4, textAlign: 'center', padding: '0 16px' }}>
      <Typography 
        variant="h3" 
        fontFamily="Poppins" 
        fontWeight="bold" 
        color="#511F52" 
        mt={{ xs: 2, md: 4 }} 
        mb={{ xs: 2, md: 3 }}
      >
        Recipe Suggestions
      </Typography>
      <Button
        variant="outlined"
        onClick={fetchRecipes}
        sx={{
          backgroundColor: '#511F52',
          color: '#fff',
          borderRadius: '15px',
          fontFamily: 'Poppins',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#A987A8',
            borderColor: '#fff',
            color: 'white',
          },
          mb: 3,
          padding: '10px 20px',
        }}
      >
        Generate Recipes
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={2} alignItems="center">
          {recipes.map((recipe) => (
            <Box 
              key={recipe.id} 
              sx={{ 
                p: 2, 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                width: '100%', 
                maxWidth: 600,
                textAlign: 'left' 
              }}
            >
              <Typography 
                variant="h6" 
                fontFamily="Poppins" 
                color="#693B69"
                mb={1}
              >
                {recipe.title}
              </Typography>
              <Typography 
                variant="body2" 
                fontFamily="Nunito" 
                color="#511F52"
                mb={1}
              >
                Ingredients: {recipe.usedIngredients.map(ing => ing.name).join(', ')}
              </Typography>
              <Button
                variant="outlined"
                href={recipe.sourceUrl}
                target="_blank"
                sx={{
                  mt: 1,
                  backgroundColor: '#A987A8',
                  borderColor: '#A987A8',
                  color: '#fff',
                  borderRadius: '15px',
                  fontFamily: 'Poppins',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#693B69',
                    color: 'white',
                  },
                  padding: '10px 20px',
                }}
              >
                View Recipe
              </Button>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default RecipeGenerator;
