import React from 'react'
import { Link } from 'react-router-dom'
import cartIcon from '../assets/cart-plus-solid.svg'
import buyIcon from '../assets/bag-shopping-solid.svg'
import '../styles/style.css'

function BookCard(props) {
    const host = "http://127.0.0.1:5000/"
    const { title, authors, price, images } = props.book;

    return (
        <div className="col col-lg-3 col-md-4 col-sm-12 d-flex">
            <div className="card h-100 pt-3" style={{ width: "250px" }}>
                <div className='d-flex justify-content-center align-items-center'>
                    <div className="position-relative">
                        <img src={host + images[0]} className="card-img-top w-auto rounded-0  border border-white border-4" style={{ maxHeight: "275px", maxWidth: "210px", filter: "drop-shadow(0px 10px 10px rgba(0,0,0,.6))" }} alt="Book Cover" />
                        <span className="position-absolute badge rounded-circle bg-danger d-flex justify-content-center align-items-center flex-column fs-normal" style={{ width: "40px", height: "40px", right: "-10px", top: "-10px" }}><span>70%</span><span>Off</span></span>
                    </div>
                </div>
                <div className="card-body d-flex flex-column justify-content-between pb-1">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-subtitle"><strong>By: </strong>{authors}</p>
                    <p className="card-text"><strong>Price: </strong>{price}</p>
                </div>
                <div className="card-footer">
                    <div className="d-flex justify-content-between">
                        <Link href="#" className="btn btn-primary btn-sm d-inline-flex justify-content-center align-items-center"><img width="20px" src={cartIcon} alt="cart-icon" /><span className='ms-1'>Add to Cart</span></Link>
                        <Link href="#" className="btn btn-primary btn-sm d-inline-flex justify-content-center align-items-center"><img width="16px" src={buyIcon} alt="buy-icon" /><span className='ms-1'>Buy Now</span></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookCard