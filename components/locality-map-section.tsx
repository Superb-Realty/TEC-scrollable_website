"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import {
  NODES,
  PROJECT_CENTER,
  PROJECT_NAME,
  PROJECT_LOCATION,
  CATEGORIES,
  CategoryKey,
  LocalityNode,
} from "@/content/locality-data";

function curveTo(lat: number, lng: number, index: number): [number, number][] {
  const start = PROJECT_CENTER;
  const dx = lng - start.lng;
  const dy = lat - start.lat;
  const bend = (index % 2 === 0 ? 1 : -1) * 0.18;
  const control = {
    lat: start.lat + dy / 2 + dx * bend,
    lng: start.lng + dx / 2 - dy * bend,
  };
  return Array.from({ length: 25 }, (_, step) => {
    const t = step / 24;
    const oneMinusT = 1 - t;
    return [
      oneMinusT ** 2 * start.lat + 2 * oneMinusT * t * control.lat + t ** 2 * lat,
      oneMinusT ** 2 * start.lng + 2 * oneMinusT * t * control.lng + t ** 2 * lng,
    ];
  });
}

export function LocalityMapSection() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const tileLayerRef = useRef<import("leaflet").TileLayer | null>(null);

  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [selectedNode, setSelectedNode] = useState<LocalityNode | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [wheelZoomActive, setWheelZoomActive] = useState(false);

  const categoryEntries = useMemo(() => Object.entries(CATEGORIES) as [CategoryKey, typeof CATEGORIES[CategoryKey]][], []);

  const visibleNodes = useMemo(() => {
    if (activeCategory === "all") return NODES;
    return NODES.filter((n) => n.category === activeCategory);
  }, [activeCategory]);

  // 1. Initialize Leaflet Map (Safe dynamic import, client-only, scrollWheelZoom: false by default for silky scrollytelling)
  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [PROJECT_CENTER.lat, PROJECT_CENTER.lng],
        zoom: 12,
        minZoom: 10,
        maxZoom: 16,
        zoomControl: false,
        scrollWheelZoom: false, // Prevents scroll hijacking on the scrollytelling page!
        attributionControl: false,
      });

      // Add Zoom control at bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add subtle Leaflet attribution
      L.control.attribution({ position: "bottomleft", prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors')
        .addTo(map);

      const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tiles;
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Toggle wheel zoom safely
  const toggleWheelZoom = () => {
    if (!mapRef.current) return;
    if (wheelZoomActive) {
      mapRef.current.scrollWheelZoom.disable();
      setWheelZoomActive(false);
    } else {
      mapRef.current.scrollWheelZoom.enable();
      setWheelZoomActive(true);
    }
  };

  // 3. Render markers & curved animated pulse lines whenever active category or ready state changes
  useEffect(() => {
    if (!mapReady || !markersLayerRef.current || !mapRef.current) return;

    import("leaflet").then((L) => {
      const markersGroup = markersLayerRef.current;
      const map = mapRef.current;
      if (!markersGroup || !map) return;

      markersGroup.clearLayers();

      // Project Center Landmark Pin (The Eastern Chambers)
      const projectIcon = L.divIcon({
        className: "tec-map-marker-anchor",
        html: `
          <div class="tec-project-beacon">
            <span class="tec-beacon-pulse"></span>
            <span class="tec-beacon-core">TEC</span>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      const centerMarker = L.marker([PROJECT_CENTER.lat, PROJECT_CENTER.lng], { icon: projectIcon, zIndexOffset: 100 })
        .bindTooltip(
          `<div class="tec-center-tooltip">
            <strong>${PROJECT_NAME}</strong>
            <span>${PROJECT_LOCATION}</span>
          </div>`,
          { permanent: true, direction: "top", offset: [0, -24], className: "tec-tooltip tec-project-tooltip" }
        )
        .bindPopup(
          `<div class="tec-popup-body">
            <h3>${PROJECT_NAME}</h3>
            <p>${PROJECT_LOCATION}</p>
            <span class="tec-popup-badge">Grade A+ Corporate Hub</span>
          </div>`
        )
        .addTo(markersGroup);

      centerMarker.on("click", () => {
        setSelectedNode(null);
        map.flyTo([PROJECT_CENTER.lat, PROJECT_CENTER.lng], 13, { duration: 1 });
      });

      // Render visible connection curves & destination nodes
      visibleNodes.forEach((node, index) => {
        const catInfo = CATEGORIES[node.category as CategoryKey] || { color: "#b59a57", label: node.category };
        const curve = curveTo(node.lat, node.lng, index);

        // Faint baseline path
        L.polyline(curve, {
          className: "tec-connection-base",
          color: catInfo.color,
          weight: 1.4,
          opacity: 0.25,
          interactive: false,
        }).addTo(markersGroup);

        // Pulsing glowing dashline
        const pulse = L.polyline(curve, {
          className: "tec-connection-light",
          color: catInfo.color,
          weight: 2.2,
          opacity: 0.85,
          dashArray: "3 14",
          lineCap: "round",
          interactive: false,
        }).addTo(markersGroup);

        const pathEl = pulse.getElement();
        if (pathEl instanceof SVGElement) {
          pathEl.style.setProperty("--flow-delay", `${-index * 0.14}s`);
        }

        // Marker pin
        const nodeIcon = L.divIcon({
          className: "tec-map-marker-node",
          html: `
            <div class="tec-node-pin" style="--node-color: ${catInfo.color}">
              <span class="tec-node-dot"></span>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([node.lat, node.lng], { icon: nodeIcon })
          .bindTooltip(
            `<div class="tec-node-tooltip">
              <span class="tec-node-title">${node.name}</span>
              <span class="tec-node-meta" style="color:${catInfo.color}">${node.meta}</span>
            </div>`,
            {
              permanent: false,
              direction: "top",
              offset: [0, -12],
              className: "tec-tooltip tec-node-hover-tooltip",
            }
          )
          .bindPopup(
            `<div class="tec-popup-body">
              <span class="tec-popup-cat" style="color: ${catInfo.color}">${catInfo.label}</span>
              <h3>${node.name}</h3>
              <p>Proximity: <strong>${node.meta}</strong></p>
            </div>`
          )
          .addTo(markersGroup);

        marker.on("click", () => {
          setSelectedNode(node);
          marker.openPopup();
          map.flyTo([node.lat, node.lng], Math.max(map.getZoom(), 13.5), { duration: 0.8 });
        });
      });

      // Fit map viewport comfortably to visible nodes + center only when category/visible nodes change
      if (visibleNodes.length > 0) {
        const bounds: [number, number][] = [
          [PROJECT_CENTER.lat, PROJECT_CENTER.lng],
          ...visibleNodes.map((n) => [n.lat, n.lng] as [number, number]),
        ];
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13.5 });
      }
    });
  }, [visibleNodes, mapReady]);

  // Re-center map to The Eastern Chambers
  const resetToCenter = () => {
    if (!mapRef.current) return;
    setSelectedNode(null);
    mapRef.current.closePopup();
    mapRef.current.flyTo([PROJECT_CENTER.lat, PROJECT_CENTER.lng], 13, { duration: 1 });
  };

  const handleClearSelection = () => {
    setSelectedNode(null);
    if (mapRef.current) {
      mapRef.current.closePopup();
      if (visibleNodes.length > 0) {
        const bounds: [number, number][] = [
          [PROJECT_CENTER.lat, PROJECT_CENTER.lng],
          ...visibleNodes.map((n) => [n.lat, n.lng] as [number, number]),
        ];
        mapRef.current.fitBounds(bounds, { padding: [48, 48], maxZoom: 13.5 });
      }
    }
  };

  return (
    <section
      className="tec-locality-section"
      id="architecture"
      aria-labelledby="architecture-title"
    >
      {/* 1. Architectural Editorial Section Header */}
      <div className="tec-locality-header">
        <div className="tec-locality-badge-row">
          <span className="tec-eyebrow">03 / STRATEGIC CONNECTIVITY & HUB</span>
          <span className="tec-status-pill">
            <span className="tec-live-pulse" />
            45 Key Nodes Mapped
          </span>
        </div>

        <div className="tec-locality-title-grid">
          <h2 id="architecture-title" className="tec-locality-title">
            WHERE MUMBAI<br />
            <em>CONNECTS,</em><br />
            THE FUTURE WORKS.
          </h2>
          <div className="tec-locality-description">
            <p>
              On LBS Marg in Vikhroli West, The Eastern Chambers is positioned at a strategic intersection of Mumbai&apos;s
              eastern corridor, connecting the city&apos;s Central, Western and North-Eastern catchments.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Map Console Stage */}
      <div className="tec-map-wrapper">
        {/* Sidebar Filter Deck */}
        <aside className="tec-map-console">
          <div className="tec-console-top">
            <div className="tec-console-brand">
              <span className="tec-console-sub">LOCATION MATRIX</span>
              <h3 className="tec-console-title">{PROJECT_NAME}</h3>
              <p className="tec-console-caption">Amber Compound, LBS Marg, Vikhroli West</p>
            </div>

            <div className="tec-console-actions">
              <button
                type="button"
                className="tec-console-icon-btn"
                onClick={resetToCenter}
                title="Reset map view to The Eastern Chambers"
              >
                ⊙ Recenter View
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="tec-category-group" role="tablist" aria-label="Transit categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "all"}
              className={`tec-category-pill ${activeCategory === "all" ? "is-active" : ""}`}
              onClick={() => {
                setActiveCategory("all");
                setSelectedNode(null);
              }}
            >
              <span className="tec-pill-indicator all-pill" />
              <span className="tec-pill-name">All Corridors</span>
              <span className="tec-pill-count">{NODES.length}</span>
            </button>

            {categoryEntries.map(([key, cat]) => {
              const count = NODES.filter((n) => n.category === key).length;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`tec-category-pill ${isActive ? "is-active" : ""}`}
                  onClick={() => {
                    setActiveCategory(key);
                    setSelectedNode(null);
                  }}
                >
                  <span className="tec-pill-indicator" style={{ backgroundColor: cat.color }} />
                  <span className="tec-pill-name">{cat.label}</span>
                  <span className="tec-pill-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Node Inspector or Legend */}
          <div className="tec-console-footer">
            {selectedNode ? (
              <div className="tec-selected-card">
                <div className="tec-card-meta">
                  <span
                    className="tec-card-tag"
                    style={{
                      backgroundColor: `${CATEGORIES[selectedNode.category as CategoryKey]?.color || "#b59a57"}22`,
                      color: CATEGORIES[selectedNode.category as CategoryKey]?.color || "#b59a57",
                      borderColor: CATEGORIES[selectedNode.category as CategoryKey]?.color || "#b59a57",
                    }}
                  >
                    {CATEGORIES[selectedNode.category as CategoryKey]?.label || selectedNode.category}
                  </span>
                  <span className="tec-card-time">{selectedNode.meta}</span>
                </div>
                <h4 className="tec-card-name">{selectedNode.name}</h4>
                <p className="tec-card-coord">
                  Lat: {selectedNode.lat.toFixed(4)}° N · Lng: {selectedNode.lng.toFixed(4)}° E
                </p>
                <button
                  type="button"
                  className="tec-card-clear"
                  onClick={handleClearSelection}
                >
                  ✕ Clear selection
                </button>
              </div>
            ) : (
              <div className="tec-legend-box">
                <p className="tec-legend-tip">
                  <span className="tec-tip-icon">✦</span>
                  Click any marker or category to explore travel times and connectivity arcs.
                </p>
                <div className="tec-legend-item">
                  <span className="tec-legend-line" />
                  <span>Interactive flow arc connecting to TEC</span>
                </div>
              </div>
            )}

            {/* Scroll zoom notice */}
            <div className="tec-scroll-mode-bar">
              <span className="tec-scroll-mode-text">
                {wheelZoomActive ? "Mouse scroll: Zooming map" : "Mouse scroll: Scrolling page"}
              </span>
              <button
                type="button"
                className={`tec-scroll-mode-toggle ${wheelZoomActive ? "active" : ""}`}
                onClick={toggleWheelZoom}
                title="Toggle whether mouse scroll zooms the map or scrolls the web page"
              >
                {wheelZoomActive ? "Disable map zoom" : "Enable map zoom"}
              </button>
            </div>
          </div>
        </aside>

        {/* Map Viewport Canvas */}
        <div className="tec-map-canvas-container">
          <div ref={mapContainerRef} className="tec-leaflet-element" />

          {/* Floating Quick Action Overlay */}
          <div className="tec-map-floating-overlay">
            <div className="tec-hud-badge">
              <span className="tec-hud-dot" />
              <span>THE EASTERN CHAMBERS · 19.1096° N, 72.9258° E · LBS MARG</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
