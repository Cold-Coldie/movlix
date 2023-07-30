import React from "react";
import Card from "./card";
import styles from "./section-cards.module.css";
import Link from "next/link";

const SectionCards = ({ title, videos = [], size }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.cardWrapper}>
        {videos.map((item, index) => (
          <Link href={`/video/${item.id}`} key={index}>
            <Card
              imageUrl={item.imageUrl}
              size={size}
              index={index}
              key={index}
            />{" "}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
