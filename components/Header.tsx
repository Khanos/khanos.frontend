import Head from 'next/head'

export default function Header() {
    return (
        <Head>
            <title>Khanos && Chill 😎</title>
            <meta name="description" content="A khanos fun personal project" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
            {/* eslint-disable-next-line @next/next/next-script-for-ga */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-525CEBLYVE"></script>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-525CEBLYVE');
                    `,  
                }}
            />
        </Head>
    )
};