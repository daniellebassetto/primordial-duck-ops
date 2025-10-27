import assets from '../assets';

const getDuckImage = (status, mutations) => {
  switch (status) {
    case 'Desperto':
      if (mutations >= 1 && mutations <= 2) {
        return mutations === 1 ? assets.images.patos.patoDesperto1 : assets.images.patos.patoDesperto2;
      } else if (mutations >= 3 && mutations <= 5) {
        return assets.images.patos.patoDesperto3Plus;
      } else if (mutations >= 6) {
        return assets.images.patos.patoDesperto6Plus;
      } else {
        return assets.images.patos.patoDesperto1;
      }

    case 'Em Transe':
      return assets.images.patos.patoEmTranse1;

    case 'Hibernacao Profunda':
    case 'Hibernação Profunda':
      return mutations % 2 === 0 ? assets.images.patos.patoHibernacao1 : assets.images.patos.patoHibernacao2;

    default:
      return assets.images.patos.patoDesperto1;
  }
};

export default getDuckImage;