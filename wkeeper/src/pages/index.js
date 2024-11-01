// pages/index.js
export async function getServerSideProps() {
    return {
        redirect: {
            destination: '/equipment',
            permanent: false,
        },
    };
}

export default function Home() {
    return null;
}