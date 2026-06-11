import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { waterAreas } from "../../utils/waterAreas";
import { capitalize } from "../../utils/capitalize";
import { useAppStore } from "@/store/useAppStore";
import {
  X,
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Radio,
} from "lucide-react";
import {
  formatDate,
  getLayerGroups,
  isPointInPolygon,
  isValidGeoJSON,
} from "@/utils/woker_fn";
import { geoData } from "@/utils/geodata";
import type { LayerDef, UgandaBoundaryMapProps } from "@/types/data_types";

const FAO_BLUE = "#318DDE";
const GEO_SERVER = "https://multihazard.rosewillbome.com/geoserver/wfews/wms";
const WMS_OPTS = {
  format: "image/png" as const,
  transparent: true,
  version: "1.1.0",
  opacity: 0.85,
};

function clearLayer<T extends L.Layer>(
  map: L.Map,
  ref: React.MutableRefObject<T | null>,
) {
  if (ref.current) {
    map.removeLayer(ref.current);
    ref.current = null;
  }
}

// ── Types ──────────────────────────────────────────────────────────────────────
export type StationStatus = "online" | "maintenance" | "offline";

export interface WeatherStation {
  id: string;
  code?: string;
  name: string;
  region?: string;
  status: StationStatus;
  lat: number;
  lng: number;
  temp?: number;
  humidity?: number;
  wind?: number;
  pressure?: number;
  rain?: number;
  signal?: number;
  lastUpdate?: string;
}

export interface WeatherStationsMapProps extends Omit<
  UgandaBoundaryMapProps,
  "legendTitle" | "legendItems"
> {
  stations?: WeatherStation[];
  onStationClick?: (station: WeatherStation) => void;
}

const STATUS_COLOR: Record<StationStatus, string> = {
  online: "#22c55e",
  maintenance: "#eab308",
  offline: "#ef4444",
};
const STATUS_LABEL: Record<StationStatus, string> = {
  online: "Online",
  maintenance: "Maintenance",
  offline: "Offline",
};

// ── Marker HTML ────────────────────────────────────────────────────────────────
function makeMarkerHtml(station: WeatherStation, isDark: boolean): string {
  const c = STATUS_COLOR[station.status];
  const bg = isDark ? "rgba(8,12,24,0.88)" : "rgba(255,255,255,0.92)";
  const lb = isDark ? "rgba(8,12,24,0.82)" : "rgba(255,255,255,0.90)";
  const lc = isDark ? "rgba(255,255,255,0.90)" : "rgba(15,23,42,0.85)";
  const pulse =
    station.status === "online"
      ? `<span style="position:absolute;inset:0;border-radius:50%;background:${c};opacity:.35;animation:stationPulse 2s ease-out infinite;"></span>`
      : "";
  return `<div style="display:flex;flex-direction:column;align-items:center;width:80px;font-family:ui-sans-serif,system-ui,sans-serif;">
  <div style="position:relative;width:28px;height:28px;border-radius:50%;background:${bg};border:2.5px solid ${c};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.4);flex-shrink:0;">
    ${pulse}
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.9 4.9a10 10 0 0 1 14.14 0M7.76 7.76a6 6 0 0 1 8.49 0M10.6 10.6a2 2 0 0 1 2.83 0"/>
      <circle cx="12" cy="14" r="1" fill="${c}" stroke="none"/><line x1="12" y1="15" x2="12" y2="20"/>
    </svg>
  </div>
  <div style="margin-top:3px;background:${lb};border-radius:6px;padding:2px 4px;width:76px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;">
    <span style="font-size:9px;font-weight:700;color:${lc};">${station.name}</span>
  </div>
  <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid ${isDark ? "rgba(8,12,24,.82)" : "rgba(255,255,255,.90)"};flex-shrink:0;"></div>
</div>`;
}

