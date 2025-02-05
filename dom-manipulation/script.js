





/*document.getElementById("quoteDisplay");
newQuoteButton = document.getElementById("newQuote");

// Array to store quote objects
let quotes = [];

// Function to show a notification
function showNotification(message, type = "info") {
  const notificationBar = document.getElementById("notificationBar");
  if (notificationBar) {
    notificationBar.textContent = message;
    notificationBar.className = `notification ${type}`;
    notificationBar.style.display = "block";

    // Hide the notification after 5 seconds
    setTimeout(() => {
      notificationBar.style.display = "none";
    }, 5000);
  }
}

// Function to fetch quotes from JSONPlaceholder
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Map the fetched data to our quote format
    quotes = data.map((post) => ({
      text: post.title,
      category: `User ${post.userId}`, // Use userId as the category
    }));

    // Save the fetched quotes to localStorage
    saveQuotes();

    // Display the fetched quotes
    displayQuotes();
    populateCategoryFilter();

    // Notify the user if conflicts were resolved
    if (conflicts.length > 0) {
      showNotification(
        `${conflicts.length} conflicts resolved. Click here to review.`,
        "warning"
      );
      document
        .getElementById("notificationBar")
        .addEventListener("click", () => {
          showConflictResolutionDialog(conflicts);
        });
    } else {
      showNotification("Quotes synced with server!");
    }
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

// Function to resolve conflicts between local and server data
function resolveConflicts(syncQuotes) {
  // Create a map of server quotes for quick lookup
  const syncQuoteMap = new Map(syncQuotes.map((quote) => [quote.text, quote]));

  // Update local quotes with server data
  const updatedQuotes = quotes.map((localQuote) => {
    const syncQuote = syncQuoteMap.get(localQuote.text);
    return syncQuote ? syncQuote : localQuote; // Prefer server data
  });

  // Add new quotes from the server that don't exist locally
  syncQuotes.forEach((syncQuote) => {
    if (!quotes.some((localQuote) => localQuote.text === serverQuote.text)) {
      updatedQuotes.push(syncQuote);
    }
  });

  // Update the quotes array
  quotes = updatedQuotes;
}

// Function to periodically fetch quotes
function startPeriodicFetching(interval = 5000) {
  fetchQuotesFromServer(); // Fetch immediately
  setInterval(fetchQuotes, interval); // Fetch periodically
}

// Function to post a new quote to JSONPlaceholder
async function postQuote(newQuote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newQuote.text,
        body: newQuote.category,
        userId: 1, // Simulate a user ID
      }),
    });
    const data = await response.json();
    console.log("Quote posted:", data);
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

// Load quotes from localStorage on page load
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
  displayQuotes(); // Display the loaded quotes
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quoteDisplay) {
    quoteDisplay.innerHTML = `
            <p>"${randomQuote.text}"</p>
            <p><em>- ${randomQuote.category}</em></p>
        `;
  }
}

// Store the last displayed quote in sessionStorage
sessionStorage.setItem("lastRandomQuote", JSON.stringify(randomQuote));

// Function to create and display the "Add Quote" form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  if (formContainer) {
    formContainer.innerHTML = `
            <h3>Add a New Quote</h3>
            <form id="addQuoteForm">
                <label for="quoteText">Quote:</label>
                <textarea id="quoteText" placeholder="Enter the quote" required></textarea>
                <label for="quoteCategory">Category:</label>
                <input type="text" id="quoteCategory" placeholder="Enter the category" required>
                <button type="submit">Add Quote</button>
            </form>
        `;

    // Add event listener to the form
    const addQuoteForm = document.getElementById("addQuoteForm");
    if (addQuoteForm) {
      addQuoteForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const quoteText = document.getElementById("quoteText").value;
        const quoteCategory = document.getElementById("quoteCategory").value;

        if (quoteText && quoteCategory) {
          // Add the new quote to the array
          quotes.push({ text: quoteText, category: quoteCategory });

          // Clear the form
          addQuoteForm.reset();

          // Show a success message
          alert("Quote added successfully!");
        } else {
          alert("Please fill out both fields.");
        }
      });
    }
  }
}

// Function to populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    // Get all unique categories from the quotes array
    const categories = [...new Set(quotes.map((quote) => quote.category))];

    // Clear the dropdown and add the default "All" option
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    // Add each category as an option
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
}

// Function to filter quotes by category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    const selectedCategory = categoryFilter.value;
    displayQuotes(selectedCategory); // Display quotes filtered by the selected category
  }
}

// Function to export quotes as a JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to initialize the application
function init() {
  // Create a container for the random quote display
  const quoteDisplay = document.createElement("div");
  quoteDisplay.id = "quoteDisplay";
  document.body.appendChild(quoteDisplay);

  // Create a button to show a random quote
  const randomQuoteBtn = document.createElement("button");
  randomQuoteBtn.textContent = "Show Random Quote";
  randomQuoteBtn.addEventListener("click", showRandomQuote);
  document.body.appendChild(randomQuoteBtn);
  // Create a container for the "Add Quote" form

  // Create a container for the quotes list
  const quotesList = document.createElement("ul");
  quotesList.id = "quotesList";
  document.body.appendChild(quotesList);

  // Create a container for the "Add Quote" form
  const formContainer = document.createElement("div");
  formContainer.id = "formContainer";
  document.body.appendChild(formContainer);

  // Create a button to show the "Add Quote" form
  const addQuoteBtn = document.createElement("button");
  addQuoteBtn.textContent = "Add New Quote";
  addQuoteBtn.addEventListener("click", createAddQuoteForm);
  document.body.appendChild(addQuoteBtn);

  // Create a button to export quotes
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes";
  exportBtn.addEventListener("click", exportQuotes);
  document.body.appendChild(exportBtn);
}
// Initialize the application when the page loads
document.addEventListener("DOMContentLoaded", init);*/



































