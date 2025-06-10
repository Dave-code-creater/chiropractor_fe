import SectionForm from './SectionForm';
import { sendDetailedDescription } from '../../reportAPI';

export default function DetailedDescription() {
    const handleSubmit = async (data) => {
        console.log('Submitting detailed description data:', data);
    };

    return <SectionForm sectionId="4" isLast onSubmit={handleSubmit} />;
}
