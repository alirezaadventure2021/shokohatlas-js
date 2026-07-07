export const submenuVariants = (inDuraion, outDuration) => {
  return {
    hidden: { height: 0 },
    visible: {
      height: "auto",
      transition: {
        duration: inDuraion,
        ease: "easeInOut",
      },
    },
    exit: {
      height: 0,
      transition: {
        duration: outDuration,
        ease: "easeInOut",
      },
    },
  };
};

export const contentVariants = () => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,

      transition: { duration: 0.5 },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };
};

export const fadeIn = (direction, delay, distance) => {
  return {
    hidden: {
      x:
        direction === "left" ? distance : direction === "right" ? -distance : 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 1.2,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export const buttonVariant = () => {
  return {
    tap: {
      scale: 0.9,
      backgroundColor: "hsl(0, 0%, 100%)",
      color: "#E7842D",
      transition: { duration: 0.4 },
    },
    hover: {
      scale: 1.1,
      backgroundColor: "hsl(0, 0%, 100%)",
      color: "#E7842D",
      transition: { duration: 0.4 },
    },
  };
};
