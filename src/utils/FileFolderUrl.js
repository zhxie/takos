const USER_AGENT = 'Takos/0.1.0';

const SPLATOON2_INK = 'https://splatoon2.ink';
const SPLATOON2_INK_PROXY = '/splatoon2inkApi';
const SPLATOON2_INK_SCHEDULES = '/data/schedules.json';
const SPLATOON2_INK_SHIFTS = '/data/coop-schedules.json';

const SPLATNET = 'https://app.splatoon2.nintendo.net';
const SPLATNET_PROXY = '/splatnetApi';
const SPLATNET_RESULTS = '/api/results';
const SPLATNET_RESULT = '/api/results/{0}';
const SPLATNET_SHARE_RESULT = '/api/share/results/{0}';
const SPLATNET_NICKNAME_AND_ICON = '/api/nickname_and_icon?id={0}';

const NINTENDO_ACCOUNTS_AUTHORIZE =
  'https://accounts.nintendo.com/connect/1.0.0/authorize?state={0}&redirect_uri=npf71b963c1b7b6d119%3A%2F%2Fauth&client_id=71b963c1b7b6d119&scope=openid+user+user.birthday+user.mii+user.screenName&response_type=session_token_code&session_token_code_challenge={1}&session_token_code_challenge_method=S256&theme=login_form';

const NINTENDO_ACCOUNTS = 'https://accounts.nintendo.com';
const NINTENDO_ACCOUNTS_PROXY = '/nintendoAccountsApi';
const NINTENDO_ACCOUNTS_SESSION_TOKEN = '/connect/1.0.0/api/session_token';
const NINTENDO_ACCOUNTS_TOKEN = '/connect/1.0.0/api/token';

const NINTENDO_ACCOUNTS_API = 'https://api.accounts.nintendo.com';
const NINTENDO_ACCOUNTS_API_PROXY = '/nintendoAccountsApiApi';
const NINTENDO_ACCOUNTS_API_USER_INFO = '/2.0.0/users/me';

const ELI_FESSLER = 'https://elifessler.com';
const ELI_FESSLER_PROXY = '/eliFesslerApi';
const ELI_FESSLER_GEN2 = '/s2s/api/gen2';

const FLAPG = 'https://flapg.com';
const FLAPG_PROXY = '/flapgApi';
const FLAPG_LOGIN = '/ika2/api/login';

const NINTENDO_SERVICE = 'https://api-lp1.znc.srv.nintendo.net';
const NINTENDO_SERVICE_PROXY = '/nintendoServiceApi';
const NINTENDO_SERVICE_LOGIN = '/v1/Account/Login';
const NINTENDO_SERVICE_WEB_SERVICE_TOKEN = '/v2/Game/GetWebServiceToken';

class FileFolderUrl {
  // Set to true to proxy through http-proxy-middleware
  static useProxy = false;

  static get USER_AGENT() {
    return USER_AGENT;
  }

  static get SPLATOON2_INK() {
    if (FileFolderUrl.useProxy) {
      return SPLATOON2_INK_PROXY;
    } else {
      return SPLATOON2_INK;
    }
  }
  static get SPLATOON2_INK_SCHEDULES() {
    return FileFolderUrl.SPLATOON2_INK + SPLATOON2_INK_SCHEDULES;
  }
  static get SPLATOON2_INK_SHIFTS() {
    return FileFolderUrl.SPLATOON2_INK + SPLATOON2_INK_SHIFTS;
  }

  static get SPLATNET() {
    if (FileFolderUrl.useProxy) {
      return SPLATNET_PROXY;
    } else {
      return SPLATNET;
    }
  }
  static get SPLATNET_RESULTS() {
    return FileFolderUrl.SPLATNET + SPLATNET_RESULTS;
  }
  static get SPLATNET_RESULT() {
    return FileFolderUrl.SPLATNET + SPLATNET_RESULT;
  }
  static get SPLATNET_SHARE_RESULT() {
    return FileFolderUrl.SPLATNET + SPLATNET_SHARE_RESULT;
  }
  static get SPLATNET_NICKNAME_AND_ICON() {
    return FileFolderUrl.SPLATNET + SPLATNET_NICKNAME_AND_ICON;
  }

  static get NINTENDO_ACCOUNTS_AUTHORIZE() {
    return NINTENDO_ACCOUNTS_AUTHORIZE;
  }

  static get NINTENDO_ACCOUNTS() {
    if (FileFolderUrl.useProxy) {
      return NINTENDO_ACCOUNTS_PROXY;
    } else {
      return NINTENDO_ACCOUNTS;
    }
  }
  static get NINTENDO_ACCOUNTS_SESSION_TOKEN() {
    return FileFolderUrl.NINTENDO_ACCOUNTS + NINTENDO_ACCOUNTS_SESSION_TOKEN;
  }
  static get NINTENDO_ACCOUNTS_TOKEN() {
    return FileFolderUrl.NINTENDO_ACCOUNTS + NINTENDO_ACCOUNTS_TOKEN;
  }

  static get NINTENDO_ACCOUNTS_API() {
    if (FileFolderUrl.useProxy) {
      return NINTENDO_ACCOUNTS_API_PROXY;
    } else {
      return NINTENDO_ACCOUNTS_API;
    }
  }
  static get NINTENDO_ACCOUNTS_API_USER_INFO() {
    return FileFolderUrl.NINTENDO_ACCOUNTS_API + NINTENDO_ACCOUNTS_API_USER_INFO;
  }

  static get ELI_FESSLER() {
    if (FileFolderUrl.useProxy) {
      return ELI_FESSLER_PROXY;
    } else {
      return ELI_FESSLER;
    }
  }
  static get ELI_FESSLER_GEN2() {
    return FileFolderUrl.ELI_FESSLER + ELI_FESSLER_GEN2;
  }

  static get FLAPG() {
    if (FileFolderUrl.useProxy) {
      return FLAPG_PROXY;
    } else {
      return FLAPG;
    }
  }
  static get FLAPG_LOGIN() {
    return FileFolderUrl.FLAPG + FLAPG_LOGIN;
  }

  static get NINTENDO_SERVICE() {
    if (FileFolderUrl.useProxy) {
      return NINTENDO_SERVICE_PROXY;
    } else {
      return NINTENDO_SERVICE;
    }
  }
  static get NINTENDO_SERVICE_LOGIN() {
    return FileFolderUrl.NINTENDO_SERVICE + NINTENDO_SERVICE_LOGIN;
  }
  static get NINTENDO_SERVICE_WEB_SERVICE_TOKEN() {
    return FileFolderUrl.NINTENDO_SERVICE + NINTENDO_SERVICE_WEB_SERVICE_TOKEN;
  }
}

export default FileFolderUrl;
