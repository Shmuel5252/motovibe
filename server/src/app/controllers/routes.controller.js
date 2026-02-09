const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Route = require('../models/Route');

function sendValidation(res, errors) {
    return res.status(400).json({
        error: { code: "VALIDATION_ERROR", details: errors.array() }
    });
}

async function createRoute(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendValidation(res, errors);
    }

    const owner = req.user.userId;
    const { title, start, end } = req.body;

    const route = await Route.create({ owner, title, start, end, visibility: 'private' });
    return res.status(201).json({ route });
}

async function listMyRoutes(req, res) {
    const owner = req.user.userId;

    const routes = await Route.find({ owner }).sort({ createdAt: -1 });

    return res.status(200).json({ routes });
}

async function getMyRoute(req, res) {
    const owner = req.user.userId;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Route not found" }
        });
    }

    const route = await Route.findOne({ _id: id, owner });
    if (!route) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Route not found" }
        });
    }

    return res.status(200).json({ route });
}

async function updateMyRoute(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendValidation(res, errors);
    }
    const owner = req.user.userId;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Route not found" }
        });
    }

    const update = {};
    const fields = ['title', 'start', 'end'];
    for (const key of fields) {
        if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const route = await Route.findOneAndUpdate({ _id: id, owner }, update, { new: true });
    if (!route) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Route not found" }
        });
    }

    return res.status(200).json({ route });
}
async function deleteMyRoute(req, res) {
    const owner = req.user.userId;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Route not found" }
        });
    }
    const result = await Route.deleteOne({ _id: id, owner });
    if (result.deletedCount === 0) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Route not found" }
        });
    }

    return res.status(204).send();
}


module.exports = {
    createRoute,
    listMyRoutes,
    getMyRoute,
    updateMyRoute,
    deleteMyRoute
};