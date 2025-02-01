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
const newQuoteText = document.getElementById('newQuoteText');
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
  if (text && category !== '') {
    addQuote();
  } else {
    console.log('enter new quote and category');
  };


};

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
  function populateCategories() {
    const categories = [...new Set(quotes.map((quote) => quote.category))]; // Get unique categories
    categorySelect.innerHTML = categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join('');
  }
  populateCategories();
  
  // Show Random Quote
  function showRandomQuote() {
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
};