# Cards Cartel Website

This is the frontend for the Cards Cartel project, a Next.js application designed to display and manage Solana-based card listings.

## Current Status

The website has been updated to integrate with a new backend built on Azure Functions. Previously, it may have used a different data source, but it is now configured to fetch data from an API endpoint that is expected to be provided by an Azure Function.

### What has been done:
-   **API Integration:** The frontend has been configured to make API calls to a proxy endpoint (`/api/...`). This proxy forwards requests to the backend API, which is the Azure Function.
-   **Local Environment Setup:** The application is configured to work with a local instance of the Azure Function. The local environment file (`.env.local`) points the `API_URL` to `http://localhost:7071`, the default address for local Azure Functions.
-   **Listing Endpoint:** The code has been updated to call the `get-listings` endpoint to fetch card listings.

### What is left to do:
-   **Local Testing:** The integration needs to be thoroughly tested to ensure that the frontend correctly communicates with the local Azure Function and that all features, including wallet connection and data display, work as expected.
-   **Deployment:** Both the Next.js frontend and the Azure Function backend need to be deployed to a production environment.
-   **Production Configuration:** The production environment needs to be configured with the correct `API_URL` for the deployed Azure Function.

## Getting Started (Local Development)

To run the website locally for development and testing, follow these steps:

1.  **Prerequisites:**
    *   Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
    *   The local Azure Function backend must be running and accessible at `http://localhost:7071`.

2.  **Install Dependencies:**
    Open a terminal in the `cartel-website` directory and run the following command to install the necessary packages:
    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    After the installation is complete, start the Next.js development server:
    ```bash
    npm run dev
    ```

4.  **Access the Website:**
    Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## How to Test

1.  **Verify Data Loading:** When you open the website, it should automatically fetch and display the card listings from your local Azure Function. Check that the data appears correctly in the listing grid.
2.  **Wallet Connection:** Test the "Connect Wallet" functionality to ensure that you can connect a Solana wallet.
3.  **Holdings View:** If you have a connected wallet, switch to the "Holdings" view to verify that it correctly fetches and displays the tokens in the wallet.
4.  **Filtering and Sorting:** Test the filtering and sorting options in the sidebar to ensure they work as expected with the data from the new backend.
