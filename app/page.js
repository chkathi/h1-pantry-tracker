'use client'
import Image from 'next/image'
import { useState, useEffect, useInsertionEffect } from 'react'
import { firestore } from '@/firebase'

import { Box, Typography } from '@mui/material'
import { collection, getDocs, query } from 'firebase/firestore'

export default function Home() {
  // Inventory Management helper functions
  const { inventory, setInventory } = useState([])
  const { open, setOpen } = useState(false)
  const { itemName, setItemName } = useState('')

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
        ...doc.data,
      })
    })

    // Update the state
    setInventory(inventoryList)
  }

  // Whenever the dependencies in the array changes the function passed in runs
  useEffect(() => {
    updateInventory()
  }, [])

  return (
    // Display the
    <>
      <Box>
        <Typography variant="h1">Inventory Management</Typography>
      </Box>
    </>
  )
}
