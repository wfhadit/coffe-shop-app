import { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import loginBackgroundImage from "../assets/backgroundLogin.jpg";
import { SVGeye, SVGslashedEye } from "../components/SVG/SVGeye";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/middlewares/auth-middleware";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

export const Login = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const [seePassword, setSeePassword] = useState(false);

  const toastProcessing = () =>
    toast({
      title: "Processing",
      position: "top",
      duration: 1000,
      isClosable: true,
      status: "loading",
    });
  const toastSuccess = (title = "success", description = "") =>
    toast({
      title: title,
      position: "top",
      duration: 1500,
      isClosable: true,
      status: "success",
      description: description,
    });
  const toastError = (title = "Error", description = "") =>
    toast({
      title: title,
      position: "top",
      duration: 1500,
      isClosable: true,
      status: "error",
      description: description,
    });

  const formik = useFormik({
    initialValues: {
      username: null,
      password: null,
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      if (!values.username || !values.password) {
        return toastError("Error Login", "please fill the form");
      }
      toastProcessing();
      await dispatch(userLogin(values))
        .then((result) => {
          console.log(result);
          if (result === 1) {
            toastSuccess("Login success");
            nav(`/account_management`);
          } else if (result === 2) {
            toastSuccess("Login success");
            nav(`/cashier/landing_page`);
          } else {
            toastError("Login failed", result.response?.data);
          }
        })
        .catch((err) => {
          console.log(err);
          toastError("Login failed", err?.response?.data);
        });
    },
  });
  useEffect(() => {
    if (localStorage.getItem("cs-token") && userSelector.role === 1) {
      nav(`/account_management`);
    } else if (localStorage.getItem("cs-token") && userSelector.role === 2) {
      nav(`/cashier/landing_page`);
    }
  }, [userSelector.role]);
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "100vw",
        height: "100vh",
        backgroundImage: `url(${loginBackgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <Container
        style={{
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Card
          className="d-flex flex-column align-items-center justify-content-center gap-2"
          style={{
            maxWidth: "300px",
            width: "100%",
            position: "relative",
            borderRadius: "50px",
          }}
        >
          <h2 className="mt-2">Login</h2>
          <Form>
            <Form.Group className="mb-3" controlId="UsernameLoginForm">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="username"
                onChange={formik.handleChange}
                autoFocus
              />
              <div className="text-danger"> {formik.errors.username}</div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="PasswordLoginForm">
              <Form.Label>Password</Form.Label>
              <div
                className="d-flex align-items-center"
                style={{ position: "relative" }}
              >
                <Form.Control
                  type={seePassword ? "text" : "password"}
                  placeholder="password"
                  name="password"
                  onChange={formik.handleChange}
                  autoFocus
                />
                {seePassword ? (
                  <span
                    style={{ position: "absolute", right: "5px" }}
                    type="button"
                    onClick={() => setSeePassword(!seePassword)}
                  >
                    <SVGslashedEye />
                  </span>
                ) : (
                  <span
                    style={{ position: "absolute", right: "5px" }}
                    type="button"
                    onClick={() => setSeePassword(!seePassword)}
                  >
                    <SVGeye />
                  </span>
                )}
              </div>
              <div className="text-danger"> {formik.errors.password}</div>
              <div className="w-100 d-flex justify-content-center">
                <Button
                  variant="primary"
                  onClick={formik.handleSubmit}
                  className="mt-4"
                >
                  Login
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Card>
      </Container>
    </div>
  );
};
