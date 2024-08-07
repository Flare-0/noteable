import { useEffect, useState } from 'react';
import Land from './comp/Land';
import Notecard from './comp/notecard';
import { Texteditor } from './comp/Texteditor';
import { Loading } from './comp/Loading';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getDatabase, ref, set, remove, push, onValue } from 'firebase/database';
import { firebaseConfig } from './firebaseCred';
import './App.css';
import './scrollbar.css';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const db = getDatabase(firebaseApp);

function App() {
  const [noteableUser, setNoteableUser] = useState(null);
  const [searchFormData, setSearchFormData] = useState("");
  const [newFormData, setNewFormData] = useState({ title: "", content: `` });
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [currentlySelectedNote, setCurrentlySelectedNote] = useState("");
  const [noResult, setNoResult] = useState(false);

  const handleSearchForm = (event) => {
    const { value } = event.target;
    setSearchFormData(value);
    filterNotes(value);
  };
  
  const handleTitleForm = (event) => {
    const { value } = event.target;
    setNewFormData((prev) => ({ ...prev, title: value }));
  };
  
  const handleContentForm = (event) => {
    const { value } = event.target;
    setNewFormData((prev) => ({ ...prev, content: value }));
  };
  
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setNoteableUser(user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignOut = () => {
    let userResponse = window.confirm("Are you sure you want to sign out?");
  
    if (userResponse) {
      signOut(auth)
        .then(() => {
          setNoteableUser(null);
          setNotes([]);
        })
        .catch((error) => {
          console.error('Sign out error', error);
        });
    }
  };
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setNoteableUser(user);
        fetchNotes(user.uid);
      } else {
        setNoteableUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const addNote = () => {
    if (noteableUser) {
      if(newFormData.content || newFormData.title){
        const noteRef = push(ref(db, 'users/' + noteableUser.uid));
        const newNoteId = noteRef.key;
        set(noteRef, {
          uid: newNoteId,
          title: newFormData.title,
          content: newFormData.content
        });
        setNewFormData({ title: "", content: "" });
      }
    }
  };
  
  const editNote = async (noteId, title, content) => {
    if (noteableUser) {
      const noteRef = ref(db, `users/${noteableUser.uid}/${noteId}`);
      await set(noteRef, {
        uid: noteId,
        title: title,
        content: content
      });
    }
  };

  const fetchNotes = (userId) => {
    const notesRef = ref(db, 'users/' + userId);
    onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notesArray = Object.entries(data).map(([id, note]) => ({ id, ...note }));
        setNotes(notesArray);
        setFilteredNotes(notesArray);
      } else {
        setNotes([]);
        setFilteredNotes([]);
      }
    });
  };

  const deleteNote = (noteId) => {
    if (noteableUser) {
      const noteRef = ref(db, `users/${noteableUser.uid}/${noteId}`);
      remove(noteRef)
        .then(() => {
        })
        .catch((error) => {
          console.error('Error deleting note:', error);
        });
    }
  };

  function filterNotes(query) {
    if (!query) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }

  useEffect(() => {
    if (filteredNotes.length === 0 && searchFormData) {
      setNoResult(true);
    } else {
      setNoResult(false);
    }
  }, [filteredNotes, searchFormData]);

  return (
<div>
  {currentlySelectedNote !== "" && (
    <Texteditor 
      closeEditor={() => { setCurrentlySelectedNote("") }}
      note={currentlySelectedNote}
      handleEdit={editNote}
    />
  )}
  {isLoading && <Loading />}
  <div className="headCont">
    <img className='logo' src='https://raw.githubusercontent.com/Flare-0/noteable/main/public/logo.svg' alt="Logo" />
    {!noteableUser ? (
      <div onClick={handleSignIn} className="loginBtn">
        <p className='loginText'>Login</p>
      </div>
    ) : (
      <div className="flexRow">
        <div className="userProfile">
          <img className='userProfileImg' src={noteableUser.photoURL} alt="User Profile" />
          <p className='userProfileName'>{noteableUser.displayName.split(" ")[0]}</p>
          <p className='userProfileEmail'>{noteableUser.email}</p>
        </div>
        <div className="headerRound">
        <img src="https://raw.githubusercontent.com/Flare-0/noteable/main/public/logout.svg" alt="logout" onClick={handleSignOut} />

        </div>
      </div>
    )}
  </div>

  {!noteableUser ? (
    <Land />
  ) : (
    <>
      <div className="center">
        <form className='searchNoteForm'>
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearchForm}
            value={searchFormData}
            className='SeearchInputField'
          />
        </form>
      </div>
      <div className="center">
        <form className='newNoteForm' action="">
          <input className='titleInputForm' onChange={handleTitleForm} placeholder='Title' type="text" value={newFormData.title} />
          <textarea className='contentInputForm' onChange={handleContentForm} placeholder='Take a note' value={newFormData.content}></textarea>
          <div className="center">
            <div onClick={addNote} className="addnote"> Add</div>
          </div>
        </form>
      </div>

      <div className="center"><h1>Your Notes</h1></div>
      <div className="center">{noResult && <p>No search results found</p>}</div>

      <div className="center">
        <div className="allnoteCardCont">
          {filteredNotes.map((note) => (
            <Notecard
              key={note.id}
              title={note.title}
              content={note.content}
              onDelete={() => deleteNote(note.id)}
              onclick={() => setCurrentlySelectedNote(note)} //onclick != onClick so use onclick(its a props)
            />
          ))}
        </div>
      </div>
    </>
  )}
  <div className="footer"></div>
</div>

  );
}

export default App;
