const dev = process.env.NODE_ENV !== 'production';

export const apiUrl = dev ? 'http://localhost:7071/api/get-listings' : process.env.NEXT_PUBLIC_API_URL_PROD;