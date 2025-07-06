import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import Actividades from '@pages/Actividades';
import Documentos from '@pages/Documentos';
import Historial from '@pages/Historial';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'vocalia']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/actividades',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'vocalia', 'estudiante']}>
            <Actividades />
          </ProtectedRoute>
        )
      },
      {
        path: '/documentos',
        element: (
            <ProtectedRoute allowedRoles={['admin', 'vocalia', 'estudiante']}>
              <Documentos />
            </ProtectedRoute>
          )
      },
      {
        path: '/historial',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Historial />
          </ProtectedRoute>
        )
      }


    ]
  },
  {
    path: '/auth',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)