import React, { useEffect, useState } from "react";
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
  Select,
} from "@chakra-ui/react";
import defaultImage from "../../assets/default-image.jpg";
import { api } from "../../API/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

export const ModalInputProduct = ({
  product = { productName: "", categoryId: "", price: 0, stock: 0, desc: "" },
  isOpen,
  fetchProducts,
  onClose,
  edit,
  handleSortChange,
}) => {
  const userSelector = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");

      setCategories([...res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoryOption = [
    { value: 1, label: "Coffee" },
    { value: 2, label: "Non-Coffee" },
    { value: 3, label: "Pizza" },
  ];

  const validationSchema = Yup.object().shape({
    productName: Yup.string()
      .min(3)
      .test("unique-product", "Product already exists", async function (value) {
        if (!edit) {
          const response = await api.get("/products");
          const existingProducts = response.data.data;
          const isDuplicate = existingProducts.some(
            (product) => product.productName === value
          );
          return !isDuplicate;
        }
        return true;
      })
      .required("Product name is required"),
    price: Yup.number()
      .min(4)
      .typeError("Price must be a number")
      .required("Price is required"),
    stock: Yup.number()
      .min(2)
      .typeError("Stock must be a number")
      .required("Stock is required"),
    desc: Yup.string().required("Description is required"),
  });

  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      ...product,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("cs-token");
        const formData = new FormData();

        if (selectedImage) {
          formData.append("productImage", selectedImage);
        }
        formData.append("productName", values.productName);
        formData.append("categoryId", values.categoryId);
        formData.append("price", values.price);
        formData.append("stock", values.stock);
        formData.append("desc", values.desc);

        if (edit) {
          const response = await api.patch(
            `/products/${product.id}`,
            formData,
            {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('cs-token'),
                'api-key': userSelector?.username,
              },
            }
          );

          toast({
            title: "Success",
            description: "Product successfully updated!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        } else {
          const response = await api.post("/products", formData, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('cs-token'),
              'api-key': userSelector?.username,
            },
          });
          toast({
            title: "Success",
            description: "Product successfully created!",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
        }
        setSelectedImage(null);
        onClose();
        fetchProducts();
      } catch (err) {
        console.log(err);
      }
    },
  });
  useEffect(() => {
    formik.resetForm();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="font-sans">
          {edit ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Center flexDir="column" gap={"15px"}>
              <img
                className=""
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : formik?.values.imageName
                    ? "http://localhost:2500/public/product/" +
                      formik?.values.imageName
                    : defaultImage
                }
                width={"201px"}
                height={"143px"}
                alt=""
              ></img>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                style={{ display: "none" }}
              />
              <label htmlFor="image" className="cursor-pointer">
                Choose Image
              </label>
              <FormControl
                id="productName"
                isInvalid={
                  formik.touched.productName && formik.errors.productName
                }
                maxW="300px"
              >
                <FormLabel>Product Name</FormLabel>
                <Input
                  type="text"
                  {...formik.getFieldProps("productName")}
                  onChange={(e) =>
                    formik.setFieldValue("productName", e.target.value)
                  }
                  placeholder="Product Name"
                />
                <FormErrorMessage>{formik.errors.productName}</FormErrorMessage>
              </FormControl>
              <FormControl
                maxW="300px"
                isInvalid={
                  formik.errors.categoryId && formik.touched.categoryId
                }
              >
                <FormLabel>Category</FormLabel>
                {/* <Select
                  name="categoryId"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange("categoryId")}
                  placeholder="Choose Category"
                >
                  {categoryOption.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select> */}
                <OptionList
                  categories={[...categories]}
                  fetchCategories={fetchCategories}
                  formik={formik}
                />
                <FormErrorMessage>{formik.errors.categoryId}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="price"
                isInvalid={formik.touched.price && formik.errors.price}
                maxW="300px"
              >
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  {...formik.getFieldProps("price")}
                  onChange={(e) =>
                    formik.setFieldValue("price", e.target.value)
                  }
                  placeholder="Price"
                />
                <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="stock"
                isInvalid={formik.touched.stock && formik.errors.stock}
                maxW="300px"
              >
                <FormLabel>Stock</FormLabel>
                <Input
                  type="number"
                  {...formik.getFieldProps("stock")}
                  onChange={(e) =>
                    formik.setFieldValue("stock", e.target.value)
                  }
                  placeholder="Stock"
                />
                <FormErrorMessage>{formik.errors.stock}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="desc"
                isInvalid={formik.touched.desc && formik.errors.desc}
                maxW="300px"
              >
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  {...formik.getFieldProps("desc")}
                  onChange={(e) => formik.setFieldValue("desc", e.target.value)}
                  placeholder="Description"
                />
                <FormErrorMessage>{formik.errors.desc}</FormErrorMessage>
              </FormControl>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="green" mr={3}>
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const OptionList = ({ categories = [], fetchCategories, formik }) => {
  return (
    <>
      <Select
        name="categoryId"
        value={formik.values.categoryId}
        onChange={formik.handleChange("categoryId")}
        placeholder="Choose Category"
      >
        {categories?.map((category, idx) => (
          <option value={category.id} key={`category` + idx}>
            {category.category_name}
          </option>
        ))}
      </Select>
    </>
  );
};
