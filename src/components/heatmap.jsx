import { useEffect, useMemo } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

const Heatmap = (props) => {
  console.log(props.geojson);
  const map = useMap();
  const visualization = useMapsLibrary("visualization");

  const heatmap = useMemo(() => {
    if (!visualization) return null;

    return new google.maps.visualization.HeatmapLayer({
      radius: props.radius,
      opacity: props.opacity,
    });
  }, [visualization, props.radius, props.opacity]);

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setData(
      props.geojson.features.map((point) => {
        const [lng, lat] = point.geometry.coordinates;

        return {
          location: new google.maps.LatLng(lat, lng),
          weight: point.properties?.mag,
        };
      })
    );
  }, [heatmap, props.geojson, props.radius, props.opacity]);

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setMap(map);

    return () => {
      heatmap.setMap(null);
    };
  }, [heatmap, map]);

  return null;
};

export default Heatmap;
