import SectionForm from './SectionForm';
import { sendImpact } from '../../reportAPI';

export default function Impact() {
    const handleSubmit = async (data) => {
        console.log('Submitting impact data:', data);
    };

    return <SectionForm sectionId="4" isLast onSubmit={handleSubmit} />;
}
