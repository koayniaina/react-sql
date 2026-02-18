import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Edit() {
  const { id } = useParams(); 
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // récupérer la note
  useEffect(() => {
    axios.get(`http://localhost:3001/api/notes/${id}`)
      .then((res) => {
        if (res.data.status) {
          setTitle(res.data.note.title);     // 🔹 note.title
          setContent(res.data.note.content); // 🔹 note.content
        } else {
          console.error("Note not found");
          navigate("/"); // retourne à la liste si note introuvable
        }
      })
      .catch((err) => console.error(err));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/notes/${id}`, { title, content });
      navigate("/"); // retourne à la liste après update
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Modifier la note</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Titre:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Contenu:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>Modifier</button>
      </form>
    </div>
  );
}
