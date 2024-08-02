'use client'
import Image from 'next/image'
import { useState, useEffect, useInsertionEffect } from 'react'
import { firestore } from '@/firebase'

import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import {
  collection,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  query,
  setDoc,
} from 'firebase/firestore'

export default function Home() {
  // Inventory Management helper functions
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  // Updating to firebase
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))

    // using the snapshot of our firebase let's get the documents
    const docs = await getDocs(snapshot)

    const inventoryList = []

    // Get all items from the inventory
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })

    // Update the state
    setInventory(inventoryList)

    console.log(inventory)
  }

  const removeItem = async (item) => {
    console.log('remove item')
    // To get the direct item
    const docRef = doc(collection(firestore, 'inventory'), item)

    const docSnapshot = await getDoc(docRef)

    if (docSnapshot.exists()) {
      // Decrament the item count by 1
      const { quantity } = docSnapshot.data()

      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    updateInventory()
  }

  const addItem = async (item) => {
    const itemName = item.toLowerCase()
    // To get the direct item
    const docRef = doc(collection(firestore, 'inventory'), itemName)

    const docSnapshot = await getDoc(docRef)

    if (docSnapshot.exists()) {
      const { quantity } = docSnapshot.data()

      // Increase the item count by 1
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    updateInventory()
  }

  const filterItems = async (item) => {
    if (item.length === 0) return
    const snapshot = query(collection(firestore, 'inventory'))

    // using the snapshot of our firebase let's get the documents
    const docs = await getDocs(snapshot)

    const inventoryList = []

    // Get all items from the inventory
    docs.forEach((doc) => {
      if (doc.id.includes(itemName))
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        })
    })

    // Update the state
    setInventory(inventoryList)
  }

  const showAllItems = async () => {}

  // Whenever the dependencies in the array changes the function passed in runs
  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    // Display the

    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          left="50%"
          top="50%"
          width={400}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullwidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('') // add and empty the text field
                handleClose() // Close the modal
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h1" margin="30px">
        Inventory Management
      </Typography>
      <Box width="800px" heigh="100px">
        <Stack
          space={5}
          direction="row"
          display="flex"
          justifyContent="space-between"
        >
          <TextField
            variant="filled"
            width="600px"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value.toLowerCase())
              filterItems(itemName)
            }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              setItemName('')
              updateInventory()
            }}
          >
            Show All Items
          </Button>
        </Stack>
      </Box>
      <Box border="1px solid black">
        <Box
          width="800px"
          heigh="100px"
          bgcolor="#ABCDEF"
          display="flex"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography variant="h2">Inventory Items</Typography>
          <Button
            variant="contained"
            onClick={() => {
              handleOpen()
            }}
          >
            Add New Inventory Item
          </Button>
        </Box>

        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow="auto"
          display="flex"
        >
          {inventory.length === 0 ? (
            <Box
              width="100%"
              minHeight="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="grey"
              padding={5}
            >
              <Typography variant="h4">Inventory is Empty...</Typography>
            </Box>
          ) : (
            inventory.map(({ name, quantity }) => {
              return (
                <Box
                  key={name}
                  width="100%"
                  minHeight="100px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="#f0f0f0"
                  border=".5px solid black"
                  padding={5}
                >
                  <Typography variant="h4" color="#333" textAlign="center">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h4" color="#333" textAlign="center">
                    {quantity}
                  </Typography>
                  <Stack direction="column" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        addItem(name)
                      }}
                    >
                      Add Item
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        removeItem(name)
                      }}
                    >
                      Remove Item
                    </Button>
                  </Stack>
                </Box>
              )
            })
          )}
        </Stack>
      </Box>
    </Box>
  )
}
