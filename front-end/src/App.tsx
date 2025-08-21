import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPupil from "./pages/ListPupil";
import AddPupil from "./pages/AddPupil";
import ViewPupil from "./pages/ViewPupil";
import EditPupil from "./pages/EditPupil";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";

function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true, 
          element: <Dashboard />,
        },
        {
          path: "/pupils", 
          element: <ListPupil />,
        },
        {
          path: "pupils/add",
          element: <AddPupil />,
        },
        {
          path: "pupils/:id", 
          element: <ViewPupil />,
        },
        {
          path: "pupils/:pupilId/edit", 
          element: <EditPupil />,
        },
      ],
    },
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
      <Toaster/>
    </>
  );
}

export default App;
