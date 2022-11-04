const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const generateToken = require('../utils/generateToken');
const validatePassword = require('../middlewares/validatePassword');
const validateEmail = require('../middlewares/validateEmail');

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

app.post('/login',
validatePassword,
validateEmail,
 (req, res) => {
  // const { email, password } = req.body;
  // // if ([email, password].includes(undefined)) {
  // //   return res.status(401).json({ message: 'Campos ausentes!' });
  // // }

  const token = generateToken();

  return res.status(200).json({ token });
});

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

app.get('/talker/:id', async (req, res) => {
  try {
    const talkers = await readFile();
    const talker = talkers.find(({ id }) => id === Number(req.params.id));
    if (talker === undefined) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(talker);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = app;