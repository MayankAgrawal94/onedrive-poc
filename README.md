# OneDrive App

## What does this program do?

This program connects to OneDrive to:
- List files
- Download files
- List all users who have access to a file
- Provides real-time updates on user access changes

## How to execute it?

1. Clone the repository:
    ```bash
    git clone <repository_url>
    cd onedrive-poc
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables for your Azure AD application credentials:
    - `CLIENT_ID`
    - `TENANT_ID`
    - `CLIENT_SECRET`

4. Start the server:
    ```bash
    npm run start
    ```

5. Open the client:
    Open `http://localhost:3001` in a web browser.

6. 

7. Test the real-time updates:
    - Enter a valid OneDrive file ID and click the "Watch File" button.
    - The permissions will be displayed and updated in real-time as they change.
