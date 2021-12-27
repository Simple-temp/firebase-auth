import React, { useState } from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider , getAuth , signInWithPopup , signOut , createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile ,FacebookAuthProvider } from "firebase/auth";
import  firebaseConfig  from "./firebaseConfig";


initializeApp( firebaseConfig );

function App() {

  const [newuser, setNewuser] = useState(false);

  const [user, setUser] = useState({

    isIt : false,
    name : '',
    email : '',
    photo : '',
    password : '',
    error : '',
    success : ''
  })

  const provider = new GoogleAuthProvider();
  const FbProvider = new FacebookAuthProvider();

  const click = () =>
  {
    const auth = getAuth();
  signInWithPopup(auth, provider)
  .then((result) => {

    const {displayName,photoURL,email} = result.user;
    const signIn = {
      isIt : true,
      name : displayName,
      email : email,
      photo : photoURL
    }
    setUser(signIn);
  })
  }

  const clickOut = () =>
  {
    const auth = getAuth();
    signOut(auth)
    .then(() => {
      const SignOut = {
        isIt : false,
        name : '',
        email : '',
        photo : ''
      }
      setUser(SignOut);
    })
  }

  const fbAuth = () =>
  {
    const auth = getAuth();
signInWithPopup(auth, FbProvider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
  }

  const haldleSubmit = (e) =>
  {
    if (newuser && user.email && user.password)
    {
      const auth = getAuth();
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((createuser) => {
        const userInfo = {...user}
        userInfo.error = '';
        userInfo.success = true;
        setUser(userInfo);
        update(user.name)
      })
      .catch(error => {
        const userInfo = {...user}
        userInfo.error = error.message;
        userInfo.success = false ;
        setUser(userInfo)
      });
  }

    const auth = getAuth();
  signInWithEmailAndPassword(auth, user.email, user.password)
  .then((createuser) => {
    const userInfo = {...user}
    userInfo.error = '';
    userInfo.success = true;
    setUser(userInfo)
  })
  .catch((error) => {
    const userInfo = {...user}
    userInfo.error = error.message;
    userInfo.success = false ;
    setUser(userInfo)
  });

    e.preventDefault();
  }
  const haldleBlur = (e) =>
  {
    let isvalid = true;
    if( e.target.name === "email")
    {
      isvalid = /\S+@\S+.\S+/.test(e.target.value);
    }
    if( e.target.name === "password")
    {
      /*password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters */
      const passLength = e.target.value.length > 8 ;
      const validPass = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-])(?=.*?[0-9])/.test(e.target.value);
      isvalid = passLength && validPass;
    }
    if(isvalid)
    {
      const copyInfo = {...user}
      copyInfo [e.target.name] = e.target.value;
      setUser(copyInfo)
    }
  }

  const update = name =>
  {
    const auth = getAuth();
  updateProfile(auth.currentUser, {
    displayName: name
  }).then(() => {
    console.log("User name update successfully");
  }).catch((error) => {
    console.log(error);
  });
  }


  return (
    <div className="App">
        {user.isIt ? <button onClick={clickOut} >Sign out</button> :
        <button onClick={click} >Sign in</button>
        }
        <button onClick={fbAuth} >Sign in with facebook</button>
        {
          user.isIt && <div>

          <p>Welcome , {user.name}</p>

          <p>Email : {user.email}</p>

          <img src={user.photo} alt="" />

          </div>
        }

        <h1>Own Authentication</h1>

        <input type="checkbox" onChange={()=>setNewuser(!newuser)} name="newuser" id="" />
        <label htmlFor="newuser">Sign up </label>

        <form onSubmit={haldleSubmit} >
          { newuser && <input type="text" name="name" onChange={haldleBlur} placeholder='Name' />}
          <br/>
          <input type="text" name="email" onChange={haldleBlur} placeholder='Email' required />
          <br/>
          <p>password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters</p>
          <input type="password" name="password" onChange={haldleBlur} id="" placeholder='Password' required />
          <br/>
          <input type="submit" value={newuser ? "sign up" : "sign in"} />
        </form>
        {
          user.error &&  <p>This account has been already taken</p>
        }
        {
          user.success &&  <p>User { newuser ? "Created" : "Logged In"} SuccessFully</p>
        }
    </div>
  );
}

export default App;
