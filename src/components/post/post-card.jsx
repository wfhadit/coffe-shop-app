import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../API/api";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

export const PostCard = ({ products, fetchProducts }) => {
  const userSelector = useSelector((state) => state.auth);
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const toast = useToast();

  const deleteProduct = (productId) => {
    const token = localStorage.getItem("cs-token");

    const isConfirmed = window.confirm("Are u sure want to delete this?");
    if (!isConfirmed) {
      return;
    }

    api
      .delete(`/products/${productId}`, {
        params: { token, product_id: userSelector.id },
      })
      .then((result) => {
        toast({
          title: "Product has been deleted",
          status: "success",
          isClosable: true,
          position: "top",
          duration: 1500,
        });
        fetchProducts();
      })
      .catch((err) => {
        toast({
          title: "Delete post failed",
          description: err?.response?.data,
          status: "error",
          position: "top",
          isClosable: true,
          duration: 1500,
        });
      });
  };
  useEffect(() => {
    console.log(userSelector.id);
  }, []);

  const fetchSearch = (query) => {
    return api
      .get("/products/search", {
        params: {
          productName: query,
        },
      })
      .then((res) => res.data.data)
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (search) {
      fetchSearch(search).then((data) => {
        setProduct(data || []);
      });
    } else {
      fetchProducts("").then((data) => {
        setProduct(data || []);
      });
    }
  }, [search]);

  const debouncedSearch = useCallback(
    debounce((query) => setSearch(query), 1000),
    []
  );

  const doSearch = (query) => {
    debouncedSearch(query);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for coffee..."
        className="border rounded-lg p-2 w-full"
        onChange={(e) => doSearch(e.target.value)}
      />
      <div>
        <label className="mr-2">Sort by:</label>
        <select
          value={sortBy || ""}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">None</option>
          <option value="name-asc">Product Name (Ascending)</option>
          <option value="name-desc">Product Name (Descending)</option>
          <option value="price-asc">Price (Ascending)</option>
          <option value="price-desc">Price (Descending)</option>
        </select>
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {products.length &&
            products.map((product) => (
              <tr key={product.id}>
                <td className="border px-4 py-2">{product.id}</td>
                <td className="border px-4 py-2">{product.imageName}</td>
                <td className="border px-4 py-2">{product.productName}</td>
                <td className="border px-4 py-2">Rp. {product.price}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">{product.desc}</td>
                <td className="border px-4 py-2">
                  <EditIcon boxSize={5} cursor={"pointer"} />
                </td>
                <td className="border px-4 py-2">
                  <DeleteIcon
                    boxSize={5}
                    cursor={"pointer"}
                    onClick={() => deleteProduct(product.id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {products.length === 0 && <p className="mt-4">Product not found</p>}
    </div>
  );
};
