const express = require('express');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Manually compile template, because rendering the template through express is
// causing a crazy memory leak.
const templatePath = path.resolve('views/embed/stream.ejs');
const templateStr = fs.readFileSync(templatePath, 'utf-8');
const template = ejs.compile(templateStr);

router.use('/:embed', async (req, res, next) => {
  switch (req.params.embed) {
  case 'stream': {
    res.send(template(res.locals));
    return;
  }
  }

  return next();
});

module.exports = router;
