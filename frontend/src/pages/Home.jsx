import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <main className="container center-list-container">
      <h1>Bienvenido</h1>
      <ul className='center-list'>
        <li>
          <Link to="/feedback">Feedback</Link>
        </li>
        <Link to="/votacion">Votaciones</Link>
        {/* Agrega aquí más enlaces a otras páginas nuevas */}
      </ul>
    </main>
  );
}

export default Home