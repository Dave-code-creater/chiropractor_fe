import SectionForm from './SectionForm';
import { sendHealthHistory } from '../../reportAPI';

export default function HealthHistory() {
    const handleSubmit = async (data) => {
        await sendHealthHistory(data);
    };

    return <SectionForm sectionId="6" isLast onSubmit={handleSubmit} />;
}
