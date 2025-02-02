"use client";
import { GeolocationPosition, IUserAddres } from "@/types/geoLocation";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useGeoLocation() {
  const [locationData, setLocationData] = useState<IUserAddres | null>(null);

  useEffect(() => {
    getLocation();
  }, []);

  function success(position: GeolocationPosition) {
    const { latitude, longitude } = position.coords;
    setLocationData({
      lat: latitude,
      long: longitude,
    });
  }

  const error = async () => {
    getLocationByIp();
  };

  /**
   * Fetch location data by IP address, if user denies location access
   */

  const getLocationByIp = async () => {
    try {
      const res = await axios.get("http://ip-api.com/json");
      if (res.status === 200) {
        setLocationData(res.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching location data:", error);
    }
  };

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      getLocationByIp();
    }
  }

  return {
    lat: locationData?.lat,
    long: locationData?.lon,
  };
}
