import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { DefaultUrls } from "@shared/types/enums";
import { AuthPage } from "@pages/Auth/AuthPage";
import { RegistrationPage } from "@pages/Registration/RegistrationPage";
import { MainPage } from "@pages/Main/MainPage";
import { BankPage } from "@pages/Bank/BankPage";
import { CalendarPage } from "@pages/Calendar/CalendarPage";
import { TrainingPage } from "@pages/Training/TrainingPage";
import { MoviesPage } from "@pages/Movies/MoviesPage";
import { MoviesSharedPage } from "@pages/MoviesShared/MoviesSharedPage";
import { ProfilePage } from "@pages/Profile/ProfilePage";
import { HiddenPageGuard } from "./HiddenPageGuard";

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
        element: (
          <HiddenPageGuard page={DefaultUrls.main}>
            <MainPage />
          </HiddenPageGuard>
        ),
      },
      {
        path: DefaultUrls.bank,
        element: (
          <HiddenPageGuard page={DefaultUrls.bank}>
            <BankPage />
          </HiddenPageGuard>
        ),
      },
      {
        path: DefaultUrls.calendar,
        element: (
          <HiddenPageGuard page={DefaultUrls.calendar}>
            <CalendarPage />
          </HiddenPageGuard>
        )
      },
      {
        path: DefaultUrls.training,
        element: (
          <HiddenPageGuard page={DefaultUrls.training}>
            <TrainingPage />
          </HiddenPageGuard>
        )
      },
      {
        path: DefaultUrls.movies,
        element: (
          <HiddenPageGuard page={DefaultUrls.movies}>
            <MoviesPage />
          </HiddenPageGuard>
        )
      },
      {
        path: DefaultUrls.profile,
        element: <ProfilePage />
      },
      {
        path: "movies/shared/:token",
        element: <MoviesSharedPage />
      }
    ],
  },
]);
