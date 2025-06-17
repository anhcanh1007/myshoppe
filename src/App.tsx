import useRouteElement from "./useRouteElement";
import { ToastContainer } from "react-toastify";
function App() {
  const useRoute = useRouteElement();
  return (
    <>
      {useRoute}
      <ToastContainer />
    </>
  );
}

export default App;
