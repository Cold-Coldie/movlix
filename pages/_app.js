import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { magic } from "@/lib/magic";
import Loader from "../components/loading/loading";
import Navbar from "../components/nav/navbar";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Create our router
  const router = useRouter();

  useEffect(() => {
    // Set loading to true to display our loading message within pages/index.js
    setUser({ loading: true });
    setIsLoading(true);
    // Check if the user is authenticated already
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        // Pull their metadata, update our state, and route to dashboard
        magic.user.getMetadata().then((userData) => setUser(userData));
        // router.push("/video/mYfJxlgR2jw");
        setIsLoading(false);
      } else {
        // If false, route them to the login page and reset the user state
        router.push("/login");
        setUser({ user: null });
      }
    });
    // Add an empty dependency array so the useEffect only runs once upon page load
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const value = { user, setUser };
  return (
    <UserContext.Provider value={value}>
      {router.pathname === "/login" ? "" : <Navbar username={user?.email} />}
      {isLoading && <Loader></Loader>}
      {!isLoading && <Component {...pageProps} />}
    </UserContext.Provider>
  );
}
