const requestPlanetURL = 'https://dragonball-api.com/api/planets';
const requestCharacterURL = 'https://dragonball-api.com/api/characters';

// General function to fetch paginated data from any URL
async function fetchAll(apiURL, section) {
  let dataArray = [];
  let currentPage = 1;

  try {
    while (true) {
      const response = await fetch(`${apiURL}?page=${currentPage}`);
      const data = await response.json();
      dataArray = dataArray.concat(data.items);
      
      if (!data.links.next) break; // Exit loop if no next page
      currentPage++;
    }

    // Display items in the corresponding section
    dataArray.forEach(item => {
      section.innerHTML += `
        <div class="item">
          <img src="${item.image}" alt="${item.name}">
          <h2>${item.name}</h2>
          <p>${item.description}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error(`Error fetching data from ${apiURL}:`, error);
  }
}

// DOM elements for the planet and character sections
const planetSection = document.getElementById('planetSection');
const characterSection = document.getElementById('characterSection');

// Fetch and display planets and characters
fetchAll(requestPlanetURL, planetSection);
fetchAll(requestCharacterURL, characterSection);
