"use client";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment, Snackbar, Alert } from '@mui/material';
import { firestore, auth } from '@/firebase';  // Ensure auth is imported
import Fab from '@mui/material/Fab';
import NavBar from '../Components/NavBar';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import withPrivateRoute from '../Components/withPrivateRoute';
import RecipeGenerator from '../api/route';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const PANTRY_ALERT_DAYS = 7;

const Pantry = () => {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [expirationDate, setExpirationDate] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        updateInventory(user.uid);
        checkExpiringItems(user.uid);
      } else {
        setUser(null);
        setInventory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateInventory = async (userId) => {
    const snapshot = query(collection(firestore, 'users', userId, 'pantry'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    const today = new Date();
    let latestExpiryAlert = '';

    docs.forEach((doc) => {
      const data = doc.data();
      const expiryDate = new Date(data.expiration);
      inventoryList.push({ name: doc.id, ...data });

      const daysToExpire = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      if (daysToExpire >= 0 && daysToExpire <= PANTRY_ALERT_DAYS) {
        if (latestExpiryAlert === '' || expiryDate < new Date(latestExpiryAlert)) {
          latestExpiryAlert = expiryDate;
          setMessage(`Item "${doc.id}" is expiring soon on ${expiryDate.toDateString()}.`);
          setOpenSnackbar(true);
        }
      }
    });

    setInventory(inventoryList);
  };

  const addItem = async (userId, item, expiration) => {
    const docRef = doc(collection(firestore, 'users', userId, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, expiration });
    } else {
      await setDoc(docRef, { quantity: 1, expiration });
    }

    await updateInventory(userId);
  };

  const removeItem = async (userId, item) => {
    const docRef = doc(collection(firestore, 'users', userId, 'pantry'), item);
    await deleteDoc(docRef);
    await updateInventory(userId);
  };

  const increaseQuantity = async (userId, item) => {
    const docRef = doc(collection(firestore, 'users', userId, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await updateDoc(docRef, { quantity: quantity + 1 });
    }
    await updateInventory(userId);
  };

  const decreaseQuantity = async (userId, item) => {
    const docRef = doc(collection(firestore, 'users', userId, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity > 1) {
        await updateDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory(userId);
  };

  const checkExpiringItems = async (userId) => {
    const snapshot = query(collection(firestore, 'users', userId, 'pantry'));
    const docs = await getDocs(snapshot);
    const today = new Date();
    docs.forEach((doc) => {
      const data = doc.data();
      const expiryDate = new Date(data.expiration);
      const daysToExpire = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      if (daysToExpire >= 0 && daysToExpire <= PANTRY_ALERT_DAYS) {
        setMessage(`Item "${doc.id}" is expiring soon on ${expiryDate.toDateString()}.`);
        setOpenSnackbar(true);
      }
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <NavBar />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontFamily: 'Poppins', color: '#511F52' }}>
              Add Item
            </Typography>
            <Stack width="100%" direction="column" spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <DatePicker
                label="Expiry"
                value={expirationDate}
                onChange={(newDate) => setExpirationDate(newDate)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {params.InputProps.endAdornment}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Button
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
                  padding: '10px 20px',
                }}
                onClick={() => {
                  if (expirationDate && user) {
                    addItem(user.uid, itemName, expirationDate.toISOString().split('T')[0]);
                    setItemName('');
                    handleClose();
                  } else {
                    console.error("Expiration date is null or user not authenticated");
                  }
                }}>
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
      </LocalizationProvider>
      <Box
        width="100%"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
        px={2}
        mt={8}
      >
        <Typography variant={'h3'} textAlign={'center'} sx={{
          fontWeight: 'bold',
          color: '#511F52',
          fontFamily: 'Poppins',
          marginBottom: '1rem',
        }}
          mt={{ xs: 2, md: 4 }}
          mb={{ xs: 2, md: 3 }}>
          My Pantry
        </Typography>
        <Button variant="outlined" onClick={handleOpen} sx={{
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
          width: '100%',
          maxWidth: 200
        }}>
          Add Item
        </Button>
        <TableContainer component={Paper} sx={{ width: '100%', maxWidth: 800, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#511F52' }}>Name</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#511F52' }}>Quantity</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#511F52' }}>Expiration Date</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#511F52' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.name}>
                  <TableCell component="th" scope="row" align="center" sx={{ fontSize: '0.875rem' }}>
                    {item.name}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.875rem' }}>{item.quantity}</TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.78rem' }}>{item.expiration}</TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Fab size="small" color="success" aria-label="add"  sx={{ width: 35, height: 25, padding: 0 }} onClick={() => increaseQuantity(user.uid, item.name)}>
                        <AddIcon sx={{ fontSize: 15 }} />
                      </Fab>
                      <Fab size="small" color="error" aria-label="remove"  sx={{ width: 35, height: 25, padding: 0 }} onClick={() => decreaseQuantity(user.uid, item.name)}>
                        <RemoveIcon sx={{ fontSize: 15 }} />
                      </Fab>
                      <Fab size="small" color="error" aria-label="delete"  sx={{ width: 35, height: 25, padding: 0 }} onClick={() => removeItem(user.uid, item.name)}>
                        <DeleteIcon sx={{ fontSize: 15 }} />
                      </Fab>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Duration before the snackbar hides
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%', backgroundColor: '#ECD4EA', fontFamily: 'Nunito', color: '#693B69'}}>
          {message}
        </Alert>
      </Snackbar>
      <RecipeGenerator pantryItems={inventory.map(item => item.name)} />
    </>
  );
};

export default withPrivateRoute(Pantry);
