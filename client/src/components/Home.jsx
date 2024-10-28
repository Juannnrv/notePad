import React from "react";
import useFetch from "../hook/useFetch";
import search from "../assets/img/search.png";
import info from "../assets/img/info_outline.png";
import add from "../assets/img/add.png";
import rafiki from "../assets/img/rafiki.png";
import { useNavigate } from 'react-router-dom';

const NotesList = () => {
  const { data, loading, error } = useFetch("/notes");
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/save');
  };

  const handleNoteClick = (id) => {
    navigate(`/edit/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data.length) {
    return (
      <div className="bg-color-13 min-h-screen py-[47px] px-6">
        <div className="flex justify-between items-center mb-4">
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
      <div className="flex justify-between items-center mb-4">
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
            className="bg-gray-800 py-7 px-12 rounded-lg shadow-md cursor-pointer"
            onClick={() => handleNoteClick(note._id)}
          >
            <h3 className="text-xl text-white">{note.title}</h3>
            <p className="text-gray-300">{note.content}</p>
          </li>
        ))}
      </ul>
      <div className="fixed bg-color-13 rounded-full p-2 z-10 right-9 bottom-9 cursor-pointer" onClick={handleAddClick}>
        <img src={add} alt="Add" className="w-6 h-6 object-contain" />
      </div>
    </div>
  );
};

export default NotesList;