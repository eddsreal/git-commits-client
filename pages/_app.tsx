import "../styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress height={5} options={{ easing: "ease", speed: 500 }}/>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
