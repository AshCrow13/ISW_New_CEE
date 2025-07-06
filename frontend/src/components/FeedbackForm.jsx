import {useState} from 'react';
import '../styles/feedform.css';
import { postFeedback } from '../services/feedback.service';

const FeedbackForm = ({ onSuccess }) => {
  const [comentario, setComentario] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    const res = await postFeedback({ comentario, anonimo });
    if (res.status === "Success") {
      setMensaje("¡Feedback enviado!");
      setComentario("");
      setAnonimo(false);
      if (onSuccess) onSuccess();
    } else {
      setMensaje(res.message || "Error al enviar feedback");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
        <h2>Enviar Feedback</h2>
        <textarea
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            placeholder="Escribe tu comentario..."
            minLength={5}
            maxLength={500}
            required
        />
        <div>
            <label>
            <input
                type="checkbox"
                checked={anonimo}
                onChange={e => setAnonimo(e.target.checked)}
            />
            Enviar como anónimo
            </label>
        </div>
        <button type="submit">Enviar</button>
        {mensaje && <div className="mensaje">{mensaje}</div>}
        </form>
  );
};

export default FeedbackForm;