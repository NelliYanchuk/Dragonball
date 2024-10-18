const requestPlanetURL = 'https://dragonball-api.com/api/planets'

// General function to fetch paginated data from URL
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

    // If there's more than 300 chars, cut, set ... and a button "more"
    dataArray.forEach(item => {
      const fullDescription = item.description || 'No description available.';
      const truncatedDescription =
        fullDescription.length > 300
          ? fullDescription.substring(0, 300) + '...'
          : fullDescription;

      section.innerHTML += `
        <div class="item-flex">
          <img src="${item.image}" alt="${item.name}" class="item-img">
          <div class="item-info">
            <h2 class="item-name">${item.name}</h2>
            <p class="item-description">${truncatedDescription}</p>
            ${
              fullDescription.length > 300
                ? `<span class="read-more" onclick="toggleDescription(event, '${fullDescription}')">[more]</span>`
                : ''
            }
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error(`Error fetching data from ${apiURL}:`, error);
  }
}

function toggleDescription(event, fullDescription) {
  const target = event.target;
  const itemInfoDiv = target.parentElement;

  // Check if description exists
  const descriptionParagraph = itemInfoDiv.querySelector('.full-description');

  if (descriptionParagraph) {
    // If text is already full - hide it
    descriptionParagraph.remove();
    target.innerHTML = '[more]';
  } else {
    // If text not full - show
    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.className = 'full-description'; // class for full text
    descriptionParagraph.innerHTML = fullDescription; // show full text

    itemInfoDiv.insertBefore(descriptionParagraph, target); 
    target.innerHTML = '[less]';
  }
}

// DOM elements for planet sections
const planetSection = document.getElementById('planetSection');

// Fetch and display planets
fetchAll(requestPlanetURL, planetSection);
