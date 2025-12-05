# FA Applications

This is a React-based web application that contains 2 main parts

-   Cockpit website (Desktop + Mobile, just shrink the browser window to see the mobile version)
-   Backoffice desktop app (also in React)

## Getting Started

### Prerequisites

-   Node.js installed on your machine.
-   Google Antigravity AI editor.

Copilot is probably fine, but I recommend using Antigravity + Gemini 3 high planning mode for best results, it can even open the browser and test the stuff for you.
There's no backend database, everything is just in-memory data structures, so no need to set up a database. Everything is just hardcoded code that resets on every page refresh.

### Installation

1.  Open your terminal.
2.  Navigate to the project directory.
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to the URL shown in the terminal.

### Accounts

usernames:

```
werker
manager
supervisor
```

Passwords:
does not matter, just type something.

if the accounts don't work, tell AI to fix it for you.
Pages change depending on the account type, so to get the special worker planning page, log in with the worker account.

## Updating

Make sure to tell AI to update whichever part you want to update, I mean prompts like:
"In Cockpit do this..." or "In Backoffice do that...".

## Keep in mind
