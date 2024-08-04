import { useEffect, useState } from 'react';
import viteLogo from '/vite.svg';
import Land from './comp/Land';
import Notecard from './comp/notecard';
import { Loading } from './comp/Loading';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getDatabase, ref, set,remove, push, onValue } from 'firebase/database';
import { firebaseConfig } from './firebaseCred';
import './App.css';

// Initialize Firebase outside the component to avoid reinitialization
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const db = getDatabase(firebaseApp);

function App() {
  const [noteableUser, setNoteableUser] = useState(null);
  const [newFormData, setNewFormData] = useState({ title: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  function handleSearchForm(event) {
    const { name, value } = event.target;
    setNewFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // User signed in
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

  function addNote() {
    if (noteableUser) {
      const noteRef = push(ref(db, 'users/' + noteableUser.uid));
      set(noteRef, {
        uid: noteableUser.uid,
        title: "",
        content: " "
      });
    }
  }

  function fetchNotes(userId) {
    const notesRef = ref(db, 'users/' + userId);
    onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notesArray = Object.entries(data).map(([id, note]) => ({ id, ...note }));
        setNotes(notesArray);
      } else {
        setNotes([]);
      }
    });
  }


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);


  function deleteNote(noteId) {
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
  }


  return (
    <div>
      {isLoading && <Loading />}
      <div className="headCont">
        <img className='logo' src='/logo.svg' alt="Logo" />
        {noteableUser == null && <div onClick={handleSignIn} className="loginBtn">
          <p className='loginText'>Login</p>
        </div>}
        {noteableUser && <div className="userProfile">
          <img className='userProfileImg' src={noteableUser.photoURL} alt="User Profile" />
          <p className='userProfileName'>{noteableUser.displayName.split(" ")[0]}</p>
          <p className='userProfileEmail'>{noteableUser.email}</p>
          <p className='userProfileSignout' onClick={handleSignOut}>Sign Out</p>
        </div>}
      </div>

      {noteableUser == null && <Land />}
      <div className="center">
        <form className='newNoteForm'>
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearchForm}
            name="title"
            value={newFormData.title}
            className='titleInputField'
          />
        </form>
      </div>

      <div className="addNewNote" onClick={addNote}><img src='/plusicon.svg' alt="Add Note" /></div>

      <div className="center">
        <div className="allnoteCardCont">
          {notes.map((note) => (
            <Notecard
              key={note.id}
              title={note.title}
              content={note.content}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
