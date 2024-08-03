import { useEffect, useState } from 'react'
import Land from './comp/Land'
import viteLogo from '/vite.svg'
import './App.css'
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import Notecard from './comp/notecard';
import { firebaseConfig } from './firebaseCred';

function App() {
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const [noteableUser, setNoteableUser] = useState();
  const [newFormData, setNewFormData] = useState({ title: 'e', Content: null });

  function handleChangeTitle(event) {
    setNewFormData((prevData) => ({...prevData,title: event.target.value,}));}

  function handleChangeContent(event) {
    setNewFormData((prevData) => ({ ...prevData, Content: event.target.value, }));}

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(error);
      });
  };
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out.');
      })
      .catch((error) => {
        console.error('Sign out error', error);
      });
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setNoteableUser(user);
      } else {
        setNoteableUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  console.log(noteableUser)
  return (
    <>
      {/* Header */}
      <div className="headCont">
        <img className='logo' src='/logo.svg' alt="Logo" />  {/*logo*/}


        {noteableUser == null && <div onClick={handleSignIn} className="loginBtn">{/*login btn*/}
          <p className='loginText'>Login</p></div>}


        {noteableUser && <div className="userProfile">{/*userinfo btn*/}
          <img className='userProfileImg' src={noteableUser.photoURL} />
          <p className='userProfileName' >{noteableUser.displayName.split(" ")[0]}</p>
          <p className='userProfileEmail' >{noteableUser.email}</p>
          <p className='userProfileSignout' onClick={handleSignOut} >Sign Out</p>
        </div>}



      </div>

      {noteableUser == null && <Land />}
      <div className="center">
      <form className='newNoteForm'>
        <input
          type="text"
          placeholder="Title"
          onChange={handleChangeTitle}
          name="firstName"
          value={newFormData.title}
          className='contentInputField'
        />
        <input
          type="text"
          placeholder="Content"
          onChange={handleChangeContent}
          name="firstName"
          value={newFormData.Content}
          className='titleInputField'
        />

      </form>
      </div>
      <div className="center">
        <div className="allnoteCardCont">
          <Notecard title="Helo" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta eius corrupti illum maiores labore perspiciatis ipsum accusantium minus blanditiis cumque dolorum dignissimos quaerat voluptates molestiae, explicabo in, laboriosam exercitationem cum." />
          <Notecard title="Helo" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta eius corrupti illum maiores labore perspiciatis ipsum accusantium minus blanditiis cumque dolorum dignissimos quaerat voluptates molestiae, explicabo in, laboriosam exercitationem cum." />
        </div>

      </div>


    </>
  );
}
export default App;
