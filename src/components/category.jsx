import { Center, Box, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ModalInputCategory } from "./categorym";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

export const CategoryCard = ({ category, fetchCategories }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Center
        flexDir={"column"}
        maxWidth={"233px"}
        maxH={"239px"}
        padding={"20px 0px"}
        fontSize="14px"
        onClick={onOpen}
      >
        <Box
          fontWeight="500"
          w={"100%"}
          maxWidth={"273px"}
          padding={"0px 20px"}
        >
          <Box marginBottom={"8px"}>
            <h2 style={{ marginBottom: "8px" }}>{category.category_name}</h2>
          </Box>
        </Box>
      </Center>
      <ModalInputCategory
        isOpen={isOpen}
        onClose={onClose}
        fetchCategories={fetchCategories}
        id={category.id}
      />
    </>
  );
};

export const CategoryList = ({ categories = [], fetchCategories }) => {
  return (
    <>
      <TableContainer>
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>Category</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories?.map((category, idx) => (
              <Tr key={idx}>
                <a>
                  <CategoryCard
                    category={category}
                    fetchCategories={fetchCategories}
                  />
                </a>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
