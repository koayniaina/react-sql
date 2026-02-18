import express from 'express'
import connectdb from "../config/db.js";

const router = express.Router();


router.post("/", (req, res) => {

    const { title, content } = req.body;

    connectdb.query(
        "INSERT INTO note (title, content) VALUES (?, ?)",
        [title, content],
        (error, data) => {

            if (error) {
                res.json({
                    status: false,
                    message: "Failed to create note"
                });
            } else {
                res.json({
                    status: true,
                    message: "Note created successfully",
                    id: data.insertId 
                });
            }
        }
    );
});

router.get("/", (req, res) => {

    connectdb.query("SELECT * FROM note", (error, data) => {

        if (error) {
            res.json({
                status: false,
                message: "Failed to fetch notes"
            });
        } else {
            res.json({
                status: true,
                notes: data
            });
        }
    });
});


// ✅ GET SINGLE NOTE
router.get("/:id", (req, res) => {

    const noteId = req.params.id;

    connectdb.query(
        "SELECT * FROM note WHERE id = ?",
        [noteId],
        (error, data) => {

            if (error) {
                res.json({
                    status: false,
                    message: "Failed to execute query"
                });
            } else {

                if (data.length > 0) {
                    res.json({
                        status: true,
                        note: data[0]
                    });
                } else {
                    res.json({
                        status: false,
                        message: "Note not found"
                    });
                }
            }
        }
    );
});

router.put("/:id", (req, res) => {

    const noteId = req.params.id;
    const { title, content } = req.body;

    connectdb.query(
        "UPDATE note SET title = ?, content = ? WHERE id = ?",
        [title, content, noteId],
        (error, data) => {

            if (error) {
                res.json({
                    status: false,
                    message: "Failed to update note"
                });
            } else {
                res.json({
                    status: true,
                    message: "Note updated successfully"
                });
            }
        }
    );
});

router.delete("/:id", (req, res) => {

    const noteId = req.params.id;

    connectdb.query(
        "DELETE FROM note WHERE id = ?",
        [noteId],
        (error, data) => {

            if (error) {
                res.json({
                    status: false,
                    message: "Failed to delete note"
                });
            } else {
                res.json({
                    status: true,
                    message: "Note deleted successfully"
                });
            }
        }
    );
});


export default router;
