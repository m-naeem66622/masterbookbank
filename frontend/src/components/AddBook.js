import React, { useState, useRef } from "react";
import ImagePreview from "./ImagePreview";
import { useBooksContext } from "../provider/BookProvider";
import { addBook } from "../features/BookFeatures";

function AddBook() {
    document.title = "Add Book | Master Book Bank";
    // Context
    const { notify, rolling, setRolling } = useBooksContext();

    // Related To Image
    const imageRef = useRef(null);
    const [files, setFiles] = useState([]);
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

        setRolling(true);
        const response = await addBook(book, files);
        setRolling(false);

        if (response.status === 201) {
            // Reset Form
            setBook({
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
            imageRef.current.value = "";
            setFiles([]);

            notify("success", response.json.message);
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

    return (
        <>
            <form onSubmit={formSubmitHandle} className="row g-3">
                <div className="col-md-7 d-flex justify-content-center">
                    <div className="product-images-container position-relative w-100 center">
                        {/* <div className="product-label rounded-circle position-absolute center text-bg-sea-green">
                            <span>-29%</span>
                        </div> */}
                        <div className="product-image-wrap">
                            <ImagePreview
                                edit={true}
                                getImagesBlobURL={getImagesBlobURL}
                                deleteFile={deleteFile}
                                files={files}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="wrapper h-100" style={{ padding: "20px" }}>
                        <div
                            onDragOver={handleOnDragOver}
                            onDrop={handleOnDrop}
                            onClick={() => imageRef.current.click()}
                            className="drop_zone px-2 d-flex w-100 h-100"
                        >
                            <p className="m-auto text-center">
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
                    <label htmlFor="title" className="form-label fw-medium">
                        Title
                    </label>
                    <input
                        type="text"
                        value={book.title}
                        className="form-control"
                        name="title"
                        id="title"
                        onChange={onChangeHandle}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className="col-md-5">
                    <label htmlFor="authors" className="form-label fw-medium">
                        Author(s)
                    </label>
                    <input
                        type="text"
                        value={book.authors}
                        className="form-control"
                        name="authors"
                        id="authors"
                        onChange={onChangeHandle}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className="col-md-3">
                    <label
                        htmlFor="categories"
                        className="form-label fw-medium"
                    >
                        Categories
                    </label>
                    <input
                        type="text"
                        value={book.categories}
                        className="form-control"
                        name="categories"
                        id="categories"
                        onChange={onChangeHandle}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className="col-md-3">
                    <label htmlFor="language" className="form-label fw-medium">
                        Language
                    </label>
                    <input
                        type="text"
                        value={book.language}
                        className="form-control"
                        name="language"
                        id="language"
                        onChange={onChangeHandle}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="tags" className="form-label fw-medium">
                        Tags
                    </label>
                    <input
                        type="text"
                        value={book.tags}
                        className="form-control"
                        name="tags"
                        id="tags"
                        onChange={onChangeHandle}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className="col-md-2">
                    <label htmlFor="inStock" className="form-label fw-medium">
                        In Stock
                    </label>
                    <input
                        type="number"
                        value={book.inStock}
                        className="form-control"
                        name="inStock"
                        id="inStock"
                        onChange={onChangeHandle}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className="col-md-5">
                    <label htmlFor="publisher" className="form-label fw-medium">
                        Publisher
                    </label>
                    <input
                        type="text"
                        value={book.publisher}
                        className="form-control"
                        name="publisher"
                        id="publisher"
                        onChange={onChangeHandle}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className="col-md-3">
                    <label
                        htmlFor="publishDate"
                        className="form-label fw-medium"
                    >
                        Publish Date
                    </label>
                    <input
                        type="date"
                        value={book.publishDate}
                        className="form-control"
                        name="publishDate"
                        id="publishDate"
                        onChange={onChangeHandle}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className="col-md-2">
                    <label htmlFor="pages" className="form-label fw-medium">
                        Pages
                    </label>
                    <input
                        type="number"
                        value={book.pages}
                        className="form-control"
                        name="pages"
                        id="pages"
                        onChange={onChangeHandle}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className="col-md-2">
                    <label htmlFor="price" className="form-label fw-medium">
                        Price (PKR)
                    </label>
                    <input
                        type="number"
                        value={book.price}
                        className="form-control"
                        name="price"
                        id="price"
                        onChange={onChangeHandle}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className="col-12">
                    <label
                        htmlFor="description"
                        className="form-label fw-medium"
                    >
                        Description
                    </label>
                    <textarea
                        rows="2"
                        value={book.description}
                        type="text"
                        className="form-control"
                        name="description"
                        id="description"
                        onChange={onChangeHandle}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className="col-12">
                    <button
                        disabled={rolling}
                        type="submit"
                        className="btn btn-fill-sea-green d-flex justify-content-between align-items-center"
                        // style={{ width: "8rem" }}
                    >
                        <span className="d-inline-flex me-2">
                            <i className="fa-solid fa-cloud-arrow-up fs-5"></i>
                        </span>
                        Add Book
                    </button>
                </div>
            </form>
        </>
    );
}

export default AddBook;
