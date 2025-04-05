import { IonContent, IonButton, IonInput, IonPage, IonLabel, IonTitle } from "@ionic/react";
import { registerUser } from "../Database";
import { useState } from "react";
import { Storage } from "@capacitor/storage";

function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    const saveValue = async (key, value) => {
      await Storage.set({
        key: key,
        value: value,
      });
      console.log(`${key} saved!`);
    };
    if (password == passwordRepeat) {
      const result = await registerUser(email, password, username);
      console.log(result);
      if (result.status == "success") {
        saveValue("Auth", "True");
        saveValue("AuthName", result.user.username);
        saveValue("AuthID", result.user.id);
        saveValue("AuthEmail", result.user.email);
        window.location.reload();
      }
    }
  }
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="justify-center items-center w-full h-full flex flex-col">
          <form className="w-3/4 items-center flex flex-col" onSubmit={(e) => handleRegister(e)}>
            <p className="text-4xl font-bold tracking-tight scale-y-150 mb-5">Sign Up</p>
            <IonInput required type="text" label="Username" labelPlacement="floating" fill="outline" placeholder="Enter your username" onIonInput={(e) => setUsername(e.target.value)} />
            <IonInput required type="email" label="Email" labelPlacement="floating" fill="outline" placeholder="Enter your email" onIonInput={(e) => setEmail(e.target.value)} />
            <IonInput required minlength={8} type="password" label="Password" labelPlacement="floating" fill="outline" placeholder="Enter your password" onIonInput={(e) => setPassword(e.target.value)} />
            <IonInput required minlength={8} type="password" label="Repeat Password" labelPlacement="floating" fill="outline" placeholder="Enter your password" onIonInput={(e) => setPasswordRepeat(e.target.value)} />
            <IonButton type="submit" className="btn btn-primary text-white w-full max-w-md mt-2">
              Sign Up
            </IonButton>
            <div className="mt-2 max-w-md">
              <IonLabel className="">Already have an account? </IonLabel>
              <IonLabel onClick={() => (window.location = "/login")} className="text-blue-400 hover:text-blue-600 font-semibold transition-all">
                Sign In
              </IonLabel>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
}
export default RegistrationPage;
