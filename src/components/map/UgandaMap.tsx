import React, { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { v4 } from "uuid";
import "leaflet-simple-map-screenshoter";
import { geoData } from "../../utils/geodata";
import { waterAreas } from "../../utils/waterAreas";

interface UgandaMapProps {
  indicator?: string;
  timerange?: string;
  month?: string;
  zoom?: number;
  minZoom?: number;
  setDistrict?: (district: string) => void;
  getTheBounds?: string;
  district?: string;
  mapConatinerId?: string;
  imageCintainerId?: string;
  showWMS?: boolean;
  wmsLayerName?: string;
  wmsStyle?: string;
  showDistricts?: boolean;
  showWaterAreas?: boolean;
}

// Capitalize utility function
const capitalize = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const UgandaMap: React.FC<UgandaMapProps> = ({
  indicator = "CDI",
  timerange = "2024",
  month = "December",
  zoom = 7.2,
  minZoom = 7.2,
  setDistrict,
  getTheBounds = "",
  district = "",
  mapConatinerId = "uganda-map",
  imageCintainerId = "uganda-map-image",
  showWMS = false,
  wmsLayerName = "",
  wmsStyle = "",
  showDistricts = true,
  showWaterAreas = true,
}) => {
  const [Hreload, setHreload] = useState("");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const rasterLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const baseMapsRef = useRef<Record<string, L.TileLayer> | null>(null);
  const districtLayerRef = useRef<L.GeoJSON | null>(null);
  const boundaryLayer = useRef<L.GeoJSON | null>(null);
  const riverLayer = useRef<L.GeoJSON | null>(null);
  
  const geoServerUrl = import.meta.env.VITE_GEOSERVER_URL || "https://geoserver.example.com/geoserver/wms";

  // Initialize the map
  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current || !mapContainerRef.current) return;

    baseMapsRef.current = {
      OpenStreetMap: L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      ),
    };

    mapRef.current = L.map(mapContainerRef.current, {
      center: [1.3733, 32.2903],
      zoom: zoom,
      minZoom: minZoom,
      layers: [baseMapsRef.current["OpenStreetMap"]],
      attributionControl: false,
    });

    // Initialize District Layer
    if (showDistricts && geoData) {
      districtLayerRef.current = L.geoJSON(geoData as any, {
        style: {
          color: "gray",
          weight: 0.3,
          fill: false,
        },
      }).addTo(mapRef.current);

      // Function to toggle label visibility based on zoom level
      const updateLabelVisibility = () => {
        function doesNameFitInLeafletBoundary(
          geoJsonLayer: L.Layer,
          name: string,
          map: L.Map,
          options: { fontSize?: number; fontFamily?: string; padding?: number } = {}
        ) {
          const {
            fontSize = 14,
            fontFamily = "sans-serif",
            padding = 5,
          } = options;

          const layerBounds = (geoJsonLayer as L.Polygon).getBounds?.();
          if (!layerBounds) return false;

          const topLeft = map.latLngToLayerPoint(layerBounds.getNorthWest());
          const bottomRight = map.latLngToLayerPoint(layerBounds.getSouthEast());

          const availableWidth = bottomRight.x - topLeft.x;
          const availableHeight = bottomRight.y - topLeft.y;

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return false;
          ctx.font = `${fontSize}px ${fontFamily}`;

          const textWidth = ctx.measureText(name).width;
          const textHeight = fontSize;

          const paddedWidth = textWidth + padding * 2;
          const paddedHeight = textHeight + padding * 2;

          return paddedWidth <= availableWidth && paddedHeight <= availableHeight;
        }

        districtLayerRef.current?.eachLayer((layer) => {
          const polygonLayer = layer as L.Polygon;
          polygonLayer.closeTooltip?.();
          const feature = (layer as any).feature;
          const tf = doesNameFitInLeafletBoundary(
            layer,
            feature?.properties?.name,
            mapRef.current!,
            { fontSize: 14 }
          );

          if (feature?.properties?.name && tf) {
            polygonLayer
              .bindTooltip(feature.properties.name, {
                permanent: true,
                direction: "center",
                className: "district-label",
              })
              .openTooltip();
            polygonLayer.bringToFront();
          }
        });
      };

      mapRef.current.on("zoomend", updateLabelVisibility);
      updateLabelVisibility();

      // Click handler for districts
      mapRef.current.on("click", function (ev) {
        let clickedFeature: any = null;
        districtLayerRef.current?.eachLayer(function (layer) {
          const polygonLayer = layer as L.Polygon;
          if (polygonLayer.getBounds?.().contains(ev.latlng)) {
            clickedFeature = (layer as any).feature;
          }
        });

        if (clickedFeature && setDistrict) {
          setDistrict(clickedFeature.properties.name?.toUpperCase());
          const coordinates = clickedFeature;
          if (!coordinates) return;
          if (boundaryLayer.current) {
            mapRef.current?.removeLayer(boundaryLayer.current);
            boundaryLayer.current = null;
          }
          boundaryLayer.current = L.geoJSON(coordinates, {
            style: {
              color: "#308DE0",
              weight: 4,
              fill: false,
            },
          })
            .addTo(mapRef.current!)
            .bringToBack();
        }
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });

    resizeObserver.observe(mapContainerRef.current);
    
    // Add screenshoter
    try {
      (L as any).simpleMapScreenshoter().addTo(mapRef.current);
    } catch (e) {
      console.log("Screenshoter not available");
    }
    
    setHreload(v4());

    return () => {
      resizeObserver.disconnect();
    };
  }, [geoData, showDistricts, setDistrict, zoom, minZoom]);

  // Update WMS layer
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    if (showWMS && wmsLayerName) {
      if (rasterLayerRef.current) {
        mapRef.current.removeLayer(rasterLayerRef.current);
      }

      rasterLayerRef.current = L.tileLayer
        .wms(geoServerUrl, {
          layers: wmsLayerName,
          styles: wmsStyle,
          format: "image/png",
          transparent: true,
          opacity: 1.0,
        })
        .addTo(mapRef.current);
    }

    // Update boundary highlight
    if (boundaryLayer.current) {
      mapRef.current.removeLayer(boundaryLayer.current);
      boundaryLayer.current = null;
    }

    if (district && geoData) {
      const updatedFeatures = (geoData as any).features?.filter(
        (feature: any) =>
          feature?.properties?.name === capitalize(district?.toLowerCase())
      );
      if (updatedFeatures && updatedFeatures.length > 0) {
        const updatedJson = {
          ...(geoData as any),
          features: updatedFeatures,
        };
        boundaryLayer.current = L.geoJSON(updatedJson, {
          style: {
            color: "#308DE0",
            weight: 4,
            fill: false,
          },
        })
          .addTo(mapRef.current)
          .bringToBack();
      }
    }

    // Add water areas
    if (showWaterAreas && waterAreas) {
      if (riverLayer.current) {
        mapRef.current.removeLayer(riverLayer.current);
        riverLayer.current = null;
      }

      riverLayer.current = L.geoJSON(waterAreas as any, {
        style: {
          color: "#d2efff",
          weight: 0.1,
          fillColor: "#d2efff",
          fillOpacity: 1.0,
        },
        onEachFeature: function (feature, layer) {
          const waterAreaName = feature.properties?.NAME;
          if (waterAreaName) {
            layer.bindTooltip(waterAreaName, {
              permanent: true,
              direction: "center",
              className: "waterAreas-label",
            });
            (layer as L.Polygon).bringToFront?.();
          }
        },
      }).addTo(mapRef.current);
      riverLayer.current.bringToBack();
    }
  }, [timerange, month, indicator, Hreload, district, geoData, showWMS, wmsLayerName, wmsStyle, showWaterAreas, geoServerUrl]);

  // Handle getTheBounds for zooming to specific district
  useEffect(() => {
    if (!geoData || !getTheBounds || !mapRef.current) return;

    if (getTheBounds.trim().toLowerCase() === "all" || getTheBounds.trim() === "") {
      if (boundaryLayer.current) {
        mapRef.current.removeLayer(boundaryLayer.current);
        boundaryLayer.current = null;
      }
      mapRef.current.setView([1.3733, 32.2903], zoom);
      mapRef.current.setMinZoom(minZoom);
      return;
    }

    const updatedFeatures = (geoData as any).features?.filter(
      (feature: any) =>
        feature?.properties?.name === capitalize(getTheBounds?.toLowerCase())
    );

    if (updatedFeatures && updatedFeatures.length > 0) {
      const updatedJson = {
        ...(geoData as any),
        features: updatedFeatures,
      };

      if (boundaryLayer.current) {
        mapRef.current.removeLayer(boundaryLayer.current);
        boundaryLayer.current = null;
      }
      
      boundaryLayer.current = L.geoJSON(updatedJson, {
        style: {
          color: "blue",
          weight: 4,
          fill: false,
        },
      }).addTo(mapRef.current);

      const bounds = boundaryLayer.current.getBounds();
      if (bounds && Object.keys(bounds).length > 0) {
        mapRef.current.fitBounds(bounds);
        mapRef.current.setMaxBounds(bounds);
      }
    }
  }, [getTheBounds, geoData, zoom, minZoom]);

  return (
    <>
      <div
        id={mapConatinerId}
        ref={mapContainerRef}
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          background: "#f0f0f0",
        }}
      />
      <div
        id={imageCintainerId}
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          background: "#f0f0f0",
          display: "none",
        }}
      />
    </>
  );
};

export default UgandaMap;
