import { api } from '../../API/api';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { ModalInputProduct } from './post-modal';

export const PostCard = ({ product, fetchProducts }) => {
  const userSelector = useSelector((state) => state.auth);
  const disclosure = useDisclosure();
  const toast = useToast();

  const categoryName = (categoryId) => {
    switch (categoryId) {
      case 1:
        return 'Coffee';
      case 2:
        return 'Non-Coffee';
      case 3:
        return 'Pizza';
      default:
        return '';
    }
  };

  const deleteProduct = (productId) => {
    const token = localStorage.getItem('cs-token');

    const isConfirmed = window.confirm('Are you sure you want to delete this?');
    if (!isConfirmed) {
      return;
    }

    api
      .delete(`/products/${productId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('cs-token'),
          'api-key': userSelector?.username,
        },
      })
      .then(() => {
        toast({
          title: 'Product has been deleted',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
        fetchProducts();
      })
      .catch((err) => {
        toast({
          title: 'Delete product failed',
          status: 'error',
          position: 'top',
          isClosable: true,
          duration: 1500,
        });
      });
  };

  return (
    <>
      <tr
        key={product.id}
        className='hover:bg-slate-300 transform hover:scale-105 hover:shadow-md'
      >
        <ModalInputProduct
          product={product}
          isOpen={disclosure.isOpen}
          onClose={disclosure.onClose}
          edit={'edit'}
          fetchProducts={fetchProducts}
        />
        <td className='border px-4 py-2'>{product.id}</td>
        <td className='border px-4 py-2'>
          <img
            src={`http://localhost:2500/public/product/${product.imageName}`}
            width='100'
            height='100'
            alt=''
            objectFit='cover'
          />
        </td>
        <td className='border px-4 py-2'>{product.productName}</td>
        <td className='border px-4 py-2'>{categoryName(product.categoryId)}</td>
        <td className='border px-4 py-2'>Rp. {product.price}</td>
        <td className='border px-4 py-2'>{product.stock}</td>
        <td className='border px-4 py-2'>{product.desc}</td>
        <td className='border px-4 py-2'>
          <EditIcon
            boxSize={5}
            cursor={'pointer'}
            onClick={() => disclosure.onOpen()}
          />
        </td>
        <td className='border px-4 py-2'>
          <DeleteIcon
            color={'red.500'}
            boxSize={5}
            cursor={'pointer'}
            onClick={() => deleteProduct(product.id)}
          />
        </td>
      </tr>
    </>
  );
};
