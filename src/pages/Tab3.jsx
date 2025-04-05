import { IonContent, IonAlert, IonSelect, IonSelectOption, IonTabBar, IonButton, IonTabButton, IonList, IonIcon, IonLabel, IonItem, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { listOutline, mapOutline, settingsOutline, shareSocialOutline, paperPlaneOutline, chatboxEllipsesOutline, chevronForwardOutline } from "ionicons/icons";

const Tab3 = () => {
  async function changeSetting(key, value) {
    await Storage.set({ key: key, value: value });
    console.log(`Set ${key} value to ${value}`);
  }
  return (
    <IonPage>
      <IonAlert
        header="Sign Out?"
        trigger="SignOutAlertTrigger"
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Ok",
            role: "confirm",
            handler: () => {
              Storage.remove({ key: "Auth" });
              Storage.remove({ key: "AuthID" });
              Storage.remove({ key: "AuthName" });
              Storage.remove({ key: "AuthEmail" });
              window.location.reload();
            },
          },
        ]}
      />
      <IonContent fullscreen>
        <IonHeader>
          <div className="p-2">
            <IonTitle size="large">Settings</IonTitle>
          </div>
        </IonHeader>
        <div className="w-full flex flex-col">
          <div className="mt-2">
            <IonItem>
              <IonSelect onIonChange={(e) => changeSetting("NotificationLevel", e.detail.value)} label="Magnitude Filter" placeholder="">
                <IonSelectOption value="1.5">1.5 and above</IonSelectOption>
                <IonSelectOption value="2.5">2.5 and above</IonSelectOption>
                <IonSelectOption value="3.5">3.5 and above</IonSelectOption>
                <IonSelectOption value="4.5">4.5 and above</IonSelectOption>
                <IonSelectOption value="5.5">5.5 and above</IonSelectOption>
                <IonSelectOption value="6.5">6.5 and above</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>
          <div>
            <IonList>
              <IonItem>
                <IonIcon aria-hidden="true" icon={shareSocialOutline} />
                <IonLabel className="pl-2">Share the app</IonLabel>
                <IonIcon aria-hidden="true" icon={chevronForwardOutline} />
              </IonItem>
              <IonItem>
                <IonIcon aria-hidden="true" icon={paperPlaneOutline} />
                <IonLabel className="pl-2">Share the app</IonLabel>
                <IonIcon aria-hidden="true" icon={chevronForwardOutline} />
              </IonItem>
              <IonItem>
                <IonIcon aria-hidden="true" icon={chatboxEllipsesOutline} />
                <IonLabel className="pl-2">Share the app</IonLabel>
                <IonIcon aria-hidden="true" icon={chevronForwardOutline} />
              </IonItem>
            </IonList>
          </div>
          <IonButton id="SignOutAlertTrigger" className="text-white mt-2 font-semibold" color="danger">
            Sign Out
          </IonButton>
        </div>
      </IonContent>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab2" href="/tab2">
          <IonIcon aria-hidden="true" icon={mapOutline} />
          <IonLabel>Map</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tab3">
          <IonIcon aria-hidden="true" icon={settingsOutline} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  );
};

export default Tab3;
