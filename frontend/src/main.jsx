import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; // Importa theme
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import Actividades from '@pages/Actividades';
import Asambleas from '@pages/Asambleas';
import Documentos from '@pages/Documentos';
import Historial from '@pages/Historial';
import Feedback from './pages/feedback';
import Votacion from './pages/Votacion';

const router = createBrowserRouter([ // Define las rutas de la aplicación
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
        path: '/feedback',
        element: <Feedback/>
      },
      {
        path: '/votacion',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'vocalia','estudiante']}>
            <Votacion/>
          </ProtectedRoute>
        )
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
        path: '/asambleas',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'vocalia', 'estudiante']}>
            <Asambleas />
          </ProtectedRoute>
        )
      },
      {
        path: '/historial',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
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

ReactDOM.createRoot(document.getElementById('root')).render( // Renderiza la aplicación en el elemento con id 'root'
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router}/>
  </ThemeProvider>
)
