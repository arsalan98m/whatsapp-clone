import "./Login.css";
import { Button } from "@material-ui/core";
import { auth, provider } from "../../db/firebase";
import { useStateValue } from "../../GlobalState/StateProvider";
import { actionTypes } from "../../GlobalState/reducer";

function Login() {
  const [{}, dispatch] = useStateValue();

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({ type: actionTypes.SET_USER, payload: result.user });
      })
      .catch((error) => alert(error.message));
  };
  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://1.bp.blogspot.com/-zNhb4Jlgjh8/XxFkwihoQ8I/AAAAAAAACS8/tRHsoYUHMXUGbZOPMPIVw48olh6jSqEbwCPcBGAYYCw/s1600/whatsapp-logo-2.png"
          alt=""
        />

        <div className="login__text">
          <h1>Sign in to Whatsapp</h1>
        </div>

        <Button onClick={signIn}>Sign in with Google</Button>
      </div>
    </div>
  );
}

export default Login;
