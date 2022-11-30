import { useEffect, useState } from "react";
import io from 'socket.io-client';
const socket = io.connect("http://localhost:7000");

function App() {
  const [product, setProduct] = useState([]);
  const [Order, setOrder] = useState([]);

  const [singleProduct, setSingleProduct] = useState(null);
  const [conditions, setConditions] = useState({});
  const [porductInof, setPorductInof] = useState({});



  useEffect(() => {
    fetch("http://localhost:7000/get_products")
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setProduct(data.data)
        }
      })
  }, [])
  useEffect(() => {
    fetch("http://localhost:7000/all_orders")
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setOrder(data.data)
        }
      })
  }, [])

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data)
    })
  }, [])

  useEffect(() => {
    let userID = 324938294
    socket.emit("addUser", userID)
  }, [])


  const hangleInput = (e) => {
    const name = e.target.name
    const value = e.target.value

    const currntinfo = { ...porductInof }

    currntinfo[name] = value
    setPorductInof(currntinfo)

  }
  // const handleAddtProduct = (e) => {
  //   e.preventDefault()
  //   if (!porductInof.name && !porductInof.price && !porductInof.OldPrice) {
  //     return true
  //   }
  //   fetch("http://localhost:7000/add_product", {
  //     method: "POST",
  //     body: JSON.stringify(porductInof),
  //     headers: {
  //       'content-type': 'application/json; charset=UTF-8'
  //     }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.data) {
  //         setProduct(data.data)
  //       }
  //     })

  // }

  const handleAddtProduct = (e) => {
    e.preventDefault()
    if (!porductInof.name && !porductInof.price && !porductInof.OldPrice) {
      return true
    }
    socket.emit("add_product", porductInof)

  }

  const handleSingleProduct = async (id) => {
    try {
      const data = await fetch(`http://localhost:7000/single_product/${id}`)
      const jsonData = await data.json();
      if (jsonData.data) {
        setSingleProduct(jsonData.data)

        const currentState = { ...conditions }
        currentState["state"] = "update"
        setConditions(currentState)
      }
    } catch (error) {
    }
  }
  const handleDeleteProduct = (id) => {
    fetch(`http://localhost:7000/delete_product/${id}`, {
      method: "Delete",
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.data) {
          setProduct(data.data)
        }
      })
  }
  // const handleDeleteProduct = async (id) => {
  //   try {
  //     socket.emit("delete_product", id)

  //   } catch (error) {
  //   }
  // }
  // const handleDeleteOrder = (id) => {
  //   fetch(`http://localhost:7000/delete_order/${id}`, {
  //     method: "Delete",
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data)
  //       if (data.data) {
  //         setProduct(data.data)
  //       }
  //     })
  // }
  const handleDeleteOrder = (id) => {
    socket.emit("delete_order", id)

  }
  // const handleUpdatProduct = (e) => {
  //   e.preventDefault()

  //   fetch(`http://localhost:7000/update_product`, {
  //     method: "POST",
  //     body: JSON.stringify(singleProduct),
  //     headers: {
  //       'content-type': 'application/json; charset=UTF-8'
  //     }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.data) {
  //         setProduct(data.data)
  //       }
  //     })
  // }

  // const handleAddOrder = (id) => {
  //   const info = {
  //     buyerID: "923849",
  //     productID: id,
  //     quantity: 1,
  //     orderStatus: "ordered"
  //   }
  //   fetch("http://localhost:7000/add_order", {
  //     method: "POST",
  //     body: JSON.stringify(info),
  //     headers: {
  //       'content-type': 'application/json; charset=UTF-8'
  //     }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data)
  //       if (data.data) {
  //         setProduct(data.data)
  //       }
  //     })
  // }

  const handleAddOrder = (id) => {
    const info = {
      buyerID: "923849",
      productID: id,
      quantity: 1,
      orderStatus: "ordered"
    }
    socket.emit("add_order", info)

    
  }
  const handleUpdatProduct = (e) => {
    e.preventDefault()

    socket.emit("update_product", singleProduct)

  }
  // const hangleUpdateOrder = (info) => {
  //   fetch(`http://localhost:7000/update_order`, {
  //         method: "POST",
  //         body: JSON.stringify(info),
  //         headers: {
  //           'content-type': 'application/json; charset=UTF-8'
  //         }
  //       })
  //         .then(res => res.json())
  //         .then(data => {
  //           if (data.data) {
  //             setProduct(data.data)
  //           }
  //         })
  // }

  const hangleUpdateOrder = (info) => {
    socket.emit("update_order", info)
    
  }


  return (
    <div >
      <p>Product Count : {product.length ? product.length : 0}</p>
      <div>
        <button
          onClick={() => {
            const currentState = { ...conditions }
            currentState["state"] = "orders"
            setConditions(currentState)
          }}
        >Orders</button>

        <button
          onClick={() => {
            const currentState = { ...conditions }
            currentState["state"] = "add"
            setConditions(currentState)
          }}
        >Add Product</button>

      </div>

      {
        !conditions.state && <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Old Price</th>
                <th>Delete</th>
                <th>Add Order</th>
              </tr>
            </thead>
            <tbody>
              {
                product?.length > 0 && product.map((data) => {
                  return <tr key={data._id}>
                    <td>{data.name}</td>
                    <td>{data.price}</td>
                    <td>{data.OldPrice}</td>
                    <td onClick={() => handleSingleProduct(data._id)}>Edit</td>
                    <td onClick={() => handleDeleteProduct(data._id)}>Delete</td>
                    <td onClick={() => handleAddOrder(data._id)}>Add</td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      }

      {
        conditions.state === "orders" && <div>
          <table>
            <thead>
              <tr>
                <th>buyerID</th>
                <th>productID</th>
                <th>quantity</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {
                Order?.length > 0 && Order.map((data) => {
                  return <tr key={data._id}>
                    <td>{data.buyerID}</td>
                    <td>{data.productID}</td>
                    <td>{data.quantity}</td>
                    <td onClick={() => hangleUpdateOrder(data)}>Edit</td>
                    <td onClick={() => handleDeleteOrder(data._id)}>Delete</td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      }

      {
        conditions?.state === "add" && <div>
          <form onSubmit={handleAddtProduct}>
            <label>Name</label>
            <input type="text" name="name" onChange={hangleInput} value={porductInof.name ? porductInof.name : ""} />
            <br />
            <label>Price</label>
            <input type="number" name="price" onChange={hangleInput} value={porductInof.price ? porductInof.price : ""} />
            <br />
            <label>Old Price</label>
            <input type="number" name="OldPrice" onChange={hangleInput} value={porductInof.OldPrice ? porductInof.OldPrice : ""} />
            <br />
            <input type="submit" value="Submit" />

          </form>
        </div>
      }

      {
        conditions?.state === "update" && <div>
          <form onSubmit={handleUpdatProduct}>
            <label>Name</label>
            <input type="text" value={singleProduct ? singleProduct.name : ""} />
            <br />
            <label>Price</label>
            <input type="number" value={singleProduct ? singleProduct.price : ""} />
            <br />
            <label>Old Price</label>
            <input type="number" value={singleProduct ? singleProduct.OldPrice : ""} />
            <br />
            <input type="submit" value="Update" />

          </form>
        </div>
      }

    </div>
  );
}

export default App;
