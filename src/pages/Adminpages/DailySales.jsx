import { Header } from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { api } from '../../API/api';
import { DailySalesList } from '../../components/dailysales';
import { useParams, useSearchParams } from 'react-router-dom';
import { Center } from '@chakra-ui/layout';

export const DailySales = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const params = useParams();
  const [queryString, setQueryString] = useState('?');

  const handleInputForQueryString = (page) => {
    let tempQStr = '';
    if (document.getElementById(`datefrom`).value) {
      tempQStr += `datefrom=${document.getElementById(`datefrom`).value}&`;
    }
    if (document.getElementById(`dateto`).value) {
      tempQStr += `dateto=${document.getElementById(`dateto`).value}&`;
    }
    if (Number(page) > 1) {
      tempQStr += `page=${page}`;
    }
    fetchTransactions(tempQStr);
    window.history.pushState(null, '', tempQStr);
  };

  const fetchTransactions = async (queryString) => {
    try {
      const res = await api.get('/transactions/invoice?' + queryString);
      console.log(res.data);
      setTransactions([...res.data.data]);
      setPage(res.data.number_of_page);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions(params);
  }, [params]);

  return (
    <>
      <Header />
      <Row style={{ margin: '0', minHeight: '95vh', height: '100%' }}>
        <Col xl={2} lg={2} className='bg-[#D3A774]'>
          <Sidebar />
        </Col>
        <Col>
          <Container>
            <DailySalesList
              transactions={[...transactions]}
              handleInputForQueryString={handleInputForQueryString}
            />
            <Center>
              {page > 1 &&
                [...new Array(page)].map((val, index) => (
                  <Button
                    className='bg-[#D3A774] border-warning mx-1'
                    onClick={() => handleInputForQueryString(index + 1)}
                    id={`button-pagination-daily-sales` + (index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
            </Center>
          </Container>
        </Col>
      </Row>
    </>
  );
};
