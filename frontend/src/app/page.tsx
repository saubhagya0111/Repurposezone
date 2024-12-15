/* eslint-disable @typescript-eslint/no-explicit-any */

import { SpeedInsights } from "@vercel/speed-insights/next";
// import ContentForm from "../app/components/contentForm";
// import Dashboard from "./dashboard/page";
import { Analytics } from "@vercel/analytics/react";
import Loginpage from './auth/login/page'
export default function Home() {
  return (
    <div >
      <Loginpage />
      <Analytics/>
      <SpeedInsights/>
    </div>
  );
}
