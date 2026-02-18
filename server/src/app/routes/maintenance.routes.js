const router = require("express").Router();
const { body } = require("express-validator");

const authMiddleware = require("../middlewares/auth.middleware");
const maintenanceController = require("../controllers/maintenance.controller");

router.use(authMiddleware);

router.get("/alerts", maintenanceController.getMaintenanceAlerts);

module.exports = router;
