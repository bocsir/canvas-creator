const Animation = require('../models/animation');

exports.getAllAnimations = function(req, res) {
    Animation.getAllAnimations((err, animations) => {
        if (err) throw err;
        res.json(animations);
    });
};

exports.getAnimationById = function(req, res) {
    Animation.getAnimationById(req.params.id, (err, animation) => {
        if (err) throw err;
        res.json(animation);
    });
}

exports.storeAnimation = function(req, res) {
    const newAnimation = {
        gridSpacing: req.body.gridSpacing,
        lineWidth: req.body.lineWidth,
        lineLength: req.body.lineLength,
        mouseEffect: req.body.mouseEffect,
        mouseRadius: req.body.mouseRadius,
        colorList: req.body.colorList,
        animate: req.body.animate,
        speed: req.body.speed,
        angleFunc: req.body.angleFunc,
        lineToXFunc: req.body.lineToXFunc, 
        lineToYFunc: req.body.lineToYFunc
    };

    Animation.storeAnimation(newAnimation, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Animation stored successfuly' });
    });
};

exports.updateAnimation = function(req, res) {
    const updatedAnimation = {
        gridSpacing: req.body.gridSpacing,
        lineWidth: req.body.lineWidth,
        lineLength: req.body.lineLength,
        mouseEffect: req.body.mouseEffect,
        mouseRadius: req.body.mouseRadius,
        colorList: req.body.colorList,
        animate: req.body.animate,
        speed: req.body.speed,
        angleFunc: req.body.angleFunc,
        lineToXFunc: req.body.lineToXFunc, 
        lineToYFunc: req.body.lineToYFunc
    }

    Animation.updateAnimation(req.params.id, updatedAnimation, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Animation updated successfully' });
    });
};

exports.deleteAnimation = function(req, res) {
    Animation.deleteAnimation(req.params.id, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Animation deleted successfuly' });
    });
};