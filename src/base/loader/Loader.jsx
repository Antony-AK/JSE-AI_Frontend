import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../../assets/Animation - 1745282599914.json';
import style from './Loader.module.css';

function Loader() {
    return (
        <div className={style.loaderOverlay}>
            <div className={style.loaderContainer}>
                <Player
                    autoplay
                    loop
                    src={animationData}
                    style={{ height: '150px', width: '150px' }} // Adjust size
                />     
            </div>
        </div>
    );
}

export default Loader;
