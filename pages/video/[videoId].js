import { useRouter } from "next/router";
import React from "react";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import cls from "classnames";
import { getYouTubeVideoById } from "@/lib/videos";

Modal.setAppElement("#__next");

export async function getStaticProps({ params }) {
  const video = await getYouTubeVideoById({ videoId: params.videoId });

  return {
    props: {
      video,
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const listofVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KPEHSAViio"];

  const paths = listofVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {
  const router = useRouter();

  const { title, publishTime, description, channelTitle, viewCount } = video;

  return (
    <div className={styles.container}>
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => {
          router.back();
        }}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div>
          <iframe
            id="ytplayer"
            className={styles.videoPlayer}
            type="text/html"
            width="100%"
            height="360"
            src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&origin=http://example.com&controls=0&modestbranding=1`}
            frameborder="0"
          ></iframe>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>
                {new Date(publishTime).toDateString()}
              </p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>

            <div className={styles.col2}>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>

              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View count: </span>
                <span className={styles.channelTitle}>
                  {Number(viewCount).toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
