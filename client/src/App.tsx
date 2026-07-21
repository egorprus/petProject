import { useEffect } from "react";
import "./App.scss";
import { Outlet } from "react-router-dom";
import { RootState, useAppDispatch } from "@app/store";
import { AuthProvider } from "@features/auth/AuthProvider";
import { Header } from "@widgets/Header/Header";
import { Footer } from "@widgets/Footer/Footer";
import { startAuth } from "@features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserStatus } from "@shared/types/enums";
import { Spinner } from "@shared/ui/Spinner/Spinner";

function App() {
  const dispatch = useAppDispatch();
  const { status } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      dispatch(startAuth(""));
    }
  }, []);

	if (status === UserStatus.loading) {
		return <Spinner />
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