//declare dom elements
/*const newQuote = document.getElementById('newQuote');
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteArrays = [];
const quotes = {
    text: '',
    category: '',
};
 
function creeatAddQuoteForm() {
    const newQuot = quotes.text;
    const newCat = quotes.category;
    if (newQuot && newCat !== '') {
        quoteArrays = ;

    } else {
        console.log('please print out the quote ');
    }
}*/
// Initial Quotes Data
/*const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuote = document.getElementById('newQuote');

const quoteArrays = [];//empty arrays to manage my quotes
const quotes = [
  {
    text: 'grace and mercy',
    category: 'spiritual',
  },

];//created an arry object but empty
function createAddQuoteForm() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();
  const adds = document.createElement('newQuotesText');
  adds.textContent = newQuoteText;
  if (text && category !== '') {
    addQuote();
  } else {
    console.log('enter new quote and category');
  };
  adds.appendChild(newQuoteText);

};

//creating quotes

function addQuote() {
  const categories = [...new Set(quotes.map((quote) => quote.category))]; // Get unique categories
    categorySelect.innerHTML = categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join('');
  const text = [...new Set(quotes.map((quotes) => quotes.text))];
  
};
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter((quote) => quote.category === selectedCategory);
  
  if (filteredQuotes.length > 0) {
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>- ${randomQuote.category}</em></p>`;
  } else {
    quoteDisplay.innerHTML = `<p>No quotes available for this category.</p>`;
  
  }


  let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "In the middle of difficulty lies opportunity.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  ];
  
  // DOM Elements
  const categorySelect = document.getElementById('category');
  const showQuoteBtn = document.getElementById('showQuoteBtn');
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  
  // Populate Categories in the Dropdown
  /*function populateCategories() {
    const categories = [...new Set(quotes.map((quote) => quote.category))]; // Get unique categories
    categorySelect.innerHTML = categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join('');
  }
  populateCategories();*/
  
  // Show Random Quote
  /*function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    const filteredQuotes = quotes.filter((quote) => quote.category === selectedCategory);
  
    if (filteredQuotes.length > 0) {
      const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
      quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>- ${randomQuote.category}</em></p>`;
    } else {
      quoteDisplay.innerHTML = `<p>No quotes available for this category.</p>`;
    }
  }
  
  // Add New Quote
  function createAddQuoteForm() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
  
    if (text && category) {
      const newQuote = { text, category };
      quotes.push(newQuote); // Add to quotes array
      populateCategories(); // Update categories dropdown
      newQuoteText.value = ''; // Clear input fields
      newQuoteCategory.value = '';
      alert('Quote added successfully!');
    } else {
      alert('Please fill out both the quote and category fields.');
    }
  }
  
  // Event Listeners
  showQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', createAddQuoteForm)
};*/
//server endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

