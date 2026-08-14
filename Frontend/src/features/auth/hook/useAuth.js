import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../auth.slice";
import { getMe, login, register } from "../services/auth.api";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true));
      const data = await register({ email, password, username });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed";
      dispatch(setError(message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      dispatch(setError(message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
      return data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch user data"));
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleLogout() {
    // Clear cookies and redux state
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("token");
    dispatch(setUser(null));
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout
  };
}
