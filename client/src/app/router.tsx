import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { DefaultUrls } from "@shared/types/enums";
import { AuthPage } from "@pages/Auth/AuthPage";
import { RegistrationPage } from "@pages/Registration/RegistrationPage";
import { MainPage } from "@pages/Main/MainPage";
import { BankPage } from "@pages/Bank/BankPage";
import { CalendarPage } from "@pages/Calendar/CalendarPage";

export const router = createBrowserRouter([
  {
    path: DefaultUrls.default,
    element: <App />,
    children: [
      {
        path: DefaultUrls.auth,
        element: <AuthPage />,
      },
      {
        path: DefaultUrls.registration,
        element: <RegistrationPage />,
      },
      {
        path: DefaultUrls.main,
        element: <MainPage />,
      },
      {
        path: DefaultUrls.bank,
        element: <BankPage />,
      },
      {
        path: DefaultUrls.calendar,
        element: <CalendarPage />
      }
    ],
  },
]);
