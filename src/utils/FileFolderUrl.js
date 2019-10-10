const USER_AGENT = 'Takos/0.1.0';

const SPLATOON2_INK = '/splatoon2inkApi';
const SPLATOON2_INK_SCHEDULES = '/data/schedules.json';

const SPLATNET = '/splatnetApi';
const SPLATNET_RESULTS = '/api/results';
const SPLATNET_RESULT = '/api/results/{0}';
const SPLATNET_SHARE_RESULT = '/api/share/results/{0}';
const SPLATNET_NICKNAME_AND_ICON = '/api/nickname_and_icon?id={0}';

const NINTENDO_ACCOUNTS_AUTHORIZE =
  'https://accounts.nintendo.com/connect/1.0.0/authorize?state={0}&redirect_uri=npf71b963c1b7b6d119%3A%2F%2Fauth&client_id=71b963c1b7b6d119&scope=openid+user+user.birthday+user.mii+user.screenName&response_type=session_token_code&session_token_code_challenge={1}&session_token_code_challenge_method=S256&theme=login_form';

const NINTENDO_ACCOUNTS = '/nintendoAccountsApi';
const NINTENDO_ACCOUNTS_SESSION_TOKEN = '/connect/1.0.0/api/session_token';
const NINTENDO_ACCOUNTS_TOKEN = '/connect/1.0.0/api/token';

const NINTENDO_ACCOUNTS_API = '/nintendoAccountsApiApi';
const NINTENDO_ACCOUNTS_API_USER_INFO = '/2.0.0/users/me';

const ELI_FESSLER = '/eliFesslerApi';
const ELI_FESSLER_GEN2 = '/s2s/api/gen2';

const FLAPG = '/flapgApi';
const FLAPG_LOGIN = '/ika2/api/login';

const NINTENDO_SERVICE = '/nintendoServiceApi';
const NINTENDO_SERVICE_LOGIN = '/v1/Account/Login';
const NINTENDO_SERVICE_WEB_SERVICE_TOKEN = '/v2/Game/GetWebServiceToken';

class FileFolderUrl {
  static get USER_AGENT() {
    return USER_AGENT;
  }

  static get SPLATOON2_INK() {
    return SPLATOON2_INK;
  }
  static get SPLATOON2_INK_SCHEDULES() {
    return SPLATOON2_INK + SPLATOON2_INK_SCHEDULES;
  }

  static get SPLATNET() {
    return SPLATNET;
  }
  static get SPLATNET_RESULTS() {
    return SPLATNET + SPLATNET_RESULTS;
  }
  static get SPLATNET_RESULT() {
    return SPLATNET + SPLATNET_RESULT;
  }
  static get SPLATNET_SHARE_RESULT() {
    return SPLATNET + SPLATNET_SHARE_RESULT;
  }
  static get SPLATNET_NICKNAME_AND_ICON() {
    return SPLATNET + SPLATNET_NICKNAME_AND_ICON;
  }

  static get NINTENDO_ACCOUNTS_AUTHORIZE() {
    return NINTENDO_ACCOUNTS_AUTHORIZE;
  }

  static get NINTENDO_ACCOUNTS() {
    return NINTENDO_ACCOUNTS;
  }
  static get NINTENDO_ACCOUNTS_SESSION_TOKEN() {
    return NINTENDO_ACCOUNTS + NINTENDO_ACCOUNTS_SESSION_TOKEN;
  }
  static get NINTENDO_ACCOUNTS_TOKEN() {
    return NINTENDO_ACCOUNTS + NINTENDO_ACCOUNTS_TOKEN;
  }

  static get NINTENDO_ACCOUNTS_API() {
    return NINTENDO_ACCOUNTS_API;
  }
  static get NINTENDO_ACCOUNTS_API_USER_INFO() {
    return NINTENDO_ACCOUNTS_API + NINTENDO_ACCOUNTS_API_USER_INFO;
  }

  static get ELI_FESSLER() {
    return ELI_FESSLER;
  }
  static get ELI_FESSLER_GEN2() {
    return ELI_FESSLER + ELI_FESSLER_GEN2;
  }

  static get FLAPG() {
    return FLAPG;
  }
  static get FLAPG_LOGIN() {
    return FLAPG + FLAPG_LOGIN;
  }

  static get NINTENDO_SERVICE() {
    return NINTENDO_SERVICE;
  }
  static get NINTENDO_SERVICE_LOGIN() {
    return NINTENDO_SERVICE + NINTENDO_SERVICE_LOGIN;
  }
  static get NINTENDO_SERVICE_WEB_SERVICE_TOKEN() {
    return NINTENDO_SERVICE + NINTENDO_SERVICE_WEB_SERVICE_TOKEN;
  }
}

export default FileFolderUrl;
