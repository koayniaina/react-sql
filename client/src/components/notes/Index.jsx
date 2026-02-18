import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Index() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/notes");
      setNotes(res.data.notes); // 🔹 ici on prend res.data.notes
    } catch (err) {
      console.error("Erreur lors de la récupération des notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette note ?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Chargement des notes...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/create">Create</Link>
      <h1>Liste des notes</h1>
      {notes.length === 0 ? (
        <p>Aucune note disponible</p>
      ) : (
        notes.map((note) => (
          <div
            key={note.id} 
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => navigate(`/edit/${note.id}`)}
                style={{ marginRight: "5px" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                style={{ color: "red" }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
