import placeData from '@/data/demo.json';
import dynamic from 'next/dynamic';

const VRClient = dynamic(() => import('@/app/components/VRScene/VRClient'), { ssr: false });

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

  return <VRClient id={params.id} />;
};

export default PannellumPage;