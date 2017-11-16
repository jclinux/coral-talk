const express = require('express');
const router = express.Router();
const SettingsService = require('../../services/settings');

const viewPath = process.env.EMBED_VIEW_OVERRIDE_DIR ?
  `../${process.env.EMBED_VIEW_OVERRIDE_DIR}/stream`:
  'embed/stream';

router.use('/:embed', async (req, res, next) => {
  switch (req.params.embed) {
  case 'stream': {
    const {customCssUrl} = await SettingsService.retrieve('customCssUrl');
    return res.render(viewPath, {customCssUrl});
  }
  }

  return next();
});

module.exports = router;
