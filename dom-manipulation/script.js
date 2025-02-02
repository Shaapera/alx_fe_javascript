document.getElementById("quoteDisplay");
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
document.addEventListener("DOMContentLoaded", init);



































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