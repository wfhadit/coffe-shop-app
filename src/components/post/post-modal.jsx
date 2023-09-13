import {
  Modal,
  Center,
  Input,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalBody,
  ModalHeader,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';

import defaultImage from '../../assets/default-image.jpg';
import { useEffect, useState } from 'react';
import { api } from '../../API/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const ModalInputProduct = ({ isOpen, onClose, fetchProducts, id }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const validationSchema = Yup.object().shape({
    productName: Yup.string().min(3).required('Product Name is required'),
    price: Yup.number()
      .typeError('Price must be a number')
      .required('Price is required'),
    stock: Yup.number()
      .typeError('Stock must be a number')
      .required('Stock is required'),
    desc: Yup.string().required('Description is required'),
  });

  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      productName: '',
      price: 0,
      stock: 0,
      desc: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      try {
        const formData = new FormData();
        formData.append('productImage', selectedImage); // Menambahkan gambar ke FormData
        formData.append('productName', values.productName);
        formData.append('price', values.price);
        formData.append('stock', values.stock);
        formData.append('desc', values.desc);
        const response = await api.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        toast({
          title: 'nice!',
          description: 'product successfully created!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });

        onClose();
        formik.resetForm();
        fetchProducts();
      } catch (err) {
        console.log(err);
      }
    },
  });

  useEffect(() => {
    fetchProducts();
  }, [isOpen]);

  const remove = async () => {
    try {
      await api.delete(`/products/${id}`);
      formik.resetForm();
      fetchProducts();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className='font-sans'>Add New Product</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Center flexDir='column' gap={'15px'}>
              <img
                className='cursor-pointer'
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : defaultImage
                }
                width={'201px'}
                height={'143px'}
                alt='isi dengan gambar'
              ></img>
              <Input
                id='image'
                type='file'
                accept='image/*'
                onChange={(e) => setSelectedImage(e.target.files[0])}
                style={{ display: 'none' }}
              />
              <label htmlFor='image' className='cursor-pointer'>
                Choose Image
              </label>
              <FormControl
                id='productName'
                isInvalid={
                  formik.touched.productName && formik.errors.productName
                }
                maxW='300px'
              >
                <FormLabel>Product Name</FormLabel>
                <Input
                  type='text'
                  {...formik.getFieldProps('productName')}
                  placeholder='Product Name'
                />
                <FormErrorMessage>{formik.errors.productName}</FormErrorMessage>
              </FormControl>
              <FormControl
                id='price'
                isInvalid={formik.touched.price && formik.errors.price}
                maxW='300px'
              >
                <FormLabel>Price</FormLabel>
                <Input
                  type='number'
                  {...formik.getFieldProps('price')}
                  placeholder='Price'
                />
                <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
              </FormControl>
              <FormControl
                id='stock'
                isInvalid={formik.touched.stock && formik.errors.stock}
                maxW='300px'
              >
                <FormLabel>Stock</FormLabel>
                <Input
                  type='number'
                  {...formik.getFieldProps('stock')}
                  placeholder='Stock'
                />
                <FormErrorMessage>{formik.errors.stock}</FormErrorMessage>
              </FormControl>
              <FormControl
                id='desc'
                isInvalid={formik.touched.desc && formik.errors.desc}
                maxW='300px'
              >
                <FormLabel>Description</FormLabel>
                <Input
                  type='text'
                  {...formik.getFieldProps('desc')}
                  placeholder='Description'
                />
                <FormErrorMessage>{formik.errors.desc}</FormErrorMessage>
              </FormControl>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button type='submit' colorScheme='green' mr={3}>
              Submit
            </Button>
            {id ? (
              <Button type='button' colorScheme='red' mr={3} onClick={remove}>
                Delete
              </Button>
            ) : null}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
