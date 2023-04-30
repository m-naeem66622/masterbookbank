import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
// import BookContext from '../provider/BookContext';
import Loader from './Loader';
import { useBooksContext } from '../provider/BookProvider';
import { fetchBooks } from '../features/BookFeatures';

function Books() {
  const navigate = useNavigate();

  // const context = useContext(BookContext);
  const { loading, setLoading, notify } = useBooksContext();

  const [books, setBooks] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const asyncFunction = async () => {
      setLoading(true);
      const response = await fetchBooks();
      setLoading(false);

      if (response.status === 200) {
        if (response.json.length === 0) {
          navigate("/admin/book/add")
          notify("warning", "No books found! Try to add.")
        } else {
          if (isMounted) {
            setBooks(response.json);
          }
        }
      } else {
        notify("error", `${response.json.message}! Please try again...`);
      }
    }

    asyncFunction();

    return () => {
      isMounted = false;
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <h1 className="text-light mt-3 mb-4 text-center">Your Books</h1>
      {loading && <Loader />}
      {!loading && <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th style={{ backgroundColor: "#2c3034" }}>Title</th>
            <th style={{ backgroundColor: "#2c3034" }}>Author(s)</th>
            <th style={{ backgroundColor: "#2c3034" }} className="text-center">Price</th>
            <th style={{ backgroundColor: "#2c3034" }}>Publisher</th>
            <th style={{ backgroundColor: "#2c3034" }} className="text-center">Pages</th>
            <th style={{ backgroundColor: "#2c3034" }}>Language</th>
            <th style={{ width: "1rem", backgroundColor: "#2c3034" }}></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            return (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.authors ? book.authors.toString() : "Not available"}</td>
                <td className="text-center">{book.price}</td>
                <td>{book.publisher}</td>
                <td className="text-center">{book.pages}</td>
                <td>{book.language}</td>
                <td><Link to={`/admin/book/view/${book._id}`}>View</Link></td>
              </tr>
            )
          })}
        </tbody>
      </table>}
    </>
  )
}

export default Books