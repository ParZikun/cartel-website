import { NextResponse } from 'next/server';

// All requests to /api/* are proxied to the Azure backend
export async function GET(request, { params }) {
  const slug = params.slug ? params.slug.join('/') : '';
  const { search } = new URL(request.url);
  
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.API_KEY;

  if (!apiUrl) {
    console.error('API_URL environment variable is not set.');
    return new NextResponse('Internal Server Error: API configuration is missing.', { status: 500 });
  }

  const targetUrl = `${apiUrl}/${slug}${search}`;

  try {
    const apiResponse = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`API Error (${apiResponse.status}) from ${targetUrl}: ${errorText}`);
      return new NextResponse(errorText, { status: apiResponse.status, statusText: apiResponse.statusText });
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error forwarding request to ${targetUrl}:`, error);
    return new NextResponse('Error forwarding request to backend API.', { status: 502 });
  }
}