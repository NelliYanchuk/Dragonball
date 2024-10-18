const requestPlanetURL = 'https://dragonball-api.com/api/planets' // API URL for fetching planet data

// General function to fetch paginated data from URL
async function fetchAll(apiURL, section) {
  let dataArray = []; 
  let currentPage = 1;
  try {
    // Fetch data while there are more pages
    while (true) {
      const response = await fetch(`${apiURL}?page=${currentPage}`); // fetch data from the current page
      const data = await response.json(); // parse the response as JSON
      dataArray = dataArray.concat(data.items); // add items to the data array
      if (!data.links.next) break;
      currentPage++; 
    }

    // Process each item in the fetched data
    dataArray.forEach(item => {
      const fullDescription = item.description || 'No description available.'; // get full description
      const truncatedDescription = fullDescription.length > 300 // Cut description if longer than 300 characters
        ? `${fullDescription.substring(0, 300)}...`
        : fullDescription; // else keep it as it is

      // Build HTML structure for each item
      section.innerHTML += `
        <div class="item-flex">
          <img src="${item.image}" alt="${item.name}" class="item-img">
          <div class="item-info">
            <h2 class="item-name">${item.name}</h2>
            <p class="item-description">${truncatedDescription}</p>
            <span class="read-more" onclick="toggleDescription(event, '${fullDescription}')">[more]</span>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error(`Error fetching data from ${apiURL}:`, error);
  }
}

// Function to toggle the full description visibility
function toggleDescription(event, fullDescription) {
  const target = event.target; // The clicked element
  const itemInfoDiv = target.parentElement; // Parent div of the clicked element
  const descriptionParagraph = itemInfoDiv.querySelector('.full-description'); // Find the full description

  if (descriptionParagraph) { // if full description, then remove it and set "more" button
    descriptionParagraph.remove(); // remove the full description
    target.innerHTML = '[more]'; // change button text to 'more'
  } else { // if not full desc, then create and display it
    const descriptionParagraph = document.createElement('p'); // Create a new paragraph for full description
    descriptionParagraph.className = 'full-description'; // Class for full text
    descriptionParagraph.innerHTML = fullDescription; // Show full text

    // Insert the full description before the toggle button
    itemInfoDiv.insertBefore(descriptionParagraph, target); // Add the paragraph to the DOM
    target.innerHTML = '[less]'; // Update button text to indicate less
  }
}

const planetSection = document.getElementById('planetSection'); // DOM element to get the section to show planets

fetchAll(requestPlanetURL, planetSection); // Call function to fetch and display planets
