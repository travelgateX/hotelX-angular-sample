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
      logo: 'assets/img/logo-traveltino.jpg'
    },
    autoclose: true
  }
};

export const environment = {
  production: false,
  configUrl: './assets/config.json',
  languages: ['en', 'es'],
  function: 'https://us-central1-smyrooms-b2b.cloudfunctions.net/',
  googleMapsKey: 'AIzaSyCk2yPzVswvnVexO5Y7Gyr5Z6kUr1s5PIg',
  organization: {
    code: 'smy',
    assetsPath: 'assets/img/smyrooms/',
    defaultMarket: {
      isoCode: 'es',
      name: 'Spain'
    },
    email: 'lidia.sancho@logitravelgroup.com',
    dateFormat: 'YYYY/MM/DD',
    linkedin: 'https://www.linkedin.com/company/traveltino',
    logoNav: 'assets/img/logo-traveltino.jpg',
    logoHome: 'assets/img/traveltino.png',
    logo: 'assets/img/logo-traveltino.jpg',
    name: 'Traveltino',
  }
};
