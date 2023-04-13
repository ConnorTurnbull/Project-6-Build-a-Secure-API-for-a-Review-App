const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');

//Get all items
router.get('/', auth, sauceCtrl.getAllSauces);

//Add new item
router.post('/', auth, sauceCtrl.createSauce);

//Get individual items
router.get('/:id', auth, sauceCtrl.getOneSauce);

//Update item
router.put('/:id', auth, sauceCtrl.modifySauce);

//Delete item
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;