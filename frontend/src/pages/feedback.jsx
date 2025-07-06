import usefeedback from '@hooks/feedback/useFeedback.jsx';
import FeedbackForm from "@components/FeedbackForm.jsx";

const Feedback = () => {
  const { feedbacks, loading, fetchFeedbacks } = usefeedback();

  return (
    <div>
      <FeedbackForm onSuccess={fetchFeedbacks} />
      <h1>Feedbacks</h1>
      {loading ? (
        <div>Cargando feedbacks...</div>
      ) : (
        <ul>
          {feedbacks.map(fb => (
            <li key={fb.id}>
              <strong>{fb.usuarioName || "Anónimo"}:</strong> {fb.comentario}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Feedback;