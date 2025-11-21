const API_URL = "http://localhost:8080/v1";
const AGENT_URL = "http://localhost:3001/v1/agent";

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

  async lucAi(prompt, onChunk) {
    try {
      const response = await fetch(`${AGENT_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();

            if (data === "[DONE]") {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Detailed error while trying to generate a prompt:", error);
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

  async getCurrentBalance() {
    try {
      const response = await fetch(`${API_URL}/balances/current`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(response);

      if (!data) {
        throw new Error(
          "Error while trying to get current balance: " +
            response.status +
            "\nMessage: " +
            response.text
        );
      }
      return data.data;
    } catch (error) {
      console.error(
        "Detailed error while trying to get current balance: ",
        error
      );
      throw error;
    }
  },
};

export default api;
