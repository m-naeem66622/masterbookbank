import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import BookContext from '../provider/BookContext';
import Rolling from "../assets/Rolling.svg";
import CloudArrowUp from "../assets/cloud-arrow-up-fill.svg";
import Loader from "./Loader";
import ImagePreview from "./ImagePreview";
import { useBooksContext } from "../provider/BookProvider";
import { fetchBook, updateBook } from "../features/BookFeatures";

function EditBook() {
    document.title = "Edit Book Details | Master Book Bank";
    // Context
    const { loading, setLoading, notify, rolling, setRolling } =
        useBooksContext();

    // Get book ID from url
    const params = useParams();
    const { id } = params;

    // Related To Image
    const imageRef = useRef(null);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [imageBlobURL, setImageBlobURL] = useState([]);

    // Related To Book
    const [book, setBook] = useState({
        title: "",
        description: "",
        authors: "",
        price: "",
        publisher: "",
        publishDate: "",
        pages: "",
        language: "",
        categories: "",
        tags: "",
        inStock: 0,
    });

    // Submit The Data
    const formSubmitHandle = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            notify("warning", "At least one image is required.");
            return 0;
        }

        const filteredFiles = files.filter((file) => file instanceof Blob);
        book.toDelete = imagesToDelete;

        setRolling(true);
        const response = await updateBook(book, filteredFiles, files);
        setRolling(false);
        if (response.status === 200) {
            navigate(`/admin/book/view/${id}`);
            notify("success", "Book detail successfully updated");
            setTimeout(() => {
                for (const url of imageBlobURL) {
                    URL.revokeObjectURL(url);
                }
                setImageBlobURL([]);
            }, 5000);
        } else if (response.status === 400) {
            setBook({
                ...book,
                tags: book.tags.toString().replace(/[,]/g, " "),
            });
            notify("warning", response.json.errors[0].msg);
        } else {
            setBook({
                ...book,
                tags: book.tags.toString().replace(/[,]/g, " "),
            });
            notify("error", `${response.json.message}! Please try again...`);
        }
    };

    // Related To Book
    const onChangeHandle = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    // Related To Image
    // Update Deleted Image From ImagePreview
    const deleteFile = (index) => {
        if (
            !(files[index] instanceof Blob) &&
            files[index].includes("uploads")
        ) {
            setImagesToDelete((previous) => [...previous, files[index]]);
        }
        setFiles((previous) => previous.filter((_, i) => i !== index));
    };

    // Get Image Blob URL
    const getImagesBlobURL = (urls) => {
        setImageBlobURL([]);

        for (let index = 0; index < urls.length; index++) {
            setImageBlobURL((previous) => [...previous, urls[index]]);
        }
    };

    // Images Validation
    const imagesValidationHandle = (filesToAdd) => {
        let images = [];

        for (let i = 0; i < filesToAdd.length; i++) {
            const element = filesToAdd[i];
            const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (allowedFileTypes.includes(element.type)) {
                images.push(element);
            } else {
                notify("warning", "File type not supported.");
                images = [];
                break;
            }
        }

        if (files.length + images.length <= 3) {
            setFiles((prevoius) => [...prevoius, ...images]);
        } else {
            notify("warning", "You can only add upto 3 images.");
        }
    };

    // Handle Image From Input
    const imageOnChangeHandle = () => {
        imagesValidationHandle(imageRef.current.files);
    };

    const handleOnDragOver = (event) => {
        event.preventDefault();
    };

    // Handle Image From Drop
    const handleOnDrop = (event) => {
        //prevent the browser from opening the image
        event.preventDefault();
        event.stopPropagation();

        imagesValidationHandle(event.dataTransfer.files);
    };

    useEffect(() => {
        let isMounted = true;
        const asyncFunction = async () => {
            setLoading(true);
            const response = await fetchBook(id);
            setLoading(false);

            if (response.status === 200) {
                response.json.tags = response.json.tags.join(" ");
                response.json.publishDate = response.json.publishDate.substring(
                    0,
                    10
                );

                if (isMounted) {
                    setBook(response.json);
                    setFiles(response.json.images);
                }
            } else if (response.status === 404) {
                navigate("/admin/books");
                notify("error", response.json.message);
            } else {
                navigate("/admin/books");
                notify(
                    "error",
                    `${response.json.message}! Please try again...`
                );
            }
        };

        asyncFunction();
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <h1 className="text-light text-center mt-3">Edit Book</h1>
            {loading && <Loader />}
            {!loading && (
                <form
                    onSubmit={formSubmitHandle}
                    className="row mb-5 g-3 text-light"
                >
                    <div className="col-md-7 d-flex justify-content-center">
                        {/* <ShowImageForEdit getImagesToDeleteHandle={getImagesToDeleteHandle} getImagesObject={getImagesObject} dbFiles={filesFromDB} localFiles={filesFromLocal} /> */}
                        <ImagePreview
                            edit={true}
                            getImagesBlobURL={getImagesBlobURL}
                            deleteFile={deleteFile}
                            files={files}
                        />
                    </div>
                    <div className="col-md-5">
                        <div className="wrapper">
                            <div
                                onDragOver={handleOnDragOver}
                                onDrop={handleOnDrop}
                                onClick={() => imageRef.current.click()}
                                className="drop_zone"
                            >
                                <p>
                                    <strong>
                                        Click to select or Drop image here....
                                    </strong>
                                </p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    ref={imageRef}
                                    hidden
                                    onChange={imageOnChangeHandle}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <label htmlFor="title" className="form-label">
                            Ttile
                        </label>
                        <input
                            type="text"
                            value={book.title}
                            className="form-control text-light bg-dark"
                            name="title"
                            id="title"
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className="col-md-5">
                        <label htmlFor="authors" className="form-label">
                            Author(s)
                        </label>
                        <input
                            type="text"
                            value={book.authors}
                            className="form-control text-light bg-dark"
                            name="authors"
                            id="authors"
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="categories" className="form-label">
                            Categories
                        </label>
                        <input
                            type="text"
                            value={book.categories}
                            className="form-control text-light bg-dark"
                            name="categories"
                            id="categories"
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="language" className="form-label">
                            Language
                        </label>
                        <input
                            type="text"
                            value={book.language}
                            className="form-control text-light bg-dark"
                            name="language"
                            id="language"
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="tags" className="form-label">
                            Tags
                        </label>
                        <input
                            type="text"
                            value={book.tags}
                            className="form-control text-light bg-dark"
                            name="tags"
                            id="tags"
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="inStock" className="form-label">
                            In Stock
                        </label>
                        <input
                            type="number"
                            value={book.inStock}
                            className="form-control text-light bg-dark"
                            name="inStock"
                            id="inStock"
                            onChange={onChangeHandle}
                        />
                        <div className="invalid-feedback"></div>
                    </div>
                    <div className="col-md-5">
                        <label htmlFor="publisher" className="form-label">
                            Publisher
                        </label>
                        <input
                            type="text"
                            value={book.publisher}
                            className="form-control text-light bg-dark"
                            name="publisher"
                            id="publisher"
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="publishDate" className="form-label">
                            Publish Date
                        </label>
                        <input
                            type="date"
                            value={
                                book.publishDate
                                    ? book.publishDate.substring(0, 10)
                                    : ""
                            }
                            className="form-control text-light bg-dark"
                            name="publishDate"
                            id="publishDate"
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="pages" className="form-label">
                            Pages
                        </label>
                        <input
                            type="text"
                            value={book.pages}
                            className="form-control text-light bg-dark"
                            name="pages"
                            id="pages"
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="price" className="form-label">
                            Price (PKR)
                        </label>
                        <input
                            type="text"
                            value={book.price}
                            className="form-control text-light bg-dark"
                            name="price"
                            id="price"
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            rows="2"
                            value={book.description}
                            type="text"
                            className="form-control text-light bg-dark"
                            name="description"
                            id="description"
                            onChange={onChangeHandle}
                        />
                    </div>
                    <div className="col-12">
                        <button
                            disabled={rolling}
                            type="submit"
                            className="btn btn-primary d-flex justify-content-between align-items-center"
                            style={{ width: "10rem" }}
                        >
                            <span className="d-inline-flex">
                                <img
                                    src={rolling ? Rolling : CloudArrowUp}
                                    style={{ width: "20px" }}
                                    alt={rolling ? "loading" : "add-book"}
                                />
                            </span>{" "}
                            Update Book
                        </button>
                    </div>
                </form>
            )}
        </>
    );
}

export default EditBook;
