import SectionForm from './SectionForm';
import { sendHealthHistory } from '../../reportAPI';

export default function HealthHistory() {
    const handleSubmit = async (data) => {
        console.log('Submitting health history data:', data);
    };

    return <SectionForm sectionId="5" isLast onSubmit={handleSubmit} />;
}
