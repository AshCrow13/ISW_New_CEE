import { Link } from 'react-router-dom'; 

const Home = () => {
  return (
    <main className="container">
      <h1>Bienvenido</h1>
      <ul>
        <li>
          <Link to="/feedback">Ver Feedback</Link>
        </li>
        {/* Agrega aquí más enlaces a otras páginas nuevas */}
      </ul>
    </main>
  );
}

export default Home