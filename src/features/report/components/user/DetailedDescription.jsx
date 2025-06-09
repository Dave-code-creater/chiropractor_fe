import SectionForm from './SectionForm';
import { sendDetailedDescription } from '../../reportAPI';

export default function DetailedDescription() {
    const handleSubmit = async (data) => {
        await sendDetailedDescription(data);
    };

    return <SectionForm sectionId="4" isLast onSubmit={handleSubmit} />;
}
