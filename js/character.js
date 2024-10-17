const requestCharacterURL = 'https://dragonball-api.com/api/characters';

// General function to fetch paginated data from any URL
async function fetchAll(apiURL, section) {
  let dataArray = [];
  let currentPage = 1;

  try {
    while (true) {
      const response = await fetch(`${apiURL}?page=${currentPage}`);
      const data = await response.json();
      
      // Concatenate new data to the array
      dataArray = dataArray.concat(data.items);

      // If there's no 'next' link, exit the loop
      if (!data.links.next) break;
      currentPage++;
    }

    // Append each item to the given section
    dataArray.forEach(item => {
      section.innerHTML += `
        <div class="item-flex">
          <img src="${item.image}" alt="${item.name}" class="item-img">
          <div class="item-info">
            <h2 class="item-name">${item.name}</h2>
            <p class="item-description">${item.description || 'No description available.'}</p>
          </div>
        </div>
      `;
    });
    
    
  } catch (error) {
    console.error(`Error fetching data from ${apiURL}:`, error);
  }
}

// DOM elements for character sections
const characterSection = document.getElementById('characterSection');

// Fetch and display characters
fetchAll(requestCharacterURL, characterSection);

