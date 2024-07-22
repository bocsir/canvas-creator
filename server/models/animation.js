const db = require('../database');

exports.getAllAnimations = function(cb) {
    db.query('SELECT * FROM animations', cb);
};

exports.getAnimationById = function(id, cb) {
    db.query('SELECT * FROM animations WHERE id = ?', [id], cb);
};

exports.storeAnimation = function(newAnimation, cb) {
    db.query('INSERT INTO animations SET ?', newAnimation, cb);
};

exports.updateAnimation = function(id, updatedAnimation, cb) {
    db.query('UPDATE animations SET ? WHERE id = ?', [updatedAnimation, id], cb);
};

exports.deleteAnimation = function(id, cb) {
    db.query('DELETE FROM animations WHERE id = ?', [id], cb);
}