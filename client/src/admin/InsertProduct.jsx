import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { message, Upload } from 'antd';
import { CloudUploadOutlined, SaveOutlined } from '@ant-design/icons';
import "../admin/InsertProduct"
const InsertProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    product: '',
    price: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      message.error('Please upload a valid image file (JPEG, PNG, WEBP, or GIF)');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      message.error('Image size should be less than 2MB');
      return;
    }
    
    setImage(file);
    setErrors(prev => ({ ...prev, image: null }));
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!product.name.trim()) newErrors.name = 'Product name is required';
    if (!product.description.trim()) newErrors.description = 'Description is required';
    if (!product.product) newErrors.product = 'Please select a product category';
    
    if (!product.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(product.price))) {
      newErrors.price = 'Price must be a number';
    } else if (Number(product.price) <= 0) {
      newErrors.price = 'Price must be greater than zero';
    }
    
    if (!image) newErrors.image = 'Please upload an image';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Prepare form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'First_Preset');
      formData.append('cloud_name', 'dzbnmvkoz');
      
      // Upload image to Cloudinary
      const imageResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dzbnmvkoz/image/upload', 
        formData
      );
      
      // Prepare product data with image URL
      const productData = { 
        ...product, 
        image: imageResponse.data.url 
      };
      
      // Save product to backend
      await axios.post('http://localhost:8000/product/productsave', productData);
      
      // Show success message
      message.success('Product added successfully!');
      
      // Reset form
      setProduct({
        name: '',
        description: '',
        product: '',
        price: ''
      });
      setImage(null);
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Add New Product</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        isInvalid={!!errors.name}
                        placeholder="Enter product name"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        isInvalid={!!errors.description}
                        placeholder="Enter product description"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Product Category</Form.Label>
                      <Form.Select
                        name="product"
                        value={product.product}
                        onChange={handleInputChange}
                        isInvalid={!!errors.product}
                      >
                        <option value="">Select a category</option>
                        <option value="laptop">Laptop</option>
                        <option value="mobile">Mobile</option>
                        <option value="computer">Computer</option>
                        <option value="all">All</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.product}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="text"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        isInvalid={!!errors.price}
                        placeholder="Enter price"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Product Image</Form.Label>
                      <div className="image-upload-container">
                        {imagePreview ? (
                          <div className="image-preview-wrapper">
                            <img 
                              src={imagePreview} 
                              alt="Product preview" 
                              className="img-preview"
                            />
                            <Button 
                              variant="danger" 
                              size="sm" 
                              className="remove-image-btn"
                              onClick={() => {
                                setImage(null);
                                setImagePreview(null);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <CloudUploadOutlined className="upload-icon" />
                            <p>Click or drag file to upload</p>
                            <small>JPG, PNG, WEBP or GIF (Max 2MB)</small>
                          </div>
                        )}
                        <Form.Control
                          type="file"
                          name="file"
                          onChange={handleImageChange}
                          isInvalid={!!errors.image}
                          className="image-input"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.image}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-end mt-3">
                  <Button 
                    variant="secondary" 
                    className="me-2"
                    onClick={() => {
                      setProduct({
                        name: '',
                        description: '',
                        product: '',
                        price: ''
                      });
                      setImage(null);
                      setImagePreview(null);
                      setErrors({});
                    }}
                  >
                    Reset
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Saving...</span>
                      </>
                    ) : (
                      <>
                        <SaveOutlined className="me-1" /> Save Product
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InsertProduct;