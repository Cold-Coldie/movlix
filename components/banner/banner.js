import Image from "next/image";
import React from "react";
import styles from "./banner.module.css";
import { useRouter } from "next/router";

const banner = ({ title, subTitle, imageUrl, videoId }) => {
  const router = useRouter();

  const handlePlayVideo = () => {
    router.push(`/video/${videoId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          <div className={styles.nseriesWrapper}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.series}>S E R I E S</p>
          </div>

          <h3 className={styles.title}> {title} </h3>
          <h3 className={styles.subTitle}> {subTitle}</h3>

          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWithIcon} onClick={handlePlayVideo}>
              <Image
                src={"/static/icons/play_arrow_black_24dp.svg"}
                alt={"Play icon"}
                width={"32"}
                height={"32"}
              />
              <span className={styles.playText}> Play</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imageUrl})`,
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
        }}
      ></div>
    </div>
  );
};

export default banner;