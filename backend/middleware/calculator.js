const Book = require("../models/bookSchema");

const calculator = async (req, res, next) => {
    try {
        const { items } = req.body;
        const itemIds = items.map((item) => item.product);
        const bookData = await Book.find(
            { _id: { $in: itemIds } },
            { _id: 1, price: 1 }
        );

        let totalPrice = 0;
        items.forEach((item, index) => {
            const itemDetails = bookData.find(
                (data) => data._id.toString() === item.product
            );
            const itemPrice = itemDetails.price;
            const totalItemPrice = itemPrice * item.quantity;
            req.body.items[index].price = totalItemPrice;
            totalPrice += totalItemPrice;
        });

        req.totalPrice = totalPrice;
        
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server error.", error: error.message });
    }
};

module.exports = calculator;
