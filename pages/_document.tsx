import { Children } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { AppRegistry } from 'react-native';

// Follows the setup for react-native-web:
// https://necolas.github.io/react-native-web/docs/setup/#root-element
// Plus additional React Native scroll and text parity styles for various
// browsers.
// Force Next-generated DOM elements to fill their parent's height
const style = `
html, body, #__next {
  -webkit-overflow-scrolling: touch;
}
#__next {
  display: flex;
  flex-direction: column;
  height: 100%;
}
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}
body {
  /* Allows you to scroll below the viewport; default value is visible */
  overflow-y: auto;
  overscroll-behavior-y: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -ms-overflow-style: scrollbar;
}
`;

const myStyle = `
@font-face {
  font-family: 'Regular';
  src: url(/fonts/roboto-latin-400.woff2) format('woff2');
  font-display: swap;
}

@font-face {
  font-family: 'Medium';
  src: url(/fonts/roboto-latin-500.woff2) format('woff2');
  font-display: swap;
}

@font-face {
  font-family: 'Bold';
  src: url(/fonts/roboto-latin-700.woff2) format('woff2');
  font-display: swap;
}

@font-face {
  font-family: 'Condensed';
  src: url(/fonts/roboto-condensed-latin-400.woff2) format('woff2');
  font-display: swap;
}

body::-webkit-scrollbar {
  width: 0;
}

input {
  outline-style: none;
}

textarea {
  outline-style: none;
}

a {
  text-decoration: none;
}

img {
  -webkit-user-drag: none;
}
`;

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='pt-BR'>
        <Head>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta
            name='description'
            content='Faça suas compras sem sair de casa.'
          />
          <meta name='theme-color' content='#2196F3' />
          <link rel='preconnect' href='https://static.prontoentrega.com.br/' />
          <link rel='prefetch' href='/fonts/roboto-latin-400.woff2' as='font' />
          <link rel='prefetch' href='/fonts/roboto-latin-500.woff2' as='font' />
          <link rel='prefetch' href='/fonts/roboto-latin-700.woff2' as='font' />
          <link rel='manifest' href='/manifest.webmanifest' />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32.png'
          />
          <link rel='shortcut icon' href='/favicon.ico' />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-touch-fullscreen' content='yes' />
          <meta name='apple-mobile-web-app-title' content='Pronto' />
          <meta
            name='apple-mobile-web-app-status-bar-style'
            content='black-translucent'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/pwa/apple-touch-icon/apple-touch-icon-180.png'
          />
          <link
            rel='apple-touch-startup-image'
            media='screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
            href='/pwa/apple-touch-startup-image/apple-touch-startup-image-640x1136.png'
          />
          <link
            rel='apple-touch-startup-image'
            media='screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
            href='/pwa/apple-touch-startup-image/apple-touch-startup-image-1242x2688.png'
          />
          <link
            rel='apple-touch-startup-image'
            media='screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
            href='/pwa/apple-touch-startup-image/apple-touch-startup-image-828x1792.png'
          />
          <link
            rel='apple-touch-startup-image'
            media='screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
            href='/pwa/apple-touch-startup-image/apple-touch-startup-image-1125x2436.png'
          />
          <link
            rel='apple-touch-startup-image'
            media='screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
            href='/pwa/apple-touch-startup-image/apple-touch-startup-image-1242x2208.png'
          />
          <link
            rel='apple-touch-startup-image'
            media='screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
            href='/pwa/apple-touch-startup-image/apple-touch-startup-image-750x1334.png'
          />
          <link
            rel='apple-touch-startup-image'
            media='screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
            href='/pwa/apple-touch-startup-image/apple-touch-startup-image-2048x2732.png'
          />
          <link
            rel='apple-touch-startup-image'
            media='screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
            href='/pwa/apple-touch-startup-image/apple-touch-startup-image-1668x2388.png'
          />
          <link
            rel='apple-touch-startup-image'
            media='screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
            href='/pwa/apple-touch-startup-image/apple-touch-startup-image-1668x2224.png'
          />
          <link
            rel='apple-touch-startup-image'
            media='screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
            href='/pwa/apple-touch-startup-image/apple-touch-startup-image-1536x2048.png'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

const myGetInitialProps: typeof Document.getInitialProps = async ({
  renderPage,
}) => {
  AppRegistry.registerComponent('Main', () => Main);
  /**
   * AppRegistry don't have getApplication on declaration
   *
   * @ts-expect-error */
  const { getStyleElement } = AppRegistry.getApplication('Main');
  const page = await renderPage();

  const styles = [
    <style
      key='react-native-style'
      dangerouslySetInnerHTML={{ __html: style }}
    />,
    <style key='my-style' dangerouslySetInnerHTML={{ __html: myStyle }} />,
    getStyleElement(),
  ];

  return { ...page, styles: Children.toArray(styles) };
};

Document.getInitialProps = myGetInitialProps;

export default CustomDocument;
