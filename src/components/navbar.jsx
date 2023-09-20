import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Center,
  Box,
  Link,
} from '@chakra-ui/react';
import magnifier from '../assets/magnifier.png';
import logo from '../assets/ka-logo.png';
import profile from '../assets/profile.png';

export const Navbar = ({ setSearch }) => {
  return (
    <Box
      justifyContent={'space-between'}
      borderBottom={'1px solid #ebebeb'}
      alignItems={'center'}
      height={'50px'}
      position={'sticky'}
      top={0}
      w={'full'}
      className='hidden lg:flex'
      bgColor={'white'}
    >
      <InputGroup marginLeft={'32px'} height={'18px'} maxW={'317px'}>
        <InputLeftElement pointerEvents='none' height={'100%'}>
          <img src={magnifier} width='14px' height='14px' alt='' />
        </InputLeftElement>
        <Input
          border={'0px'}
          _focus={{
            boxShadow: 'none',
          }}
          placeholder='Type any products here'
          height={'100%'}
          onKeyPress={(e) => {
            if (e.key == 'Enter') setSearch(e.target.value);
          }}
        />
      </InputGroup>

      <Center position={'absolute'} width={'100%'} zIndex={'-1'}>
        <Center zIndex={0}>
          <Link
            textDecor={'none'}
            padding={'0px 16px'}
            _hover={{ textDecor: 'none', fontSize: '17px', color: 'green' }}
          >
            Coffee
          </Link>
          <Link
            textDecor={'none'}
            padding={'0px 16px'}
            _hover={{ textDecor: 'none', fontSize: '17px', color: 'green' }}
          >
            Tea
          </Link>
          <Link
            textDecor={'none'}
            padding={'0px 16px'}
            _hover={{ textDecor: 'none', fontSize: '17px', color: 'green' }}
          >
            Donuts
          </Link>
          <Link
            textDecor={'none'}
            padding={'0px 16px'}
            _hover={{ textDecor: 'none', fontSize: '17px', color: 'green' }}
          >
            Milk & Chocolate
          </Link>
        </Center>
      </Center>
    </Box>
  );
};
