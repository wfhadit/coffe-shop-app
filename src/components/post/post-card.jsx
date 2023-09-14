import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../API/api';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';

export const PostCard = ({ id }) => {
  const userSelector = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(null);

  const toast = useToast();
  const ref = useRef();

  const deleteProduct = (productId) => {
    const token = localStorage.getItem('cs-token');

    const isConfirmed = window.confirm('Are u sure want to delete this?');
    if (!isConfirmed) {
      return;
    }

    api
      .delete(`/products/${productId}`, {
        params: { token, product_id: userSelector.id },
      })
      .then((result) => {
        toast({
          title: 'Product has been deleted',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 1500,
        });
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      })
      .catch((err) => {
        toast({
          title: 'Delete post failed',
          description: err?.response?.data,
          status: 'error',
          position: 'top',
          isClosable: true,
          duration: 1500,
        });
      });
  };
  console.log(id);
  useEffect(() => {
    console.log(userSelector.id);
  }, []);

  const fetchProducts = (query) => {
    return api
      .get('/products', {
        params: {
          productName: query,
        },
      })
      .then((res) => res.data.data)
      .catch((err) => console.log(err));
  };

  const fetchSearch = (query) => {
    return api
      .get('/products/search', {
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
        setProducts(data || []);
      });
    } else {
      fetchProducts('').then((data) => {
        setProducts(data || []);
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

  const sortProducts = (products) => {
    if (sortBy === 'name-asc') {
      return [...products].sort((a, b) =>
        a.productName.localeCompare(b.productName)
      );
    } else if (sortBy === 'name-desc') {
      return [...products].sort((a, b) =>
        b.productName.localeCompare(a.productName)
      );
    } else if (sortBy === 'price-asc') {
      return [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      return [...products].sort((a, b) => b.price - a.price);
    } else {
      return products;
    }
  };

  const sortedProducts = sortProducts(products);

  return (
    <div>
      <input
        type='text'
        placeholder='Search for coffee...'
        className='border rounded-lg p-2 w-full'
        onChange={(e) => doSearch(e.target.value)}
      />
      <div>
        <label className='mr-2'>Sort by:</label>
        <select
          value={sortBy || ''}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value=''>None</option>
          <option value='name-asc'>Product Name (Ascending)</option>
          <option value='name-desc'>Product Name (Descending)</option>
          <option value='price-asc'>Price (Ascending)</option>
          <option value='price-desc'>Price (Descending)</option>
        </select>
      </div>

      <table className='table-auto w-full'>
        <thead>
          <tr>
            <th className='px-4 py-2'>ID</th>
            <th className='px-4 py-2'>Image</th>
            <th className='px-4 py-2'>Product</th>
            <th className='px-4 py-2'>Price</th>
            <th className='px-4 py-2'>Stock</th>
            <th className='px-4 py-2'>Description</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts &&
            sortedProducts.map((product) => (
              <tr key={product.id}>
                <td className='border px-4 py-2'>{product.id}</td>
                <td className='border px-4 py-2'>{product.imageName}</td>
                <td className='border px-4 py-2'>{product.productName}</td>
                <td className='border px-4 py-2'>Rp. {product.price}</td>
                <td className='border px-4 py-2'>{product.stock}</td>
                <td className='border px-4 py-2'>{product.desc}</td>
                <td className='border px-4 py-2'>
                  <EditIcon
                    boxSize={5}
                    cursor={'pointer'}
                    // onClick={() => }
                  />
                </td>
                <td className='border px-4 py-2'>
                  <DeleteIcon
                    boxSize={5}
                    cursor={'pointer'}
                    onClick={() => deleteProduct(product.id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {sortedProducts.length === 0 && <p className='mt-4'>Product not found</p>}
    </div>
  );
};
