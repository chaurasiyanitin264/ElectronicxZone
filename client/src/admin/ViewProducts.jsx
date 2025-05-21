import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
const ViewProducts = () => {
  const [mydata, setMydata] = useState([]);

  const loadData = () => {
    let api = "https://electronicxzone.onrender.com/product/showproduct";
    axios.get(api).then((res) => {
      setMydata(res.data);  // Save data to state
      console.log(res.data);
    }).catch((err) => {
      console.error("Error fetching data:", err);
    });
  };

  useEffect(() => {
    loadData();
  }, []);


 const RemoveProduct = async (id) => {
        let api = `https://electronicxzone.onrender.com/product/removedelete`;
        try {
            const response = await axios.post(api, { id: id });
            alert("Product Deleted Successfully");
        } catch (error) {
            console.error("Error deleting product:", error);
        }
        loadData();
    };

  const ans = mydata.map((key, index) => {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{key.name}</td>
        <td>{key.description}</td>
        <td>{key.product}</td>
        <td>₹{key.price}</td>
        <td>
          <img src={key.image} alt={key.name} width="100" height="100" />
        </td>
        <td>
          <Button variant="danger" onClick={() => { RemoveProduct(key._id) }}>Delete</Button>
        </td>
      </tr>
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2 align="center">Welcome to View Products Page!</h2>
      <Table striped bordered hover responsive style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Name</th>
            <th>Description</th>
            <th>Product</th>
            <th>Price</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {mydata.length > 0 ? ans : (
            <tr>
              <td colSpan="6" align="center">No Products Found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ViewProducts;
