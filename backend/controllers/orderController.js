import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    let dbOrderItems = [];
    for (const itemFromClient of orderItems) {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        return res.status(404).json({ message: `Product not found: ${itemFromClient._id}` });
      }

      if (itemFromClient.qty > matchingItemFromDB.countInStock) {
        return res.status(400).json({ message: `Quantity for ${matchingItemFromDB.name} exceeds available stock of ${matchingItemFromDB.countInStock}` });
      }

      dbOrderItems.push({
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      });
    }

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: req.body.isPaid || false,
      paidAt: req.body.paidAt || null,
      paymentResult: req.body.paymentResult || undefined,
    });

    const createdOrder = await order.save();

    // Deduct stock for each item atomically
    for (const item of createdOrder.orderItems) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { countInStock: -item.qty } }
      );
    }

    // Fire off Order Confirmation Email
    try {
      const user = await User.findById(req.user._id);
      if (user && user.email) {
        const message = `Dear ${user.username},\n\nThank you for shopping with us! Your order #${createdOrder._id} has been successfully placed.\n\nTotal: ₹${createdOrder.totalPrice}\n\nYou can view and track your order status directly on your dashboard.\n\nSincerely,\nThe Luxury E-Commerce Team`;
        
        await sendEmail({
          email: user.email,
          subject: `Order Confirmation - #${createdOrder._id}`,
          message,
        });
      }
    } catch (error) {
      console.error("Failed to dispatch order confirmation email: ", error);
    }

    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user", "id username").sort({ createdAt: -1 });
  res.json(orders);
};

const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const totalSalesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalSales = totalSalesData.length > 0 ? totalSalesData[0].totalSales : 0;
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();

      // Handle Razorpay payment results
      if (req.body.details) {
        order.paymentResult = {
          id: req.body.details.paymentId,
          status: "completed",
          update_time: new Date().toISOString(),
          razorpay_order_id: req.body.details.orderId,
          razorpay_signature: req.body.details.signature,
        };
      } else {
        // Fallback for any other payment method
        order.paymentResult = {
          id: req.body.id || "unknown",
          status: req.body.status || "completed",
          update_time: req.body.update_time || new Date().toISOString(),
        };
      }

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.isDelivered || order.isShipped) {
        res.status(400);
        throw new Error("Cannot cancel an order that has already been shipped or delivered");
      }

      if (order.isCancelled) {
        res.status(400);
        throw new Error("Order is already cancelled");
      }

      order.isCancelled = true;
      order.cancelledAt = Date.now();

      const updatedOrder = await order.save();

      // Restore stock for cancelled order atomically
      for (const item of updatedOrder.orderItems) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { countInStock: item.qty } }
        );
      }

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPacked = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPacked = true;
      order.packedAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsShipped = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isShipped = true;
      order.shippedAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsOutForDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isOutForDelivery = true;
      order.outForDeliveryAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsPacked,
  markOrderAsShipped,
  markOrderAsOutForDelivery,
  markOrderAsDelivered,
  cancelOrder,
};
