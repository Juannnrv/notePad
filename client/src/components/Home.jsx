import React, { useState, useEffect, useRef } from "react";
import useFetch from "../hook/useFetch";
import search from "../assets/img/search.png";
import info from "../assets/img/info_outline.png";
import add from "../assets/img/add.png";
import trash from "../assets/img/delete.png";
import rafiki from "../assets/img/rafiki.png";
import close from "../assets/img/close.png";
import people from "../assets/img/cuate.png";
import { useNavigate } from "react-router-dom";

const NotesList = () => {
  const { data: initialData, loading, error } = useFetch("");
  const navigate = useNavigate();
  const longPressTimeout = useRef(null);
  const [deletedNoteId, setDeletedNoteId] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("Search by the keyword...");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState(null);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const colors = [
    "bg-color-5",
    "bg-color-6",
    "bg-color-7",
    "bg-color-8",
    "bg-color-9",
    "bg-color-10",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAddClick = () => {
    navigate("/save");
  };

  const handleNoteClick = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleSearchClick = () => {
    setIsSearchVisible(!isSearchVisible);
    setSearchQuery("");
    setData([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery) {
        setLoadingSearch(true);
        setErrorSearch(null);
        try {
          const response = await fetch(
            `https://localhost:5000/notes/search?query=${searchQuery}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-version": "1.0.0",
              },
              credentials: "include",
            }
          );

          if (!response.ok) {
            if (response.status === 401 || response.status === 429) {
              navigate("/");
              return;
            }

            const errorData = await response.json();
            if (errorData.message === "Validation errors") {
              setErrorSearch(errorData.data.map((err) => err.msg).join(", "));
              return;
            }
            throw new Error(errorData.message || "Something went wrong");
          }

          const data = await response.json();
          if (data.data.length === 0) {
            setData([]);
          } else {
            console.log("search", data.data);
            setData(data.data);
          }
        } catch (error) {
          setErrorSearch(error.message);
        } finally {
          setLoadingSearch(false);
        }
      }
    };

    fetchData();
  }, [searchQuery, navigate]);

  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`https://localhost:5000/notes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-version": "1.0.0",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error deleting note:", error.message);
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

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (isSearchVisible) {
    return (
      <div className="bg-color-1 min-h-screen text-color-11 pt-20 pb-10 px-6">
        {isSearchVisible && (
          <div className="relative mb-10 w-full max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                e.preventDefault();
                setSearchQuery(e.target.value);
              }}
              onClick={() => setPlaceholder("Search by the keyword...")}
              placeholder={placeholder}
              className="w-full bg-color-3 text-xl text-color-11 font-light rounded-full py-2 px-10 pr-12 focus:outline-none focus:ring-2 focus:ring-color-7"
            />
            <img
              src={close}
              alt="Close"
              className="absolute right-7 top-4 cursor-pointer"
              onClick={() => {
                setSearchQuery("");
                setIsSearchVisible(false);
                setData([]);
              }}
            />
          </div>
        )}
  
        {loadingSearch ? (
          <p>Loading...</p>
        ) : data.length === 0 && searchQuery.length > 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <img src={people} alt="People searching" className="mb-4" />
            <p className="text-color-11 text-xl text-center font-light">
              File not found. Try searching again.
            </p>
          </div>
        ) : errorSearch ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <img src={people} alt="Error searching" className="mb-4" />
            <p className="text-color-11 text-xl text-center font-light">
              File not found. Try searching again.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {data.map((note) => (
              <li
                key={note._id}
                className={`py-7 px-12 rounded-lg shadow-md cursor-pointer ${getRandomColor()}`}
                onClick={() => handleNoteClick(note._id)}
              >
                <h3 className="text-xl text-color-13 font-regular">
                  {note.title}
                </h3>
                <p className="text-color-13 font-regular">{note.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (!initialData.length) {
    return (
      <div className="bg-color-13 min-h-screen py-[47px] px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-5xl font-semibold text-white">Notes</h2>
          <div className="flex items-center gap-[21px]">
            <div className="bg-color-3 rounded-2xl p-[13px] cursor-pointer">
              <img
                src={search}
                alt="Search"
                className="w-6 h-6 object-contain"
                onClick={handleSearchClick}
              />
            </div>
            <div className="bg-color-3 rounded-2xl p-[13px]">
              <img src={info} alt="Info" className="w-6 h-6 object-contain" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <img
            src={rafiki}
            alt="Rafiki"
            className="w-[350px] h-[287px] object-contain mb-4"
          />
          <p className="text-white text-xl font-light">
            Create your first note!
          </p>
        </div>
        <div
          className="fixed bg-color-13 rounded-full p-2 z-10 right-9 bottom-9 cursor-pointer"
          onClick={handleAddClick}
        >
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
            <img
              src={search}
              alt="Search"
              className="w-6 h-6 object-contain"
              onClick={handleSearchClick}
            />
          </div>
          <div className="bg-color-3 rounded-2xl p-[13px]">
            <img src={info} alt="Info" className="w-6 h-6 object-contain" />
          </div>
        </div>
      </div>
      <ul className="space-y-4">
        {initialData.map((note) => (
          <li
            key={note._id}
            className={`py-7 px-12 rounded-lg shadow-md cursor-pointer ${
              deletedNoteId === note._id ? "bg-red-500" : getRandomColor()
            }`}
            onClick={() => handleNoteClick(note._id)}
            onContextMenu={(event) => handleRightClick(event, note._id)}
            onTouchStart={(event) => handleTouchStart(event, note._id)}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            {deletedNoteId === note._id ? (
              <div className="flex items-center justify-center h-full">
                <img
                  src={trash}
                  alt="Delete"
                  className="w-12 h-12 object-contain"
                />
              </div>
            ) : (
              <>
                <h3 className="text-xl text-color-13 font-regular">
                  {note.title}
                </h3>
                <p className="text-color-13 font-regular">{note.content}</p>
              </>
            )}
          </li>
        ))}
      </ul>
      <div
        className="fixed bg-color-3 rounded-full p-5 z-10 right-9 bottom-9 cursor-pointer"
        onClick={handleAddClick}
      >
        <img src={add} alt="Add" className="w-6 h-6 object-contain" />
      </div>
    </div>
  );
};

export default NotesList;
