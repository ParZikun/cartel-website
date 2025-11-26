import { useState, useEffect } from 'react'
import Table from '../Table'
import SlideOver from '../SlideOver'

export default function ListingsTab() {
  const [listings, setListings] = useState([])
  const [selectedListing, setSelectedListing] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/get-listings?admin=true')
      .then((res) => res.json())
      .then((data) => {
        setListings(data)
        setIsLoading(false)
      })
  }, [])

  const columns = [
    { Header: 'Image', accessor: 'imageUrl' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Price', accessor: 'price' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Date', accessor: 'createdAt' },
  ]

  const handleRowClick = (listing) => {
    setSelectedListing(listing)
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={columns} data={listings} onRowClick={handleRowClick} />
      )}
      {selectedListing && (
        <SlideOver listing={selectedListing} onClose={() => setSelectedListing(null)} />
      )}
    </div>
  )
}
