const API_URL = "http://localhost:8080/v1";

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
  async register(
    name,
    lastName,
    dateOfBirth,
    email,
    password,
    profileImageUrl
  ) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          lastName,
          dateOfBirth,
          email,
          password,
          profileImageUrl,
        }),
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
      console.error("Detailed error in register: ", error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
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

  async logout() {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(
          "Error while trying to log out: " +
            response.status +
            "\nMessage: " +
            response.text
        );
      }

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Detailed error in login: ", error);
      throw error;
    }
  },

  async generateText(prompt) {
    try {
      const response = await fetch(`${API_URL}/api/gemini`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt }),
      });
      const data = await handleResponse(response);

      if (data) {
        return data;
      } else {
        throw new Error("Error while generating a prompt.");
      }
    } catch (error) {
      console.error(
        "Detailed error while trying to generate a prompt: ",
        error
      );
      throw error;
    }
  },

  async getConversationByUserId() {
    try {
      const response = await fetch(`${API_URL}/lucai`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await handleResponse(response);

      if (data) {
        return data;
      } else {
        throw new Error("Error while get conversation history.");
      }
    } catch (error) {
      console.error(
        "Detailed error while trying to get conversation history: ",
        error
      );
    }
  },

  async isAuthenticated() {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
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
