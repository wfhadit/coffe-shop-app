import { AdminLandingPage } from "../pages/Adminpages/AdminLandingPage";
import { CashierAccountManagement } from "../pages/Adminpages/CashierAccountManagement";
import { CashierLandingPage } from "../pages/CashierPages/CashierLandingPage";
import { Login } from "../pages/Login";
import { Redirect } from "../pages/Redirect";
import { ProtectedPage } from "./ProtectedPage";

class RouteClass {
  constructor(path = "", element) {
    this.path = path;
    this.element = element;
  }
}

export const routes = [
  new RouteClass("/", <Redirect />),
  new RouteClass("/login", <Login />),
  // new RouteClass(
  //   "/admin/landing_page",
  //   (
  //     <ProtectedPage needLogin={true} AdminOnly={true}>
  //       <AdminLandingPage />
  //     </ProtectedPage>
  //   )
  // ),
  new RouteClass("/", <Redirect />),
  new RouteClass("/login", <Login />),
  new RouteClass(
    "/admin/landing_page",
    (
      <ProtectedPage needLogin={true} AdminOnly={true}>
        <AdminLandingPage />
      </ProtectedPage>
    )
  ),
  new RouteClass(
    "/account_management",
    (
      <ProtectedPage needLogin={true} AdminOnly={true}>
        <CashierAccountManagement />
      </ProtectedPage>
    )
  ),
  new RouteClass(
    "/TheCoffeeSpace",
    (
      <ProtectedPage needLogin={true}>
        <CashierLandingPage />
      </ProtectedPage>
    )
  ),

  new RouteClass(
    "/dashboard",
    (
      <ProtectedPage needLogin={true} AdminOnly={true}>
        <AdminLandingPage />
      </ProtectedPage>
    )
  ),
];
