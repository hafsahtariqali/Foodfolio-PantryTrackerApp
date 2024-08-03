"use client";
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, Typography, Snackbar, Alert } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase'; // Adjust the path if necessary
import { useRouter } from 'next/navigation';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(''); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setMessage(`Welcome, ${user.displayName}! You have been signed in.`);
      } else {
        setMessage('You are logged off. Sign in to continue.');
      }
      setOpenSnackbar(true); // Show the snackbar whenever the message changes
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/Landing'); // Redirect to the landing page
      setMessage('You are logged off. Sign in to continue.');
      setOpenSnackbar(true); // Show the snackbar after signing out
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#511F52',
        color: '#fff',
        fontFamily: 'Poppins',
        width: '100vw', // Ensure the navbar takes full width
      }}
    >
      <Typography variant="h6" component="div" fontWeight={'bold'} fontFamily={"Poppins"}>
        Foodfolio
      </Typography>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#A987AB',
            color: '#fff',
            borderRadius: '15px',
            fontFamily: 'Poppins',
            display: { xs: 'none', sm: 'flex', textTransform: 'none' },
            '&:hover': {
              backgroundColor: '#ECD4EA',
              borderColor: '#fff',
              color: 'white',
            },
          }}
          href="/Pantry" // Link to the Pantry page
        >
          My Pantry
        </Button>
      </Box>
      <Stack direction="row" spacing={1} mr={2}>
        {user ? (
          <Button
            variant="outlined"
            sx={{
              borderColor: '#693B69',
              color: '#fff',
              backgroundColor: '#A987AB',
              borderRadius: '10px',
              fontFamily: 'Poppins',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#ECD4EA',
                color: 'white',
              },
            }}
            onClick={handleSignOut} // Call the signOut function when clicked
          >
            Sign Out
          </Button>
        ) : (
          <Button
            variant="outlined"
            sx={{
              borderColor: '#693B69',
              color: '#fff',
              backgroundColor: '#A987AB',
              borderRadius: '10px',
              fontFamily: 'Poppins',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#ECD4EA',
                color: 'white',
              },
            }}
            href="/sign-in" // Link to the Sign In page
          >
            Sign In
          </Button>
        )}
        <Button
          variant="outlined"
          sx={{
            borderColor: '#693B69',
            color: '#fff',
            backgroundColor: '#A987AB',
            borderRadius: '10px',
            fontFamily: 'Poppins',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ECD4EA',
              color: 'white',
            },
          }}
          href="/sign-up" // Link to the Sign Up page
        >
          Sign Up
        </Button>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Duration before the snackbar hides
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%', backgroundColor: '#ECD4EA', fontFamily: 'Nunito', color: '#693B69'}}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NavBar;
