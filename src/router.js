const Router = require("express").Router;
const { tokenGenerator, voiceResponse } = require("./handler");
const gassistant = require("./mic-speaker");

const router = new Router();

router.get("/token", (req, res) => {
  res.send(tokenGenerator());
});

router.post("/voice", (req, res) => {
  res.set("Content-Type", "text/xml");
  res.send(voiceResponse(req.body));
  gassistant.assistant.start(gassistant.config.conversation);
});

module.exports = router;
