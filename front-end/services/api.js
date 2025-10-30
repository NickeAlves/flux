const API_URL = "http://localhost:8080";

const getAuthHeaders = (isJson = true) => {
  const token = localStorage.getItem("auth_token");
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
    data = { message: text || "Unknowm error" };
  }

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;

    if (data && typeof data == "object") {
      errorMessage =
        data.message ||
        data.error ||
        data.msg ||
        data.details ||
        JSON.stringify(data);
    } else if (typeof data == "string") {
      errorMessage = data;
    }

    console.error("API error: ", {
      status: response.status,
      data: data,
      url: response.url,
    });
    throw new Error(errorMessage);
  }
  return data;
};

const api = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/v1/auth/login`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(response);

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
      } else {
        throw new Error(data.message || "Token not received.");
      }
    } catch (error) {
      console.error("Detailed error in login: ", error);
      throw error;
    }
  },

  async isAuthenticated() {
    try {
      const response = await fetch(`${API_URL}/v1/users/me`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return response.ok;
    } catch (err) {
      console.error("Error while verification:", err);
      return false;
    }
  },
};

export default api;
