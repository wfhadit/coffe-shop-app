import {
  Center,
  Input,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalBody,
  ModalHeader,
  Button,
  Modal,
} from "@chakra-ui/react";
import defaultImage from "../assets/default-image.jpg";
import { useEffect, useState } from "react";
import { api } from "../API/api";
export const ModalInputProduct = ({ isOpen, onClose, fetchProducts, id }) => {
  const [data, setData] = useState({
    imageName: "",
    productName: "",
    price: 0,
  });

  const fetchProductById = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setData({ ...res.data });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) fetchProductById();
  }, [isOpen]);

  const inputHandler = (e) => {
    if (e.target.id == "price") {
      const price = e.target.value.replace(/[,.]/g, "");
      if (isNaN(price)) return setData({ ...data, [e.target.id]: 0 });
      else {
        return setData({
          ...data,
          [e.target.id]: price,
        });
      }
    }
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };

  const clear = () => {
    setData({
      imageName: "",
      productName: "",
      price: 0,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.patch(`/products/${id}`, data);
      } else {
        await api.post("/products", data);
        clear();
      }
      fetchProducts();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/products/${id}`);
      clear();
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
        <ModalHeader>Add/Edit Product</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={submit}>
          <ModalBody>
            <Center flexDir="column" gap={"15px"}>
              <img
                src={data?.imageName ? data?.imageName : defaultImage}
                width={"201px"}
                height={"143px"}
                alt="isi dengan gambar"
              ></img>
              <Input
                id="imageName"
                placeholder="Image URL"
                maxW="300px"
                defaultValue={data?.imageName}
                onChange={inputHandler}
                required
                type="url"
              ></Input>
              <Input
                id="productName"
                placeholder="Product Name"
                maxW="300px"
                defaultValue={data?.productName}
                onChange={inputHandler}
                required
              ></Input>
              <Input
                id="price"
                placeholder="Product Price"
                maxW="300px"
                defaultValue={data?.price}
                value={data?.price}
                onChange={inputHandler}
                required
              ></Input>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="green" mr={3}>
              Submit
            </Button>
            {id ? (
              <Button type="button" colorScheme="red" mr={3} onClick={remove}>
                Delete
              </Button>
            ) : null}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
