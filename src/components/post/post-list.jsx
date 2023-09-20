import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../API/api';
import { useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { ModalInputProduct } from './post-modal';
import { PostCard } from './post-card';
import { Search2Icon } from '@chakra-ui/icons';

export const PostList = ({ isOpen, onOpen, onClose }) => {
  const userSelector = useSelector((state) => state.auth);
  const [sort, setSort] = useState({ orderBy: '', sortBy: '', categoryId: '' });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const toast = useToast();

  const fetchSearch = async () => {
    console.log('search', search);
    console.log('sort', sort);
    console.log('category', category);
    return api
      .get('/products/search', {
        params: {
          productName: search,
          ...sort,
          categoryId: category,
        },
      })
      .then((res) => {
        setProducts(res.data.data);
        console.log('tesssss', res.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchSearch();
  }, [search, sort, category]);

  const debouncedSearch = useCallback(
    debounce((query) => setSearch(query), 500),
    []
  );

  const doSearch = (query) => {
    debouncedSearch(query);
  };

  const handleSortChange = (e) => {
    const value = e.target.value.split('-');
    setSort({ orderBy: value[0], sortBy: value[1] });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
  };

  return (
    <div>
      <div className='flex relative'>
        <div className='absolute left-3 top-3'>
          <Search2Icon className='w-5 h-5 mb-2  text-gray-400' />
        </div>
        <input
          type='text'
          placeholder='Search for products...'
          className='border rounded-lg pl-12 mr-2 text-left border-none outline-none'
          onChange={(e) => doSearch(e.target.value)}
        />
        <div className='px-2 py-2 border rounded-lg mr-2'>
          <select
            className='border-none outline-none cursor-pointer'
            defaultValue={''}
            onChange={handleSortChange}
          >
            <option className='cursor-pointer' value=''>
              None
            </option>
            <option value='productName-asc'>Product Name A-Z</option>
            <option value='productName-desc'>Product Name Z-A</option>
            <option value='price-asc'>Price A-Z</option>
            <option value='price-desc'>Price Z-A</option>
          </select>
        </div>
        <div className='px-2 py-2 border rounded-lg'>
          <select
            className='border-none outline-none cursor-pointer'
            defaultValue={''}
            onChange={handleCategoryChange}
            style={{ cursor: 'pointer' }}
          >
            <option className='' value=''>
              Category
            </option>
            <option value='1'>Coffee</option>
            <option value='2'>Non-Coffee</option>
            <option value='3'>Pizza</option>
          </select>
        </div>
      </div>
      <table className='border mt-8 w-full text-center'>
        <thead>
          <tr>
            <th className='px-4 py-2 '>ID</th>
            <th className='px-4 py-2 '>Image</th>
            <th className='px-4 py-2 '>Product</th>
            <th className='px-4 py-2 '>Category</th>
            <th className='px-4 py-2 '>Price</th>
            <th className='px-4 py-2 '>Stock</th>
            <th className='px-4 py-2 '>Description</th>
            <th className='px-4 py-2 ' colSpan='2'>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <PostCard product={product} fetchProducts={fetchSearch} />
          ))}
        </tbody>
      </table>
      <ModalInputProduct
        isOpen={isOpen}
        fetchProducts={fetchSearch}
        onClose={onClose}
        handleSortChange={handleSortChange}
      />
    </div>
  );
};
