export const auth0Config = {
  domain: 'xtg.eu.auth0.com',
  clientId: 'f8mTlypd0j0tfBsKTu1ppxvC6Mk2DTnX',
  options: {
    auth: {
      redirectUrl: location.origin + '/home',
      responseType: 'token id_token',
      params: {
        scope: 'openid profile email picture name'
      },
      leeway: 30
    },
    languageDictionary: {
      title: ''
    },
    theme: {
      logo: 'assets/img/xtg_two_color_logo.svg'
    },
    autoclose: true
  }
};

export const environment = {
  production: true,
  configUrl: './assets/config.json',
  languages: ['en', 'es'],
  organization: {
    code: 'tgx',
    assetsPath: 'assets/img/traveltino/',
    defaultMarket: {
      isoCode: 'es',
      name: 'Spain'
    },
    email: 'sales@traveltino.com',
    dateFormat: 'YYYY/MM/DD',
    headquarters: [
      {
        country: 'United Arab Emirates',
        telephone: '+(971) 8000 32 00 55 ',
        address: 'Unit No. 2407, Mazaya Business Avenue BB2, Jumeirah Lakes Towers, Dubai'
      },
      {
        country: 'Spain',
        telephone: '+(34) 922 938 041 ',
        address: 'Oficina No. 20-21, Edificio Lanzateide, Vá Transversal 2, Muelle los Llanos, 28003, Santa Cruz de Tenerife'
      },
      {
        country: 'United Arab Emirates',
        telephone: '+(971) 8000 32 00 55 ',
        address: 'Oficina No. 402, Calle Paraguay 2141, 11800, Montevideo'
      }
    ],
    linkedin: 'https://www.linkedin.com/company/traveltino',
    logoNav: 'assets/img/logo_traveltino.png',
    logoHome: 'assets/img/logo_traveltino.png',
    logo: 'assets/img/logo_traveltino.png',
    name: 'Traveltino'
  }
};
