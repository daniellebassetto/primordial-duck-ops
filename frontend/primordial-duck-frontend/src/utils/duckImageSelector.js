const getDuckImage = (status, mutations) => {
  const basePath = '/assets/images/patos-primordiais/';

  switch (status) {
    case 'Desperto':
      if (mutations >= 1 && mutations <= 2) {
        return basePath + (mutations === 1 ? 'pato-desperto-1.png' : 'pato-desperto-2.png');
      } else if (mutations >= 3 && mutations <= 5) {
        return basePath + 'pato-desperto-com-3+mutacoes.png';
      } else if (mutations >= 6) {
        return basePath + 'pato-desperto-com-6+mutacoes.png';
      } else {
        return basePath + 'pato-desperto-1.png';
      }

    case 'Em Transe':
      return basePath + 'pato-em-transe-1.png';

    case 'Hibernacao Profunda':
    case 'Hibernação Profunda':
      const hibernationImages = ['pato-em-hibernacao-profunda-1.png', 'pato-em-hibernacao-profunda-2.png'];
      return basePath + hibernationImages[mutations % 2];

    default:
      return basePath + 'pato-desperto-1.png';
  }
};

export default getDuckImage;