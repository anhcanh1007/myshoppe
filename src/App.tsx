import { useContext, useEffect } from "react";
import useRouteElement from "./useRouteElement";
import { ToastContainer } from "react-toastify";
import { AppContext } from "./contexts/app.context";
import { LocalStorageEventTarget } from "./ultils/auth";
function App() {
  const useRoute = useRouteElement();
  const { reset } = useContext(AppContext);

  useEffect(() => {
    LocalStorageEventTarget.addEventListener("clearLS", reset);
    return () => {
      LocalStorageEventTarget.removeEventListener("clearLS", reset);
    };
  }, [reset]);
  return (
    <>
      {useRoute}
      <ToastContainer />
    </>
  );
}

export default App;
