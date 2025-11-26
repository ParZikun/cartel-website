import { NextResponse } from 'next/server';

async function handler(request, { params }) {
  const slug = params.slug ? params.slug.join('/') : '';
  const { search } = new URL(request.url);

  const apiUrl = process.env.API_URL;
  const apiKey = process.env.API_KEY;

  if (!apiUrl) {
    console.error('FATAL: API_URL environment variable is not set.');
    return new NextResponse(
      'Internal Server Error: API configuration is missing.',
      { status: 500 }
    );
  }

  const targetUrl = `${apiUrl}/${slug}${search}`;
  
  const headers = {
    'X-API-Key': apiKey,
  };

  // Copy content-type header from original request if it exists
  if (request.headers.has('content-type')) {
    headers['Content-Type'] = request.headers.get('content-type');
  }

  try {
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
      duplex: 'half', // Required for streaming request body in Node.js environments
    });

    // Create a new response from the backend response to avoid streaming issues on Vercel
    const body = await apiResponse.text();
    const response = new NextResponse(body, {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
    });

    // Copy headers from the API response, filtering out problematic ones
    apiResponse.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'content-length') {
            response.headers.set(key, value);
        }
    });

    return response;

  } catch (error) {
    console.error(`Error forwarding request to ${targetUrl}:`, error);
    return new NextResponse('Bad Gateway: Error forwarding request to backend API.', {
      status: 502,
    });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };