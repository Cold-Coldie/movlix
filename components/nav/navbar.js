import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import styles from "./navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { UserContext } from "../../context/UserContext";
import { magic } from "../../lib/magic";

const Navbar = ({ username }) => {
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);

  const [showDropdpwn, setShowDropdpwn] = useState(false);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleLogout = (e) => {
    e.preventDefault();

    // Call Magic's logout method, reset the user state, and route to the login page
    magic.user.logout().then(() => {
      setUser({ user: null });
      router.push("/login");
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <a href="/" className={styles.logoLink}>
          <div className={styles.logoWrapper}>
            <Image
              src={"/static/icons/netflix.svg"}
              alt={"Netflix logo"}
              width={128}
              height={34}
            />
          </div>
        </a>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          {/* <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li> */}
        </ul>

        <nav className={styles.navContainer}>
          <div>
            <button
              className={styles.usernameBtn}
              onClick={() => {
                setShowDropdpwn(!showDropdpwn);
              }}
            >
              <p className={styles.username}>{username}</p>

              {showDropdpwn ? (
                <Image
                  src={"/static/icons/expand_less.svg"}
                  alt={"expand icon"}
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src={"/static/icons/expand_more.svg"}
                  alt={"expand icon"}
                  width={24}
                  height={24}
                />
              )}
            </button>

            {showDropdpwn && (
              <div className={styles.navDropdown}>
                <div>
                  <Link
                    href={""}
                    onClick={handleLogout}
                    className={styles.linkName}
                  >
                    Sign out
                  </Link>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
