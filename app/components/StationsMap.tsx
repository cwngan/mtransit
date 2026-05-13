import { Dispatch, SetStateAction, useContext, useEffect, useRef } from "react";
import mapboxgl, { GeolocateControl, Map, Marker } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { Station } from "../types/data";
import CurrentTabContext from "../store/CurrentTabContext";

interface StationsMapProps {
  setLocation: Dispatch<
    SetStateAction<{ latitude: number; longitude: number } | null>
  >;
  stations: Station[];
}

export default function StationsMap({
  setLocation,
  stations,
}: StationsMapProps) {
  const currentTab = useContext(CurrentTabContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(undefined);
  const geoLocateRef = useRef<GeolocateControl>(undefined);
  const timeout = useRef<number | null>(null);
  const markers = useRef<Marker[]>([]);
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN === null ||
      containerRef.current === null
    )
      return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    geoLocateRef.current = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
    });
    mapRef.current = new Map({
      container: containerRef.current,
      center: { lng: 113.55963, lat: 22.16455 },
      zoom: 11.1,
      style: "mapbox://styles/matthewngan/ckl22d4c40lj019qooa3513mb",
      fitBoundsOptions: {
        minZoom: 16,
      },
    });
    mapRef.current.addControl(geoLocateRef.current);
    mapRef.current.on("load", () => {
      geoLocateRef.current?.trigger();
    });
    for (let i = 0; i < 5; i++) {
      markers.current.push(
        new Marker({
          draggable: false,
        }),
      );
    }
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);
  useEffect(() => {
    if (!mapRef.current || !geoLocateRef.current) return;
    geoLocateRef.current.on("geolocate", (e) => {
      mapRef.current?.jumpTo({
        center: [e.coords.longitude, e.coords.latitude],
        zoom: 16,
      });
      setLocation(e.coords);
    });
  }, [setLocation]);
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.on("moveend", () => {
      if (timeout.current !== null) window.clearTimeout(timeout.current);
      if (currentTab === 1) return;
      timeout.current = window.setTimeout(() => {
        if (!mapRef.current) return;
        const location = mapRef.current.getCenter();
        setLocation({ latitude: location.lat, longitude: location.lng });
      }, 500);
    });
  }, [setLocation, currentTab]);
  useEffect(() => {
    if (!mapRef.current) return;
    if (stations.length > markers.current.length) {
      for (let i = markers.current.length; i < stations.length; i++) {
        markers.current.push(
          new Marker({
            draggable: false,
          }),
        );
      }
    }
    if (stations.length < markers.current.length) {
      for (let i = markers.current.length; i > stations.length; i--) {
        markers.current[i - 1].remove();
        markers.current.pop();
      }
    }
    stations.forEach((station, i) => {
      if (
        !station.latitude ||
        !station.longitude ||
        !markers.current[i] ||
        !mapRef.current
      )
        return;
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        `${station.code}`,
      );
      markers.current[i]
        .setLngLat({
          lat: station.latitude,
          lng: station.longitude,
        })
        .setPopup(popup)
        .addTo(mapRef.current);
    });
  }, [stations]);
  return <div className="!h-96 w-full flex-shrink-0" ref={containerRef}></div>;
}
