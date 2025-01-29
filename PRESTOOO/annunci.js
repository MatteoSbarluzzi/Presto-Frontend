document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("annunci-container");
  const searchBar = document.getElementById("search-bar");
  const priceFilter = document.getElementById("price-filter");
  
  let annunci = [];

  function generateImageUrl(id) {
    return `https://picsum.photos/300/200?random=${id}`;
  }

  fetch("annunci.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nel caricamento del file JSON");
      }
      return response.json();
    })
    .then((data) => {
      annunci = data;
      populateCategories();
      displayAnnunci(data);
    })
    .catch((error) => console.error("Errore:", error));

  function populateCategories() {
    const categories = [...new Set(annunci.map(a => a.category))];
    const categoryFilter = document.createElement("select");
    categoryFilter.id = "category-filter";
    categoryFilter.innerHTML = `<option value="">Tutte le categorie</option>` +
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
    document.querySelector(".filters").appendChild(categoryFilter);
    document.querySelector(".filters").appendChild(applyFiltersButton);
  }

  function displayAnnunci(data) {
    container.innerHTML = "";
    data.forEach((annuncio) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const img = document.createElement("img");
      img.src = generateImageUrl(annuncio.id);
      img.alt = annuncio.name;

      const title = document.createElement("h3");
      title.textContent = annuncio.name;

      const price = document.createElement("p");
      price.textContent = `Prezzo: €${parseFloat(annuncio.price).toFixed(2)}`;

      const category = document.createElement("p");
      category.textContent = `Categoria: ${annuncio.category}`;

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(category);

      container.appendChild(card);
    });
  }

  const sortOptions = document.createElement("select");
  sortOptions.id = "sort-options";
  sortOptions.innerHTML = `
    <option value="">Ordina per</option>
    <option value="name-asc">Nome A-Z</option>
    <option value="name-desc">Nome Z-A</option>
    <option value="price-asc">Prezzo crescente</option>
    <option value="price-desc">Prezzo decrescente</option>
  `;
  document.querySelector(".filters").appendChild(sortOptions);

  sortOptions.addEventListener("change", () => {
    let sortedAnnunci = [...annunci];
    const sortValue = sortOptions.value;

    if (sortValue === "name-asc") {
      sortedAnnunci.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "name-desc") {
      sortedAnnunci.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortValue === "price-asc") {
      sortedAnnunci.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortValue === "price-desc") {
      sortedAnnunci.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    displayAnnunci(sortedAnnunci);
  });

  const applyFiltersButton = document.getElementById("apply-filters");

  applyFiltersButton.addEventListener("click", () => {
    let filteredAnnunci = [...annunci];
    const searchQuery = searchBar.value.toLowerCase();
    const maxPrice = parseFloat(priceFilter.value);
    const selectedCategory = document.getElementById("category-filter").value;

    if (searchQuery) {
      filteredAnnunci = filteredAnnunci.filter(a => a.name.toLowerCase().includes(searchQuery));
    }

    if (!isNaN(maxPrice)) {
      filteredAnnunci = filteredAnnunci.filter(a => parseFloat(a.price) <= maxPrice);
    }

    if (selectedCategory) {
      filteredAnnunci = filteredAnnunci.filter(a => a.category === selectedCategory);
    }

    displayAnnunci(filteredAnnunci);
  });
});
