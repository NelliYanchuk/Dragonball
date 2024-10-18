const requestPlanetURL = 'https://dragonball-api.com/api/planets' // API URL for fetching planet data

// General function to fetch paginated data from any URL
async function fetchAll (apiURL, section) {
  let dataArray = []
  let currentPage = 1

  try {
    while (true) {
      const response = await fetch(`${apiURL}?page=${currentPage}`)
      const data = await response.json()
      dataArray = dataArray.concat(data.items)
      if (!data.links.next) break
      currentPage++
    }

    dataArray.forEach(item => {
      const fullDescription = item.description || 'No description available.'
      const truncatedDescription =
        fullDescription.length > 300
          ? fullDescription.substring(0, 300) + '...'
          : fullDescription

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
  `
    })
  } catch (error) {
    console.error(`Error fetching data from ${apiURL}:`, error)
  }
}

function toggleDescription (event, fullDescription) {
  const target = event.target
  const itemInfoDiv = target.parentElement
  const descriptionParagraph = itemInfoDiv.querySelector('.full-description')

  if (descriptionParagraph) {
    descriptionParagraph.remove()
    target.innerHTML = '[more]'
  } else {
    const descriptionParagraph = document.createElement('p')
    descriptionParagraph.className = 'full-description'
    descriptionParagraph.innerHTML = fullDescription

    itemInfoDiv.insertBefore(descriptionParagraph, target)
    target.innerHTML = '[less]'
  }
}

const planetSection = document.getElementById('planetSection'); // DOM element to get the section to show planets

fetchAll(requestPlanetURL, planetSection);
