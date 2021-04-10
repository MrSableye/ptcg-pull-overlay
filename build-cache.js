const fs = require('fs');
const path = require('path');
const Axios = require('axios');

const apiKey = process.env.API_KEY || '';

const buildCache = async (cacheFileOutputPath) => {
  const cards = {};
  const sets = [];

  let page = 1;
  let result = await Axios.get('https://api.pokemontcg.io/v2/cards', {
    params: {
      page,
      orderBy: "id",
    },
    headers: {
      'X-Api-Key': apiKey,
    },
  });

  while (result.data.data.length > 0) {
    page++;
    result.data.data.forEach((card) => {
      if (!cards[card.set.id]) {
        cards[card.set.id] = {};
      }

      cards[card.set.id][card.id] = card;
    });
    result = await Axios.get('https://api.pokemontcg.io/v2/cards', {
      params: {
        page,
        orderBy: "id",
      },
      headers: {
        'X-Api-Key': apiKey,
      },
    });
  }

  page = 1;
  result = await Axios.get('https://api.pokemontcg.io/v2/sets', {
    params: {
      page,
      orderBy: "-releaseDate",
    },
    headers: {
      'X-Api-Key': apiKey,
    },
  });

  while (result.data.data.length > 0) {
    page++;
    result.data.data.forEach((set) => {
      sets.push(set);
    });
    result = await Axios.get('https://api.pokemontcg.io/v2/sets', {
      params: {
        page,
        orderBy: "-releaseDate",
      },
      headers: {
        'X-Api-Key': apiKey,
      },
    });
  }

  fs.writeFileSync(
    cacheFileOutputPath,
    JSON.stringify({
      cards,
      sets,
    }),
    'utf8',
  );

  return sets;
};

buildCache(path.join(__dirname, 'src/cache.json'));
