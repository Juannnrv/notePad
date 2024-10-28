import React, { useState, useEffect, useRef } from "react";
import useFetch from "../hook/useFetch";
import search from "../assets/img/search.png";
import info from "../assets/img/info_outline.png";
import add from "../assets/img/add.png";
import trash from "../assets/img/delete.png";
import rafiki from "../assets/img/rafiki.png";
import { useNavigate } from 'react-router-dom';

const NotesList = () => {
  const { data, loading, error } = useFetch("/notes");
  const navigate = useNavigate();
  const longPressTimeout = useRef(null);
  const [deletedNoteId, setDeletedNoteId] = useState(null);

  const colors = [
    'bg-color-5', 'bg-color-6', 'bg-color-7', 'bg-color-8', 'bg-color-9', 'bg-color-10'
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAddClick = () => {
    navigate('/save');
  };

  const handleNoteClick = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`https://localhost:5000/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-version': '1.0.0',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error deleting note:', error.message);
    }
  };

  const handleLongPress = (id) => {
    setDeletedNoteId(id);
    handleDeleteNote(id);
    setTimeout(() => {
      setDeletedNoteId(null);
    }, 2000); 
  };

  const handleRightClick = (event, id) => {
    event.preventDefault();
    setDeletedNoteId(id);
    handleDeleteNote(id);
    setTimeout(() => {
      setDeletedNoteId(null);
    }, 2000); 
  };

  const handleTouchStart = (event, id) => {
    event.persist();
    longPressTimeout.current = setTimeout(() => handleLongPress(id), 800);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimeout.current);
  };

  const handleTouchMove = () => {
    clearTimeout(longPressTimeout.current);
  };

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data.length) {
    return (
      <div className="bg-color-13 min-h-screen py-[47px] px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-5xl font-semibold text-white">Notes</h2>
          <div className="flex items-center gap-[21px]">
            <div className="bg-color-3 rounded-2xl p-[13px]">
              <img src={search} alt="Search" className="w-6 h-6 object-contain" />
            </div>
            <div className="bg-color-3 rounded-2xl p-[13px]">
              <img src={info} alt="Info" className="w-6 h-6 object-contain" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <img src={rafiki} alt="Rafiki" className="w-[350px] h-[287px] object-contain mb-4" />
          <p className="text-white text-xl font-light">Create your first note!</p>
        </div>
        <div className="fixed bg-color-13 rounded-full p-2 z-10 right-9 bottom-9 cursor-pointer" onClick={handleAddClick}>
          <img src={add} alt="Add" className="w-6 h-6 object-contain" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-color-13 min-h-screen py-[47px] px-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-5xl font-semibold text-white">Notes</h2>
        <div className="flex items-center gap-[21px]">
          <div className="bg-color-3 rounded-2xl p-[13px]">
            <img src={search} alt="Search" className="w-6 h-6 object-contain" />
          </div>
          <div className="bg-color-3 rounded-2xl p-[13px]">
            <img src={info} alt="Info" className="w-6 h-6 object-contain" />
          </div>
        </div>
      </div>
      <ul className="space-y-4">
        {data.map((note) => (
          <li
            key={note._id}
            className={`py-7 px-12 rounded-lg shadow-md cursor-pointer ${deletedNoteId === note._id ? 'bg-red-500' : getRandomColor()}`}
            onClick={() => handleNoteClick(note._id)}
            onContextMenu={(event) => handleRightClick(event, note._id)}
            onTouchStart={(event) => handleTouchStart(event, note._id)}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            {deletedNoteId === note._id ? (
              <div className="flex items-center justify-center h-full">
                <img src={trash} alt="Delete" className="w-12 h-12 object-contain" />
              </div>
            ) : (
              <>
                <h3 className="text-xl text-color-13 font-regular">{note.title}</h3>
                <p className="text-color-13 font-regular">{note.content}</p>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="fixed bg-color-3 rounded-full p-5 z-10 right-9 bottom-9 cursor-pointer" onClick={handleAddClick}>
        <img src={add} alt="Add" className="w-6 h-6 object-contain" />
      </div>
    </div>
  );
};

export default NotesList;