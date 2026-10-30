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
  const markersMapRef = useRef<Record<string, import("leaflet").Marker>>({});
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
        touchZoom: true,
        dragging: true,
        attributionControl: false,
      });

      // Add Zoom control at bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add subtle Leaflet attribution
      L.control.attribution({ position: "bottomleft", prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors')
        .addTo(map);

      // Authentic full-color OpenStreetMap basemap with natural water, vegetation & transit routes
      const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
      }).addTo(map);

      tileLayerRef.current = tiles;
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapReady(true);

      // Responsive resize & intersection observers to keep Leaflet coordinate-to-pixel projection exact
      const handleResize = () => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      };
      window.addEventListener("resize", handleResize);

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserver.observe(mapContainerRef.current);
      }

      let intersectionObserver: IntersectionObserver | null = null;
      if (typeof IntersectionObserver !== "undefined" && mapContainerRef.current) {
        intersectionObserver = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) {
              map.invalidateSize();
            }
          },
          { threshold: 0.05 }
        );
        intersectionObserver.observe(mapContainerRef.current);
      }

      return () => {
        window.removeEventListener("resize", handleResize);
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();
      };
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
      markersMapRef.current = {};

      // Project Center Landmark Pin (The Eastern Chambers)
      const projectIcon = L.divIcon({
        className: "map-marker-shell",
        html: `<span class="project-marker"><i>TEC</i></span>`,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      const centerMarker = L.marker([PROJECT_CENTER.lat, PROJECT_CENTER.lng], { icon: projectIcon, zIndexOffset: 1000 })
        .bindTooltip(
          `<strong>${PROJECT_NAME}</strong>`,
          { permanent: true, direction: "top", offset: [0, -22], className: "location-label project-label" }
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
        const catInfo = CATEGORIES[node.category as CategoryKey] || { color: "#2563eb", label: node.category };
        const curve = curveTo(node.lat, node.lng, index);

        // Faint baseline path
        L.polyline(curve, {
          className: "connection-base",
          color: catInfo.color,
          weight: 1.4,
          opacity: 0.25,
          interactive: false,
        }).addTo(markersGroup);

        // Pulsing glowing dashline
        const pulse = L.polyline(curve, {
          className: "connection-light",
          color: catInfo.color,
          weight: 2.2,
          opacity: 0.9,
          dashArray: "2 12",
          lineCap: "round",
          interactive: false,
        }).addTo(markersGroup);

        const pathEl = pulse.getElement();
        if (pathEl instanceof SVGElement) {
          pathEl.style.setProperty("--flow-delay", `${-index * 0.12}s`);
        }

        // Marker pin
        const nodeIcon = L.divIcon({
          className: "map-marker-shell",
          html: `<span class="place-marker" style="--marker: ${catInfo.color}"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const marker = L.marker([node.lat, node.lng], { icon: nodeIcon })
          .bindTooltip(
            `<span>${node.name}</span>`,
            {
              permanent: true,
              direction: "top",
              offset: [0, -9],
              className: "location-label",
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
          map.flyTo([node.lat, node.lng], Math.max(map.getZoom(), 14), { duration: 0.8 });
        });

        markersMapRef.current[node.id] = marker;
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

  const handleSelectPlace = (node: LocalityNode) => {
    setSelectedNode(node);
    const map = mapRef.current;
    const marker = markersMapRef.current[node.id];
    if (map) {
      map.flyTo([node.lat, node.lng], Math.max(map.getZoom(), 14), { duration: 0.8 });
    }
    if (marker) {
      marker.openPopup();
    }
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
            {NODES.length} Key Nodes Mapped
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

          {/* Category Filter Pills & Expandable Places Dropdown */}
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
              <span className="tec-pill-right">
                <span className="tec-pill-count">{NODES.length}</span>
              </span>
            </button>

            {categoryEntries.map(([key, cat]) => {
              const categoryNodes = NODES.filter((n) => n.category === key);
              const isActive = activeCategory === key;
              return (
                <div key={key} className={`tec-category-accordion ${isActive ? "is-open" : ""}`}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-expanded={isActive}
                    className={`tec-category-pill ${isActive ? "is-active" : ""}`}
                    onClick={() => {
                      if (isActive) {
                        setActiveCategory("all");
                        setSelectedNode(null);
                      } else {
                        setActiveCategory(key);
                        setSelectedNode(null);
                      }
                    }}
                  >
                    <span className="tec-pill-indicator" style={{ backgroundColor: cat.color }} />
                    <span className="tec-pill-name">{cat.label}</span>
                    <span className="tec-pill-right">
                      <span className="tec-pill-count">{categoryNodes.length}</span>
                      <svg
                        className={`tec-pill-chevron ${isActive ? "is-open" : ""}`}
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  {isActive && (
                    <div className="tec-category-dropdown" role="region" aria-label={`${cat.label} places`}>
                      {categoryNodes.map((node) => {
                        const isPlaceSelected = selectedNode?.id === node.id;
                        return (
                          <button
                            key={node.id}
                            type="button"
                            className={`tec-dropdown-place ${isPlaceSelected ? "is-selected" : ""}`}
                            onClick={() => handleSelectPlace(node)}
                          >
                            <span
                              className="tec-dropdown-place-dot"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="tec-dropdown-place-name">{node.name}</span>
                            <span className="tec-dropdown-place-meta">{node.meta}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Active Category Places Dropdown */}
          {activeCategory !== "all" && (
            <div className="tec-mobile-category-dropdown" role="region" aria-label="Category places">
              {visibleNodes.map((node) => {
                const catColor = CATEGORIES[node.category as CategoryKey]?.color || "#182d27";
                const isPlaceSelected = selectedNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    className={`tec-dropdown-place ${isPlaceSelected ? "is-selected" : ""}`}
                    onClick={() => handleSelectPlace(node)}
                  >
                    <span
                      className="tec-dropdown-place-dot"
                      style={{ backgroundColor: catColor }}
                    />
                    <span className="tec-dropdown-place-name">{node.name}</span>
                    <span className="tec-dropdown-place-meta">{node.meta}</span>
                  </button>
                );
              })}
            </div>
          )}

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
        <div className={`tec-map-canvas-container ${activeCategory === "all" ? "is-all-corridors" : "is-filtered-category"}`}>
          <div ref={mapContainerRef} className="tec-leaflet-element" />

          {/* Floating Quick Action Overlay */}
          <div className="tec-map-floating-overlay">
            <div className="tec-hud-badge">
              <span className="tec-hud-dot" />
              <span className="tec-hud-text-desktop">
                THE EASTERN CHAMBERS · {PROJECT_CENTER.lat.toFixed(4)}° N, {PROJECT_CENTER.lng.toFixed(4)}° E · LBS MARG
              </span>
              <span className="tec-hud-text-mobile">
                TEC · {PROJECT_CENTER.lat.toFixed(4)}° N, {PROJECT_CENTER.lng.toFixed(4)}° E
              </span>
            </div>
          </div>

          {/* Mobile Bottom Sheet Inspector (Smooth slide-up on marker tap) */}
          {selectedNode && (
            <div className="tec-mobile-selected-sheet" role="region" aria-label="Selected destination details">
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
              <div className="tec-mobile-sheet-content">
                <div className="tec-mobile-sheet-info">
                  <h4 className="tec-card-name">{selectedNode.name}</h4>
                  <p className="tec-card-coord">
                    Lat: {selectedNode.lat.toFixed(4)}° · Lng: {selectedNode.lng.toFixed(4)}°
                  </p>
                </div>
                <button
                  type="button"
                  className="tec-card-clear-btn"
                  onClick={handleClearSelection}
                  aria-label="Close details"
                  title="Close details"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
