import {useState, useContext} from 'react';
import useFeedback from '@hooks/feedback/useFeedback.jsx';
import FeedbackForm from "@components/FeedbackForm.jsx";

import {AuthContext} from '@context/AuthContext.jsx'; // Asegúrate de que la ruta sea correcta

const Feedback = () => {
  const [view, setView] = useState(null); // Cambio: iniciar sin ninguna vista
  const { feedbacks, loading, fetchFeedbacks } = useFeedback();
  const { user } = useContext(AuthContext);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <div style={{ 
        marginBottom: "2rem",
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        <button 
          onClick={() => setView(view === "crear" ? null : "crear")}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "1px solid #007bff",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {view === "crear" ? "Ocultar formulario" : "Crear feedback"}
        </button>
        {user?.rol === "admin" && (
          <button 
            onClick={() => {
              console.log("Botón Ver feedbacks clickeado");
              console.log("View actual:", view);
              console.log("Feedbacks actuales:", feedbacks);
              setView(view === "ver" ? null : "ver");
              if (view !== "ver") {
                console.log("Llamando fetchFeedbacks...");
                fetchFeedbacks();
              }
            }}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "1px solid #28a745",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {view === "ver" ? "Ocultar feedbacks" : "Ver feedbacks"}
          </button>
        )}
      </div>

      {view === "crear" && <FeedbackForm onSuccess={fetchFeedbacks} />}
      {view === "ver" && user?.rol === "admin" && (
        <div style={{ 
          width: "100%", 
          maxWidth: "800px",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{ 
            textAlign: "center", 
            color: "#333",
            marginBottom: "20px" 
          }}>
            Feedbacks Publicados
          </h1>
          {loading ? (
            <div style={{ 
              textAlign: "center", 
              padding: "20px",
              fontSize: "16px",
              color: "#666"
            }}>
              Cargando feedbacks...
            </div>
          ) : feedbacks.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "20px",
              fontSize: "16px",
              color: "#666"
            }}>
              No hay feedbacks disponibles
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {feedbacks.map((fb, index) => (
                <div key={fb.id || index} style={{
                  backgroundColor: "white",
                  padding: "15px",
                  borderRadius: "6px",
                  border: "1px solid #dee2e6",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ 
                    fontWeight: "bold", 
                    color: "#495057",
                    marginBottom: "8px"
                  }}>
                    {fb.usuarioName || "Anónimo"}
                  </div>
                  <div style={{ 
                    color: "#6c757d",
                    lineHeight: "1.5"
                  }}>
                    {fb.comentario}
                  </div>
                  {fb.createdAt && (
                    <div style={{ 
                      fontSize: "12px",
                      color: "#adb5bd",
                      marginTop: "8px"
                    }}>
                      {new Date(fb.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Botón flotante para volver al inicio - Solo aparece cuando view === "ver" */}
      {view === "ver" && (
        <button
          onClick={() => setView(null)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#c82333";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#dc3545";
            e.target.style.transform = "scale(1)";
          }}
          title="Volver al inicio"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Feedback;