// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

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
  production: false,
  configUrl: './assets/config.json',
  languages: ['en', 'es'],
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
    headquarters: [
      {
        country: 'Spain',
        telephone: '+(34) 871 968 181 ',
        address:
          'Edificio Europa, Local 1, bajos, 07121 (ParcBIT), Palma de Mallorca, Spain'
      }
    ],
    // linkedin: 'https://www.linkedin.com/company/smyrooms',
    logoNav: 'assets/img/xtg_two_color_logo.svg',
    logoHome: 'assets/img/xtg_logo.svg',
    logo: 'assets/img/xtg_two_color_logo.svg',
    name: 'Travelgatex'
  }
};
