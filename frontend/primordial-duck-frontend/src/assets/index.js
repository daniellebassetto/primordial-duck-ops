import logo from './images/logo.png';
import videoAlistamento from './videos/video-alistamento.mp4';
import patoPerdendo from './videos/pato-perdendo.mp4';
import patoFugindo from './videos/pato-fugindo.mp4';
import patoVencendo from './videos/pato-vencendo.mp4';
import videoDrone1 from './videos/video-drone-1.mp4';
import videoDrone2 from './videos/video-drone-2.mp4';
import patoDesperto1 from './images/patos-primordiais/pato-desperto-1.png';
import patoDesperto2 from './images/patos-primordiais/pato-desperto-2.png';
import patoDesperto3Plus from './images/patos-primordiais/pato-desperto-com-3+mutacoes.png';
import patoDesperto6Plus from './images/patos-primordiais/pato-desperto-com-6+mutacoes.png';
import patoEmTranse1 from './images/patos-primordiais/pato-em-transe-1.png';
import patoHibernacao1 from './images/patos-primordiais/pato-em-hibernacao-profunda-1.png';
import patoHibernacao2 from './images/patos-primordiais/pato-em-hibernacao-profunda-2.png';

export const assets = {
    images: {
        logo,
        patos: {
            patoDesperto1,
            patoDesperto2,
            patoDesperto3Plus,
            patoDesperto6Plus,
            patoEmTranse1,
            patoHibernacao1,
            patoHibernacao2
        }
    },
    videos: {
        videoAlistamento,
        patoPerdendo,
        patoFugindo,
        patoVencendo,
        videoDrone1,
        videoDrone2
    }
};

export default assets;
