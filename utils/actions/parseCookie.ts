import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
// import { cookies } from "next/headers"


export default function formJson(cookies: RequestCookie[]): string {

  let jsonStr = "";
  const sbAuthRegEx = /^sb.*auth-token(?!.*verifier).*/

  for (let cookie of cookies) {
    if (cookie.name.match(sbAuthRegEx) !== null) {
      jsonStr = jsonStr.concat(cookie.value);
    }
  }

  return jsonStr;
}