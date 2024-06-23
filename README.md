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
    git clone https://github.com/MayankAgrawal94/onedrive-poc.git
    cd onedrive-poc
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory of 'onedrive-poc' and add the following environment variables:
    ```
    CLIENT_ID=
    TENANT_ID=
    CLIENT_SECRET=
    SESSION_SECRET=
    ```
    Note: While new App registaion at Azure make sure to added 'Redirect URI' as `http://localhost:3001/v1/auth/ms/cb`
    
4. Start the server:
    ```bash
    npm run start
    ```

5. Open the client:
    Open `http://localhost:3001` in a web browser.

## Project Structure
```
.
├── package.json
├── package-lock.json
├── README.md
└── src
    ├── app
    │   ├── controllers
    │   │   ├── auth
    │   │   │   ├── basic.auth.controller.js
    │   │   │   └── ms.auth.controller.js
    │   │   └── msOneDrive.controller.js
    │   ├── helpers
    │   │   ├── genericFun.js
    │   │   └── onedrive.js
    │   ├── routes
    │   │   ├── auth
    │   │   │   ├── basicAuth.routes.js
    │   │   │   └── msAuth.routes.js
    │   │   └── msOneDrive.routes.js
    │   └── services
    │       ├── auth
    │       │   ├── index.js
    │       │   ├── oauthCallback.js
    │       │   ├── oauthRequest.js
    │       │   └── refreshToken.js
    │       └── onedrive.js
    ├── app.js
    ├── config
    │   ├── env.js
    │   └── session.config.js
    ├── middleware
    │   └── isAuthenticated.js
    ├── public
    │   ├── assests
    │   │   ├── document-icon.png
    │   │   ├── download-icon.png
    │   │   └── folder-icon.png
    │   ├── index.html
    │   ├── scripts
    │   │   └── logic.js
    │   ├── styles
    │   │   ├── tree-container.css
    │   │   └── welcome.css
    │   └── welcome.html
    ├── server.js
    └── socket.js
```

## Test the real-time updates:
- Login with valid a OneDrive account and click the "Watch File" button.
- The permissions will be displayed and updated in real-time as they change.

## Contributing
If you have any suggestions or improvements, feel free to submit a pull request or open an issue.

## Contact
If you have any feedback, questions, or suggestions, feel free to reach out.
connect me at `jobs@mayankagrawal.co.in` or can DM me on [LinkedIn](https://www.linkedin.com/in/mayank-agrawal-59192940/).