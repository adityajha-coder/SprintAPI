# Complete Guide: Using the Universal Data Pusher

Welcome! We have a built-in script that makes it incredibly easy to add new APIs, Tools, and Extensions to the SprintAPI directory. This guide will walk you through exactly how to use it step by step.

### Step 1: Open the configuration file
Open your code editor and navigate to the file located at `scratch/push.js`. This is the only file you will need to edit.

### Step 2: Choose your target destination
Inside the file, look for the variable named `TARGET` near the top. You need to tell the script what kind of data you are adding. Change it to one of the following exact options depending on what you want to submit:
1. "apis" (if you are adding a new API)
2. "tools" (if you are adding a developer tool)
3. "vsc-ext" (if you are adding a VS Code Extension)
4. "chrome-ext" (if you are adding a Chrome Extension)

### Step 3: Format and add your data
Next, look for the `NEW_ITEMS` array. This is where you will type in your new data. The format you must use depends heavily on what target you chose in Step 2. 

Please copy the correct format block below and fill in your details:

If you are adding an API (TARGET = "apis"):
{ name: "Name of API", desc: "Short description", url: "https://link.com", category: "Category Name", auth: "API Key", cors: true, pricing: "Free" }

If you are adding a Tool (TARGET = "tools"):
{ name: "Name of Tool", desc: "Short description", url: "https://link.com", cat: "Category Name" }

If you are adding a VS Code Extension (TARGET = "vsc-ext"):
{ name: "Extension Name", desc: "Short description", id: "publisher.id", cat: "Category Name" }

If you are adding a Chrome Extension (TARGET = "chrome-ext"):
{ name: "Extension Name", desc: "Short description", id: "chrome-store-id", icon: "https://icon-link.com", cat: "Category Name" }

### Step 4: Run the script
Once you have added your items and saved the file, open your terminal (command line) in the project folder and type this exact command:
`node scratch/push.js`

Press Enter. The script will automatically scan all existing databases to ensure you aren't adding a duplicate item. If the item is new, it will automatically place it into the correct JSON database file.

***

### A Note to Contributors
Please be kind and thoughtful when raising a Pull Request (PR) to add new tools using this script. We manually review all submissions to maintain the high quality of SprintAPI. 

Do not submit fake, duplicate, or spam Pull Requests simply to inflate your open-source contribution graphs. Ensure that any resource you add is genuinely helpful to developers, correctly categorized, and that the links are functional. Quality always matters more than quantity. Thank you for contributing!
