import { IonContent, IonButton, IonInput, IonPage, IonLabel, IonTitle } from "@ionic/react";
import { loginUser } from "../Database";
import { useState } from "react";
import { Storage } from "@capacitor/storage";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    const saveValue = async (key, value) => {
      await Storage.set({
        key: key,
        value: value,
      });
      console.log(`${key} saved!`);
    };
    const result = await loginUser(email, password);
    if (result.status == "success") {
      saveValue("Auth", "True");
      saveValue("AuthName", result.username);
      saveValue("AuthID", result.message.user.id.slice(0, 8));
      saveValue("AuthEmail", result.message.user.email);
      window.location.reload();
    }
  }
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="justify-center items-center w-full h-full flex flex-col">
          <form className="w-3/4 items-center flex flex-col" onSubmit={(e) => handleRegister(e)}>
            <p className="text-4xl font-bold tracking-tight scale-y-150 mb-5">Sign In</p>
            <IonInput required type="email" label="Email" labelPlacement="floating" fill="outline" placeholder="Enter your email" onIonInput={(e) => setEmail(e.target.value)} />
            <IonInput required minlength={8} type="password" label="Password" labelPlacement="floating" fill="outline" placeholder="Enter your password" onIonInput={(e) => setPassword(e.target.value)} />
            <IonButton type="submit" className="btn btn-primary text-white w-full max-w-md mt-2">
              Sign In
            </IonButton>
            <div className="mt-2 max-w-md">
              <IonLabel className="">Don't have an account? </IonLabel>
              <IonLabel onClick={() => (window.location = "/register")} className="text-blue-400 hover:text-blue-600 font-semibold transition-all">
                Sign Up
              </IonLabel>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
}
export default LoginPage;
