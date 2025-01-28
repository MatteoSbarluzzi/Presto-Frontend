function showDetails(name, role, imgUrl) {
  const details = document.querySelector('.details');
  details.querySelector('img').src = imgUrl;
  details.querySelector('h3').textContent = name;
  details.querySelector('p').textContent = role;
  details.querySelector('.description').textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.";
  details.classList.add('active');
}




function generateImageUrl(id) {

  return `https://picsum.photos/300/200?random=${id}`;
}


fetch('annunci.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Errore nel caricamento del file JSON');
    }
    return response.json();
  })
  .then((data) => {
    const container = document.getElementById('annunci-container');
    container.innerHTML = ''; 

  
    data.forEach((annuncio) => {
      const card = document.createElement('div');
      card.classList.add('card');

     
      const img = document.createElement('img');
      img.src = generateImageUrl(annuncio.id);
      img.alt = annuncio.name;


      const title = document.createElement('h3');
      title.textContent = annuncio.name;

      const price = document.createElement('p');
      price.textContent = `Prezzo: €${parseFloat(annuncio.price).toFixed(2)}`;

   
      const category = document.createElement('p');
      category.textContent = `Categoria: ${annuncio.category}`;

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(category);

      container.appendChild(card);
    });
  })
  .catch((error) => {
    console.error('Errore:', error);
  });
