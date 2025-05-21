import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

const ViewOrders = () => {
  const [mydata, setMydata] = useState([]);

  const loadData = () => {
    let api = "https://electronicxzone.onrender.com/users/ViewOrders";
    axios.get(api).then((res) => {
      setMydata(res.data);
      console.log(res.data);
    }).catch((err) => {
      console.error("Error fetching data:", err);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const rows = mydata.map((order, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{order.name}</td>
      <td>{order.address}</td>
      <td>{order.city}</td>
      <td>{order.pin}</td>
      <td>{order.mobile}</td>
      <td>{order.product?.join(', ')}</td>
      <td>₹{order.price}</td>
    </tr>
  ));

  return (
    <div style={{ padding: "20px" }}>
      <h2 align="center">Customer Orders</h2>
      <Table striped bordered hover responsive style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Pin Code</th>
            <th>Mobile</th>
            <th>Products</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {mydata.length > 0 ? rows : (
            <tr>
              <td colSpan="8" align="center">No Orders Found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ViewOrders;
