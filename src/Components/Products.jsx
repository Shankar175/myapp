import React, { useEffect, useState } from 'react'

const Products = () => {
    const showList = () => {
        setContent(<ProductList showForm={showForm} />);
    }

    const showForm = (product) => {
        setContent(<ProductForm product={product} showList={showList} />);
    }

    const [content, setContent] = useState(<ProductList showForm={showForm} />);

    return (
        <div className='container my-5'>
            {content}
        </div>
    )
}

const ProductList = (props) => {
    const [products, setProducts] = useState([]);

    const fetchProducts = () => {
        fetch(`http://localhost:3004/productsDB`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unexpected server error");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.log(`error message: ${error}`);
            });
    }

    useEffect(() => fetchProducts(), []);

    const deleteProduct = (id) => {
        fetch(`http://localhost:3004/productsDB/${id}`, {
            method: 'DELETE'
        })
            .then((response) => response.json())
            .then(() => fetchProducts());
    }

    return (
        <>
            <h2 className='text-center mb-3'>List of Products</h2>
            <button onClick={() => props.showForm({})} className='btn btn-primary me-2'>Create</button>
            <button onClick={() => fetchProducts()} className='btn btn-outline-success me-2'>Refresh</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>CreatedAt</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product, index) => {
                            return (
                                <tr key={index}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price}</td>
                                    <td>{product.description}</td>
                                    <td>{product.createdAt}</td>
                                    <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                                        <button onClick={() => props.showForm(product)} type='button' className='btn btn-primary btn-sm me-2'>Edit</button>
                                        <button onClick={() => deleteProduct(product.id)} type='button' className='btn btn-danger btn-sm'>Delete</button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

const ProductForm = (props) => {

    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const product = Object.fromEntries(formData.entries());

        if (!product.name || !product.brand || !product.category || !product.price) {
            setErrorMessage(
                <div class="alert alert-danger" role="alert">
                    Please fill all the details.
                </div>
            )
            return;
        }

        if (props.product.id) {
            fetch(`http://localhost:3004/productsDB/${props.product.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Data not Stored");
                    }
                    return response.json();
                })
                .then((data) => props.showList())
                .catch((error) => {
                    console.log(`error message: ${error}`);
                });
        } else {
            product.createdAt = new Date().toISOString().slice(0, 10);

            fetch(`http://localhost:3004/productsDB`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Data not Stored");
                    }
                    return response.json();
                })
                .then((data) => props.showList())
                .catch((error) => {
                    console.log(`error message: ${error}`);
                });
        }
    }

    return (
        <>
            <h2 className='text-center mb-3'>{props.product.id ? "Update Product" : "Create New Product"}</h2>
            <div className='row'>
                <div className='col-lg-6 mx-auto'>
                    {errorMessage}
                    <form onSubmit={(event) => handleSubmit(event)}>
                        {props.product.id && <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Product Id</label>
                            <div className='col-sm-8'>
                                <input readOnly className='form-control' name='name' defaultValue={props.product.id} />
                            </div>
                        </div>}
                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Name</label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='name' defaultValue={props.product.name} />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Brand</label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='brand' defaultValue={props.product.brand} />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Category</label>
                            <div className='col-sm-8'>
                                <select className='form-select' name='category' defaultValue={props.product.category}>
                                    <option value="Phones">Phones</option>
                                    <option value="Computers">Computers</option>
                                    <option value="Cameras">Cameras</option>
                                </select>
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Price</label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='price' defaultValue={props.product.price} />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Description</label>
                            <div className='col-sm-8'>
                                <textarea className='form-control' name='description' defaultValue={props.product.description} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='offset-sm-4 col-sm-4 d-grid'>
                                <button type='submit' className='btn btn-primary me-3'>Save</button>
                            </div>
                            <div className='col-sm-4 d-grid'>
                                <button onClick={() => props.showList()} type='button' className='btn btn-danger me-2'>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Products