let lastSyncTimestamp = Date.now();  //current timestamp in milliseconds
let isInitialSync = true;

// array of quotes(initial)
let quotes = [
  { text: "Life is what happens while you're busy making other plans.", category: "Life" },
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Failure" },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', category: "Dreams" },
  { text : 'One day you will face many defeats but remember that defeat is a stepping stone to victory.', category: "Victory" },
  { text : 'One day , the son will be greater than his father.', category: "Inheritance" }
];


// generate html structure and  display quote
// setting initial variables 

let quoteDisplay , newQuote ,categoryFilter;


// function to generate html structure and display quote

function init() {

  quoteDisplay = document.getElementById("quoteDisplay");
  newQuote = document.getElementById("newQuote");
  categoryFilter = document.getElementById("categoryFilter");

  // Load quotes from local storage
  loadQuotes();

  newQuote.addEventListener("click", showRandomQuote);

  // Create and append add quote form
  createAddQuoteForm();

   // Create and append import/export buttons
   createImportExportButtons();

   // Populate categories dropdown
   populateCategories();

   // Load and set last selected category
   const lastCategory = localStorage.getItem('lastSelectedCategory') || 'all';
   categoryFilter.value = lastCategory;
   filterQuotes();

   // Store last viewed quote in session storage
   window.addEventListener('beforeunload', () => {
    const currentQuote = quoteDisplay.textContent;
    sessionStorage.setItem('lastViewedQuote', currentQuote);

    // Start periodic sync
    startPeriodicSync();
    
    // Add sync status indicator
    createSyncStatusIndicator();

}
  );
}

// Create sync status indicator
function createSyncStatusIndicator() {
  const statusDiv = document.createElement('div');
  statusDiv.id = 'syncStatus';
  statusDiv.className = 'sync-status';
  document.body.insertBefore(statusDiv, document.body.firstChild);
  syncQuotes('Initialized');
}

// Update sync status indicator
function syncQuotes(message, isError = false) {
  const statusDiv = document.getElementById('syncStatus');
  statusDiv.textContent = message;
  statusDiv.className = `sync-status ${isError ? 'error' : 'success'}`;
  
  // Clear error status after 5 seconds
  if (isError) {
      setTimeout(() => {
          statusDiv.className = 'sync-status';
          statusDiv.textContent = 'Synced';
      }, 5000);
  }
}

// Start periodic sync with server
function startPeriodicSync() {
  // Initial sync
  fetchQuotesFromServer();
  
  // Set up periodic sync every 30 seconds
  setInterval(syncWithServer, 30000);
}

// Sync data with server
// Add this new function to handle sending data to server
async function fetchQuotesFromServer(quote) {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              title: quote.text,
              body: quote.category,
              userId: 1
          })
      });

      if (!response.ok) {
          throw new Error('Failed to send quote to server');
      }

      const data = await response.json();
      syncQuotes('Quote synced to server successfully');
      return data;
  } catch (error) {
    syncQuotes('Failed to sync quote: ' + error.message, true);
      throw error;
  }
}


// Handle initial sync
function handleInitialSync(serverQuotes) {
  // Combine local and server quotes, keeping local ones if there's a conflict
  const mergedQuotes = [...quotes];
  
  serverQuotes.forEach(serverQuote => {
      if (!quotes.some(q => q.id === serverQuote.id)) {
          mergedQuotes.push(serverQuote);
      }
  });
  
  quotes = mergedQuotes;
  saveQuotes();
  syncQuotes('Quotes synced with server!');
}

// Merge quotes from server with local quotes
function mergeQuotes(serverQuotes) {
  let conflicts = [];
  
  serverQuotes.forEach(serverQuote => {
      const localQuote = quotes.find(q => q.id === serverQuote.id);
      
      if (!localQuote) {
          // New quote from server
          quotes.push(serverQuote);
      } else if (serverQuote.timestamp > localQuote.timestamp) {
          // Server has newer version
          conflicts.push({
              local: localQuote,
              server: serverQuote
          });
      }
  });
  
  if (conflicts.length > 0) {
      handleConflicts(conflicts);
  }
  
  saveQuotes();
}

// Handle quote conflicts
function handleConflicts(conflicts) {
  conflicts.forEach(conflict => {
      // Create conflict resolution dialog
      const dialogHTML = `
          <div class="conflict-dialog">
              <h3>Quote Conflict Detected</h3>
              <div class="conflict-versions">
                  <div class="local-version">
                      <h4>Local Version</h4>
                      <p>${conflict.local.text}</p>
                      <p>Category: ${conflict.local.category}</p>
                  </div>
                  <div class="server-version">
                      <h4>Server Version</h4>
                      <p>${conflict.server.text}</p>
                      <p>Category: ${conflict.server.category}</p>
                  </div>
              </div>
              <div class="conflict-actions">
                  <button onclick="resolveConflict(${conflict.local.id}, 'local')">Keep Local</button>
                  <button onclick="resolveConflict(${conflict.server.id}, 'server')">Use Server</button>
              </div>
          </div>
      `;
      
      const dialogDiv = document.createElement('div');
      dialogDiv.innerHTML = dialogHTML;
      document.body.appendChild(dialogDiv);
  });
}

// Resolve quote conflict
function resolveConflict(quoteId, version) {
  const conflicts = document.querySelectorAll('.conflict-dialog');
  const conflict = conflicts[0];
  
  if (version === 'server') {
      const serverQuote = quotes.find(q => q.id === quoteId);
      if (serverQuote) {
          serverQuote.timestamp = Date.now();
          updateSyncStatus('Conflict resolved with server version');
      }
  } else {
      const localQuote = quotes.find(q => q.id === quoteId);
      if (localQuote) {
          localQuote.timestamp = Date.now();
          updateSyncStatus('Conflict resolved with local version');
      }
  }
  
  // Remove conflict dialog
  conflict.remove();
  
  // Save and refresh
  saveQuotes();
  filterQuotes();
}


//function to populate categories dynamically in the dropdown
function populateCategories() {
  const categories = new Set(quotes.map(quote => quote.category));

  // console.log(categories);

  // Create default option to render 
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);

    
  })
  

}

//function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  // console.log(selectedCategory);

  // save selected category in local storage
  localStorage.setItem('lastselectedCategory', selectedCategory);

  // Filter quotes
  const filteredQuotes = selectedCategory === 'all' 
  ? quotes 
  : quotes.filter(quote => quote.category === selectedCategory);

// Display filtered quotes
displayQuotes(filteredQuotes);
}

// Display quotes in the quote display area
function displayQuotes(quotesToShow) {
  quoteDisplay.innerHTML = '';
  
  if (quotesToShow.length === 0) {
      quoteDisplay.textContent = "No quotes available in this category.";
      return;
  }

  quotesToShow.forEach(quote => {
      const quoteDiv = document.createElement('div');
      quoteDiv.className = 'quote-item';
      
      const quoteText = document.createElement('p');
      quoteText.className = 'quote-text';
      quoteText.textContent = quote.text;
      
      const quoteCategory = document.createElement('span');
      quoteCategory.className = 'quote-category';
      quoteCategory.textContent = `Category: ${quote.category}`;
      
      quoteDiv.appendChild(quoteText);
      quoteDiv.appendChild(quoteCategory);
      quoteDisplay.appendChild(quoteDiv);
  });
}

//function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
      quotes = JSON.parse(savedQuotes);
  }
}

