var router = require('express').Router();

router.get('/', function(req, res) {
    res.json({message: 'Connected to PrintOnDemandAPI, Resource: Materials'})
});

router.get('/info', function(req, res){
    res.json({message: 'This is another route for materials'})
});

router.get('/get/:id', function(req, res) {
    res.json({ message: 'Getting material with ID: ' + req.params.id })
});

module.exports = router;