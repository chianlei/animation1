import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { photos } from "../data/photos";
import { media } from "../data/site";
function Photo({ photo }: { photo: (typeof photos)[number] }) {
  return (
    <figure className="polaroid">
      <img
        src={media(photo.file)}
        alt={photo.title}
        loading="lazy"
        draggable="false"
      />
      <figcaption>
        <p>{photo.title}</p>
        <small>
          DATE: <span>{photo.date}</span>
        </small>
        <span className="photo-number">{photo.number}</span>
      </figcaption>
    </figure>
  );
}
export default function Gallery() {
  const [active, setActive] = useState(-1);
  const reduced = useReducedMotion();
  return (
    <section aria-label="Phil's family and cycling photos">
      <div className="gallery-desktop">
        {photos.map((photo, i) => (
          <motion.div
            className={`photo-position photo-${i}`}
            style={{
              left: `${photo.left}%`,
              top: `${photo.top}%`,
              zIndex: active === i ? 5 : 2,
            }}
            initial={{
              opacity: reduced ? 1 : 0,
              x: reduced ? 0 : 100,
              rotate: photo.rotate + (reduced ? 0 : 10),
            }}
            whileInView={{ opacity: 1, x: 0, rotate: photo.rotate }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 0.8,
              delay: i * 0.07,
              ease: [0.44, 0, 0.56, 1],
            }}
            key={photo.file}
          >
            <motion.div className="photo-drag" drag dragMomentum={false} onDragStart={() => setActive(i)}>
              <Photo photo={photo} />
            </motion.div>
          </motion.div>
        ))}
      </div>
      <div className="gallery-mobile">
        {photos.map((photo) => (
          <Photo photo={photo} key={photo.file} />
        ))}
      </div>
    </section>
  );
}
