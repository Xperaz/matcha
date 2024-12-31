import { IUserAddres } from "@/types/geoLocation";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useGeoLocation() {
  const [locationData, setLocationData] = useState<IUserAddres | null>(null);

  useEffect(() => {
    getLocation();
  }, []);

  async function getLocation() {
    try {
      const res = await axios.get("http://ip-api.com/json");
      if (res.status === 200) {
        setLocationData(res.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching location data:", error);
    }
  }

  return {
    lat: locationData?.lat,
    long: locationData?.lon,
  };
}
