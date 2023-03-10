const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const generateToken = require('../utils/generateToken');
const validatePassword = require('../middlewares/validatePassword');
const validateEmail = require('../middlewares/validateEmail');
const auth = require('../middlewares/auth');
const validateName = require('../middlewares/validateName');
const validateAge = require('../middlewares/validateAge');
const validateTalk = require('../middlewares/validateTalk');
const validateWatchedAt = require('../middlewares/validateWatchedAt');
const validateRate = require('../middlewares/validateRate');

const app = express();
app.use(bodyParser.json());

app.use(express.json());

const HTTP_OK_STATUS = 200;

const talkerPath = path.resolve(__dirname, './talker.json');

const readFile = async () => {
  try {
    const data = await fs.readFile(talkerPath);
    return JSON.parse(data);
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${err.message}`);
  }
};

app.post('/login', validatePassword, validateEmail, (req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const talkers = await readFile();
  if (q) {
    const filteredTalkers = talkers.filter((element) => element.name.includes(q));
    return res.status(200).json(filteredTalkers);
  }
    return res.status(200).json(talkers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

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
    // if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante n??o encontrada' });
    } 
    return res.status(200).json(talker);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

app.post('/talker',
auth,
validateName,
validateAge,
validateTalk,
validateWatchedAt,
validateRate,
async (req, res) => {
  try {
    const talkers = await readFile();
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const newTalker = {
      // acessamos a chave id do ultimo objeto do array de maneira din??mica e incrementamos + 1 em seu valor
      id: talkers[talkers.length - 1].id + 1,
      name,
      age,
      talk: { watchedAt,
      rate },
    };
    const allTalkers = JSON.stringify([...talkers, newTalker]);
    await fs.writeFile(talkerPath, allTalkers);
   res.status(201).json(newTalker);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.put('/talker/:id',
auth,
validateName,
validateAge,
validateTalk,
validateWatchedAt,
validateRate,
 async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talkers = await readFile();
    const index = talkers.findIndex((element) => element.id === Number(id));
    talkers[index] = { id: Number(id), name, age, talk: { watchedAt, rate } };
    const updatedTalkers = JSON.stringify(talkers, null, 2);
    await fs.writeFile(talkerPath, updatedTalkers);
    res.status(200).json(talkers[index]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.delete('/talker/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await readFile();
    const filteredTalkers = talkers.filter((talker) => talker.id !== Number(id));
    const updatedTalkers = JSON.stringify(filteredTalkers, null, 2);
    console.log(updatedTalkers);
    await fs.writeFile(talkerPath, updatedTalkers);
    res.status(204).end();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = app;