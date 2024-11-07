import Cookies from "universal-cookie";

interface RegisterData {
  username: string;
  password: string;
}

interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

const cookies = new Cookies();

const TOKEN_KEY = "auth_token";
const COOKIE_OPTIONS = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: true,
  maxAge: 60 * 60 * 24 * 7,
};

export async function register(values: RegisterData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"}/api/auth/local/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: `${values.username}@example.com`,
          password: values.password,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || "Registration failed");
    }

    const data: AuthResponse = await response.json();

    // Set cookie using universal-cookie
    cookies.set(TOKEN_KEY, data.jwt, COOKIE_OPTIONS);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
