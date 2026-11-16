import "./App.scss";
import { Outlet } from "react-router-dom";
import { RootState } from "@app/store";
import { AuthProvider } from "@features/auth/AuthProvider";
import { Header } from "@widgets/Header/Header";
import { Footer } from "@widgets/Footer/Footer";
import { useSelector } from "react-redux";
import { UserStatus } from "@shared/types/enums";
import { Spinner } from "@shared/ui/Spinner/Spinner";
import { useGetMeQuery } from "@features/auth/authApi";

function App() {
  const { status } = useSelector((state: RootState) => state.user);

  useGetMeQuery(undefined, { skip: !localStorage.getItem("token") });

  if (status === UserStatus.loading) {
    return <Spinner />;
  }

  return (
    <div className="App">
      <AuthProvider>
        <Header />
        <main className="main container">
          <Outlet />
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
