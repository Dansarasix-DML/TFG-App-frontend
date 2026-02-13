export function getCookies() {
    let cookies = {};
    let cookieString = document.cookie;

    cookies = cookieString.split('; ');
    let cookieObj = {};
    cookies.forEach(cookie => {
      let [name, value] = cookie.split('=');
      cookieObj[name] = decodeURIComponent(value);
    });

    return cookieObj;
}

export function getCookiesRaw() {
  return document.cookie;
}

export function getJwt() {
    let cookies = getCookies();
    return cookies.tkn ? cookies.tkn : null;
}

export function getUsrEmail() {
  let cookies = getCookies();
  return cookies.usr ? cookies.usr : null;
}

export function addCookie(name, value, expirationMin) {
  const d = new Date();
  d.setTime(d.getTime() + (expirationMin*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export async function setUserCookies(email, token) {
  addCookie('usr', btoa(email), 30);
  addCookie('tkn', token, 30);
}

export function isLoged() {
  const cookies = getCookies();

  if (!cookies.hasOwnProperty('usr') || !cookies.hasOwnProperty('tkn')) {
    return false;
  }

  return true;
}

export function isLogedRedirect() {
  const cookies = getCookies();

  if (!cookies.hasOwnProperty('usr') || !cookies.hasOwnProperty('tkn')) {
    window.location.href = "/login";
  }
}

export function eraseCookies() {
  addCookie('usr', "", 0);
  addCookie('tkn', "", 0);
  location.reload();
}