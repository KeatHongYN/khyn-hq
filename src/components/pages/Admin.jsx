/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import MainLayout from "../layout/MainLayout";

const AdminPage = () => {
  const [coordinatesArr, setCoordinatesArr] = useState("");
  const [loading, setLoading] = useState(true);
  const parseXML = async (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const ndElements = xmlDoc.getElementsByTagName("nd");
    const refs = Array.from(ndElements).map((nd) => nd.getAttribute("ref"));
    return refs;
  };

  // Function to fetch node details (lat, lon) from OpenStreetMap
  const fetchNodeDetails = async (nodeId) => {
    try {
      const response = await fetch(
        `https://api.openstreetmap.org/api/0.6/node/${nodeId}`
      );
      const xml = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      const nodeElement = xmlDoc.getElementsByTagName("node")[0];
      const lat = parseFloat(nodeElement.getAttribute("lat"));
      const lon = parseFloat(nodeElement.getAttribute("lon"));
      return { lat, lon };
    } catch (error) {
      console.error("Error fetching node details:", error);
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);
    // Fetch the XML file from the public folder
    fetch("/test.xml")
      .then((response) => response.text())
      .then((data) => parseXML(data))
      .then(async (references) => {
        const coordinates = [];
        for (const refff of references) {
          const nodeDetails = await fetchNodeDetails(refff);
          if (nodeDetails) {
            coordinates.push([nodeDetails.lat, nodeDetails.lon]);
          }
        }
        setCoordinatesArr(JSON.stringify(coordinates));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching the XML file:", error);
        setLoading(false);
      });
  }, []);
  return (
    <MainLayout>
      <p>Coordinates</p>
      <p>{loading ? <Loader2 className=" animate-spin" /> : coordinatesArr}</p>
    </MainLayout>
  );
};

export default AdminPage;
