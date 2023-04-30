import React, { useContext, createContext, useState } from "react";
import { toast } from "react-toastify";
const BookContext = createContext();

const BookProvider = (props) => {
    const [loading, setLoading] = useState(false);
    const [rolling, setRolling] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [accountDetail, setAccountDetail] = useState({});
    const [books, setBooks] = useState([]);

    // Show Push Notification
    const notify = (type, message) => {
        toast(message, {
            type,
            theme: "dark",
            position: toast.POSITION.TOP_RIGHT
        })
    };

    return (
        <BookContext.Provider value={{ notify, loading, setLoading, rolling, setRolling, accountDetail, setAccountDetail, isAdmin, setIsAdmin, isUser, setIsUser, books, setBooks }}>
            {props.children}
        </BookContext.Provider>
    )
}

export const useBooksContext = () => useContext(BookContext)

export default BookProvider;