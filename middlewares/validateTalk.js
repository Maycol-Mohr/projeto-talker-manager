// middlewares/validateTalk.js
module.exports = (req, res, next) => {
    const { talk } = req.body;
    
    if (!talk) {
      return res.status(400).json(
        { message: 'O campo "talk" é obrigatório' },
      );
    }

    const { rate } = req.body.talk;

    if (!rate && rate !== 0) {
      return res.status(400).json(
        { message: 'O campo "rate" é obrigatório' },
      );
    }
  
    next();
  };
