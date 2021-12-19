require('dotenv/config');

const axios = require('axios').default;

const config = {
  miniflux: {
    baseUrl: process.env.MINIFLUX_BASE_URL,
    token: process.env.MINIFLUX_TOKEN,
  },
  reader: {
    baseUrl: 'https://readwise.io/reader/api',
    token: process.env.READER_TOKEN,
  },
};

const miniflux = axios.create({
  baseURL: config.miniflux.baseUrl,
  headers: {
    'x-Auth-Token': config.miniflux.token,
  },
});

const reader = axios.create({
  baseURL: config.reader.baseUrl,
  headers: {
    Authorization: `token ${config.reader.token}`,
  },
});

const articles = {
  save: async (url) => reader.post('/add', { url }),
  toggleStar: async (entryId) => miniflux.put(`/entries/${entryId}/bookmark`),
  getStarred: async () => miniflux.get('/entries', {
    params: { starred: true },
  }),
};

const run = async () => {
  console.log('Checking for starred articles...');

  const { data } = await articles.getStarred();
  const { entries: starred } = data;

  console.log(`Found ${starred.length} starred articles to process...`);

  await Promise.all(starred.map(async (article) => {
    try {
      const { id: entryId, url } = article;
      await articles.save(url);
      await articles.toggleStar(entryId);
    } catch (error) {
      console.error(error);
      console.error('Failed to process article, continuing...');
    }
  }));

  console.log('Done!');
};

exports.run = async (req, res) => {
  await run();
  res.sendStatus(200);
};
