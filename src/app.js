const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.use(express.json());

const HTTP_OK_STATUS = 200;
// const PORT = '3000';

const talkerPath = path.resolve(__dirname, './talker.json');

const readFile = async () => {
  try {
    const data = await fs.readFile(talkerPath);
    return JSON.parse(data);
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${err.message}`);
  }
};

// não remova esse endpoint, e para o avaliador funcionar - teste
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// app.listen(PORT, () => {
//   console.log('Online');
// });

app.get('/talker', async (req, res) => {
  try {
   const talkers = await readFile();
   res.status(200).json(talkers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = app;