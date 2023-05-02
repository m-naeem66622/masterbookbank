import React, { useRef, useState, useEffect } from "react";

function ImagePreview(props) {
    const host = process.env.REACT_APP_SERVER_HOST;

    const { files, getImagesBlobURL, deleteFile, edit } = props;
    const [index, setIndex] = useState(0);
    const [src, setSrc] = useState([]);
    const thumbRef = useRef(null);

    const fileReaderHandle = () => {
        setSrc([]);
        for (let index = 0; index < files.length; index++) {
            const file = files[index];

            if (file instanceof Blob) {
                const fileURL = URL.createObjectURL(file);
                setSrc((previous) => [...previous, fileURL]);
            } else if (file.includes("uploads")) {
                const fileURL = `${host}/${file}`;
                setSrc((previous) => [...previous, fileURL]);
            }
        }
    };

    const handleTab = (index) => {
        setIndex(index);
        const images = thumbRef.current.children;
        for (let i = 0; i < images.length; i++) {
            images[i].classList.remove("active");
        }

        images[index].classList.add("active");
    };

    const delteImageHandle = (index) => {
        setSrc((current) =>
            current.filter((element) => {
                URL.revokeObjectURL(src[index]);
                return element !== src[index];
            })
        );

        deleteFile(index);

        setIndex(0);
    };

    useEffect(() => {
        if (files.length === 0) {
            setSrc([]);
        }

        fileReaderHandle();
        // eslint-disable-next-line
    }, [files]);

    useEffect(() => {
        if (src.length !== 0) {
            thumbRef.current.children[index].classList.add("active");
        }

        const blobURLs = src.filter((url) => url.includes("blob"));
        if (edit) {
            getImagesBlobURL(blobURLs);
        }
        // eslint-disable-next-line
    }, [src]);

    return (
        <div className="big-img">
            <div
                className={`img-cont ${
                    src.length === 0
                        ? "d-flex align-items-center justify-content-center"
                        : ""
                }`}
            >
                {src.length !== 0 ? (
                    <img src={src[index]} alt="book-img" />
                ) : (
                    <h2 className="text-center">No files to show.</h2>
                )}
            </div>
            {src.length !== 0 && (
                <div className="thumb" ref={thumbRef}>
                    {src.map((img, index) => (
                        <span key={index} className="position-relative">
                            <img
                                src={img}
                                alt=""
                                onClick={() => handleTab(index)}
                            />
                            {edit && (
                                <span
                                    className="position-absolute translate-middle badge rounded-pill bg-danger"
                                    style={{
                                        padding: ".35em .55em",
                                        top: "17%",
                                        left: "77%",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => delteImageHandle(index)}
                                >
                                    X
                                    <span className="visually-hidden">
                                        Delete Image
                                    </span>
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImagePreview;
