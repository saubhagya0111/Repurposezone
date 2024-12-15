/* eslint-disable @typescript-eslint/no-explicit-any */

import { SpeedInsights } from "@vercel/speed-insights/next";
// import ContentForm from "../app/components/contentForm";
// import Dashboard from "./dashboard/page";
import Loginpage from './auth/login/page'
export default function Home() {
  return (
    <div >
      <Loginpage/>
      <SpeedInsights/>
    </div>
  );
}
