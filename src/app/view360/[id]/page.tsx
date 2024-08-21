import placeData from '@/data/demo.json';
import dynamic from 'next/dynamic';

const PannellumClient = dynamic(() => import('@/app/components/PannellumScene/PannellumClient/PannellumClient'), { ssr: false });

// Function to generate static paths
export const generateStaticParams = async () => {
  const paths = placeData.map(place => ({
    id: place.place_id.toString()
  }));
  return paths
};

const PannellumPage = ({ params }: { params: { id: string } }) => {
  if (!params.id) {
    return <div>Loading...</div>;
  }

  return <PannellumClient id={params.id} />;
};

export default PannellumPage;