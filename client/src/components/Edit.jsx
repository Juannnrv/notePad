import React, { useState, useEffect } from 'react';
import chevron from '../assets/img/chevron_left.png';
import edit from '../assets/img/mode.png';
import tools from '../assets/img/typeTools.png';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from './Modal';
import useFetch from '../hook/useFetch';

export default function EditNoteEditor() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/${id}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorState, setErrorState] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
    }
  }, [data]);

  const handleEdit = async () => {
    const note = { title, description };
    try {
      const response = await fetch(`https://localhost:5000/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-version': '1.0.0',
        },
        credentials: 'include',
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 429) {
          navigate('/');
          return;
        }

        const errorData = await response.json();
        if (errorData.message === 'Validation errors') {
          setErrorState(errorData.data.map(err => err.msg).join(', '));
          return;
        }
        throw new Error(errorData.message || 'Something went wrong');
      }

      const result = await response.json();
      console.log('Note updated:', result);
      navigate('/home');
    } catch (error) {
      console.error('Error updating note:', error.message);
      setErrorState(error.message);
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
    handleEdit();
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    navigate('/home');
  };

  const handleCancelDiscard = () => {
    setShowDiscardModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-color-13 min-h-screen py-[47px] px-6 text-color-12">
      <header className="flex justify-between items-center mb-10">
        <button className="px-4 py-3 rounded-2xl bg-color-3" onClick={() => navigate('/home')}>
          <img src={chevron} alt="Back" className="w-3 h-5" />
        </button>
        <button className="px-4 py-3 rounded-2xl bg-color-3" onClick={handleSaveClick}>
          <img src={edit} alt="Edit" className="w-4 h-5" />
        </button>
      </header>
      <main className="p-4 space-y-4">
        {errorState && (
          <div className="text-red-500 mb-4">
            {errorState}
          </div>
        )}
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