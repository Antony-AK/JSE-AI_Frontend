import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../assets/Animation - 1745282599914.json';

const AnimationPlayer = () => {
  return (
    <Player
      autoplay
      loop
      src={animationData}
      style={{ height: '100px', width: '100px' }} // Adjust size
    />
  );
};

export default AnimationPlayer;
