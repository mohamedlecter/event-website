exports.verifyPayment = async (req, res) => {
  try {
    const { reference, gateway } = req.body;

    if (!reference || !gateway) {
      return res.status(400).json({ 
        message: "Missing required parameters: reference and gateway" 
      });
    }

    if (gateway === "stripe") {
      // Stripe verification logic
      const session = await stripe.checkout.sessions.retrieve(reference, {
        expand: ["payment_intent"],
      });
      const paymentReference = session.client_reference_id;

      if (session.payment_status !== "paid") {
        await Payment.findOneAndUpdate(
          { reference: paymentReference },
          { $set: { status: "failed" } }
        );

        await Ticket.updateMany(
          { paymentReference: paymentReference },
          { $set: { status: "failed" } }
        );

        return res.status(400).json({
          message: "Payment failed",
          details: session.payment_intent?.last_payment_error || null,
        });
      }

      // Find the payment record
      const payment = await Payment.findOne({ reference: paymentReference })
        .populate("tickets")
        .populate("event")
        .populate("user", "name email");

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Check if tickets would exceed event capacity
      const ticketType = payment.tickets[0].ticketType;
      const ticketField = ticketType === "vip" ? "vipTicket" : "standardTicket";
      const event = await Event.findById(payment.event);

      if (
        event[ticketField].sold + payment.tickets.length >
        event[ticketField].quantity
      ) {
        // Refund the payment if capacity is exceeded
        try {
          await stripe.refunds.create({
            payment_intent: session.payment_intent.id,
          });
        } catch (refundError) {
          console.error("Refund failed:", refundError);
        }

        // Update statuses to failed
        payment.status = "refunded";
        await payment.save();

        await Ticket.updateMany(
          { paymentReference: paymentReference },
          { $set: { status: "failed" } }
        );

        return res
          .status(400)
          .json({ message: "Event capacity exceeded - payment refunded" });
      }

      // Update payment status
      payment.status = "success";
      payment.stripePaymentIntent = session.payment_intent.id;
      await payment.save();

      // Update all related tickets
      await Ticket.updateMany(
        { paymentReference: paymentReference },
        { $set: { status: "success" } }
      );

      // Update event ticket counts
      await Event.findByIdAndUpdate(payment.event, {
        $inc: { [`${ticketField}.sold`]: payment.tickets.length },
        $set: {
          soldOut:
            event.standardTicket.sold +
              (ticketField === "standardTicket" ? payment.tickets.length : 0) >=
              event.standardTicket.quantity &&
            event.vipTicket.sold +
              (ticketField === "vipTicket" ? payment.tickets.length : 0) >=
              event.vipTicket.quantity,
        },
      });

      // Refresh payment data after updates
      const updatedPayment = await Payment.findById(payment._id)
        .populate("tickets")
        .populate("event")
        .populate("user", "name email");

      return res.json({
        message: "Stripe payment verified successfully",
        payment: updatedPayment,
      });
    } else if (gateway === "wave") {
      // Wave verification logic
      const payment = await Payment.findOne({ reference })
        .populate("tickets")
        .populate("event")
        .populate("user", "name email");

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Verify payment with Wave API directly
      try {
        const waveResponse = await axios.get(
          `${waveConfig.apiUrl}/checkout/sessions/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${waveConfig.apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        const waveData = waveResponse.data;

        // Check payment status according to Wave's API
        if (
          waveData.status !== "completed" &&
          waveData.payment_status !== "paid"
        ) {
          payment.status = "failed";
          await payment.save();
          await Ticket.updateMany(
            { paymentReference: reference },
            { $set: { status: "failed" } }
          );
          return res.status(400).json({
            message: "Wave payment not completed",
            waveStatus: waveData.status,
          });
        }

        // Update payment status
        payment.status = "success";
        payment.wavePaymentId = waveData.id;
        payment.waveTransactionId = waveData.transaction_id;
        await payment.save();

        // Update tickets
        await Ticket.updateMany(
          { paymentReference: reference },
          { $set: { status: "success" } }
        );

        // Update event ticket counts
        const ticketType = payment.tickets[0].ticketType;
        const ticketField =
          ticketType === "vip" ? "vipTicket" : "standardTicket";
        const event = await Event.findById(payment.event);

        await Event.findByIdAndUpdate(payment.event, {
          $inc: { [`${ticketField}.sold`]: payment.tickets.length },
          $set: {
            soldOut:
              event.standardTicket.sold +
                (ticketField === "standardTicket"
                  ? payment.tickets.length
                  : 0) >=
                event.standardTicket.quantity &&
              event.vipTicket.sold +
                (ticketField === "vipTicket" ? payment.tickets.length : 0) >=
                event.vipTicket.quantity,
          },
        });

        const updatedPayment = await Payment.findById(payment._id)
          .populate("tickets")
          .populate("event")
          .populate("user", "name email");

        return res.json({
          message: "Wave payment verified successfully",
          payment: updatedPayment,
        });
      } catch (waveError) {
        console.error(
          "Wave verification error:",
          waveError.response?.data || waveError.message
        );

        payment.status = "failed";
        await payment.save();
        await Ticket.updateMany(
          { paymentReference: reference },
          { $set: { status: "failed" } }
        );

        return res.status(500).json({
          message: "Wave payment verification failed",
          error: waveError.message,
          details: waveError.response?.data || undefined,
        });
      }
    } else {
      return res.status(400).json({ message: "Invalid payment gateway" });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);

    // Error handling and cleanup
    try {
      const reference = req.body.reference;
      if (reference) {
        await Payment.findOneAndUpdate(
          { reference },
          { $set: { status: "failed" } }
        );

        await Ticket.updateMany(
          { paymentReference: reference },
          { $set: { status: "failed" } }
        );
      }
    } catch (dbError) {
      console.error("Failed to update statuses on error:", dbError);
    }

    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
      details: error.response?.data || undefined,
    });
  }
}; 