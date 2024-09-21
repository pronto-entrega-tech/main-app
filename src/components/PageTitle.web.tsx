import Head from "next/head";

export function PageTitle({ title }: { title: string }) {
  return (
    <Head>
      <title>{title + " | ProntoEntrega"}</title>
      {/**
       * don't use <title>{title} | ProntoEntrega</title>
       * it SSR as "{title}<!-- --> | ProntoEntrega"
       */}
    </Head>
  );
}
