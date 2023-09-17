import { Form } from "react-bootstrap";

export const SearchboxBootstrap = () => {
  return (
    <Form style={{ padding: 0 }}>
      <Form.Control
        id="searchFormCashierPage"
        type="text"
        placeholder="Search Product Name Here"
        className=" mr-sm-2"
      />
    </Form>
  );
};
