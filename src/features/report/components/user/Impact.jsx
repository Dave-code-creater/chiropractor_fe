import SectionForm from './SectionForm';
import { sendImpact } from '../../reportAPI';

export default function Impact() {
    const handleSubmit = async (data) => {
        await sendImpact(data);
    };

    return <SectionForm sectionId="5" isLast onSubmit={handleSubmit} />;
}
