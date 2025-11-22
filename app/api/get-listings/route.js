import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const admin = searchParams.get('admin')

  // This is a placeholder. In a real application, you would fetch data from a database.
  const allListings = [
    {
      id: 1,
      name: 'Card 1',
      price: 10.0,
      status: 'Listed',
      createdAt: new Date().toISOString(),
      imageUrl: 'https://via.placeholder.com/150',
      jsonData: { "foo": "bar" }
    },
    {
      id: 2,
      name: 'Card 2',
      price: 20.0,
      status: 'Sold',
      createdAt: new Date().toISOString(),
      imageUrl: 'https://via.placeholder.com/150',
      jsonData: { "foo": "bar" }
    },
    {
      id: 3,
      name: 'Card 3',
      price: 5.0,
      status: 'Skipped',
      createdAt: new Date().toISOString(),
      imageUrl: 'https://via.placeholder.com/150',
      jsonData: { "foo": "bar" }
    },
  ]

  if (admin === 'true') {
    return NextResponse.json(allListings)
  }

  const activeListings = allListings.filter(listing => listing.status === 'Listed');
  return NextResponse.json(activeListings)
}
