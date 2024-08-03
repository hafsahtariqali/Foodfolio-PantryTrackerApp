"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, CssBaseline } from '@mui/material';
import NavBar from '../Components/NavBar';

const LandingPage = () => {
  const router = useRouter();

  return (
    <React.Fragment>
      <NavBar />
      <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CssBaseline />
        <Box 
          sx={{ 
            textAlign: 'center', 
            px: { xs: 2, sm: 4 }, 
            mb: { xs: 2, sm: 4 }  // Ensure bottom margin is not too large
          }}
        >
          <Typography 
            variant="h2" 
            gutterBottom  
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 'bold',
              color: '#511F52',
              fontSize: { xs: '2rem', sm: '3rem' }, // Responsive font size
            }}
          >
            Welcome to Foodfolio!
          </Typography>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom  
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              color: '#693B69',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              mt: 4, // Responsive font size
            }}
          >
            Your ultimate pantry management tool.
          </Typography>
          <Typography 
            variant="h6" 
            color="textSecondary" 
            paragraph  
            sx={{
              fontFamily: 'Nunito',
              fontWeight: '400',
              color: '#A987A8',
              mt: 4, // Reduce top margin
              mx: { xs: 2, sm: 4 } // Responsive margin
            }}
          >
            Monitor your pantry inventory, minimize food waste, and stay informed about your stock. FoodFolio assists you in organizing your pantry effectively, so you always have the essentials on hand.
            <br></br><br></br>
            Bonus: Get personalized AI recipes based on your pantry items!
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => router.push('/Pantry')}  
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
              mx: 'auto',
              mt: 4, // Reduce top margin
              padding: '10px 20px',
              display: { xs: 'block', sm: 'inline-block' }  // Ensure button is visible on mobile
            }}
          >
            Create Pantry
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default LandingPage;
