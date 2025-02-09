"use client";
import { GeolocationPosition, IUserAddres } from "@/types/geoLocation";
import axios from "axios";
import { useEffect, useState } from "react";

export const getLocationByIp = async () => {
  try {
    const res = await axios.get("http://ip-api.com/json");
    if (res.status === 200) {
      return res.data as IUserAddres;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching location data:", error);
  }
};

export default function useGeoLocation() {
  const [locationData, setLocationData] = useState<IUserAddres | null>(null);

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function success(position: GeolocationPosition) {
    const { latitude, longitude } = position.coords;
    setLocationData({
      lat: latitude,
      lon: longitude,
    });
  }

  const error = async () => {
    const res = await getLocationByIp();
    if (res) {
      setLocationData(res);
    }
  };

  async function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      const res = await getLocationByIp();
      if (res) {
        setLocationData(res);
      }
    }
  }

  return {
    lat: locationData?.lat,
    lon: locationData?.lon,
  };
}
