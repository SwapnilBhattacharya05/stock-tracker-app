"use client";
import { useEffect, useRef } from "react";

const useTradingViewWidget = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600,
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // IF THERE IS NO containerRef.current
    if (!containerRef.current) return;
    // IF ALREADY LOADED ONE WIDGET, IF THAT'S THE CASE NEED TO EXIT INSTEAD OF CREATING A NEW ONE
    if (containerRef.current.dataset.loaded) return;

    containerRef.current.innerHTML = `<div class="tradingview-widget-container__widget" style="width:100%; height:${height}px;"></div>`;
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);
    containerRef.current.dataset.loaded = "true";
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        delete containerRef.current.dataset.loaded;
      }
    };
  }, [scriptUrl, config, height]);
  return containerRef;
};
export default useTradingViewWidget;
