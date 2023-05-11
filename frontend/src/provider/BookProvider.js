import React, {
    useContext,
    createContext,
    useState,
    useEffect,
    useReducer,
} from "react";
import { toast } from "react-toastify";
import { authenticateAdmin, authenticateUser } from "../features/AuthFeatures";
import cartReducer from "./cartReducer";
const BookContext = createContext();

const BookProvider = (props) => {
    const [loading, setLoading] = useState(false);
    const [rolling, setRolling] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [accountDetail, setAccountDetail] = useState({});
    const [books, setBooks] = useState([]);
    const [cart, dispatchCart] = useReducer(cartReducer, {});

    // Show Push Notification
    const notify = (type, message) => {
        toast(message, {
            type,
            theme: "dark",
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const authenticate = async () => {
        setRolling(true);
        const response = await authenticateUser();
        setRolling(false);
        if (response.status) {
            setIsUser(true);
            setAccountDetail(response.json);
            return true;
        }

        authenticateAgain();
    };

    const authenticateAgain = async () => {
        setRolling(true);
        const response = await authenticateAdmin();
        setRolling(false);
        if (response.status) {
            setIsAdmin(true);
            setAccountDetail(response.json);
            return true;
        }
    };

    useEffect(() => {
        authenticate();
        const cartItems = localStorage.getItem("cartItems");
        if (cartItems) {
            const parseData = JSON.parse(cartItems);
            if (
                typeof parseData === "object" &&
                Object.keys(parseData).length
            ) {
                dispatchCart({ type: "SET_CART", payload: parseData });
            }
        }

        // eslint-disable-next-line
    }, []);

    return (
        <BookContext.Provider
            value={{
                notify,
                loading,
                setLoading,
                rolling,
                setRolling,
                accountDetail,
                setAccountDetail,
                isAdmin,
                setIsAdmin,
                isUser,
                setIsUser,
                books,
                setBooks,
                cart,
                dispatchCart,
            }}
        >
            {props.children}
        </BookContext.Provider>
    );
};

export const useBooksContext = () => useContext(BookContext);

export default BookProvider;
