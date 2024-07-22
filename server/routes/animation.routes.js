const express = require('express');
const router = express.Router();
const animationController = require('../controllers/animationController');

//routes
router.get('/', animationController.getAllAnimations);
router.get('/:id', animationController.getAnimationById);
router.post('/', animationController.storeAnimation);
router.put('/:id', animationController.updateAnimation);
router.delete('/:id', animationController.deleteAnimation);

module.exports = router;