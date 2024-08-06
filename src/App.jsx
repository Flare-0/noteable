import { useEffect, useState } from 'react';
import viteLogo from '/vite.svg';
import Land from './comp/Land';
import Notecard from './comp/notecard';
import { Loading } from './comp/Loading';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getDatabase, ref, set, remove, push, onValue } from 'firebase/database';
import { firebaseConfig } from './firebaseCred';
import './App.css';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const db = getDatabase(firebaseApp);

function App() {
  const [noteableUser, setNoteableUser] = useState(null);
  const [searchFormData, setSearchFormData] = useState({ title: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [currentlySelectedNote, setCurrentlySelectedNote] = useState("");
  const [noResult,setNoResult]=useState(false)

  const handleSearchForm = (event) => {
    const { name, value } = event.target;
    setSearchFormData((prevData) => ({
      ...prevData+
      event.target.value
    }));
    filterNotes(value);
    console.log(searchFormData)
    console.log(filteredNotes)
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
    signOut(auth)
      .then(() => {
        setNoteableUser(null);
        setNotes([]);
      })
      .catch((error) => {
        console.error('Sign out error', error);
      });
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
      const noteRef = push(ref(db, 'users/' + noteableUser.uid));
      set(noteRef, {
        uid: noteableUser.uid,
        title: "",
        content: " "
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
          console.log('Note deleted');
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
  if (filteredNotes.length === 0 && searchFormData.title) {
    setNoResult(true);
  } else {
    setNoResult(false);
  }
}, [filteredNotes, searchFormData.title]);



  return (
    <div>
    {isLoading && <Loading />}
    <div className="headCont">
      <img className='logo' src='/logo.svg' alt="Logo" />
      {!noteableUser ? (
        <div onClick={handleSignIn} className="loginBtn">
          <p className='loginText'>Login</p>
        </div>
      ) : (
        <div className="userProfile">
          <img className='userProfileImg' src={noteableUser.photoURL} alt="User Profile" />
          <p className='userProfileName'>{noteableUser.displayName.split(" ")[0]}</p>
          <p className='userProfileEmail'>{noteableUser.email}</p>
          <p className='userProfileSignout' onClick={handleSignOut}>Sign Out</p>
        </div>
      )}
    </div>
    
    {!noteableUser && <Land />}
    
    <div className="center">
      <form className='searchNoteForm'>
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearchForm}
          name="title"
          value={searchFormData.title}
          className='SeearchInputField'
        />
      </form>
    </div>

    <div className="center"><h1>Your Notes</h1></div>
    <div className="center">
      {noResult && <p>No search result found</p>}
      <div className="allnoteCardCont">
        {filteredNotes.map((note) => (
          <Notecard
            key={note.id}
            title={note.title}
            content={note.content}
            onDelete={() => deleteNote(note.id)}
            onClick={() => setCurrentlySelectedNote(note.id)}
          />
        ))}
      </div>
    </div>
  </div>
);
  );
}

export default App;
