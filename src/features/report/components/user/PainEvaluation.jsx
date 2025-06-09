import SectionForm from './SectionForm';
import { sendPainEvaluation } from '../../reportAPI';

export default function PainEvaluation() {
    const handleSubmit = async (data) => {
        await sendPainEvaluation(data);
    };

    return <SectionForm sectionId="3" isLast onSubmit={handleSubmit} />;
}
