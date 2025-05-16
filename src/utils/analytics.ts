declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

// Use environment variable for tracking ID
export const GA_TRACKING_ID = import.meta.env
  .VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID;

// Log page views
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID) {
    console.warn("Google Analytics Measurement ID is not defined");
    return;
  }
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// Log specific events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (!GA_TRACKING_ID) {
    console.warn("Google Analytics Measurement ID is not defined");
    return;
  }
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