// Create and append import/export buttons
function createImportExportButtons() {
  const buttonContainer = document.querySelector('.button-container');
  const exportBtn = document.querySelector('#exportBtn');
  const importInput = document.querySelector('#importFile');

  exportBtn.addEventListener('click', exportToJsonFile);


  // const buttonContainer = document.createElement('div');
  // buttonContainer.className = 'button-container';
  
  // // Create export button
  // const exportBtn = document.createElement('button');
  // exportBtn.textContent = 'Export Quotes';
  // exportBtn.onclick = exportToJson;
  
  // Create import input
  // const importInput = document.createElement('input');
  // importInput.type = 'file';
  // importInput.id = 'importFile';
  // importInput.accept = '.json';
  // importInput.onchange = importFromJsonFile;
  
  // Create import label
  // const importLabel = document.createElement('label');
  // importLabel.textContent = 'Import Quotes';
  // importLabel.className = 'import-label';
  // importLabel.appendChild(importInput);
  
  // buttonContainer.appendChild(importLabel);
}

// Export quotes to JSON file
function exportToJsonFile() {
  const quotesJson = JSON.stringify(quotes, null, 2);
  const blob = new Blob([quotesJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  
  fileReader.onload = function(e) {
      try {
          const importedQuotes = JSON.parse(e.target.result);
          
          // Validate imported data
          if (Array.isArray(importedQuotes) && 
              importedQuotes.every(quote => 
                  typeof quote === 'object' && 
                  'text' in quote && 
                  'category' in quote)) {
              quotes.push(...importedQuotes);
              saveQuotes();
              showRandomQuote();
              alert('Quotes imported successfully!');
          } else {
              throw new Error('Invalid quote format');
          }
      } catch (error) {
          alert('Error importing quotes. Please check the file format.');
      }
  };
  
  fileReader.readAsText(event.target.files[0]);
}

//creating add quote form

function createAddQuoteForm() {
  // Create form container
  const formContainer = document.createElement('div');
  formContainer.className = 'js-quote-form';

  formContainer.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter a new quote">
    <input type="text" id="newQuoteCategory" placeholder="Enter quote category">
    <button onclick="addQuote()">Add Quote</button>
`;
document.body.appendChild(formContainer);
}

// function to show random quote

// Show a random quote from the list based on the selected category
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const eligibleQuotes = selectedCategory === 'all' 
      ? quotes 
      : quotes.filter(quote => quote.category === selectedCategory);

  if (eligibleQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available in this category.";
      return;
  }

  const randomIndex = Math.floor(Math.random() * eligibleQuotes.length);
  const quote = eligibleQuotes[randomIndex];

  quoteDisplay.innerHTML = '';

  const quoteText = document.createElement('p');
  quoteText.className = 'quote-text';
  quoteText.textContent = quote.text;

  const quoteCategory = document.createElement('span');
  quoteCategory.className = 'quote-category';
  quoteCategory.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  // Store current quote in session storage
  sessionStorage.setItem('lastViewedQuote', quote.text);
}

// function to add new quote
// Modified addQuote function to include ID and timestamp

function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  //validation check for empty fields(text and category)
  if (!quoteText || !category) {
    alert('Please enter a quote text and provide its category.');
    return;
  }

  const newQuote = {
    id: Date.now(),  //Uses Timestamp as ID
    text: quoteText,
    category: category,
    timestamp: Date.now()
  };

  quotes.push(newQuote);
  

  //add new quote to the array  
  // quotes.push({ text: quoteText, category: category });

  // Save quotes to local storage
  saveQuotes();

  // Populate categories dropdown
  populateCategories();

  //clear input fields after submission or enter key press
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  //Display Success mesage 
  const successMessage = document.createElement('p');
  successMessage.className = 'success-message';
  successMessage.textContent = 'Quote added successfully!';
  document.body.appendChild(successMessage);

  //remove success message after 3 seconds
  setTimeout(() => {
    document.body.removeChild(successMessage);
  }, 3000);

  // Show success message
  syncQuotes('New quote added - syncing...');
    
  // Trigger immediate sync
  fetchQuotesFromServer();

  //display random quotes
  showRandomQuote();

  
}

document.addEventListener("DOMContentLoaded", init);