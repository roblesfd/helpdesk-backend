const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

router
  .route("/")
  .get(ticketController.getAllTickets)
  .post(ticketController.createTicket);

router
  .route("/:id")
  .get(ticketController.getTicket)
  .patch(ticketController.updateTicket)
  .delete(ticketController.deleteTicket);

module.exports = router;
