export const auth0Config = {
  domain: 'xtg.eu.auth0.com',
  clientId: 'f8mTlypd0j0tfBsKTu1ppxvC6Mk2DTnX',
  options: {
    auth:  {
      redirectUrl: location.origin + '/home',
      responseType: 'token id_token',
      params: {
        scope: 'openid profile email picture name',
      },
      leeway: 30,
    },
    languageDictionary: {
      title: ''
    },
    theme: {
      logo: 'assets/img/xtg_two_color_logo.svg'
    }
  }
};

export const environment = {
  production: true,
  languages: ['en', 'es'],
  // function: 'http://localhost:5000/smyrooms-b2b-dev/us-central1/',
  function: 'https://us-central1-smyrooms-b2b-dev.cloudfunctions.net/',
  googleMapsKey: 'AIzaSyDnnHGVUJJCRIzFTmRwdASd60QnQi2L7LY',
  organization: {
    code: 'tgx',
    assetsPath: 'assets/img/travelgatex/',
    defaultMarket: {
      isoCode: 'es',
      name: 'Spain'
    },
    email: 'info@xmltravelgate.com',
    dateFormat: 'YYYY/MM/DD',
    headquarters: [{
      country: 'Spain',
      telephone: '+(34) 871 968 181 ',
      address: 'Edificio Europa, Local 1, bajos, 07121 (ParcBIT), Palma de Mallorca, Spain'
    }],
    // linkedin: 'https://www.linkedin.com/company/smyrooms',
    logoNav: 'assets/img/xtg_two_color_logo.svg',
    logoHome: 'assets/img/xtg_logo.svg',
    logo: 'assets/img/xtg_two_color_logo.svg',
    name: 'Travelgatex',
  }
};
