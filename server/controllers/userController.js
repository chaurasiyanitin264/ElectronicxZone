const UserModel= require("../models/userModel");


const customerSave=async(req, res)=>{
    const {name, address, city, pincode, mobile, proname, price}=req.body;
    console.log(name, address, city, pincode, mobile, proname, price,"lkjhgcxzxcgbhjjkhg lkgjfhgf")
    await UserModel.create({

        name:name,
        address:address, 
        city: city,
        pin:pincode,
        mobile: mobile,
        product:proname,
        price:price
    })
  res.send(name, address, city, pincode, mobile,proname, price);
  
}
const ViewOrders = async (req, res) => {
    try {
        const Orders = await UserModel.find();
        res.send(Orders); // ✅ Fix: Send actual order data
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Error fetching orders");
    }
};

module.exports={
    customerSave,
    ViewOrders
}