const API_URL = "http://localhost:8080";

const getAuthHeaders = (isJson = true, useGoogle = false) => {
  const token = useGoogle
    ? localStorage.getItem("google_access_token")
    : localStorage.getItem("auth_token");

  const headers = {};

  if (token && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const handleResponse = async (response) => {
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "Unknown error" };
  }

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;

    if (data && typeof data === "object") {
      errorMessage =
        data.message ||
        data.error ||
        data.msg ||
        data.details ||
        JSON.stringify(data);
    } else if (typeof data === "string") {
      errorMessage = data;
    }

    switch (response.status) {
      case 400:
        errorMessage =
          data.message ||
          "Invalid data. Please verify the fields and try again.";
        break;
      case 401:
        errorMessage = "Email or password is incorrect.";
        break;
      case 403:
        errorMessage = "Access denied.";
        break;
      case 404:
        errorMessage = "Service not found.";
        break;
      case 422:
        errorMessage =
          data.message || "Invalid data. Please verify the fields.";
        break;
      case 429:
        errorMessage = "Too many attempts. Please try again in a few minutes.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      case 503:
        errorMessage = "Service temporarily unavailable.";
        break;
      default:
        if (data.message) {
          errorMessage = data.message;
        }
    }

    console.error("API Error:", {
      status: response.status,
      statusText: response.statusText,
      data: data,
      url: response.url,
    });

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

const api = {
  async isAuthenticated() {
    const token = localStorage.getItem("auth_token");
    return !!(token && token !== "null");
  },

  async register(customerData) {
    try {
      const response = await fetch(`${API_URL}/auth/v1/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      const data = await handleResponse(response);

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        return data;
      } else {
        throw new Error(data.message || "Token not received on register.");
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await handleResponse(response);

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        return data;
      } else {
        throw new Error(data.message || "Token not received on login.");
      }
    } catch (error) {
      console.error("Detailed login error:", error);
      throw error;
    }
  },

  async logout() {
    const token = localStorage.getItem("auth_token");

    try {
      if (token && token !== "null") {
        const response = await fetch(`${API_URL}/auth/v1/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.warn("Logout returned error:", response.status);
        }
      }
    } catch (err) {
      console.warn("Logout error (token may have expired):", err);
    } finally {
      localStorage.removeItem("auth_token");
      if (typeof cacheManager !== "undefined") {
        cacheManager.clear();
      }
    }
  },

  async getGoogleEvents(timeMin, timeMax) {
    const query = new URLSearchParams({ timeMin, timeMax });
    const response = await fetch(
      `${API_URL}/api/calendar/events?${query.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(true, true),
      }
    );
    return handleResponse(response);
  },

  async createGoogleEvent(event) {
    const eventWithTimezone = {
      ...event,
      start: {
        dateTime: event.start.dateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: event.end.dateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const response = await fetch(`${API_URL}/api/calendar/events`, {
      method: "POST",
      headers: getAuthHeaders(true, true),
      body: JSON.stringify(eventWithTimezone),
    });
    return handleResponse(response);
  },
  async updateGoogleEvent(eventId, event) {
    const response = await fetch(`${API_URL}/api/calendar/events/${eventId}`, {
      method: "PUT",
      headers: getAuthHeaders(true, true),
      body: JSON.stringify(event),
    });
    return handleResponse(response);
  },

  async deleteGoogleEvent(eventId) {
    const response = await fetch(`${API_URL}/api/calendar/events/${eventId}`, {
      method: "DELETE",
      headers: getAuthHeaders(false, true),
    });
    return handleResponse(response);
  },
};

export default api;
