import { IonContent, IonTabBar, IonButton, IonTabButton, IonList, IonIcon, IonSegmentView, IonSegmentContent, IonSegmentButton, IonSegment, IonLabel, IonItem, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { AdvancedMarker, APIProvider, Map, Marker, Pin, useMap } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import Heatmap from "../components/heatmap";
import { Storage } from "@capacitor/storage";
import { listOutline, mapOutline, settingsOutline } from "ionicons/icons";
const getMagnitudeColor = (magnitude) => {
  if (magnitude < 2) {
    return "bg-green-300 opacity-30 border-green-500";
  } else if (magnitude < 3) {
    return "bg-green-300 opacity-60 border-green-500";
  } else if (magnitude < 4) {
    return "bg-yellow-300 opacity-40 border-yellow-500";
  } else if (magnitude < 5) {
    return "bg-yellow-300 opacity-60 border-yellow-500";
  } else if (magnitude < 6) {
    return "bg-red-300 opacity-40 border-red-500";
  } else if (magnitude < 7) {
    return "bg-red-300 opacity-60 border-red-500";
  } else {
    return "bg-red-300 opacity-80 border-red-500";
  }
};
const getMagnitudeColorList = (magnitude) => {
  if (magnitude < 2) {
    return "text-green-300";
  } else if (magnitude < 3) {
    return "text-green-400";
  } else if (magnitude < 4) {
    return "text-yellow-300";
  } else if (magnitude < 5) {
    return "text-yellow-400";
  } else if (magnitude < 6) {
    return "text-red-300";
  } else if (magnitude < 7) {
    return "text-red-400";
  } else {
    return "text-red-600";
  }
};

const MapContent = ({ earthquakes, selected }) => {
  const map = useMap();
  useEffect(() => {
    if (map && selected) {
      map.panTo({ lat: selected.geometry.coordinates[1], lng: selected.geometry.coordinates[0] });
      map.setZoom(8);
    }
  }, [map, selected]);
  return (
    <>
      {earthquakes.map((quake, index) => {
        const lat = quake.geometry.coordinates[1];
        const lng = quake.geometry.coordinates[0];
        return (
          <AdvancedMarker key={index} position={{ lat: lat, lng: lng }} title={`Magnitude: ${quake.properties.mag}`}>
            <div className={`w-8 h-8 border-2 rounded-full transform ${getMagnitudeColor(quake.properties.mag)}`}></div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};
const EarthquakeMap = ({ earthquakes, selected }) => {
  return (
    <APIProvider apiKey={process.env.MAPS_KEY}>
      <Map mapId={"4a1bc3baa8a6252e"} id={"main"} defaultCenter={{ lat: 52.1, lng: 17.1 }} defaultZoom={4}>
        <MapContent earthquakes={earthquakes} selected={selected} />
      </Map>
    </APIProvider>
  );
};
const EarthquakeHeatMap = ({ earthquakes, selected }) => {
  return (
    <APIProvider apiKey={process.env.MAPS_KEY}>
      <Map mapId={"4a1bc3baa8a6252e"} id={"main"} defaultCenter={{ lat: 52.1, lng: 17.1 }} defaultZoom={4}>
        <Heatmap geojson={earthquakes} radius={25} opacity={0.8} />
      </Map>
    </APIProvider>
  );
};
const Tab2 = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [earthquakesFull, setEarthquakesFull] = useState([]);
  const [magnitude, setMagnitude] = useState(null);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchEarthquakes();
      console.log("Refreshing Data!");
    }, 60000);
  }, []);
  useEffect(() => {
    var key = "NotificationLevel";
    Storage.get({ key }).then(({ value }) => {
      setMagnitude(parseFloat(value));
      if (magnitude != null) fetchEarthquakes();
    });
  }, [magnitude]);
  function formatDate(todayDate) {
    var d = todayDate,
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  const fetchEarthquakes = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();
    const startTime = formatDate(startDate);
    const endTime = formatDate(endDate);
    var url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=${magnitude}`;
    const res = await fetch(url);
    const data = await res.json();
    setEarthquakes(data.features);
    setEarthquakesFull(data);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader>
          <div className="p-2">
            <IonTitle size="large">Map</IonTitle>
          </div>
        </IonHeader>
        <IonSegment value="USGS">
          <IonSegmentButton contentId="USGS" value="USGS">
            <IonLabel>USGS</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton contentId="AFAD" value="AFAD">
            <IonLabel>AFAD</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonSegmentView>
          <IonSegmentContent id="USGS">
            <div className="w-full mt-2 h-[50vh] flex flex-col">
              <p>USGS Live Update</p>
              <EarthquakeMap earthquakes={earthquakes} selected={selected} />
            </div>
            <div className="h-[50vh] overflow-y-auto">
              <IonList>
                {earthquakes.map((quake, index) => (
                  <div onClick={() => setSelected(quake)} className="flex flex-col w-full border-b-[1px]" key={index}>
                    <div className="flex justify-between">
                      <p className="text-xl">Magnitude:</p>
                      <p className={`text-xl font-bold ${getMagnitudeColorList(quake.properties.mag)}`}>{quake.properties.mag}</p>
                    </div>
                    <p className="text-gray-300 text-md">Location: {quake.properties.place}</p>
                  </div>
                ))}
              </IonList>
            </div>
          </IonSegmentContent>
          <IonSegmentContent id="AFAD">
            <div className="w-full mt-2 h-[50vh] flex flex-col">
              <p>AFAD Live Update</p>
              <EarthquakeHeatMap earthquakes={earthquakesFull} selected={selected} />
            </div>
            <div className="h-[50vh] overflow-y-auto">
              <IonList>
                {earthquakes.map((quake, index) => (
                  <div onClick={() => setSelected(quake)} className="flex flex-col w-full border-b-[1px]" key={index}>
                    <div className="flex justify-between">
                      <p className="text-xl">Magnitude:</p>
                      <p className={`text-xl font-bold ${getMagnitudeColorList(quake.properties.mag)}`}>{quake.properties.mag}</p>
                    </div>
                    <p className="text-gray-300 text-md">Location: {quake.properties.place}</p>
                  </div>
                ))}
              </IonList>
            </div>
          </IonSegmentContent>
        </IonSegmentView>
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

export default Tab2;
