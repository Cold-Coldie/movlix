import Head from "next/head";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Login.module.css";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";
import { magic } from "@/lib/magic";
import Link from "next/link";

const Login = () => {
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleOnChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
    setUserMsg("");
  };

  useEffect(() => {
    // Check for an issuer on our user object. If it exists, route them to the dashboard.
    user?.issuer && router.push("/");
  }, [user]);

  const handleLoginWithEmail = async (e) => {
    if (email) {
      // if (email === "erioluwa@netflix.com") {
      //   console.log("Route to dashboard");
      //   router.push("/");
      // } else {
      //   setUserMsg("Something went wrong loggin in.");
      // }

      try {
        setIsLoading(true);

        const didToken = await magic.auth.loginWithMagicLink({
          email,
        });

        // Send this token to our validation endpoint
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${didToken}`,
          },
        });

        // If successful, update our user state with their metadata and route to the dashboard
        if (res.ok) {
          const userMetadata = await magic.user.getMetadata();
          setUser(userMetadata);
          router.push("/");
        }
      } catch (error) {
        setIsLoading(false);

        console.error("Something went wrong loggin in", error);
      }
    } else {
      setIsLoading(false);

      setUserMsg("Enter a valid email address");
    }
  };

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      handleLoginWithEmail();
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src={"/static/icons/netflix.svg"}
                alt={"Netflix logo"}
                width={128}
                height={34}
              />
            </div>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="email"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
            onKeyDown={handlePressEnter}
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>{" "}
        </div>
      </main>
    </div>
  );
};

export default Login;
