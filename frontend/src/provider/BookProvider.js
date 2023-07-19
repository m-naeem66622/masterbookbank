import React, {
    useContext,
    createContext,
    useState,
    useEffect,
    useReducer,
} from "react";
import { toast } from "react-toastify";
import cartReducer from "../features/cartReducer";
import { auth } from "../firebase";
// import { authenticateUser } from "../features/AuthFeatures";

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

    // const authenticate = async () => {
    //     console.log("I am going from authenticate");
    //     const { status, json } = await authenticateUser(
    //         await auth.currentUser.getIdToken()
    //     );
    //     console.log("I am done from authenticate");
    //     if (status === 200) {
    //         localStorage.setItem("accountDetail", JSON.stringify(json.data));
    //         setAccountDetail(json.data);
    //     }
    // };

    useEffect(() => {
        let interval;
        function startInterval() {
            interval = setInterval(async () => {
                await auth.currentUser.getIdToken(true);
            }, 3600000);
        }
        const unsubscribeOnAuthStateChanged = auth.onAuthStateChanged(
            async (user) => {
                if (user) {
                    const detail = localStorage.getItem("accountDetail");
                    if (detail) {
                        setAccountDetail(JSON.parse(detail));
                    } // else {
                    //     authenticate();
                    // }
                    try {
                        await auth.currentUser.getIdToken(true);
                    } catch (error) {
                        console.log(error);
                    }
                    startInterval();
                    setIsUser(true);
                } else {
                    setIsUser(false);
                }
            }
        );

        const unsubscribeOnIdTokenChanged = auth.onIdTokenChanged(
            async (user) => {
                const localIdToken = localStorage.getItem("idToken");
                if (user && user.stsTokenManager.accessToken !== localIdToken) {
                    console.log("User Token Refreshed");
                    localStorage.setItem(
                        "idToken",
                        user.stsTokenManager.accessToken
                    );
                }
            }
        );

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

        return () => {
            unsubscribeOnAuthStateChanged();
            unsubscribeOnIdTokenChanged();
            clearInterval(interval);
        };
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
