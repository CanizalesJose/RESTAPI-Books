var router = require('express').Router();

router.get('/search', function(req, res) {
  res.json({ message: 'Searching a 3d model' })
});

router.get('/', function(req, res) {
  res.json({ message: 'Connected to PrintOnDemandAPI, Resource: Models' })
});

router.get('/:id', function(req, res) {
  res.json({ message: 'Getting a model by ID:  ' + req.params.id })
});

router.post('/', function(req, res) {
  res.json({ message: 'Adding a new model' })
});

router.put('/:id', function(req, res) {
  res.json({ message: 'Updating model with ID: ' + req.params.id })
});

router.delete('/:id', function(req, res) {
  res.json({ message: 'Deleting model with ID: ' + req.params.id})
});

module.exports = router;