function doesNameFit(map: L.Map, layer: L.GeoJSON, name: string): boolean {
  const tl = map.latLngToLayerPoint(layer.getBounds().getNorthWest());
  const br = map.latLngToLayerPoint(layer.getBounds().getSouthEast());
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = "14px sans-serif";
  return ctx.measureText(name).width + 10 <= br.x - tl.x && 24 <= br.y - tl.y;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function WeatherStationsMap({
  className = "",
  isDarkMode,
  badgeText = "Uganda",
  district,
  getTheBounds,
  zoom = 6.8,
  minZoom = 6.8,
  stations = [],
  onStationClick,
}: WeatherStationsMapProps) {
  const { currentPage, forecastStep, dateRange } = useAppStore((s) => s);
  const LAYER_GROUPS = getLayerGroups({
    today: formatDate(dateRange),
    forecastStep,
    dateRange,
  });

  // ── Refs ───────────────────────────────────────────────────────────────────
  const rootRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const districtLayerRef = useRef<L.GeoJSON | null>(null);
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);
  const riverLayerRef = useRef<L.GeoJSON | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const wmsLayersRef = useRef<Record<string, L.TileLayer.WMS>>({});
  const stationMarkersRef = useRef<L.Marker[]>([]);
  // Stable refs — so map event handlers always see latest values
  const stationsRef = useRef(stations);
  const onClickRef = useRef(onStationClick);
  useEffect(() => {
    stationsRef.current = stations;
  }, [stations]);
  useEffect(() => {
    onClickRef.current = onStationClick;
  }, [onStationClick]);

  // ── State ──────────────────────────────────────────────────────────────────
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [hoveredStation, setHoveredStation] = useState<WeatherStation | null>(
    null,
  );

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) rootRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // ── WMS layer toggle ───────────────────────────────────────────────────────
  const toggleLayer = (ld: LayerDef) => {
    const map = mapRef.current;
    if (!map) return;
    if (activeLayers.has(ld.id)) {
      const ex = wmsLayersRef.current[ld.id];
      if (ex) {
        map.removeLayer(ex);
        delete wmsLayersRef.current[ld.id];
      }
      setActiveLayers((p) => {
        const n = new Set(p);
        n.delete(ld.id);
        return n;
      });
    } else {
      const wl = L.tileLayer
        .wms(GEO_SERVER, { ...WMS_OPTS, layers: `wfews:${ld.wms}`, opacity: 1 })
        .addTo(map);
      wl.bringToFront();
      wmsLayersRef.current[ld.id] = wl;
      setActiveLayers((p) => new Set(p).add(ld.id));
    }
  };

  // ── Map init — deferred until container has real CSS dimensions ────────────
  useEffect(() => {
    if (!mapContainerRef.current || !geoData || !isValidGeoJSON(geoData))
      return;
    const container = mapContainerRef.current;
    let cleanedUp = false;

    const doInit = () => {
      if (cleanedUp || mapRef.current) return;

      tileLayerRef.current = L.tileLayer(
        isDarkMode
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, attribution: "© CartoDB" },
      );

      const map = L.map(container, {
        center: [1.3733, 32.2903],
        zoom,
        minZoom,
        layers: [tileLayerRef.current],
        zoomControl: false,
        attributionControl: false,
      });
      mapRef.current = map;

      // District boundaries
      districtLayerRef.current = L.geoJSON(geoData, {
        interactive: false,
        style: {
          color: isDarkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
          weight: 0.5,
          fill: false,
        },
      }).addTo(map);

      const updateLabels = () => {
        if (!mapRef.current || !districtLayerRef.current) return;
        districtLayerRef.current.eachLayer((l: any) => {
          l.closeTooltip();
          const name: string | undefined = l.feature?.properties?.name;
          if (!name) return;
          if (doesNameFit(mapRef.current!, l, name))
            l.bindTooltip(name, {
              permanent: true,
              direction: "center",
              className: "district-label",
            }).openTooltip();
        });
      };
      map.on("zoomend", updateLabels);
      updateLabels();

      // Water areas
      if (waterAreas) {
        riverLayerRef.current = L.geoJSON(waterAreas as any, {
          interactive: false,
          style: {
            color: "#d2efff",
            weight: 0.1,
            fillColor: "#d2efff",
            fillOpacity: 0.3,
          },
          onEachFeature(feat, l: any) {
            const n: string | undefined = feat.properties?.NAME;
            if (n)
              l.bindTooltip(n, {
                permanent: true,
                direction: "center",
                className: "waterAreas-label",
              });
          },
        }).addTo(map);
        riverLayerRef.current.bringToBack();
      }

      // ── Click: hit-test against stations by pixel distance ────────────────
      // Markers are interactive:false so we catch the click on the map itself.
      map.on("click", (ev: L.LeafletMouseEvent) => {
        const clickPt = ev.containerPoint;
        let closest: WeatherStation | null = null;
        let closestDist = 30; // px threshold
        stationsRef.current.forEach((st) => {
          if (!Number.isFinite(st.lat) || !Number.isFinite(st.lng)) return;
          const pt = map.latLngToContainerPoint([st.lat, st.lng]);
          const d = Math.hypot(clickPt.x - pt.x, clickPt.y - pt.y);
          if (d < closestDist) {
            closestDist = d;
            closest = st;
          }
        });
        if (closest) {
          console.log(
            "[MAP] station clicked:",
            (closest as WeatherStation).name,
          );
          onClickRef.current?.(closest);
        }
      });

      // ── Mousemove: district tooltip + station hover ────────────────────────
      map.on("mousemove", (ev: L.LeafletMouseEvent) => {
        setMousePos({ x: ev.containerPoint.x, y: ev.containerPoint.y });

        // District hover
        let foundDistrict: string | null = null;
        districtLayerRef.current?.eachLayer((l: any) => {
          if (foundDistrict) return;
          if (isPointInPolygon(ev.latlng, l.getLatLngs()))
            foundDistrict = l.feature?.properties?.name ?? null;
        });
        setHoveredDistrict(foundDistrict);

        // Station hover — find nearest within 30px
        const pt = ev.containerPoint;
        let nearestSt: WeatherStation | null = null;
        let nearestDist = 30;
        stationsRef.current.forEach((st) => {
          if (!Number.isFinite(st.lat) || !Number.isFinite(st.lng)) return;
          const sp = map.latLngToContainerPoint([st.lat, st.lng]);
          const d = Math.hypot(pt.x - sp.x, pt.y - sp.y);
          if (d < nearestDist) {
            nearestDist = d;
            nearestSt = st;
          }
        });
        setHoveredStation(nearestSt);
      });
      map.on("mouseout", () => {
        setHoveredDistrict(null);
        setHoveredStation(null);
      });

      map.invalidateSize();
    };

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        if (!mapRef.current) doInit();
        else mapRef.current.invalidateSize();
      }
    });
    ro.observe(container);

    const { width, height } = container.getBoundingClientRect();
    if (width > 0 && height > 0) doInit();

    return () => {
      cleanedUp = true;
      ro.disconnect();
      stationMarkersRef.current.forEach((m) => m.remove());
      stationMarkersRef.current = [];
      Object.values(wmsLayersRef.current).forEach((l) =>
        mapRef.current?.removeLayer(l),
      );
      wmsLayersRef.current = {};
      if (mapRef.current) {
        [
          districtLayerRef,
          boundaryLayerRef,
          riverLayerRef,
          tileLayerRef,
        ].forEach((r) => {
          if (r.current) {
            mapRef.current!.removeLayer(r.current);
            (r as any).current = null;
          }
        });
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [geoData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Dark/light tile swap ───────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tileLayerRef.current) return;
    map.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(
      isDarkMode
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, attribution: "© CartoDB" },
    ).addTo(map);
    tileLayerRef.current.bringToBack();
  }, [isDarkMode]);

  // ── District highlight ─────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoData || !isValidGeoJSON(geoData)) return;
    if (
      !district ||
      district.trim() === "" ||
      district.trim().toLowerCase() === "all"
    ) {
      clearLayer(map, boundaryLayerRef);
      return;
    }
    const matched = geoData.features.filter(
      (f: any) => f?.properties?.name === capitalize(district.toLowerCase()),
    );
    if (!matched.length) return;
    clearLayer(map, boundaryLayerRef);
    boundaryLayerRef.current = L.geoJSON(
      { type: "FeatureCollection", features: matched } as any,
      { style: { color: FAO_BLUE, weight: 4, fill: false } },
    )
      .addTo(map)
      .bringToBack();
  }, [district, geoData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fit bounds ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoData || !isValidGeoJSON(geoData)) return;
    if (!getTheBounds || getTheBounds.trim().length === 0) return;
    if (
      getTheBounds.trim().toLowerCase() === "all" ||
      getTheBounds.trim() === ""
    ) {
      clearLayer(map, boundaryLayerRef);
      map.setMaxBounds(
        L.latLngBounds([
          [-90, -180],
          [90, 180],
        ]),
      );
      map.setMinZoom(minZoom);
      map.setView([1.3733, 32.2903], zoom);
      return;
    }
    const matched = geoData.features.filter(
      (f: any) =>
        f?.properties?.name === capitalize(getTheBounds.toLowerCase()),
    );
    if (!matched.length) return;
    clearLayer(map, boundaryLayerRef);
    boundaryLayerRef.current = L.geoJSON(
      { ...geoData, features: matched } as any,
      { style: { color: FAO_BLUE, weight: 2, fill: false } },
    )
      .addTo(map)
      .bringToBack();
    const b = boundaryLayerRef.current.getBounds();
    if (b.isValid()) {
      map.fitBounds(b, { padding: [40, 40] });
      map.setMaxBounds(b.pad(0.3));
    }
  }, [getTheBounds, geoData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Station markers (visual only) ─────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    stationMarkersRef.current.forEach((m) => m.remove());
    stationMarkersRef.current = [];
    stations.forEach((station) => {
      if (!Number.isFinite(station.lat) || !Number.isFinite(station.lng))
        return;
      const zIndex =
        station.status === "online"
          ? 300
          : station.status === "maintenance"
            ? 200
            : 100;
      const marker = L.marker([station.lat, station.lng], {
        icon: L.divIcon({
          className: "station-marker-icon",
          html: makeMarkerHtml(station, isDarkMode),
          iconSize: [80, 53],
          iconAnchor: [40, 53],
        }),
        zIndexOffset: zIndex,
        interactive: false,
      }).addTo(map);
      stationMarkersRef.current.push(marker);
    });
    return () => {
      stationMarkersRef.current.forEach((m) => m.remove());
      stationMarkersRef.current = [];
    };
  }, [stations, isDarkMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Layer panel visibility ─────────────────────────────────────────────────
  const visibleGroups = LAYER_GROUPS.map((g) => ({
    ...g,
    layers: g.layers.filter(
      (l) =>
        !l.pages ||
        l.pages.includes("*") ||
        l.pages.some((r) => (currentPage ?? "").startsWith(r)),
    ),
  })).filter((g) => g.layers.length > 0);

  // ── Tooltip positions ──────────────────────────────────────────────────────
  const tipX = mousePos.x > 360 ? mousePos.x - 170 : mousePos.x + 14;
  const tipY = Math.max(mousePos.y - 10, 8);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={rootRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={mapContainerRef}
        className="absolute inset-0"
        style={{ background: isDarkMode ? "#0f172a" : "#f1f5f9" }}
      />

      {/* Badge */}
      <div className="absolute top-2 left-2 z-[400] pointer-events-none">
        <span
          className="rounded px-2 py-0.5 text-[10px] font-medium shadow-sm"
          style={{
            backgroundColor: isDarkMode ? `${FAO_BLUE}33` : `${FAO_BLUE}22`,
            color: FAO_BLUE,
          }}
        >
          {badgeText}
        </span>
      </div>

      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        className="absolute top-[44px] left-2 z-[400] flex items-center justify-center w-[30px] h-[30px] rounded-lg shadow-md transition-all"
        style={{
          background: isDarkMode
            ? "rgba(10,15,30,0.65)"
            : "rgba(255,255,255,0.80)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: `1px solid ${isDarkMode ? `${FAO_BLUE}55` : `${FAO_BLUE}40`}`,
        }}
      >
        {isFullscreen ? (
          <Minimize2 className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />
        ) : (
          <Maximize2 className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />
        )}
      </button>

      {/* MAP LAYERS button */}
      <button
        onClick={() => setShowLayerPanel((v) => !v)}
        className="absolute top-2 right-2 z-[400] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all"
        style={{
          backgroundColor: showLayerPanel
            ? FAO_BLUE
            : isDarkMode
              ? "#1e293b"
              : "#ffffff",
          color: showLayerPanel ? "#ffffff" : FAO_BLUE,
          border: `1px solid ${FAO_BLUE}55`,
        }}
      >
        <Layers className="w-3.5 h-3.5" /> MAP LAYERS
      </button>

      {/* Zoom */}
      <div className="absolute top-[46px] right-2 z-[400] flex flex-col gap-1">
        {(
          [
            {
              icon: Plus,
              title: "Zoom in",
              action: () => mapRef.current?.zoomIn(),
            },
            {
              icon: Minus,
              title: "Zoom out",
              action: () => mapRef.current?.zoomOut(),
            },
          ] as const
        ).map(({ icon: Icon, title, action }) => (
          <button
            key={title}
            onClick={action}
            title={title}
            className="flex items-center justify-center w-[30px] h-[30px] rounded-lg shadow-md transition-all hover:opacity-90"
            style={{
              backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
              border: `1px solid ${FAO_BLUE}55`,
            }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />
          </button>
        ))}
      </div>

      {/* Layer panel */}
      {showLayerPanel && (
        <>
          <div
            className="fixed inset-0 z-[600]"
            onClick={() => setShowLayerPanel(false)}
          />
          <div
            className={`absolute top-10 right-2 z-[700] w-64 overflow-y-auto rounded-xl shadow-xl flex flex-col ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}
            style={{ maxHeight: "90%" }}
          >
            <div
              className="flex items-center justify-between px-3 py-2.5 flex-shrink-0 border-b"
              style={{ borderColor: isDarkMode ? "#334155" : "#e2e8f0" }}
            >
              <span
                className={`text-xs font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}
              >
                MAP LAYERS
              </span>
              <button
                onClick={() => setShowLayerPanel(false)}
                className={`p-0.5 rounded transition-colors ${isDarkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 py-1">
              {visibleGroups.map((group) => (
                <div key={group.title} className="mb-1">
                  <p
                    className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-widest"
                    style={{ color: FAO_BLUE }}
                  >
                    {group.title}
                  </p>
                  {group.layers.map((ld) => {
                    const isActive = activeLayers.has(ld.id);
                    return (
                      <div
                        key={ld.id}
                        onClick={() => toggleLayer(ld)}
                        className={`flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors select-none ${isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all"
                            style={{
                              backgroundColor: isActive
                                ? FAO_BLUE
                                : "transparent",
                              borderColor: isActive
                                ? FAO_BLUE
                                : isDarkMode
                                  ? "#475569"
                                  : "#cbd5e1",
                            }}
                          >
                            {isActive && (
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                viewBox="0 0 10 10"
                                fill="none"
                              >
                                <path
                                  d="M1.5 5L4 7.5L8.5 2.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span
                            className={`text-xs ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                          >
                            {ld.label}
                          </span>
                        </div>
                        {ld.date && (
                          <span
                            className={`text-[10px] ml-2 flex-shrink-0 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                          >
                            {ld.date}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Station legend */}
      <div
        className="absolute bottom-4 left-2 z-[400] px-3 py-2.5 rounded-xl shadow-lg pointer-events-none"
        style={{
          background: isDarkMode
            ? "rgba(8,12,24,0.68)"
            : "rgba(255,255,255,0.82)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
          minWidth: 148,
        }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Radio className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: FAO_BLUE }}
          >
            Stations
          </span>
        </div>
        <div className="space-y-1">
          {(Object.entries(STATUS_COLOR) as [StationStatus, string][]).map(
            ([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span
                  className="text-[10px]"
                  style={{
                    color: isDarkMode
                      ? "rgba(255,255,255,0.70)"
                      : "rgba(15,23,42,0.70)",
                  }}
                >
                  {STATUS_LABEL[status]}
                </span>
                <span
                  className="ml-auto text-[10px] font-medium"
                  style={{ color }}
                >
                  {stations.filter((s) => s.status === status).length}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Hover tooltip — station takes priority over district */}
      {(hoveredStation || hoveredDistrict) && (
        <div
          className="absolute pointer-events-none z-[450]"
          style={{
            left: tipX,
            top: tipY,
            background: isDarkMode
              ? "rgba(8,12,24,0.92)"
              : "rgba(255,255,255,0.96)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}`,
            borderRadius: 10,
            padding: "8px 12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.30)",
            minWidth: 140,
          }}
        >
          {hoveredStation ? (
            <>
              {/* Station name + status */}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: STATUS_COLOR[hoveredStation.status],
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isDarkMode
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(15,23,42,0.90)",
                  }}
                >
                  {hoveredStation.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: STATUS_COLOR[hoveredStation.status],
                }}
              >
                {STATUS_LABEL[hoveredStation.status]}
              </span>
              {/* Readings — only when online/maintenance */}
              {hoveredStation.status !== "offline" && (
                <div
                  className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 pt-2"
                  style={{
                    borderTop: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                  }}
                >
                  {hoveredStation.temp !== undefined && (
                    <div>
                      <p
                        style={{
                          fontSize: 8,
                          color: isDarkMode
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.4)",
                        }}
                      >
                        TEMP
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isDarkMode
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(0,0,0,0.85)",
                        }}
                      >
                        {hoveredStation.temp}°C
                      </p>
                    </div>
                  )}
                  {hoveredStation.humidity !== undefined && (
                    <div>
                      <p
                        style={{
                          fontSize: 8,
                          color: isDarkMode
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.4)",
                        }}
                      >
                        HUMIDITY
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isDarkMode
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(0,0,0,0.85)",
                        }}
                      >
                        {hoveredStation.humidity}%
                      </p>
                    </div>
                  )}
                  {hoveredStation.wind !== undefined && (
                    <div>
                      <p
                        style={{
                          fontSize: 8,
                          color: isDarkMode
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.4)",
                        }}
                      >
                        WIND
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isDarkMode
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(0,0,0,0.85)",
                        }}
                      >
                        {hoveredStation.wind} km/h
                      </p>
                    </div>
                  )}
                  {hoveredStation.rain !== undefined && (
                    <div>
                      <p
                        style={{
                          fontSize: 8,
                          color: isDarkMode
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.4)",
                        }}
                      >
                        RAIN
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isDarkMode
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(0,0,0,0.85)",
                        }}
                      >
                        {hoveredStation.rain} mm
                      </p>
                    </div>
                  )}
                </div>
              )}
              {hoveredStation.lastUpdate && (
                <p
                  style={{
                    fontSize: 8,
                    color: isDarkMode
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(0,0,0,0.3)",
                    marginTop: 6,
                  }}
                >
                  Updated {hoveredStation.lastUpdate}
                </p>
              )}
            </>
          ) : (
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: "nowrap",
                color: isDarkMode
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(0,0,0,0.75)",
              }}
            >
              {hoveredDistrict}
            </p>
          )}
        </div>
      )}

      <style>{`
        .district-label {
          background: transparent !important; border: none !important; box-shadow: none !important;
          font-size: 11px; font-weight: 600; white-space: nowrap; pointer-events: none;
          color: ${isDarkMode ? "rgba(255,255,255,0.9)" : "rgba(15,23,42,0.80)"};
          text-shadow: ${isDarkMode ? "0 1px 4px rgba(0,0,0,0.9)" : "0 1px 3px rgba(255,255,255,0.9)"};
        }
        .waterAreas-label {
          background: transparent !important; border: none !important; box-shadow: none !important;
          font-size: 10px; pointer-events: none; color: ${isDarkMode ? "#93c5fd" : "#2563eb"};
        }
        .station-marker-icon {
          background: transparent !important; border: none !important; overflow: visible !important;
        }
        @keyframes stationPulse {
          0%   { transform: scale(1);   opacity: 0.35; }
          100% { transform: scale(2.5); opacity: 0;    }
        }
      `}</style>
    </div>
  );
}
