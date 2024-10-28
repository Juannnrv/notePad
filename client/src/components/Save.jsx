import React, { useState } from "react";
import chevron from "../assets/img/chevron_left.png";
import eye from "../assets/img/visibility.png";
import save from "../assets/img/save.png";
import tools from "../assets/img/typeTools.png";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

export default function NoteEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    const note = { title, description };
    try {
      const response = await fetch("https://localhost:5000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-version": "1.0.0",
        },
        credentials: "include",
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 429) {
          navigate("/");
          return;
        }

        const errorData = await response.json();
        if (errorData.message === "Validation errors") {
          setError(errorData.data.map((err) => err.msg).join(", "));
          return;
        }
        throw new Error(errorData.message || "Something went wrong");
      }

      const result = await response.json();
      console.log("Note saved:", result);
      navigate("/home");
    } catch (error) {
      console.error("Error saving note:", error.message);
      setError(error.message);
    }
  };

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleDiscardClick = () => {
    setShowDiscardModal(true);
  };

  const handleConfirmSave = () => {
    setShowSaveModal(false);
    handleSave();
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    navigate("/home");
  };

  const handleCancelDiscard = () => {
    setShowDiscardModal(false);
  };

  return (
    <div className="bg-color-13 min-h-screen py-[47px] px-6 text-color-12">
      <header className="flex justify-between items-center mb-10">
        <button
          className="px-4 py-3 rounded-2xl bg-color-3"
          onClick={() => navigate("/home")}
        >
          <img src={chevron} alt="Back" className="w-3 h-5" />
        </button>
        <div className="flex space-x-4">
          <button className="p-[13px] rounded-2xl bg-color-3">
            <img src={eye} alt="Preview" className="w-5 h-4" />
          </button>
          <button
            className="p-[13px] rounded-2xl bg-color-3"
            onClick={handleSaveClick}
          >
            <img src={save} alt="Save" className="w-5 h-5" />
          </button>
        </div>
      </header>
      <main className="p-4 space-y-4">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent text-5xl font-regular text-color-2 w-full focus:outline-none mb-10"
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-transparent text-2xl text-color-2 w-full h-[calc(100vh-200px)] resize-none focus:outline-none"
          placeholder="Type something..."
        />
      </main>
      <img src={tools} alt="Tools" className="fixed bottom-1 left-0" />

      {showSaveModal && (
        <Modal
          title="Confirm Save"
          message="Save changes?"
          confirmText="Save"
          cancelText="Discard"
          onConfirm={handleConfirmSave}
          onCancel={handleDiscardClick}
        />
      )}

      {showDiscardModal && (
        <Modal
          title="Confirm Discard"
          message="Are you sure you want to discard the changes?"
          confirmText="Discard"
          cancelText="Cancel"
          onConfirm={handleConfirmDiscard}
          onCancel={handleCancelDiscard}
        />
      )}
    </div>
  );
}
