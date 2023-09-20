import { Form } from "react-bootstrap";

export const SearchboxBootstrap = (props) => {
  return (
    <Form style={{ padding: 0 }}>
      <Form.Control
        id="searchFormCashierPage"
        type="text"
        placeholder="Search Product Name Here"
        className=" mr-sm-2"
        onChange={(e) => props.setSearchKey(e.target.value)}
      />
    </Form>
  );
};
