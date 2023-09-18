import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Center,
} from "@chakra-ui/react";
import defaultImage from "../assets/default-image.jpg";
import { useEffect, useState } from "react";
import { api } from "../API/api";
export const ModalInputCategory = ({
  isOpen,
  onClose,
  fetchCategories,
  id,
}) => {
  const [data, setData] = useState({
    category_name: "",
  });

  const fetchCategoryById = async () => {
    try {
      const res = await api.get(`/category/${id}`);
      setData({ ...res.data });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) fetchCategoryById();
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
      category_name: "",
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.patch(`/category/${id}`, data);
      } else {
        await api.post("/category", data);
        clear();
      }
      fetchCategories();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/category/${id}`);
      clear();
      fetchCategories();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add/Edit Category</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={submit}>
          <ModalBody>
            <Center flexDir="column" gap={"15px"}>
              <Input
                id="category_name"
                placeholder="Category Name"
                maxW="300px"
                defaultValue={data?.category_name}
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
