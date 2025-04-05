import { Redirect, Route } from "react-router-dom";
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import { Storage } from "@capacitor/storage";
import { useState, useEffect } from "react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App = () => {
  const [authStatus, setAuthStatus] = useState(null);
  useEffect(() => {
    var key = "Auth";
    Storage.get({ key }).then(({ value }) => {
      setAuthStatus(value);
    });
  }, []);
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/register">
              {authStatus == "True" ? <Redirect to="/" /> : <RegistrationPage />}
            </Route>
            <Route exact path="/login">
              {authStatus == "True" ? <Redirect to="/" /> : <LoginPage />}
            </Route>
            <Route exact path="/tab2">
              {authStatus == "True" ? <Tab2 /> : <LoginPage />}
            </Route>
            <Route path="/tab3">{authStatus == "True" ? <Tab3 /> : <LoginPage />}</Route>
            <Route exact path="/">
              <Redirect to="/tab2" />
            </Route>
          </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
