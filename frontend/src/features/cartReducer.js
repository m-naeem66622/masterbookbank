const cartReducer = (prevState = {}, action) => {
    const updatedCart = { ...prevState };
    switch (action.type) {
        case "SET_CART":
            return action.payload;

        case "EMPTY_CART":
            return {};

        case "ADD_TO_CART":
            const { payload, id } = action;
            return { ...updatedCart, [id]: payload };

        case "REMOVE_FROM_CART":
            delete updatedCart[action.id];
            return updatedCart;

        case "INCREMENT_QUANTITY":
            if (
                updatedCart[action.id].quantity <
                updatedCart[action.id].product.inStock
            ) {
                // Increment quantity by 1 only if it is less than inStock value
                updatedCart[action.id].quantity += 1;
            }
            return updatedCart;

        case "DECREMENT_QUANTITY":
            if (updatedCart[action.id].quantity > 1) {
                // Decrement quantity by 1 only if it is greater than 1
                updatedCart[action.id].quantity -= 1;
            }
            return updatedCart;

        default:
            return prevState;
    }
};

export default cartReducer;
